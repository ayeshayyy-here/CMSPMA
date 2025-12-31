// signup.js

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import CaptchaComponent from '../Components/CaptchaComponent';
const Signup = () => {
  const [fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const handleSignup = () => {
  
    console.log('Signing up...', fullname, phoneNumber, email, password);
  
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create a New Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#ccc" 
        value={fullname}
        onChangeText={(text) => setFullname(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#ccc"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'top',
  },
  heading: {
    fontSize: 30, 
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color:'#ff5a66',
    marginTop: 30,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 30,
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#ff5a66',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Signup;