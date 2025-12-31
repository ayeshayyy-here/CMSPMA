import React, { useState, useRef, useEffect } from 'react';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Components/Loader';
import baseUrl from '../Config/url';
import EncryptedStorage from 'react-native-encrypted-storage';
import syncStorage from 'react-native-sync-storage';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import pmaimg from '../../assets/images/pmaimg.png';

import CaptchaComponent from '../Components/CaptchaComponent';
const Login = ({ navigation }) => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const [isPortrait, setIsPortrait] = useState(screenHeight > screenWidth);
  const [checked, setChecked] = useState(false);
  const [errorValidate, setErrorValidate] = useState(false);
  const [phone, setphone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const firstTextInput = useRef(null);
  const secondTextInput = useRef(null);


  useEffect(() => {
    const transferDataToSyncStorage = async () => {
      try {
        const userData = await EncryptedStorage.getItem('user_detail');
        if (userData !== null) {
          const user = JSON.parse(userData);
          console.log('Retrieved user data:', user); // Log retrieved user data
          syncStorage.set('user_detail', user); // Store in syncStorage
          navigateBasedOnRole(user.role);
        } else {
          console.log('No user data found in encrypted storage');
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    transferDataToSyncStorage();
  }, []);
  const navigateBasedOnRole = (role) => {
    switch (role) {
      case 'Secretary':
        navigation.navigate('MainTabs');
        break;
      case 'General_Manager':
        navigation.navigate('MainTabs');
        break;
      case 'network':
        navigation.navigate('Networknew');
        break;
      // case 'PFI':
      //   navigation.navigate('PFITabs');
      //   break;
      case 'Middleman':
      case 'CCC':
        navigation.navigate('Regcomplain');
        break;       case 'Deputy_manager':
        navigation.navigate('CCCTabs');
        break;
      case 'Assistant_manager':
        navigation.navigate('CCCTabs');
        break;                                            case 'Manager':
        navigation.navigate('CCCTabs');
        break;

      default:
        navigation.navigate('Dashboard');
        break;
    }
  };   

  const handleSubmitFirstTextInput = () => {
    secondTextInput.current.focus();
  };

  const handleSubmitLogin = () => {
    onLoginPress();
  };

  const onLoginPress = () => {
    const enteredOTP = otp.trim();
    const enteredPhone = phone.trim();
    if (!isCaptchaValid) {
      ToastAndroid.show('Please enter a valid CAPTCHA', ToastAndroid.SHORT);
      return;
    }
    if (!enteredPhone || !/^\d{11}$/.test(enteredPhone)) {
      ToastAndroid.show('Enter a valid 11-digit phone number.', ToastAndroid.LONG);
      return;
    }

    if (!enteredOTP || !/^\d{5}$/.test(enteredOTP)) {
      ToastAndroid.show('Enter a valid 5-digit OTP.', ToastAndroid.LONG);
      return;
    }

    setLoading(true);

    fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        phone: enteredPhone,
        otp: enteredOTP,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          EncryptedStorage.setItem('user_detail', JSON.stringify(data.user))
            .then(() => {
              console.log('Stored user data:', data.user); // Log stored user data
              syncStorage.set('user_detail', data.user); // Also store in syncStorage
              navigateBasedOnRole(data.user.role);
              ToastAndroid.show('Login Successfully!', ToastAndroid.SHORT);
            })
            .catch(error => {
              console.error('Error storing user data:', error);
              ToastAndroid.show('Error storing user data', ToastAndroid.LONG);
            });
        } else {
          ToastAndroid.show('Incorrect Credentials.', ToastAndroid.LONG);
        }
      })
      .catch(error => {
        console.error('Error during fetch:', error);
        ToastAndroid.show('Network request failed', ToastAndroid.LONG);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResendOTP = () => {
    setOtp('');
    ToastAndroid.show('Processing your request...', ToastAndroid.SHORT);
    navigation.navigate('Contact');
  };

  const isPhoneValid = phone.length === 11;
  return (
    <View style={{ flex: 1 }}>
      <Loader loading={loading} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ padding: 40, justifyContent: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image source={pmaimg} style={{ height: 200, width: 200 }} />
            <Text style={{ color: 'black', fontSize: 30, fontWeight: 'bold', marginTop: 0 }}>
              PMA CMS
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <View style={{ backgroundColor: '#CD1D0C', width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name="phone" size={25} color="white" />
            </View>
            <TextInput
              ref={firstTextInput}
              placeholderTextColor="grey"
              onSubmitEditing={handleSubmitFirstTextInput}
              placeholder="Contact Number"
              maxLength={11}
              keyboardType="numeric"
              style={[styles.loginFormTextInput, { borderColor: !phone && errorValidate ? 'red' : 'grey', borderWidth: 1 }]}
              value={phone}
              onChangeText={phone => setphone(phone)}
            />
            <TouchableOpacity style={{ height: 20, justifyContent: 'center', alignItems: 'center', right: '65%' }}>
              <Icon name={isPhoneValid ? 'check' : 'check'} size={15} style={{ color: 'white' }} />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <View style={{ backgroundColor: '#CD1D0C', width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name="key" size={25} color="white" />
            </View>
            <TextInput
              ref={secondTextInput}
              placeholderTextColor="grey"
              onSubmitEditing={handleSubmitFirstTextInput}
              placeholder="Enter the OTP"
              secureTextEntry={!showPassword}
              maxLength={5}
              keyboardType="numeric"
              style={[styles.loginFormTextInput, { borderColor: !otp && errorValidate ? 'red' : 'grey', borderWidth: 1 }]}
              value={otp}
              onChangeText={otp => setOtp(otp)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ height: 20, justifyContent: 'center', alignItems: 'center', right: '65%' }}>
              <Icon name={showPassword ? 'eye' : 'eye-slash'} size={15} style={{ color: 'maroon' }} />
            </TouchableOpacity>
          
          </View>
          <CaptchaComponent 
            onCaptchaChange={(isValid) => setIsCaptchaValid(isValid)}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'center' }}>
            <Text style={{ color: 'grey' }}>Dont have an account?</Text>
            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: 'maroon' }}>Register</Text>
            </TouchableOpacity>
          </View>
          <View   style={[{ alignItems: 'center', marginTop: '5%' } , (!isCaptchaValid || loading) && { opacity: 0.6 }]}
            >
            <TouchableOpacity onPress={onLoginPress} style={styles.ButtonStyle} activeOpacity={0.5}   disabled={!isCaptchaValid || loading}
          >
              <Text style={[styles.text, { textAlign: 'center' }]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={{ marginLeft: 0, color: 'grey' }}>ReGenerate OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 4,
  },
  outerbox: {
    borderWidth: 3,
    borderColor: 'white',
  },
  SpeakButton: {
    justifyContent: 'center',
    width: '35%',
    padding: 10,
    marginTop: 15,
    flex: 1,
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: '#002D62',
    color: '#fff',
  },
  closeIcon: {
    marginLeft: '90%',
  },
  loginFormTextInput: {
    flex: 1,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 0,
    height: 40,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonStyle: {
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: '#da1703',
  },
  text: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'sans-serif',
  },
  ButtonStyle: {
    justifyContent: 'center',
    width: '30%',
    padding: 10,
    borderRadius: 0,
    backgroundColor: '#CD1D0C',
    width: '55%',
  },
  Text: {
    color: 'black',
    textAlign: 'right',
    fontSize: 14,
    marginTop: 8,
  },
  Boxtext: {
    color: '#002D62',
    textAlign: 'left',
    fontSize: 15,
  },
  Checkbox: {
    marginTop: 8,
  },
  smsimage: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    marginTop: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
});
export default Login;
