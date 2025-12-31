import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ToastAndroid,
  TouchableWithoutFeedback
} from 'react-native'; // Import Alert
import AudioRecorder from '../Components/AudioRecorder';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import DocumentPicker, {
  pickDirectory,
  types,
} from 'react-native-document-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import baseUrl from '../Config/url';
import syncStorage from 'react-native-sync-storage'; 

const QueryforassissCCC = ({navigation, route}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState('');
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const [taskDescription, setTaskDescription] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [capturedImage, setCapturedImage] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [time, setTime] = useState(new Date());
  const [stateFunction, setStateFunction] = useState({
    URI: '',
    Type: '',
    Name: '',
  });
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigateToAssignedTask = () => {
    navigation.navigate('Assignedtasksccc');
  };
  const navigateToYourTask = () => {
    navigation.navigate('Yourtasksccc');
  };

  const handleAudioRecorded = audioData => {
    setRecordedAudio(audioData);
  };

  useEffect(() => {
    fetchOptions();
  }, []);
  const handleDateTimeConfirm = date => {
    setTime(date);
    setIsDateTimePickerVisible(false);
  };

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/taskAssignList`);
      const data = await response.json();
      const options = data.map(item => ({
        id: item.id,
        name: item.name,
        designation: item.designation,
      }));
      setOptions(options);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching options:', error);
      setLoading(false);
    }
  };
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionSelect = option => {
    setSelectedOption(option.name);
    setShowSearch(false);
  };

  const openGallery = async () => {
    try {
      const response = await DocumentPicker.pick({
        allowMultiSelection: false,
        type: [DocumentPicker.types.allFiles],
      });

      console.log('response', JSON.stringify(response[0], null, 2));

      setStateFunction(prev => ({
        ...prev,
        Name: response[0].name,
        Type: response[0].type,
        URI: response[0].uri,
      }));
    } catch (error) {
      console.error('Document picking error:', error);
    }
  };
  const startRecording = async () => {
    try {
      const path = await audioRecorderPlayer.startRecorder(); // Let the library handle path generation
      console.log('Recording started');
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      console.log('Recording stopped, file saved at:', result);
      setIsRecording(false);
      setRecordedFile(result);
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playRecordedFile = async () => {
    if (!recordedFile) {
      Alert.alert('Error', 'No recorded file available');
      return;
    }
    try {
      await audioRecorderPlayer.startPlayer(recordedFile);
      console.log('Playing recorded file');
    } catch (error) {
      console.error('Error playing recorded file:', error);
      Alert.alert('Error', 'Failed to play recorded file');
    }
  };
  const navigateToQueries = () => {
    navigation.navigate('Queries');
  };

  const assignquery = async () => {
    if (!selectedOption) {
      ToastAndroid.show('Please Select an option.', ToastAndroid.LONG);
      return;
    }
    if (!taskDescription) {
      Alert.alert('Please enter Query description.');
      return;
    }
    const userId = syncStorage.get('user_detail').id;
    const currentDateTime = new Date().toISOString(); // Generate current datetime
    const requestData = {
      user_id: userId,
      selectedUser: selectedOption.id,
      description: taskDescription,
      dateTime: currentDateTime, 
     
    };
  
    console.log('Request Data:', requestData); // Log the request data before making the request
  
    try {
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/networkstorequery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      console.log('Response:', response); // Log the response object
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Response Data:', responseData); // Log the response data
        Alert.alert('Success', 'Query created successfully!');
        setSelectedOption('');
        setTaskDescription('');
        setRecordedAudio('');
        setStateFunction('');
        // setTime(new Date()); // No need to reset time state
      } else {
        Alert.alert('Error', 'Failed to create query. Please try again.');
      }
    } catch (error) {
      console.error('Error creating query:', error);
      Alert.alert('Error', 'Failed to create query. Please try again.');
    }
  };
  
  
  
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
      <LinearGradient colors={['#A00000', '#EA2027']}>
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Icon name="tasks" size={18} color="#fff" style={styles.icon} />
              <Text style={styles.headerText}>Query for Assistance</Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.additionalContainer}>
              <Icon
                name="ellipsis-v"
                size={20}
                color="#fff"
                style={styles.icon2}
              />
            </TouchableOpacity>
          </View>

        </LinearGradient>
        <View style={{flex: 1, padding: '5%'}}>
          <Text style={styles.dropdowntext}>Assign to </Text>
          <View>
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'black'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemTextStyle={styles.itemTextStyle}
              search
              searchPlaceholder="Search..."
              data={options}
              labelField="name"
              valueField="id"
              placeholder="Select an option"
              onFocus={() => setIsFocus(true)}
              value={selectedOption}
              onChange={value => setSelectedOption(value)}
            />
          </View>
          <Text style={styles.text}>Query Description:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              placeholder="Description"
              value={taskDescription}
              onChangeText={text => setTaskDescription(text)}
              multiline={true}
            />
          </View>
          <View>
            <Text style={styles.text}>Choose a File:</Text>
            <View
              style={{
                justifyContent: 'space-evenly',
                flexDirection: 'row',
                marginTop: '5%',
              }}>
              <TouchableOpacity onPress={openGallery}>
                <Icon name="file" color="black" size={30} />
              </TouchableOpacity>

            
              {/* <TouchableOpacity onPress={playRecordedFile}>
                <Icon name="play" color="black" size={30} />
              </TouchableOpacity> */}
            </View>
            {stateFunction.Name ? (
              <View
                style={{
                  marginTop: '5%',
                  // width: '80%',
                  // height: 120,
                  // backgroundColor: 'white',
                  // marginLeft: '8%',
                  alignItems: 'flex-start',
                  // borderRadius: 30,
                }}>
                <Text style={{color: 'black'}}>{stateFunction.Name}</Text>
              </View>
            ) : null}
          </View>
          <View>
            <Text style={styles.text}>Record Audio:</Text>
            <View>
              <TouchableOpacity>
              <AudioRecorder onAudioRecorded={handleAudioRecorded} />


              </TouchableOpacity>

            </View>
          </View>
          <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={styles.button}
    onPress={assignquery}>
    <Text style={styles.buttonText}>Query for Assistance</Text>
  </TouchableOpacity>
</View>

        </View>

     


      </View>
      <DateTimePickerModal
        isVisible={isDateTimePickerVisible}
        mode="datetime"
        date={time}
        onConfirm={handleDateTimeConfirm}
        onCancel={() => setIsDateTimePickerVisible(false)}
      />
      {/* <Modal visible={modalVisible} transparent animationType="fade">
  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback>
        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={navigateToQueries}>
            <Icon name="comment" size={20} color="#333" style={styles.icon} />
            <Text style={styles.modalOptionText}>Queries</Text>
          </TouchableOpacity>
                 </Animatable.View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal> */}
<Modal visible={modalVisible} transparent animationType="fade">
  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={navigateToQueries}>
            <Icon name="comment" size={20} color="#333" style={styles.icon} />
            <Text style={styles.modalOptionText}>Queries</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#ddd',
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: '100%', // Ensure it takes the full width available
  },
  optionText: {
    fontSize: 17,
    color: '#333',
  },

  header: {
    // backgroundColor: '#CD1D0C',
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  additionalText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: '35%', // Pushes the text to the right
  },
  icon: {
    marginRight: 10,
  },
  icon2: {
    marginLeft: '60%',
  },
  dropdowntext: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginVertical: 10,
  },
  placeholderStyle: {
    color: 'grey',
    fontSize: 14,
    margin: 2,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  inputSearchStyle: {
    color: 'black',
  },
  itemTextStyle: {
    color: 'black',
  },
  textInputContainer: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    height: 45,
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#000',
  },
  text: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  swipebutton: {
    marginTop: '85%',
    justifyContent: 'center',
    alignItems: 'center', // Center the swipe button horizontally
  },  
  registerFormTextInput: {
    flex: 1,
    color: 'black',

    borderWidth: 0.5,
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 40,
    borderColor: 'gray',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#A00000',
    paddingVertical: 10,
    paddingHorizontal: 50,
 
    marginTop: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '15%',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 10,
  },
  modalOptionText: {
    fontSize: 18,
    color: '#333',
  },
});

export default QueryforassissCCC;
