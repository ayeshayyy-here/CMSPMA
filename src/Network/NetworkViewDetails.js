import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Button,
  Image,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import AudioRecorder from '../Components/AudioRecorder';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import {Buffer} from 'buffer';
import * as RNFS from 'react-native-fs';
import {RadioButton} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';
import syncStorage from 'react-native-sync-storage';
import baseUrl from '../Config/url';
import DocumentPicker, {
  pickDirectory,
  types,
} from 'react-native-document-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
const NetworkViewDetails = ({navigation, route}) => {
  const {complaint} = route.params;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState('');
  const [startRecording, setStartRecording] = useState(false);
  const [audioFile, setAudioFile] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(true);
  const [audioPath, setAudioPath] = useState('');
  const [recording, setRecording] = useState(false);
  const [base64PathAudio, setBase64PathAudio] = useState('');
  const [capturedfile, setCapturedfile] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isActionButtonPressed, setIsActionButtonPressed] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);
  const [stateFunction, setStateFunction] = useState({
    URI: '',
    Type: '',
    Name: '',
  });
  const [recordedAudio, setRecordedAudio] = useState(null);

  const handleAudioRecorded = audioData => {
    setRecordedAudio(audioData);
  };
  const handleFormSubmit = async () => {
    const userId = syncStorage.get('user_detail').id;
    const resolvedate = new Date();
  
    if (!complaint.id) {
      console.error('Complaint ID is undefined');
      ToastAndroid.show('Error: Complaint ID is undefined.', ToastAndroid.LONG);
      return;
    }
  
    try {
      // Prepare request data
      const requestData = {
        resolve_id: userId,
        resolve_date: resolvedate.toISOString(),
        status: formData.status,
        remark: formData.finalremarks,
        resolvecomplain_pic: capturedImage,
        resolvecomplain_video: stateFunction.URI,
        resolvecomplain_audio: recordedAudio,
        resolvecomplain_file: stateFunction.URI,
      };
  
      console.log('Request Data:', requestData);
  
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/networkdetailaction/${complaint.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Response Data:', responseData);
        ToastAndroid.show('Action submitted successfully!', ToastAndroid.SHORT);
      } else {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        ToastAndroid.show('Please fill all the required fields.', ToastAndroid.LONG);
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      ToastAndroid.show('Error submitting action. Please try again.', ToastAndroid.LONG);
    }
  };
  
  



  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    complaintType: '',
    city: '',
    regDate: '',
    complaintDetails: '',
    file: '',
    audio: '',
    image: '',
    remarks: '',
    status1: '',
    finalStatus: '',
    complaintNumber: '',
    status: '',
    finalremarks: '',
  });
  useEffect(() => {
    initializeRecordingAudio();
  }, []);

  const handlePlayAudio = () => {
    if (complaint.complaint_audio) {s
      if (!sound) {
        const soundObj = new Sound(complaint.complaint_audio, '', error => {
          if (error) {
            console.log('Failed to load the sound', error);
            return;
          }
          setSound(soundObj);
          soundObj.play(success => {
            if (success) {
              console.log('Successfully finished playing');
            } else {
              console.log('Playback failed due to audio decoding errors');
            }
            setIsPlaying(false);
            setSound(null);
          });
        });
        setIsPlaying(true);
      } else {
        sound.play(success => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
          setIsPlaying(false);
          setSound(null);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [showActionButtons, setShowActionButtons] = useState(false);
  const handleActionButtonPress = () => {
    setIsActionButtonPressed(true);
    setShowActionButtons(true);
  };
  const openCamera = async () => {
    setModalVisible(false); // Close the modal
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const options = {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 2000,
        maxWidth: 2000,
      };
  
      launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.error) {
          console.log('Camera Error: ', response.error);
        } else {
          console.log('Response Image', response.assets[0].base64);
  
          const fileName = response.assets[0].fileName;
          const fileExtension = response.assets[0].fileName.split('.').pop();
          const fielUri = response.assets[0].uri;
          const fileBase64 = response.assets[0].base64;
          let imageUri = response.uri || response.assets?.[0]?.uri;
  
          // console.log(fileName,fileExtension, fielUri)
          setCapturedfile(fileBase64);
          setCapturedImage(imageUri);
          // console.log(imageUri);
  
          // response.assets.forEach(function (item, index) {
          //   if(item[index] !=null)
          //   {
          //     imgArray.push(item[0].uri);
          //     setFilePathArray(filePathArray => [filePathArray, imgArray]);
          //   }
  
          // });
        }
      });
    }
  };
  
  const initializeRecordingAudio = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external stroage', grants);

        if (
          (grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.READ_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.RECORD_AUDIO'] ===
              PermissionsAndroid.RESULTS.GRANTED) ||
          (grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN &&
            grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
        ) {
          ToastAndroid.show('permissions granted', ToastAndroid.LONG);
        } else {
          ToastAndroid.show(
            'All required permissions not granted',
            ToastAndroid.LONG,
          );

          return;
        }
      } catch (err) {
        console.warn(err);
        ToastAndroid.show(err, ToastAndroid.LONG);
        return;
      }
    }
    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'Audio.wav',
    };

    AudioRecord.init(options);
    AudioRecord.on('data', data => {
      // console.log('Data', data)
      setBase64PathAudio(data);
      const chunk = Buffer.from(data, 'base64');
      // console.log('Chunk size', chunk.byteLength);
    });
  };
  //open gallery
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
  //record audio
  const startAudio = () => {
    setStartRecording(true);
    //   console.log('Recording started');
    setAudioFile('');
    setLoaded(false);
    setRecording(true);
    AudioRecord.start();
  };
  const handleRemoveAudio = () => {
    if (sound) {
      sound.stop();
      sound.release();
    }

    setAudioFile('');
  };
  const onStopRecord = async () => {
    if (!recording) {
      return;
    }
    console.log('Stop record');
    // let audiofilePath = await AudioRecord.stop();

    let audiofile = await AudioRecord.stop().then(r => {
      setAudioFile(r);
      RNFS.readFile(r, 'base64') // r is the path to the .wav file on the phone
        .then(data => {
          console.log('Data', data);
          // this.context.socket.emit('sendingAudio', {
          //     sound: data
          // });
          setRecording(false);
          setStartRecording(false);
          setAudioPath(data);
        });
    });
    console.log('Audio File', audioPath);
  };
  const load = () => {
    return new Promise((resolve, reject) => {
      if (!audioFile) return reject('Audio file is empty. ');
      const soundObject = new Sound(audioFile, '', error => {
        if (error) {
          console.log('Failed to load the file:', error);
          reject(error);
        } else {
          setLoaded(true);

          console.log('Sound Object', soundObject);
          setSound(soundObject);
          resolve();
        }
      });
    });
  };
  const play = async () => {
    console.log('Audio File', audioFile);
    if (!loaded) {
      try {
        await load();
      } catch (error) {
        console.log('Play error', error);
      }
    }
    setPaused(false);
  };

  useEffect(() => {
    if (sound && !paused) {
      Sound.setCategory('Playback');
      sound.play(success => {
        if (success) {
          console.log('Successfully played.');
        } else {
          console.log('Error playing sound, decoding error');
        }
        setPaused(true);
      });
    }
  }, [sound, paused]);
  const handleRecordVideo = async () => {
    try {
      if (!isRecording) {
        setIsRecording(true);
        const data = await camera.recordAsync();
        // Process the recorded video data (e.g., save it, upload it, etc.)
        console.log('Recorded video data:', data);
      } else {
        setIsRecording(false);
        camera.stopRecording();
      }
    } catch (error) {
      console.error('Error recording video:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    <Icon name="arrow-left" size={25} color="black" /></TouchableOpacity>
            <Text style={styles.headerText}>Complaint Details</Text>
          </View>
        </View>
        <View style={{flex: 1, padding: '5%'}}>
          <Text style={styles.text}>Category</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={complaint.category_name}
              onChangeText={text => handleInputChange('category', text)}
              editable={false}
            />
          </View>
          <Text style={styles.text}>SubCategory:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={complaint.subcategory_name}
              onChangeText={text => handleInputChange('subCategory', text)}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Complaint Type:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={complaint.complaint_type}
              onChangeText={text => handleInputChange('complaintType', text)}
              editable={false}
            />
          </View>
          <Text style={styles.text}>City:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={complaint.city_name}
              // onChangeText={text => handleInputChange('city', text)}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Reg Date:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={complaint.reg_date}
              onChangeText={text => handleInputChange('regDate', text)}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Complaint Details:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={[
                styles.textInput,
                {height: 100, textAlignVertical: 'top'},
              ]}
              value={complaint.complaint_details}
              onChangeText={text => handleInputChange('complaintDetails', text)}
              editable={false}
              multiline={true}
              numberOfLines={10} // Set a reasonable number of lines for initial display
            />
          </View>

          <Text style={styles.text}>File(If Any):</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              value={
                complaint.complaint_file
                  ? complaint.complaint_file
                  : 'No file available'
              }
              onChangeText={text => handleInputChange('file', text)}
              editable={false}
              style={{color: complaint.complaint_file ? 'black' : 'gray'}}
            />
          </View>

          <Text style={styles.text}>Audio(If Any):</Text>
          <View style={styles.audioButtonContainer}>
            {complaint.complaint_audio ? (
              <Button
                title={isPlaying ? 'Pause Audio' : 'Play Audio'}
                onPress={handlePlayAudio}
              />
            ) : (
              <Text style={styles.audiotext}>No audio available</Text>
            )}
          </View>

          <Text style={styles.text}>Image(If Any):</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              value={
                complaint.complaint_pic
                  ? complaint.complaint_pic
                  : 'No image available'
              }
              onChangeText={text => handleInputChange('image', text)}
              editable={false}
              style={{color: complaint.complaint_pic ? 'black' : 'gray'}}
            />
          </View>
          <Text style={styles.text}>Remarks:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              // style={styles.textInput}
              value={complaint.remark ? complaint.remark : 'No Remarks'}
              // value={complaint.complaint_amremarks}
              onChangeText={text => handleInputChange('remarks', text)}
              editable={false}
              style={{color: complaint.remark ? 'black' : 'gray'}}
            />
          </View>

          <Text style={styles.text}>Status:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              // style={styles.textInput}
              value={complaint.status ? complaint.status : 'NULL'}
              onChangeText={text => handleInputChange('status1', text)}
              editable={false}
              style={{color: complaint.status ? 'black' : 'gray'}}
            />
          </View>
          <Text style={styles.text}>Final Status:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={complaint.finalStatus ? complaint.finalStatus : 'NULL'}
              onChangeText={text => handleInputChange('finalStatus', text)}
              editable={false}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {backgroundColor: isActionButtonPressed ? 'grey' : '#ff0f0f'},
            ]}
            onPress={handleActionButtonPress}>
            <Text style={styles.actionButtonText}>Take Action</Text>
          </TouchableOpacity>
          {showActionButtons && (
            <View>
              <Text style={styles.text}>
                Complaint Number:{' '}
                <Text style={{fontWeight: '300'}}>{complaint.id}</Text>
              </Text>
              <Text style={styles.text}>Select Status:</Text>
              <View style={styles.radioItem}>
                <RadioButton
                  value="In Process"
                  status={
                    formData.status === 'In Process' ? 'checked' : 'unchecked'
                  }
                  onPress={() => handleInputChange('status', 'In Process')}
                  color="#6495ED"
                />
                <Text style={styles.radioLabel}>In Process</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton
                  value="Resolved"
                  status={
                    formData.status === 'Resolved' ? 'checked' : 'unchecked'
                  }
                  onPress={() => handleInputChange('status', 'Resolved')}
                  color="#6495ED"
                />
                <Text style={styles.radioLabel}>Resolved</Text>
              </View>

              <Text style={styles.text}>Remarks:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Remarks"
                placeholderTextColor="grey"
                value={formData.finalremarks}
                onChangeText={text => handleInputChange('finalremarks', text)}
                multiline
              />

<View>
              <Text style={styles.textinputtext}>Choose a File/Video:</Text>
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
              {/* to display recorded audio */}
              <View>
            <Text style={styles.text}>Record Audio:</Text>
            <View>
              <TouchableOpacity>
              <AudioRecorder onAudioRecorded={handleAudioRecorded}/>
              </TouchableOpacity>

            </View>
            <Text style={styles.text}>Capture Image:</Text>
            <View style={{
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  marginTop: '5%',
                }}>
            <TouchableOpacity
                  onPress={openCamera}
                  style={styles.iconWrapper}>
                  <Icon name="camera" size={30} color="black" />
            </TouchableOpacity>
            
          </View>  
          {capturedImage ? (
                <View
                  style={{
                    marginTop: 20,
                    width: 300,
                    height: 120,
                    backgroundColor: 'green',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 30,
                    marginLeft:'5%'
                  }}>
                  <Image
                    source={{uri: capturedImage}}
                    style={{width: '100%', height: 120, resizeMode: 'cover'}} // Adjust the height and width here
                  />
                </View>
              ) : null}
          </View>
            </View>
            
             
            <TouchableOpacity style={[styles.suubmitButton, {marginTop: 20}]} onPress={handleFormSubmit}>
  <Text style={styles.submitButtonText}>Submit</Text>
</TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#357CA5',
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginLeft: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    color: '#000',
    height: 45,
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 5,
  },
  text: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  audiotext: {
    marginTop: 10,
    // fontWeight: 'bold',
    color: 'grey',
  },
  actionButton: {
    backgroundColor: '#ff0f0f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  suubmitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: '40%',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textinputtext: {
    color: '#000',
    marginBottom: 8,
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  radioButton: {
    marginRight: 10,
  },
  radio: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    borderRadius: 5,
  },
  radioSelected: {
    backgroundColor: '#357CA5',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-evenly',
    marginTop: 10, // Add some margin at the top
  },
  iconWrapper: {
    marginHorizontal: 20, // Add margin between icons
  },

  radioLabel: {
    marginLeft: 2,
    color: '#555',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default NetworkViewDetails;
