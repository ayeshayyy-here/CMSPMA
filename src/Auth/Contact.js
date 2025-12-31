import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Components/Loader';
import baseUrl from '../Config/url';
import pmaimg from '../../assets/images/pmaimg.png';

const Contact = ({navigation}) => {
  const handleSubmitFirstTextInput = () => {
    // Logic to handle submission of the first text input
    // For example, you can focus on the next input or perform validation
    console.log('Handling first text input submission');
  };
  const [errorValidate, setErrorValidate] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const handleResendOTP = () => {
    // Validate the phone number
    if (!phone || !/^\d{11}$/.test(phone)) {
      ToastAndroid.show(
        'Please enter a valid 11-digit phone number',
        ToastAndroid.LONG,
      );
      return;
    }

    setLoading(true);

    // Make a request to the server to resend OTP
    fetch(`${baseUrl}/resendotp`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Server Response:', data);
        if (data.success) {
          ToastAndroid.show('OTP Resent Successfully!', ToastAndroid.SHORT);
          // Navigate to the OTP screen after clearing the OTP state
          navigation.navigate('Otp');
        } else if (data.error === 'User not found') {
          ToastAndroid.show(
            'User not found. Please register.',
            ToastAndroid.LONG,
          );
        } else {
          ToastAndroid.show(
            'Error Resending OTP. Please try again.',
            ToastAndroid.LONG,
          );
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

  return (
    <View>
      <ImageBackground
        style={{
          width: '100%',
          height: '100%',
          opacity: 0.9,
          alignSelf: 'center',
        }}>
        <Loader loading={loading} />
        <View style={{flex: 2}}>
          <View style={{flex: 0.2}}>
            <View
              style={{
                width: '35%',
                marginLeft: '60%',
                marginTop: 10,
                paddingVertical: 10,
                justifyContent: 'flex-end',
                height: 100,
                justifyContent: 'flex-start',
              }}></View>
          </View>
          <View style={{flex: 1}}>
            <KeyboardAvoidingView enabled>
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={{padding: 40, justifyContent: 'center'}}>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={pmaimg} style={{height: 160, width: 180}} />
                  </View>
                  {/* <Text style={{ marginTop: 0, fontWeight: "bold", color: "#000000" }}>Cnic #:</Text> */}

                  <View style={styles.inputContainer}>
                    <View
                      style={{
                        backgroundColor: '#CD1D0C',
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon name="phone" size={25} color="white" />
                    </View>

                    <TextInput
                      placeholderTextColor="grey"
                      onSubmitEditing={handleSubmitFirstTextInput}
                      keyboardType="numeric"
                      placeholder="Contact Number"
                      maxLength={11}
                      placeholderColor="#c4c3cb"
                      style={[
                        styles.loginFormTextInput,
                        {
                          borderColor: !phone && errorValidate ? 'red' : 'grey',
                          borderWidth: 1, // Add this line to set the border width
                        },
                      ]}
                      value={phone}
                      placeholderStyle={{paddingHorizontal: 20}}
                      onChangeText={phone => setPhone(phone)}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                      marginLeft:8
                    }}>
                    <Text style={{color: 'grey'}}> Dont have an account?</Text>
                    <TouchableOpacity
                      style={{marginLeft: 5}}
                      onPress={() => navigation.navigate('Register')}>
                      <Text style={{color: 'maroon'}}>Register</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{alignItems: 'center', marginTop: '5%'}}>
                    <TouchableOpacity
                      onPress={handleResendOTP}
                      style={styles.ButtonStyle}
                      activeOpacity={0.5}>
                      <Text style={[styles.text, {textAlign: 'center'}]}>
                        ReGenerate OTP
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 4,
  },
  outerbox: {
    borderWidth: 3,
    borderColor: 'white', // Change the border color to white
  },
  SpeakButton: {
    justifyContent: 'center',
    width: '35%',
    padding: 10,
    marginTop: 15,
    // marginLeft: '15%',
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
    // borderWidth: 1,
    borderRadius: 0,
    height: 40,
    // borderColor: '',
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
    // paddingVertical: 10,
    borderRadius: 0,
    // paddingHorizontal: 15,
    backgroundColor: '#CD1D0C',
    width: '55%',
  },
  Text: {
    color: 'black',
    textAlign: 'right',
    fontSize: 14,
    marginTop: 8,
    // marginTop:5
  },
  Boxtext: {
    color: '#002D62',
    textAlign: 'left',
    // marginLeft:-8,
    fontSize: 15,
  },
  Checkbox: {
    marginTop: 8,
  },
  smsimage: {},
  inputContainer: {
    // backgroundColor:'red',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    marginTop: 10,
    // borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  icon: {
    width: 35, // Adjust the width of the icon as needed
    height: 35, // Adjust the height of the icon as needed
    marginRight: 10, // Adjust the margin as needed
    // backgroundColor:'red'
  },
});

export default Contact;
