import React, { useState, useEffect, useRef } from 'react';
import pmaimg from '../../assets/images/pmaimg.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';

import {
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import Loader from '../Components/Loader';
import baseUrl from '../Config/url';
import CaptchaComponent from '../Components/CaptchaComponent';
const Register = ({ navigation, route }) => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  // const [isPortrait, setIsPortrait] = useState(screenHeight > screenWidth);

  // useEffect(() => {
  //   const updateOrientation = () => {
  //     const newScreenWidth = Dimensions.get('window').width;
  //     const newScreenHeight = Dimensions.get('window').height;
  //     setScreenWidth(newScreenWidth);
  //     setScreenHeight(newScreenHeight);
  //     setIsPortrait(newScreenHeight > newScreenWidth);
  //   };
  //   Dimensions.addEventListener('change', updateOrientation);
  //   return () => Dimensions.removeEventListener('change', updateOrientation);
  // }, []);

  const firstTextInput = useRef(null);
  const secondTextInput = useRef(null);
  const thirdTextInput = useRef(null);
  const forthTextInput = useRef(null);

  const handleSubmitFirstTextInput = () => {
    secondTextInput.current.focus();
  };

  const handleSubmitSecondTextInput = () => {
    thirdTextInput.current.focus();
  };

  const handleSubmitThirdTextInput = () => {
    forthTextInput.current.focus();
  };

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [errorValidate, setErrorValidate] = useState(false);
  const [district, setDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [role, setRole] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegisterUser = () => {
  setLoading(true);

  console.log("Starting registration...");
  console.log("Inputs =>", { name, email, cnic, phone, district, isCaptchaValid });

  if (!isCaptchaValid) {
    ToastAndroid.show('Please enter a valid CAPTCHA', ToastAndroid.SHORT);
    console.log("CAPTCHA invalid");
    return;
  }

  if (!name) {
    ToastAndroid.show('Enter Your Full Name.', ToastAndroid.LONG);
    setLoading(false);
    console.log("Name missing");
    return;
  }

  if (!isValidCNIC(cnic)) {
    ToastAndroid.show('Enter a valid 13-digit CNIC.', ToastAndroid.LONG);
    setLoading(false);
    console.log("Invalid CNIC:", cnic);
    return;
  }

  if (!district) {
    ToastAndroid.show('Select City.', ToastAndroid.LONG);
    setLoading(false);
    console.log("District missing");
    return;
  }

  if (!isValidPhone(phone)) {
    ToastAndroid.show('Enter a valid 11-digit phone number.', ToastAndroid.LONG);
    setLoading(false);
    console.log("Invalid phone:", phone);
    return;
  }

  if (!isValidEmail(email)) {
    ToastAndroid.show('Enter a valid email address.', ToastAndroid.LONG);
    setLoading(false);
    console.log("Invalid email:", email);
    return;
  }

  const requestBody = {
    name,
    email,
    cnic,
    phone,
    district,
    role: "user",
  };

  console.log("Request URL:", `https://complaint-pma.punjab.gov.pk/api/register`);
  console.log("Request Body:", requestBody);

  fetch(`https://complaint-pma.punjab.gov.pk/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then(respSubmit => {
      console.log("Raw Response:", respSubmit);
      console.log("Status:", respSubmit.status, respSubmit.statusText);
      console.log("Headers:", respSubmit.headers);

      if (!respSubmit.ok) {
        throw new Error("Network request failed");
      }

      const contentType = respSubmit.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (contentType && contentType.includes("application/json")) {
        return respSubmit.json();
      } else {
        throw new Error("Non-JSON response received");
      }
    })
    .then(responseRegister => {
      console.log("Parsed Response:", responseRegister);

      if (responseRegister.success) {
        const generatedOTP = responseRegister.generatedOTP;
        console.log("OTP generated:", generatedOTP);
        navigation.navigate("Otp", { generatedOTP });
      } else {
        console.log("Registration error:", responseRegister.error);
        ToastAndroid.show(responseRegister.error, ToastAndroid.LONG);
      }
    })
    .catch(error => {
      console.error("Error during fetch:", error.message || error);
      ToastAndroid.show("Network request failed", ToastAndroid.LONG);
    })
    .finally(() => {
      setLoading(false);
      console.log("Registration flow finished");
    });
};

  const isValidCNIC = cnic => /^\d{13}$/.test(cnic);
  const isValidPhone = phone => /^\d{11}$/.test(phone);
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSelectCity = city => {
    const cityToDistrictMap = {
      Lahore: 1,
      Multan: 2,
      Rawalpindi: 3,
    };

    setDistrict(cityToDistrictMap[city]);
    setSelectedCity(city);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ padding: 40, justifyContent: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image source={pmaimg} style={{ height: 140, width: 140 }} />

            <Text
              style={{
                color: 'black',
                fontSize: 25,
                fontWeight: 'bold',
                marginTop: 0,
              }}>
              PMA CMS
            </Text>
            <Text style={{ color: 'black', fontSize: 18, marginTop: 5 }}>
              Registration
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.redcontainer}>
              <Icon name="user" size={25} color="white" />
            </View>
            <TextInput
              ref={firstTextInput}
              placeholderTextColor="grey"
              onSubmitEditing={handleSubmitFirstTextInput}
              placeholder="Full Name"
              maxLength={13}
              placeholderColor="#c4c3cb"
              style={[
                styles.loginFormTextInput,
                {
                  borderColor: !name && errorValidate ? 'red' : 'grey',
                  borderWidth: 1,
                },
              ]}
              value={name}
              placeholderStyle={{ paddingHorizontal: 20 }}
              onChangeText={text => setName(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.redcontainer}>
              <Icon name="envelope" size={25} color="white" />
            </View>
            <TextInput
              placeholderTextColor="grey"
              onSubmitEditing={handleSubmitFirstTextInput}
              placeholder="Email"
              maxLength={56}
              placeholderColor="#c4c3cb"
              style={[
                styles.loginFormTextInput,
                {
                  borderColor: !email && errorValidate ? 'red' : 'grey',
                  borderWidth: 1,
                },
              ]}
              value={email}
              placeholderStyle={{ paddingHorizontal: 20 }}
              onChangeText={text => setEmail(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.redcontainer}>
              <Icon name="id-card" size={25} color="white" />
            </View>
            <TextInput
              placeholderTextColor="grey"
              onSubmitEditing={handleSubmitFirstTextInput}
              placeholder="CNIC"
              keyboardType="numeric"
              maxLength={13}
              placeholderColor="#c4c3cb"
              style={[
                styles.loginFormTextInput,
                {
                  borderColor: !cnic && errorValidate ? 'red' : 'grey',
                  borderWidth: 1,
                },
              ]}
              value={cnic}
              placeholderStyle={{ paddingHorizontal: 20 }}
              onChangeText={text => setCnic(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.redcontainer}>
              <Icon name="map-marker" size={25} color="white" />
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{ flex: 1 }}>
              <TextInput
                placeholderTextColor="grey"
                placeholder="Select City"
                placeholderColor="#c4c3cb"
                style={[
                  styles.loginFormTextInput,
                  {
                    borderColor: !district && errorValidate ? 'red' : 'grey',
                    borderWidth: 1,
                  },
                ]}
                value={selectedCity}
                placeholderStyle={{ paddingHorizontal: 20 }}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.redcontainer}>
              <Icon name="phone" size={25} color="white" />
            </View>
            <TextInput
              placeholderTextColor="grey"
              onSubmitEditing={handleSubmitFirstTextInput}
              placeholder="Contact Number"
              keyboardType="numeric"
              maxLength={11}
              placeholderColor="#c4c3cb"
              style={[
                styles.loginFormTextInput,
                {
                  borderColor: !phone && errorValidate ? 'red' : 'grey',
                  borderWidth: 1,
                },
              ]}
              value={phone}
              placeholderStyle={{ paddingHorizontal: 20 }}
              onChangeText={text => setPhone(text)}
            />
          </View>
          <CaptchaComponent 
            onCaptchaChange={(isValid) => setIsCaptchaValid(isValid)}
          />
          <View style={{ alignItems: 'center', marginTop: '5%' }}>
            <TouchableOpacity
              onPress={handleRegisterUser}
              style={styles.ButtonStyle}
              activeOpacity={0.5}>
              <Text style={[styles.text, { textAlign: 'center' }]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInText}>Already user? <Text style={styles.signInLink}>Sign in</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select City</Text>
            {['Lahore', 'Multan', 'Rawalpindi'].map(city => (
              <TouchableOpacity
                key={city}
                style={styles.modalOption}
                onPress={() => handleSelectCity(city)}>
                <Text style={styles.modalOptionText}>{city}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:''
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 4,
  },
  redcontainer: {
    backgroundColor: '#CD1D0C',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerbox: {
    borderWidth: 3,
    borderColor: 'white', // Change the border color to white
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
  inputContainer1: {
    // backgroundColor:'red',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff', // You can adjust the border color and other styles
    // borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  icon: {
    width: 35, // Adjust the width of the icon as needed
    height: 35, // Adjust the height of the icon as needed
    marginRight: 10, // Adjust the margin as needed
  },
  signInText: {
    textAlign: 'center',
    marginTop: 10,
    color: 'grey',
    fontSize: 16,
  },
  signInLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  modalOption: {
    paddingVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 12,
    color: 'gray',
  },
  modalCancel: {
    marginTop: 20,
  },
  modalCancelText: {
    color: 'red',
    fontSize: 10,
  },
});
