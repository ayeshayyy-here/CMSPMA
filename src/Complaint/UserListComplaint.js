import React, {useState, useEffect,useRef} from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {SafeAreaView,Platform, Text,Button, View, TextInput, ImageBackground,ScrollView,Image,Modal,TouchableWithoutFeedback ,
	StyleSheet, Dimensions,TouchableOpacity, ToastAndroid, PermissionsAndroid } from 'react-native';
import pwdIMage from '../../assets/images/Background.jpg'
import Loader from '../Components/Loader';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import baseUrl from '../Config/url';
import syncStorage from 'react-native-sync-storage';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;



const UserListComplaint = ({navigation,route}) => {


/* States For display array in dropdown */

  const [categories, setCategories]   = useState([]);
  const [subCategories, setSubCategories]   = useState([]);
  const [states, setStates]   = useState([]);
  const [loading, setLoading]   = useState(false);
  /* End for displaying array in dropdown */
  const [isFocus, setIsFocus]     = useState(false);
  const [isFocusId, setIsFocusId] = useState(null);
  const [errorValidate, setErrorValidate] =  useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  
  const [duration, setDuration] = useState('00:00:00');
  const [playTime, setPlayTime]     = useState('00:00:00');
  const [startRecording, setStartRecording] =  useState(false);
  const [recordsec, setRecordSec]  = useState(0);
  const [recordTime, setRecordTime]  = useState('00:00:00');
  const [wordCount, setWordCount] = useState(0); 
  
  /* States OF Post API */
    const [cnic, setCnic]              = useState('');
    const [category_id, setCategoryId] = useState('');
    const [subcategory_id, setSubCategoryId] = useState('');
    const [district_id, setDistrictId] = useState('');
    const [phone, setPhone]            = useState('');
    const [complaint, setComplaint]              = useState('');
    const [capturedImage, setCapturedImage] = useState('');
    const [audioPath, setAudioPath] = useState('');
    const [status, setStatus] = useState('')
    const [orientation, setOrientation] = useState('LANDSCAPE');
    const [categoryName, setCategoryName] = useState('');
    const [complains, setComplain] = useState([]);
   
    const [userId, setUserId] = useState('');
  /* ENd */
  useEffect(() =>{
    const screenWidth = Dimensions.get('window').width;
    const detail = syncStorage.get('user_detail')
    setUserId(detail.id)
    getUserComplains();
  }, []);

  const orientationDidChange = (orientation) => {
    if (orientation === 'LANDSCAPE') {
      setOrientation('LANDSCAPE')
    } else {
      // do something with portrait layout
    }
  }
  const issueData = [{"value":0,"label":"Pending"},{"value":1,"label":"Issue"},{"value":2,"label":"Resolve"}];
  const getUserComplains = () =>{

      const userId =  syncStorage.get('user_id')
      console.log('User Id', userId)
      console.log('User Complain Url',`${baseUrl}/user-complains/${userId}`)
    setLoading(true)
    fetch(`${baseUrl}/user-complains/${userId}`, {
      method: 'GET',
    })
    .then(resp => resp.json())
    .then(respUserComplain => {

      console.log('ALl  UserComplains', respUserComplain)
      // tableData: [
      //   ['1', '2', '3'],
      //   ['a', 'b', 'c'],
      //   ['1', '2', '3'],
      //   ['a', 'b', 'c']
      // ]
     
      var count = Object.keys(respUserComplain.user_complains).length;
    //   // console.log('COunt', count)
      let complinData = [];
      for (var i = 0; i < count; i++) {
        const createdAtDate = respUserComplain.user_complains[i].created_at;
        const updatedAtDate = respUserComplain.user_complains[i].updated_at;
        // // const updatedAtTime = respUserComplain.user_complains[i].updated_at.getTime() / 1000
        // var hours = updatedAtDate.getHours(); //To get the Current Hours
        // var min = updatedAtDate.getMinutes(); //To get the Current Minutes
        // var sec = updatedAtDate.getSeconds();
        // console.log('Date update', hours,min,sec)
        complinData.push([`PMACID-${respUserComplain.user_complains[i].id}`,`${respUserComplain.user_complains[i].complaint_details}`,`${respUserComplain.user_complains[i].complaint_type}`,createdAtDate.toString().substr(0 ,10),
          <View style={{backgroundColor:'red'}}>

        <Button
            title='Pending'
            style={{borderRadius:10}}
            color="#da1703"
            
        />

          </View>
        ]);
        // getCategories(respComplain.complains[i].category)
      }
      // console.log('COmplain Data',JSON.stringify(complinData))
      setComplain(complinData);
    }).finally(() => setLoading(false));
  }

  const getCategories = (categoryId) =>{

    console.log('Category ID', categoryId)
    fetch(`${baseUrl}/category`, {
      method: 'GET',
      headers:{},
    })
    .then(respBoard => respBoard.json())
    .then(respCategory => {

      // console.log('Categories', respCategory.category)
      const responseCategory =  respCategory.category;
      // console.log('categoryvhjadc',responseCategory)
      responseCategory.map((item, i) => {
        if(item.id == categoryId){
          const categoryName = item.name !='' ? item.name:'No Category';
          setCategoryName(categoryName)
        }
      });
      
      // return categoryName;
    });
  }
  const button = <View style={styles.container}>

  <Dropdown
    style={[styles.dropdown, isFocus && { borderColor: 'black',backgroundColor:'#fff', }]}
    placeholderStyle={styles.placeholderStyle}
    selectedTextStyle={styles.selectedTextStyle}
    inputSearchStyle={styles.inputSearchStyle}
    itemTextStyle={styles.itemTextStyle}
    data={[{"value":1,"label":"Pending"},{"value":2,"label":"Issue"},{"value":3,"label":"Resolve"}]}
    search
    labelField="label"
    valueField="value"
    placeholder={'Select Issue'}
    value={status}
    onFocus={() => setIsFocus(true)}
    onBlur={() => setIsFocus(false)}
    onChange={item => {
      setStatus(item.value);
     
    }}
  />
</View>

return (
	<View>
    
	<ImageBackground
		source={pwdIMage}
		style={styles.img}>
    
    <Loader loading={loading}/>
       
      <View style={{padding:50, justifyContent:'center',}}>
        <View value={orientation} style={{width:600,opacity:1, backgroundColor:'#fff', height:'100%',padding:10, borderRadius:10}}>
          <ScrollView>
            <View style={{flex:1, backgroundColor:'#fff',alignSelf:'center',}}>
              <Text style={[styles.text2,{fontSize:25, marginBottom:10,color:'black'}]}>List of Complaints</Text>
            </View>
            
            <View  style={{width:'100%',opacity:0.9, backgroundColor:'#fff',alignSelf:'center', height:'100%',paddingLeft:50, borderRadius:30}}>
            
              <Table borderStyle={{borderWidth: 0, borderColor: '#444',}}>
                <Row data={['Complaint ID','Description','Complaint Type', 'Complaint Date', 'Status']} style={styles.head} textStyle={styles.text}/>
                {/* {complains != '' && complains.map((item,index) => {
                  console.log('COmplains', item)
                })} */}
                {/* [
                
                ['4563','Person', 'Security',
                  <View style={styles.container}>

                    <Dropdown
                      style={[styles.dropdown, isFocus && { borderColor: 'black',backgroundColor:'#fff', }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={styles.itemTextStyle}
                      mode='modal'
                      data={[{"value":1,"label":"Pending"},{"value":2,"label":"Issue"},{"value":3,"label":"Resolve"}]}
                      // search
                      labelField="label"
                      valueField="value"
                      placeholder={'Select Issue'}
                      value={status}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item =>{
                        setStatus(item.value)
                        setIsFocusId(item.value)
                      }}
                    />
                  </View>
                ],
              
            ] */}
                <Rows data={complains} style={styles.row} textStyle={styles.textData}/>
              </Table>
            
            </View>
          </ScrollView>
        </View>
        {/* <Footer /> */}
      </View>
     
   
	</ImageBackground>
  
	</View>
);
};


