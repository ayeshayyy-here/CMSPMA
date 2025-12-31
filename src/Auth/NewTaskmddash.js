import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Image,
} from 'react-native';
import AudioRecorder from '../Components/AudioRecorder';
import {RadioButton, shadow} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Dropdown} from 'react-native-element-dropdown';
import {DatePickerInput} from 'react-native-paper-dates';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


// import DocumentPicker from 'react-native-document-picker';
import DocumentPicker, {
  pickDirectory,
  types,
} from 'react-native-document-picker';
import LinearGradient from 'react-native-linear-gradient';
import baseUrl from '../Config/url';
import syncStorage from 'react-native-sync-storage'; 

const AssignTaskScreen = ({navigation,route}) => {
  const {complaintId} = route.params || { complaintId: null };
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');

  const [priority, setPriority] = useState('Normal');
  const [taskDescription, setTaskDescription] = useState('');
  const [stateFunction, setStateFunction] = useState({
    URI: '',
    Type: '',
    Name: '',
  });
  const [capturedfile, setCapturedfile] = useState('');
  const [time, setTime] = useState(new Date());
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);

  const handleAudioRecorded = audioData => {
    setRecordedAudio(audioData);
  };
  const handleDateTimeConfirm = date => {
    setTime(date);
    setIsDateTimePickerVisible(false);
  };

  const navigateToAssignedTask = () => {
    navigation.navigate('AssignedTaskmddash');
  };
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOptions();
  }, []);

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

  const handleOptionSelect = option => {
    setSelectedOption(option.name);
    setShowSearch(false);
  };
  const assignTask = async () => {
    // Validation checks
    if (!selectedOption) {
      ToastAndroid.show('Please Select an option.', ToastAndroid.LONG);
      return;
    }
    if (!taskTitle) {
      ToastAndroid.show('Please enter a task title.', ToastAndroid.LONG);
      return;
    }
    if (!time) {
      ToastAndroid,show('Please set a date for the task.', ToastAndroid.LONG);
      return;
    }
    if (!taskDescription) {
      ToastAndroid.show('Please enter a task description.', ToastAndroid.LONG);
      return;
    }
  
    // Retrieve manager id from Sync Storage
    const managerId = syncStorage.get('user_detail').id;
  
    // Debugging console statements
    console.log('Manager ID:', managerId);
    console.log('Selected Option ID:', selectedOption.id);
    console.log('Task Title:', taskTitle);

    console.log('Task Description:', taskDescription);
    console.log('Time:', time.toISOString());
    console.log('Priority:', priority);
    console.log('Fattach:', stateFunction.URI);
    console.log('Audio:', recordedAudio);
    // Prepare the request data
    const requestData = {
      user_id: managerId,
      taskTitle: taskTitle,
      description: taskDescription,
      dateTime: time.toISOString(),
      priority: priority,
      manager_id: selectedOption.id,
      fattach: stateFunction.URI,
  
      complaint_audio: recordedAudio, 
    };
  
    try {
      // Make the POST request
      const response = await fetch(`${baseUrl}/create-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      // Check if the request was successful
      if (response.ok) {
        const responseData = await response.json();
        // Alert success message and clear input fields
        alert('Task assigned successfully!');
        setSelectedOption(null);
        setTaskTitle('');
        setTime(new Date());
        setPriority('Normal');
        setTaskDescription('');
        setRecordedAudio('');
        setStateFunction('');
      } else {
        // Handle the case where the request failed
        alert('Failed to assign task. Please try again.');
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error assigning task:', error);
      alert('Error assigning task. Please try again.');
    }
  };
  
  

  return (
    // <LinearGradient colors={['#FFFFFF', '#E8EAED']} style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <LinearGradient colors={['#A00000', '#EA2027']}>
          <View style={styles.header}>
            <View
              style={[
                styles.headerTextContainer,
                {justifyContent: 'space-between'},
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="tasks" size={22} color="#fff" style={styles.icon} />
                <Text style={styles.headerText}>Assign Task</Text>
              </View>
              <TouchableOpacity onPress={navigateToAssignedTask}>
                <Text style={styles.additionalText}>Assigned Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        {/* <Text style={{color:'black'}}>Complaint ID: {complaintId}</Text> */}
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
          <Text style={styles.text}>Task Title:</Text>
          <View style={styles.textInputContainer}>
          <TextInput
  style={styles.textInput}
  placeholder="Enter task title"
  placeholderTextColor="grey"
  value={taskTitle}
  onChangeText={text => setTaskTitle(text)}
/>

          </View>
          <Text style={styles.text}>Set Date and Time:</Text>
          <TouchableOpacity
            style={{
              marginTop: 15,
              backgroundColor: '#fff',
              borderColor: 'gray',
              borderWidth: 0.5,
              borderRadius: 5,
              height: 50,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}
            onPress={() => setIsDateTimePickerVisible(true)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: 'black'}}>{time.toLocaleString()}</Text>
              <Icon
                name="calendar"
                size={20}
                color="#000"
                style={{marginLeft: '50%'}}
              />
            </View>
          </TouchableOpacity>

          <Text style={{marginTop: '8%', fontWeight: 'bold', color: '#000000'}}>
            Task Priority:
          </Text>
          <View style={styles.radioContainer}>
            <View style={styles.radioRow}>
              <View style={styles.radioItem}>
                <RadioButton
                  value="Urgent"
                  status={priority === 'Urgent' ? 'checked' : 'unchecked'}
                  onPress={() => setPriority('Urgent')}
                  color="red"
                  uncheckedColor="#555"
                  size={10}
                />
                <Text style={styles.radioLabel}>Urgent</Text>
              </View>

              <View style={styles.radioItem}>
                <RadioButton
                  value="Medium"
                  status={priority === 'Medium' ? 'checked' : 'unchecked'}
                  onPress={() => setPriority('Medium')}
                  color="red"
                  uncheckedColor="#555"
                  size={10}
                />
                <Text style={[styles.radioLabel, {marginRight: '21%'}]}>
                  Medium
                </Text>
              </View>
            </View>

            <View style={styles.radioRow}>
              <View style={styles.radioItem}>
                <RadioButton
                  value="Normal"
                  status={priority === 'Normal' ? 'checked' : 'unchecked'}
                  onPress={() => setPriority('Normal')}
                  color="red"
                  uncheckedColor="#555"
                  size={10}
                />
                <Text style={styles.radioLabel}>Normal</Text>
              </View>

              <View style={styles.radioItem}>
                <RadioButton
                  value="By Today"
                  status={priority === 'By Today' ? 'checked' : 'unchecked'}
                  onPress={() => setPriority('By Today')}
                  color="red"
                  uncheckedColor="#555"
                  size={10}
                />
                <Text style={[styles.radioLabel, {marginRight: '20%'}]}>
                  By Today
                </Text>
              </View>
            </View>

            <View style={styles.radioRow}>
              <View style={styles.radioItem}>
                <RadioButton
                  value="By Tomorrow"
                  status={priority === 'By Tomorrow' ? 'checked' : 'unchecked'}
                  onPress={() => setPriority('By Tomorrow')}
                  color="red"
                  uncheckedColor="#555"
                  size={10}
                />
                <Text style={styles.radioLabel}>By Tomorrow</Text>
              </View>

              <View style={styles.radioItem}>
                <RadioButton
                  value="As Soon As Possible"
                  status={
                    priority === 'As Soon As Possible' ? 'checked' : 'unchecked'
                  }
                  onPress={() => setPriority('As Soon As Possible')}
                  color="red"
                  uncheckedColor="#555"
                  size={10}
                />
                <Text style={styles.radioLabel}>As Soon As Possible</Text>
              </View>
            </View>
          </View>

          <Text style={styles.text}>Task Description:</Text>
          {/* <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              placeholder="Enter task description"
              value={taskDescription}
              onChangeText={text => setTaskDescription(text)}
              multiline={true}
              // numberOfLines={4}
            />
          </View> */}
          <View
            style={{
              marginTop: 10,
              backgroundColor: '#D3D3D3',
              borderRadius: 5,
              height: 120,
            }}>
            <TextInput
              placeholderColor="#c4c3cb"
              placeholderTextColor="grey"
              placeholder="Enter Task Details"
              maxLength={2000}
              value={taskDescription}
              onChangeText={text => setTaskDescription(text)}
              multiline={true}
              textAlignVertical="top"
              style={styles.registerFormTextInput}
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
    onPress={assignTask}>
    <Text style={styles.buttonText}>Assign Task</Text>
  </TouchableOpacity>
</View>
          {/* <View style={styles.swipebutton}>
            <SwipeButton
            // Icon={<Icon name="arrow" size={24} color="white" />} 
              disabled={false}
              //disable the button by doing true (Optional)
              swipeSuccessThreshold={70}
              height={60}
              width={'100%'}
              title="Swipe to Assign"
              onSwipeSuccess={assignTask}
              // onSwipeSuccess={() => {
              //   alert('Assigned Successfully!');
              // }}
              //After the completion of swipe (Optional)
              railFillBackgroundColor="#FFD6D7" //(Optional)
              railFillBorderColor="#FFADB0" //(Optional)
              thumbIconBackgroundColor="#CD1D0C" //(Optional)
              thumbIconBorderColor="#FFF" //(Optional)
              railBackgroundColor="#FFC1C3" //(Optional)
              railBorderColor="#FF7F7F" //(Optional)
              titleFontSize={16}
              titleColor="white"
            />
          </View> */}
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDateTimePickerVisible}
        mode="datetime"
        date={time}
        onConfirm={handleDateTimeConfirm}
        onCancel={() => setIsDateTimePickerVisible(false)}
      />
    </ScrollView>
    // </LinearGradient>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    // marginTop: 20,
  },
  button: {
    backgroundColor: '#A00000',
    paddingVertical: 15,
    paddingHorizontal: '30%',
    borderRadius: 10,
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  swipebutton: {
    marginTop: '5%',
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
  assignButton: {
    backgroundColor: '#CD1D0C',
    paddingHorizontal: '40%',
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  assignButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  additionalText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: '40%', // Pushes the text to the right
  },
  taskDescription: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 0.5,
    paddingHorizontal: 10,
  },
  datepicker: {
    height: 48,
    backgroundColor: '#ffffff',
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingHorizontal: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Adjust as needed
  },
  header: {
    // backgroundColor: '#CD1D0C', // Dark Red
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row', // Align icon and text horizontally
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: '20%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Adjust as needed
    textAlign: 'center',
  },
  icon: {
    marginRight: 10, // Adjust as needed for spacing between icon and text
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
  radioContainer: {
    marginTop: 10,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 5,
    color: '#555',
  },
});

export default AssignTaskScreen;
