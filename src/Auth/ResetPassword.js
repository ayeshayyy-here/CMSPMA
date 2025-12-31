import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
  Dimensions,
  Alert,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import pwdIMage from '../../assets/images/background.png';
import syncStorage from 'react-native-sync-storage';

import Loader from '../Components/Loader';
const { width } = Dimensions.get('window');
const ResetPassword = ({ navigation }) => {
  // other fields
  const [cnic, setCnic]                            = useState('');
  const [regnum, setRegNum]                        = useState('');
  const [password, setPassword]                    = useState('');
  const [confirmpassword, setConfirmPassword]      = useState('');
  const [successmessage, setSuccessMessage]        = useState('');

  // dropdown 1
  const [dabtabs, setDABTAB] = useState([]);
  const [dabtab_id, setDABTABId] = useState('');
  const [dabtab_name, setDABTABName] = useState('');
  // dropdown 2
  const [disteh, setDisTeh] = useState([]);
  const [disteh_id, setDisTehId] = useState('');
  const [disteh_name, setDISTEHName] = useState('');
  // dropdown 3
  const [board, setBoard] = useState([]);
  const [board_id, setBoardId] = useState('');
  const [board_name, setBoardName] = useState('');
  // validation
  const [loading, setLoading]   = useState(false);
  const [Focus, setFocus] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [errorValidate, setErrorValidate] =  useState(false);

  useEffect(() => {
    getDabTab();
  }, []);
// dropdown 1 API
  const getDabTab = () => {

    fetch(`https://dpmis.punjab.gov.pk/api/app/dabtab`, {
      method: 'GET',
      headers: {},
    })
      .then(resp => resp.json())
      .then(response => {
        var count = Object.keys(response.Boards).length;
        if (count > 0) {
          let dropDownData = [];
          for (var i = 0; i < count; i++) {
            dropDownData.push({
              value: response.Boards[i].id,
              label: response.Boards[i].name,
            });
          }
          setDABTAB(dropDownData);
        }
      });
  }
// dropdown 2 API
  const getDisTeh = (dabis) => {
    fetch(`https://dpmis.punjab.gov.pk/api/app/disteh/${dabis}`, {
      method: 'GET',
      headers: {},
    })
      .then(resp => resp.json())
      .then(responseDisTeh => {
        var count = Object.keys(responseDisTeh.disteh).length;
        let disTehData = [];
        for (var i = 0; i < count; i++) {
          disTehData.push({ value: responseDisTeh.disteh[i].id, label: responseDisTeh.disteh[i].name });
        }
        setDisTeh(disTehData);
      });

  }
// dropdown 3 API
  const getBoard = (tehName) => {
    fetch(`https://dpmis.punjab.gov.pk/api/app/disboard/${tehName}`, {
      method: 'GET',
      headers: {},
    })
      .then(resp => resp.json())
      .then(responseBoard => {
        var count = Object.keys(responseBoard.disboard).length;
        let disboardhData = [];
        for (var i = 0; i < count; i++) {
          disboardhData.push({ value: responseBoard.disboard[i].id, label: responseBoard.disboard[i].name });
        }
        setBoard(disboardhData);
      });
  }
// validation handle
  const handleResetPassword = () => {
    // PCRDP/DAB/LHR/MMHL-PB-3269
    // const pcrdp = `PCRDP/${dabtab_name}/${disteh_name}/${board_name}-PB-${regnum}`;
    // console.log('pcrdp : ', pcrdp);
    
    setErrorValidate(true)
    if(!cnic){
      ToastAndroid.show('Please Enter Your CNIC..!', ToastAndroid.LONG);
      return;
    }else if(!dabtab_name){
      ToastAndroid.show('Please Select DAB/TAB', ToastAndroid.LONG);
      return;
    }else if(!disteh_name){
      ToastAndroid.show('Please Select District after Selecting DAB/TAB', ToastAndroid.LONG);
      return;
    }else if(!board_name){
      ToastAndroid.show('Please Select Medical Board after selecting District', ToastAndroid.LONG); 
      return;
    }else if(!regnum){
      ToastAndroid.show('Please Enter Your Reg Num', ToastAndroid.LONG);
      return;
    }else if(!password){
      ToastAndroid.show('Please Enter New Password', ToastAndroid.LONG);
      return;
    }else if(!confirmpassword){
      ToastAndroid.show('Please Enter Confirmation Password', ToastAndroid.LONG);
      return;
    }
    else{
      if (password === confirmpassword) {
        submitResetPassword();
      } else {
        ToastAndroid.show('Your New and Confirm Password is not Matching', ToastAndroid.LONG);
        return;
      }
    }
  }
// submit API
  const submitResetPassword = () => {
      setLoading(true)
      fetch(
        `https://dpmis.punjab.gov.pk/api/app/forgetpassword`,
        {
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body:JSON.stringify({cnic:`${cnic}`,regdt:`${dabtab_name}`,regd:`${disteh_name}`,regb:`${board_name}`,regn:`${regnum}`,password:`${password}`})
        },
      ) 
      .then(resp => resp.json()).then(response => 
        { 
          if(response.status === 200){
            const message = response.message;
            syncStorage.set('ResetPasswordmsg', message);
            navigation.navigate('Login');
          }
      }).catch((error) => Alert.alert(error))
      .finally(() =>{
        setLoading(false);
      });
  }
  return (
    <View>
      <ImageBackground source={pwdIMage} style={{ width: '100%', height: '100%', opacity: 0.9 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
        >
          <KeyboardAvoidingView enabled>
            <View style={{ padding: 40, flex: 1, alignSelf: 'auto', paddingTop: '25%' }}>
              <View style={{ width: '100%', backgroundColor: '#fff', height: 550, padding: 30, borderRadius: 30 }}>
                <View style={[styles.loginFormView, {}]}>

                  <View style={{}}>
                    <Text style={[styles.logoText, { textAlign: 'center', color: '#002D62', fontWeight: "bold", fontSize: 25 }]}>Reset Password</Text>
                  </View>

                  <Text style={{ marginTop: 10, fontWeight: "bold", color: "#000000" }}>CNIC:</Text>
                  <View style={{ marginTop: 5, backgroundColor: '#D3D3D3', borderRadius: 5, height: 40 }}>
                    <TextInput keyboardType='numeric' placeholderTextColor='grey'
                     maxLength={13} placeholder="CNIC without dashes(-)" placeholderColor="#c4c3cb" style={styles.styleTextInput} 
                      value={cnic} onChangeText={(cnic)=> setCnic(cnic)} 
                      />
                  </View>
                  <Text style={{ marginTop: 10, fontWeight: "bold", color: "#000000" }}>Registration PCRDP:</Text>
                  <View style={styles.container}>
                    <View style={styles.dropdownContainer}>
                      <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: 'black', backgroundColor: '#D3D3D3', }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    itemTextStyle={styles.itemTextStyle}
                                    data={dabtabs}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={'Select DAB/TAB'}
                                    value={dabtab_id}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item => {
                                      setFocus(false);
                                      getDisTeh(item.label);
                                      setDABTABId(item.value);
                                      setDABTABName(item.label);
                                    }}
                                  />
                    </View>
                    <View style={styles.dropdownContainer}>
                      <Dropdown
                                    style={[styles.dropdown2, isFocus && { borderColor: 'black', backgroundColor: '#D3D3D3', }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    itemTextStyle={styles.itemTextStyle}
                                    containerStyle={{ width: 150 }}
                                    data={disteh}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={'Select District'}
                                    value={disteh_id}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item => {
                                      setFocus(false);
                                      getBoard(item.label);
                                      setDisTehId(item.value);
                                      setDISTEHName(item.label);
                                    }}
                                  />
                    </View>
                  </View>
                  <View style={styles.container}>
                    <View style={styles.dropdownContainer}>
                    <Dropdown
                      style={[styles.dropdown3, isFocus && { borderColor: 'black', backgroundColor: '#D3D3D3', }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={styles.itemTextStyle}
                      containerStyle={{ width: 150 }}
                      data={board}
                      labelField="label"
                      valueField="value"
                      placeholder={'Select Board'}
                      value={board_id}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setFocus(false);
                        getBoard(item.value);
                        setBoardId(item.value);
                        setBoardName(item.label);
                      }}
                    />
                    </View>
                    <View style={[styles.dropdownContainer, {marginTop: 0, backgroundColor: '#D3D3D3', borderRadius: 5, height: 40, marginLeft: 5}]}>
                      <TextInput keyboardType='numeric' maxLength={6} 
                        placeholderTextColor='grey' placeholderColor="#c4c3cb" placeholder='Reg num' style={styles.styleTextInput} 
                        value={regnum} onChangeText={(regnum)=> setRegNum(regnum)}
                        />
                    </View>
                  </View>
                  <Text style={{ marginTop: 15, color: "#848884", textAlign: 'center' }}>Please Enter Your Registration Number for Verification</Text>
                  <Text style={{ marginTop: 10, fontWeight: "bold", color: "#000000" }}>New Password</Text>
                  <View style={{ marginTop: 5, backgroundColor: '#D3D3D3', borderRadius: 5, height: 40 }}>
                    <TextInput 
                      placeholderColor="#c4c3cb" style={styles.styleTextInput} secureTextEntry={true}  value={password} onChangeText={(password)=> setPassword(password)}/>
                    <Text style={{ marginTop: 10, fontWeight: "bold", color: "#000000" }}>Confirm Password</Text>
                    <View style={{ marginTop: 5, backgroundColor: '#D3D3D3', borderRadius: 5, height: 40 }}>
                      <TextInput 
                       placeholderColor="#c4c3cb" style={styles.styleTextInput} secureTextEntry={true} value={confirmpassword} onChangeText={(confirmpassword)=> setConfirmPassword(confirmpassword)} />
                    </View>
                    <TouchableOpacity
                      onPress={handleResetPassword}
                      style={styles.ButtonStyle}
                      activeOpacity={0.5}>
                      <Text style={[styles.text, { textAlign: 'center' }]}>Reset</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ResetPassword;
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    flex: 1,
    width: width * 0.4, // Adjust the width as needed
  },
  styleTextInput:{
    color: 'black',
    backgroundColor:'#D3D3D3',
    borderRadius:5, 
    borderColor: '#dadae8',
  },
  ButtonStyle: {
    marginLeft: 30,
    width: '70%',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 14,
    backgroundColor: '#002D62',
    marginTop: 10,
    height: 40
  },
  text: {
    color: 'white',
    fontSize: 15,
    fontFamily: "sans-serif",
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#D3D3D3',
  },
  dropdown2: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    marginLeft: 5,
    paddingHorizontal: 8,
    backgroundColor: '#D3D3D3',
  },
  dropdown3: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#D3D3D3',
    margin: 0,
    // marginLeft:10,
  },
  itemTextStyle: {
    color: 'black'
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black'
  },
  placeholderStyle: {
    color: 'grey',
    fontSize: 13,
  }
});