export default UserListComplaint;

const styles = StyleSheet.create({
  head: { height: 60,borderRadius:10, backgroundColor: 'black', color:'white',width:'90%' },
  row: { height: 'auto', backgroundColor: '#fff', color:'#444',width:'90%' },
    headText: { fontSize: 20, fontWeight: 'bold' , textAlign: 'center', color: 'white' },
    text: { margin: 6, fontSize: 16, fontWeight: 'bold' ,color:"white", textAlign: 'center' },
    textData: { margin: 6, fontSize: 16, fontWeight: 'normal' ,color:"#444", textAlign: 'center' },

  containeDataTable: {
    // padding: 15,
    width:'100%',
    backgroundColor:'red',
    
  },
  tableHeader: {
    backgroundColor: 'black',
    color:'white',
    width:'100%',
  },
  tableTitle: {
   
    color:'white',
    fontFamily:'sans-serif',
    fontSize:11
  },
  containerSafer: {
    flex: 1,
    backgroundColor: '#455A64',
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleTxt: {
    marginTop: 100,
    color: 'white',
    fontSize: 28,
  },
  viewRecorder: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  recordBtnWrapper: {
    flexDirection: 'row',
  },
  viewPlayer: {
    marginTop: 60,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  viewBarWrapper: {
    marginTop: 28,
    marginHorizontal: 28,
    alignSelf: 'stretch',
  },
  viewBar: {
    backgroundColor: '#ccc',
    height: 4,
    alignSelf: 'stretch',
  },
  viewBarPlay: {
    backgroundColor: 'white',
    height: 4,
    width: 0,
  },
  playStatusTxt: {
    marginTop: 8,
    color: '#ccc',
  },
  playBtnWrapper: {
    flexDirection: 'row',
    marginTop: 40,
  },
  btn: {
    borderColor: 'white',
    borderWidth: 1,
  },
  txt: {
    color: 'white',
    fontSize: 14,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  txtRecordCounter: {
    marginTop: 32,
    color: 'white',
    fontSize: 20,
    textAlignVertical: 'center',
    fontWeight: '200',
    fontFamily: 'Helvetica Neue',
    letterSpacing: 3,
  },
  txtCounter: {
    marginTop: 12,
    color: 'white',
    fontSize: 20,
    textAlignVertical: 'center',
    fontWeight: '200',
    fontFamily: 'Helvetica Neue',
    letterSpacing: 3,
  },

  /* End New CSS */
  SpeakButton: {
    justifyContent: 'center',
    width: '100%',
    padding: 15,
    marginTop: 15,
    // marginLeft: '15%',
    borderColor:'red',
    borderWidth:1,
    flex: 1,
    marginRight: 5,
    borderRadius: 20,
    // backgroundColor: 'white',
    color: '#fff'
  },
  SpeakButton3: {
    justifyContent: 'center',
    width: '100%',
    padding: 15,
    // marginLeft: '15%',
    borderColor:'red',
    borderWidth:1,
    flex: 1,
    marginRight: 5,
    borderRadius: 20,
    // backgroundColor: 'white',
    color: '#fff'
  },
  SpeakButton2: {
    justifyContent: 'center',
    width: 50,
    padding: 15,
    marginTop: 15,
    borderColor:'white',
    borderWidth:1,
    // marginLeft: '15%',
    flex: 1,
    marginleft: 8,
    borderRadius: 20,
    // backgroundColor: 'white',
    color: '#fff'
  },
  searchIcon: {
    fontSize: 25,
    paddingHorizontal: 30,
    margin: 0
  },

  imagetext: {
    // fontSize: 14,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    // justifyContent: 'center',
    // // padding:20,
    // alignItems: 'center',
    flexDirection:"column",
    // backgroundColor: '#0b0b3d', // Semi-transparent background
  },
  modalContent: {

    flexDirection:'row',
    width: 300,
    // backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    marginLeft:20,
    marginRight:20,
    justifyContent:'center'
    // margin:2
  },
customContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterCount: {
    marginTop: 3,
    color: 'black',
    fontSize: 12,
    textAlign: 'right',
  },
  registerFormTextInput:{
    flex: 1,
    color: 'black',
   
    borderWidth: 1,
    backgroundColor:'#fff',
    borderRadius:5, 
    height:40,
    borderColor: '#dadae8',
  },
  dropdown: {
    // height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor:'#fff',
    margin: 0,
    // marginBottom:30,
    width:'98%'
  },
  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    color:'grey',
    fontSize: 14,
    margin:0
  },

img: {
	// height: screenHeight,
	// width: screenWidth,
	justifyContent: 'center',
	alignItems: 'center',
  resizeMode:'cover',
},
// text:{
//   color:'black',
//   fontSize:15,
//   fontFamily: "sans-serif",

// },
text2:{
  color:'white',
  fontSize:15,
  fontFamily: "sans-serif",

},
ButtonStyle:{
  justifyContent: 'center',
  width:'70%',
  padding:10,
  borderRadius: 14,
  backgroundColor: '#da1703',
  marginTop:20,
  marginLeft:30,
  
},
Text:{
  color:'#002D62',
  textAlign: 'center',
  fontSize:14,
  marginTop:5
},
itemTextStyle:{
  color:'black'
},
selectedTextStyle: {
  fontSize: 16,
  color:'#444'
},
inputSearchStyle : {
  color:'black'
}
});
