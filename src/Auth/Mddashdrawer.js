/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import { useEffect, useState } from 'react';
import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { useForm } from 'react-hook-form';
import pmaimg from '../../assets/images/pmaimg.png';

import SplashScreen from 'react-native-splash-screen'
import {
  StyleSheet,
  onPress,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  TextInput,
  Modal,
  Button,
  ScrollView,
  onLoginPress,
  Alert,
} from 'react-native';


import { Image } from "react-native";
import ComplaintIMG from '../../assets/images/complaint.png';
import pwdRegistration from '../../assets/images/pwd-registration.png';
import syncStorage from 'react-native-sync-storage';
import Loader from '../Components/Loader';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/FontAwesome'


const Mddashdrawer = ({ route, navigation }) => {
   const [userDetail, setUserDetail] = useState(null);
   const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Function to retrieve user details from syncStorage
    const getUserDetail = () => {
      try {
        const userDetailFromStorage = syncStorage.get('user_detail');
        if (userDetailFromStorage) {
          setUserDetail(userDetailFromStorage);
        }
      } catch (e) {
        console.error('Error retrieving user detail from syncStorage: ', e);
      }
    };

    // Call the function to retrieve user detail
    getUserDetail();
  }, []);



  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  return (
    <View style={styles.container}>
     
    <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="times" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* User Info Section */}
      <View style={styles.user}>
        <View style={styles.iconContainer}>
          <View style={styles.iconWrapper}>
            {/* Place your icon component here */}
            <Icon name="user" size={40} color="gray" />
          </View>
        </View>
        <View style={styles.textContainer}>
      {userDetail && ( // Check if userDetail is not null
        <View>
          <Text style={styles.title}>{userDetail.name}</Text>
          <Text style={styles.subtitle}>{userDetail.designation}</Text>
        </View>
      )}
    </View>
      
    </View>
    <TouchableOpacity style={styles.item} onPress={toggleVisibility}>
        <Icon style={styles.icon} color="white" name="home" size={20} />
        <Text style={styles.text}>Tasks</Text>
      </TouchableOpacity>
      {isVisible && (
        <View style={styles.additionalContainer}>
          <TouchableOpacity style={styles.additionalItem} onPress={() => navigation.navigate('NewTaskmddash')}>
            <Icon color="white" name="home" size={15} />
            <Text style={styles.additionalText}>New Task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.additionalItem} onPress={() => navigation.navigate('AssignedTaskmddash')}>
            <Icon color="white" name="home" size={15} />
            <Text style={styles.additionalText}>Assigned Task</Text>
          </TouchableOpacity>
        </View>
      )}     
   
      <TouchableOpacity style={styles.item} onPress={() => {}}>
      <Icon style={styles.icon} color="white" name="star-o" size={20} />
        <Text style={styles.text}>Queries</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => {}}>
      <Icon style={styles.icon} color="white" name="gear" size={20} />
        <Text style={styles.text}>Cities</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => {}}>
      <Icon style={styles.icon} color="white" name="star" size={20} />
        <Text style={styles.text}>System Wise Staff</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => {}}>
      <Icon style={styles.icon} color="white" name="star" size={20} />
        <Text style={styles.text}>Designation Wise Staff</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => {}}>
      <Icon style={styles.icon} color="white" name="star" size={20} />
        <Text style={styles.text}>Hierarchy Wise Staff</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => {}}>
      <Icon style={styles.icon} color="white" name="envelope-o" size={20} />
        <Text style={styles.text}>Source of Complaint</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => {}}>
      <Icon style={styles.icon} color="white" name="sign-out" size={25} />
        <Text style={styles.text}>logout</Text>
      </TouchableOpacity>
    </View>
 
  );
};

const styles = StyleSheet.create({
  nav: {
    position: 'absolute', // Position the container absolutely to the left
    top: 0,
    left: 0,
    zIndex: 1, // Ensure the container is above other components
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    left: 250,
  },
  container: {
    flex: 1,
    backgroundColor: '#373a47',
    padding: 20,
    // right: 5,
    // width:'70%'
  },
  containeri: {
  
    left: 40,
  },
  dropdown: {
    height: 20,
    width:160,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    left: 15,
  },
  item: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 20,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  containernav: {
  left: 20,
  },
  nav: {
    flexDirection: 'row',

    justifyContent: 'flex-end',
    padding: 20,
    bottom: 20,
    left: 20,
  },
  backButton: {
    paddingHorizontal: 10,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 50, 
    left: 20,
 
  },
  iconContainer: {
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  iconWrapper: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  additionalContainer: {     
    marginTop: 5,
    paddingHorizontal: 40, 
  },
  additionalItem: {
    flexDirection: 'row', // Make icon and text on the same line
    backgroundColor: 'gray',
    padding: 6,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'left',
   right: 25,
    bottom: 35,
    // Align items horizontally
  },
  additionalText: {
    color: 'white',
    marginLeft: 10, // Add some space between icon and text
  },
});

export default Mddashdrawer;
