import { useEffect,useState }  from 'react';
import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { useForm } from 'react-hook-form';
// import  from 'react';

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
  Image

} from 'react-native';

import regIMage8 from '../../assets/images/PWDREG-09.png';
import regIMage9 from '../../assets/images/PWDfooter.png';
import regIMage10 from   '../../assets/images/pitb.png';

const Footer = () =>{
    return (
    <View style={{backgroundColor:'#0C2D48',height:130,width:'130%',paddingTop:10,marginLeft:-40}}>
      <View style={{flexDirection: 'row',flex:1}}>          
        <Image source={regIMage9} style={{height:'35%',width:'35%'}}/>
        <Image source={regIMage10} style={{height:'37%',width:'10%',marginLeft:'35%'}}/>  
      </View>     
    </View>
        
  );
}

export default Footer;