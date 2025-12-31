import React, { useState, useRef } from 'react';
import {Image, View,ToastAndroid, TextInput, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Loader from '../Components/Loader';
import pmaOTP from '../../assets/images/pmaOTP.png';
import baseUrl from '../Config/url';
import { useNavigation } from '@react-navigation/native';

const OTPScreen = ({route}) => {
 
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputsRef = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ]; // References for 5 OTP input fields

  const navigation = useNavigation();


  const handleOTPVerification = () => {
    if (!otp.trim()) {
      setErrorMessage('Please enter the OTP'); // Set the error message
      return;
    }
  
    // Clear the error message
    setErrorMessage('');
  
    console.log('otp', otp);
  
    // Make a request to the server to verify the OTP
    fetch(`${baseUrl}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        otp: otp,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Server Response:', data);
        if (data.success) {
          ToastAndroid.show('OTP Verified Successfully!', ToastAndroid.SHORT);
          // Navigate to the 'Dashboard' screen
          navigation.navigate('Login');
        } else {
          ToastAndroid.show('Invalid OTP. Please try again.', ToastAndroid.LONG);
        }
      })
      .catch((error) => {
        console.error('Error during fetch:', error);
        ToastAndroid.show('Network request failed', ToastAndroid.LONG);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
    const handleResendOTP = () => {
      // Navigate to the 'Contact' screen
      navigation.navigate('Contact');
    };
  const handleInputChange = (index, value) => {
    setOTP((prevOTP) => {
      const newOTP = prevOTP.split('');
      newOTP[index] = value;
      return newOTP.join('');
    });

    if (value && index < 4) {
      inputsRef[index + 1].current.focus();
    } else if (!value && index > 0) {
      inputsRef[index - 1].current.focus();
    }
  };

  return (
    <View style={styles.container}>
        <Loader loading={loading} />
        <Text style={{color:'black',fontSize:18,fontWeight:'bold',paddingTop:40}}>Enter Verification Code</Text>
      <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center',paddingLeft:25 }}>
      <Image
        source={pmaOTP}
        style={{
            height: 300,
            width: 300,
            // borderRadius: 10,  // Example: Adding a border radius
            // borderWidth: 2,   // Example: Adding a border
            // borderColor: 'blue', // Example: Setting border color
            resizeMode: 'cover', // Example: Controlling image resizing
        }}
    />
      </View>
<View></View>
      <Text style={{ color: 'black',padding:15,fontSize:18 }}>
          We have sent OTP on your number
        </Text>
      <View style={styles.otpInputContainer}>
        {Array(5)
          .fill()
          .map((_, index) => (
            <TextInput
              key={index}
              ref={inputsRef[index]}
              style={[styles.otpInputField, otp.length === index ? styles.otpInputActive : null ,otp[index] ? { color: 'black' } : null]}
              value={otp[index] || ''}
              maxLength={1}
              onChangeText={(text) => handleInputChange(index, text)}
              keyboardType="numeric"
            />
          ))}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
        <Text style={{ color: 'grey' }}>     Having Trouble?</Text>
        <TouchableOpacity style={{ marginLeft: 5 }} onPress={handleResendOTP}>
          <Text style={{ color: 'black' }}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
     



      <Text style={styles.errorText}>{errorMessage}</Text>
      <TouchableOpacity style={styles.verifyButton} onPress={handleOTPVerification}>
        <Text style={styles.verifyButtonText}>Verify OTP</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  bottomTextContainer: {
    position: 'absolute', // Position the text at the bottom
    bottom: 40, // Adjust the bottom value as needed for proper positioning
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 16,
    color: '#002D62',
    fontStyle: 'CenturyGothic',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    
  },
  headingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    marginBottom: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle:'CenturyGothic',
    color: '#002D62',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '65%',
    
    
  },
  otpInputField: {
    // borderWidth: 2,
    borderRadius: 10,
    // borderColor: '#002D62',
    fontSize: 24,
    color: '#3f51b5',
    width: 40,
    height: 50,
    textAlign: 'center',
    backgroundColor: '#d3d3d3'
  },
  otpInputActive: {
    // borderColor: '#ff9800', // Change border color for the active input
  },
  verifyButton: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 20,
    width: 150,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  
  resendButton: {
    marginTop: 10,
  },
  resendButtonText: {
    color: '#002D62',
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section1: {
    flexDirection: 'row',
    // backgroundColor: '#f2f2f2',
    color: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    padding: 25,
    width: '100%',
    paddingStart: 20,
    paddingEnd: 20,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subView: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    elevation: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  subViewIcon: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: '#fff',
    height: '100%',
    elevation: 10,
    // borderRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  subViewText: {
    flex: 1,
    backgroundColor: '#002D62',
    width: '100%',
    elevation: 10,
    shadowColor: '#000',
    borderTopLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'row',
  },
  text1: {
    fontSize: 25,
    display: 'flex',
    justifyContent: 'center',
    color: '#fff',
  },
  eCatalogText: {
    flex: 1,
    color: '#fff',
    textAlign: 'center',
    fontSize: 30,
    textShadowColor: '#fff',
    textShadowRadius: 5,
    fontFamily: 'CenturyGothic',
  },
});

export default OTPScreen;
