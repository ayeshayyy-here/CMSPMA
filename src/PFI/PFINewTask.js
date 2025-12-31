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
import { Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import AudioRecorder from '../Components/AudioRecorder';
import {RadioButton} from 'react-native-paper';
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

const PFINewTask = ({navigation,route}) => {
  const {complaintId} = route.params || { complaintId: null };
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

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
  const [modalVisible, setModalVisible] = useState(false);
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDateTimeConfirm = date => {
    setTime(date);
    setIsDateTimePickerVisible(false);
  };

  const navigateToAssignedTask = () => {
    navigation.navigate('PFIAssignedTask');
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
      alert('Please enter a task title.');
      return;
    }
    if (!time) {
      alert('Please set a date for the task.');
      return;
    }
    if (!taskDescription) {
      alert('Please enter a task description.');
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
  
    // Prepare the request data
    const requestData = {
     
        user_id: managerId,
        taskTitle: taskTitle, // Use taskTitle instead of title here
        description: taskDescription,
        dateTime: time.toISOString(),
        priority: priority,
        manager_id: selectedOption.id,
     
       // Add manager id to the request data
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
  const navigateToassigntask = () => {
    navigation.navigate('PFIAssignedTask');
  };
  const navigateToyourtask = () => {
    navigation.navigate('PFIYourTask');
  };
  
  

  return (
    // <LinearGradient colors={['#FFFFFF', '#E8EAED']} style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <LinearGradient colors={['#4CAF50', '#3E8944']}>
          <View style={styles.header}>
            <View
              style={[
                styles.headerTextContainer,
                {justifyContent: 'space-between'},
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="tasks" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.headerText}>Assign Task</Text>
              </View>
               <TouchableOpacity onPress={navigateToAssignedTask}>
                {/* <Text style={styles.additionalText}>Assigned Task</Text> */}
              </TouchableOpacity> 
              <TouchableOpacity
              onPress={() => setModalVisible(true)}>
              <Icon
                name="ellipsis-v"
                size={20}
                color="#fff"
                style={styles.icon2}
              />
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
                  color="#006400"
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
                  color="#006400"
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
                  color="#006400"
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
                  color="#006400"
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
                  color="#006400"
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
                  color="#006400"
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
                <AudioRecorder/>
              </TouchableOpacity>

            </View>

          </View>

          {/* <TouchableOpacity style={styles.assignButton}>
            <Text style={styles.assignButtonText}>Assign</Text>
          </TouchableOpacity> */}
                <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={styles.button}
    onPress={assignTask}>
    <Text style={styles.buttonText}>Assign Task</Text>
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
            onPress={navigateToassigntask}>
            <Icon name="tasks" size={20} color="#333" style={styles.icon} />
            <Text style={styles.modalOptionText}>Assigned Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={navigateToyourtask}>
            <Icon name="tasks" size={20} color="#333" style={styles.icon} />
            <Text style={styles.modalOptionText}>Your Tasks</Text>
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
            onPress={navigateToassigntask}>
            <Icon name="tasks" size={20} color="#333" style={styles.icon} />
            <Text style={styles.modalOptionText}>Assigned Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={navigateToyourtask}>
            <Icon name="tasks" size={20} color="#333" style={styles.icon} />
            <Text style={styles.modalOptionText}>Your Tasks</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>

    
    </ScrollView>
    // </LinearGradient>
  );
};

const styles = StyleSheet.create({
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
  icon2: {
    marginLeft: '65%',
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
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 30,
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
    paddingHorizontal: 5,
    width: '100%', // Ensure it takes the full width available
  },
  optionText: {
    fontSize: 17,
    color: '#333',
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
  iconContainerLeft:{
    marginLeft:'10%'
  },

  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  iconWrapper: {
    position: 'absolute',
    top: -30,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  iconContainer: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 30,
    color: 'black',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  buttonRow: {
    width: '100%',
  },
 
  modalOptionText: {
    fontSize: 16,
    color: 'white',
  },
  modalCancel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'gray',
    paddingHorizontal: 10,
    marginVertical: 1,
    borderRadius: 10,
    width: '100%',
  },
  modalCancelText: {
    color: 'white',
    fontSize: 16,
  },
  //new 
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
    
    height: '25%',
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
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#006400',
    paddingVertical: 10,
    paddingHorizontal: 80,
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});



export default PFINewTask;
