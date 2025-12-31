import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import logo from '../images/PMA.png';
import ComplaintForm from '../Components/ComplaintForm';
const Main = ({ navigation }) => {
  const [complaint, setComplaint] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    // Handle complaint submission logic here
    console.log({ name, email, phone, complaint });
    // You would typically send this to your backend
    alert('Complaint submitted successfully!');
    setComplaint('');
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ImageBackground style={styles.backgroundImage} source={logo}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.welcomeText}>
            Welcome to Punjab Mass Transit Authority
          </Text>

          <View style={styles.bodyContainer}>
             <ComplaintForm 
              onSubmit={() => {
                // Optional: Handle what happens after successful submission
                // For example, show a thank you message
              }}
            />
        

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('Login')} 
                activeOpacity={0.8}
              >
                <Icon name="user-circle" size={18} color="#444" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Login For Staff</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('TrackComplaint')} 
                activeOpacity={0.8}
              >
                <Icon name="search" size={18} color="#444" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Track Complaint</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer with helpline */}
        <View style={styles.footer}>
          <Icon name="phone" size={20} color="maroon" style={styles.footerIcon} />
          <Text style={styles.helplineText}>Helpline: 1762</Text>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 60, // Space for footer
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins',
    marginTop: 40,
    marginHorizontal: 20,
    lineHeight: 36,
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  inputIcon: {
    padding: 10,
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontFamily: 'Poppins',
    color: '#333',
  },
  complaintInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#444',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: 10,
  },
  submitButtonText: {
    color: 'white',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: 160,
    height: 45,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#444',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(235, 229, 229, 0.7)',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: 10,
  },
  helplineText: {
    color: 'maroon',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Main;