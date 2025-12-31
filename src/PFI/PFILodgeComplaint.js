import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  ScrollView,
  ToastAndroid,
  PermissionsAndroid,
  Button
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import LinearGradient from 'react-native-linear-gradient';
import pmaimg from '../../assets/images/pmaimg.png';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import syncStorage from 'react-native-sync-storage';
import baseUrl from '../Config/url';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import {Buffer} from 'buffer';
import * as RNFS from 'react-native-fs';
import DocumentPicker, {
  pickDirectory,
  types,
} from 'react-native-document-picker';
const PFILodgecomplaint = ({route, navigation}) => {
  const [activeTab, setActiveTab] = useState('LodgeComplaint'); // Default active tab

  const [contactNumber, setContactNumber] = useState('');
  const [source, setSource] = useState('PFI');
  const [currentIndex, setcurrentIndex] = useState('');

  const [isFocus, setIsFocus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
 
  const [complaintdetail, setcomplaintdetail] = useState('');

  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  const [startRecording, setStartRecording] = useState(false);
  const [audioFile, setAudioFile] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(true);
  const [audioPath, setAudioPath] = useState('');
  const [recording, setRecording] = useState(false);
  const [base64PathAudio, setBase64PathAudio] = useState('');
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [stateFunction, setStateFunction] = useState({
    URI: '',
    Type: '',
    Name: '',
  });
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  useEffect(() => {
    fetchCities();
    setSelectedCity(null);
  }, []);

  const complainassign = async () => {
    const users_id = syncStorage.get('user_detail').id;
    console.log('User ID:', users_id);
    try {
      const requestData = {
        users_id: users_id,
        name: name,
        cnic: cnic,
        phoneno: contactNumber,
        complaint_type: selectedOption ? selectedOption.name : '', // Check if selectedOption is not null
        source: 'PFI',
        system_name: selectedSystemName,
        station_name: selectedStation,
        stop_name: selectedStopname,
        category: selectedcategoryy,
        subcategory: selectedsubcategoryy,
        complaint_details: complaintdetail,
        // Add any other necessary fields here
      };
  
      console.log('Request Data:', requestData);
  
      const response = await fetch(`${baseUrl}/mstorecomplain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        ToastAndroid.show('Complaint submitted successfully!', ToastAndroid.SHORT);
        // Clear form fields or navigate to a different screen as needed
        clearFormFields(); // Function to clear form fields
      } else {
        ToastAndroid.show('Please fill all the required fields.', ToastAndroid.LONG);
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      ToastAndroid.show('Error submitting complaint. Please try again.', ToastAndroid.LONG);
    }
  };
  
  const clearFormFields = () => {

    setName('');
    setCnic('');
    setContactNumber('');
    setSelectedOption(null);
    setSource('');
    setSelectedSystemName('');
    setSelectedStation('');
    setSelectedStopname('');
    setSelectedCategoryy('');
    setSelectedSubcategoryy('');
    setcomplaintdetail('');
  };
  

  useEffect(() => {
    if (selectedCity) {
      fetchStations(selectedCity.id);
    }
  }, [selectedCity]);

  const [complaintsData, setComplaintsData] = useState([]); // State to store fetched complaints data
  const [collapsedStates, setCollapsedStates] = useState([]); // State to manage collapsed state of each item
  const [loading, setLoading] = useState(false); // State to indicate loading state
  const [offset, setOffset] = useState(0); // State to manage pagination offset

  // Pagination configuration
  const complaintsPerPage = 10; // Number of complaints per page

  // Effect to fetch complaints data when offset changes
  useEffect(() => {
    fetchComplaintsData();
  }, [offset]);

  // Function to fetch complaints data from the server
  const fetchComplaintsData = () => {
    setLoading(true);
    const users_id = syncStorage.get('user_detail').id;

    // Calculate the current page based on the offset and complaints per page
    const currentPage = Math.floor(offset / complaintsPerPage) + 1;

    fetch(`${baseUrl}/complainthistory/${users_id}/${currentPage}`)
      .then(response => response.json())
      .then(data => {
        // console.log('Fetched Data:', data); // Log fetched data
        setComplaintsData(data);
        setCollapsedStates(new Array(data.length).fill(true)); // Initially collapse all items
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching complaints data:', error);
        setLoading(false);
      });
  };

  // Pagination functions

  const nextPage = () => {
    const totalComplaints = complaintsData.length;
    if (totalComplaints === complaintsPerPage) {
      setOffset(offset + complaintsPerPage);
    }
  };
  const isNextDisabled = complaintsData.length < complaintsPerPage;

  const prevPage = () => {
    if (offset - complaintsPerPage >= 0) {
      setOffset(offset - complaintsPerPage);
    }
  };

  const isPrevDisabled = offset === 0;

  const onRefresh = () => {
    setRefreshing(true); // Set refreshing to true when refreshing starts
    fetchComplaintsData(); // Fetch new data
    setRefreshing(false); // Set refreshing to false when refreshing ends
  };

  const toggleCollapse = index => {
    const newCollapsedStates = [...collapsedStates];
    newCollapsedStates[index] = !newCollapsedStates[index];
    setCollapsedStates(newCollapsedStates);
  };


  const handleLogout = async navigation => {
    try {
      // Clear user details from sync storage
      syncStorage.remove('user_detail');

      // Reset navigation stack to navigate back to Login screen
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (e) {
      console.error('Error during logout:', e);
      // Handle logout error if needed
    }
  };

 // State variables to hold data fetched from APIs
const [cities, setCities] = useState([]);
const [systemNames, setSystemNames] = useState([]);
const [stations, setStations] = useState([]);
const [stopname, setStopname] = useState([]);
const [categoryy, setCategoryy] = useState([]);
const [subcategoryy, setSubcategoryy] = useState([]);
  
// State variables to hold selected values
const [selectedCity, setSelectedCity] = useState(null);
const [selectedSystemName, setSelectedSystemName] = useState(null);
const [selectedStation, setSelectedStation] = useState(null);
const [selectedStopname, setSelectedStopname] = useState(null);
const [selectedcategoryy, setSelectedCategoryy] = useState(null);
const [selectedsubcategoryy, setSelectedSubcategoryy] = useState(null);
// Function to fetch cities from API
const fetchCities = async () => {
  try {
    const response = await fetch('https://complaint-pma.punjab.gov.pk/api/cities');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const citiesData = data.complaint.map(city => ({ id: city.id, name: city.name }));
    setCities(citiesData);
  } catch (error) {
    console.error('Error fetching cities:', error);
  }
};

// Function to fetch system names based on selected city
const fetchSystemNames = async cityId => {
  try {
    const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/citiesname/${cityId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const systemNamesData = data.map(system => ({ id: system.id, name: system.name }));
    setSystemNames(systemNamesData);
  } catch (error) {
    console.error('Error fetching system names:', error);
  }
};

// Function to fetch stations based on selected system
const fetchStations = async systemId => {
  try {
    const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/stations/${systemId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const stationsData = data.map(station => ({ id: station.id, name: station.name }));
    setStations(stationsData);
    setSelectedStation(null); // Reset selected station
  } catch (error) {
    console.error('Error fetching stations:', error);
  }
};

// Function to fetch stops based on selected station
const fetchStops = async stationId => {
  try {
    const response = await fetch(`${baseUrl}/stopname/${stationId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const stopsData = data.map(stop => ({ id: stop.id, name: stop.name }));
    setStopname(stopsData);
  } catch (error) {
    console.error('Error fetching stop names:', error);
  }
};


    const fetchcategoryy = async systemId => {
      try {
        const response = await fetch(`${baseUrl}/categoryy/${systemId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched category data:', data); // Adding console statement to log fetched data
        const categoryy = data.map(category => ({
          id: category.id,
          name: category.name,
        }));
    setCategoryy(categoryy);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const fetchsubcategoryy = async categoryId => {
  try {
    const response = await fetch(`${baseUrl}/subcategoryy/${categoryId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched subcategory data:', data);
    const subcategoryy = data.map(subcategory => ({
      id: subcategory.id,
      name: subcategory.name,
    }));
    setSubcategoryy(subcategoryy);
  } catch (error) {
    console.error('Error fetching subcategory:', error);
  }
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

  const handleCityChange = cityId => {
    setSelectedCity(cityId);
    fetchSystemNames(cityId);
    setSelectedStation(null);
  };

  const handleStationChange = stationId => {
    setSelectedStation(stationId);
  };
  useEffect(() => {
    initializeRecordingAudio();
  }, []);
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
  

  const options = [
    {id: 1, name: 'Complaint'},
    {id: 2, name: 'General Query'},
    {id: 3, name: 'Advice / Suggestion'},
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'LodgeComplaint':
        return (
          <ScrollView style={styles.tabContent}>
            <Text style={styles.textinputtext}>Name</Text>

            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor="grey"
            />
            <Text style={styles.textinputtext}>CNIC</Text>

            <TextInput
              style={styles.input}
              value={cnic}
              onChangeText={setCnic}
              placeholder="CNIC"
              keyboardType="numeric"
              maxLength={13}
              placeholderTextColor="grey"
            />
            <Text style={styles.textinputtext}>Contact Number</Text>
            <TextInput
              style={styles.input}
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder="Contact Number"
              keyboardType="numeric"
              maxLength={11}
              placeholderTextColor="grey"
            />
            <Text style={styles.dropdowntext}>Complaint Type </Text>
            <View>
              <Dropdown
                style={[styles.dropdown, isFocus && {borderColor: '#36454f'}]}
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
            {/* <Text style={styles.textinputtext}>Source</Text>
            <TextInput
              style={styles.input}
              value={source}
              onChangeText={setSource}
              placeholder="Enter Source Here"
              editable={false}
              placeholderTextColor="grey"
            /> */}
           <View>
  <Text style={styles.dropdowntext}>Select City</Text>
  <Dropdown
    style={[styles.dropdown, isFocus && { borderColor: '#1E577C' }]}
    placeholderStyle={styles.placeholderStyle}
    selectedTextStyle={styles.selectedTextStyle}
    inputSearchStyle={styles.inputSearchStyle}
    itemTextStyle={styles.itemTextStyle}
    search
    searchPlaceholder="Search..."
    data={cities}
    labelField="name"
    valueField="id"
    placeholder="Select a city"
    onFocus={() => setIsFocus(true)}
    onChange={item => {
      setSelectedCity(item.id);
      fetchSystemNames(item.id);
    }}
    value={selectedCity}
  />
</View>
<View>
  <Text style={styles.dropdowntext}>Select System Name</Text>
  <Dropdown
    style={[styles.dropdown, isFocus && { borderColor: '#1E577C' }]}
    placeholderStyle={styles.placeholderStyle}
    selectedTextStyle={styles.selectedTextStyle}
    inputSearchStyle={styles.inputSearchStyle}
    itemTextStyle={styles.itemTextStyle}
    search
    searchPlaceholder="Search..."
    data={systemNames}
    labelField="name"
    valueField="id"
    placeholder="Select a system name"
    onFocus={() => setIsFocus(true)}
    onChange={item => {
      setSelectedSystemName(item.id);
      fetchStations(item.id);
      fetchcategoryy(item.id);
    }}
    value={selectedSystemName}
  />
</View>
<View>
  <Text style={styles.dropdowntext}>Station/Routes</Text>
  <Dropdown
    style={[styles.dropdown, isFocus && { borderColor: '#1E577C' }]}
    placeholderStyle={styles.placeholderStyle}
    selectedTextStyle={styles.selectedTextStyle}
    inputSearchStyle={styles.inputSearchStyle}
    itemTextStyle={styles.itemTextStyle}
    search
    searchPlaceholder="Search..."
    data={stations}
    labelField="name"
    valueField="id"
    placeholder="Select a station/route"
    onFocus={() => setIsFocus(true)}
    onChange={item => {
      setSelectedStation(item.id);
      fetchStops(item.id);
    }}
    value={selectedStation}
  />
</View>
<View>
  <Text style={styles.dropdowntext}>Stop Name</Text>
  <Dropdown
    style={[styles.dropdown, isFocus && { borderColor: '#1E577C' }]}
    placeholderStyle={styles.placeholderStyle}
    selectedTextStyle={styles.selectedTextStyle}
    inputSearchStyle={styles.inputSearchStyle}
    itemTextStyle={styles.itemTextStyle}
    search
    searchPlaceholder="Search..."
    data={stopname}
    labelField="name"
    valueField="id"
    placeholder="Select a stop name"
    onFocus={() => setIsFocus(true)}
    onChange={item => {
      setSelectedStopname(item.id);
      fetchcategoryy(selectedSystemName); // Fetch categories based on selected system
    }}
    value={selectedStopname}
  />
</View>

<View>
  <Text style={styles.dropdowntext}>Category</Text>
  <Dropdown
    style={[styles.dropdown, isFocus && { borderColor: '#1E577C' }]}
    placeholderStyle={styles.placeholderStyle}
    selectedTextStyle={styles.selectedTextStyle}
    inputSearchStyle={styles.inputSearchStyle}
    itemTextStyle={styles.itemTextStyle}
    search
    searchPlaceholder="Search..."
    data={categoryy}
    labelField="name"
    valueField="id"
    placeholder="Select a category"
    onFocus={() => setIsFocus(true)}
    onChange={item => {
      setSelectedCategoryy(item.id);
      fetchsubcategoryy(item.id); 
    }}
    value={selectedcategoryy}
  />
</View>

<View>
  <Text style={styles.dropdowntext}>Subcategory</Text>
  <Dropdown
    style={[styles.dropdown, isFocus && { borderColor: '#1E577C' }]}
    placeholderStyle={styles.placeholderStyle}
    selectedTextStyle={styles.selectedTextStyle}
    inputSearchStyle={styles.inputSearchStyle}
    itemTextStyle={styles.itemTextStyle}
    search
    searchPlaceholder="Search..."
    data={subcategoryy}
    labelField="name"
    valueField="id"
    placeholder="Select a subcategory"
    onFocus={() => setIsFocus(true)}
    onChange={item => setSelectedSubcategoryy(item.id)}
    value={selectedsubcategoryy}
  />
</View>
            <Text style={styles.textinputtext}>
              Complaint Details (max 2000 words)
            </Text>

            <TextInput
              style={styles.input}
              value={complaintdetail}
              onChangeText={setcomplaintdetail}
              placeholder=""
              placeholderTextColor="#999"
              placeholderStyle={{height: 80}}
            />

            <View>
              <Text style={styles.textinputtext}>Choose a File:</Text>
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
              {recording == true ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Icon
                    name="volume-down"
                    size={20}
                    style={{color: '#003060'}}></Icon>
                  <View style={{flex: 0.1}}></View>
                  <Text style={{fontWeight: '700', color: '#003060'}}>
                    Recording...
                  </Text>
                </View>
              ) : null}
              {audioFile != '' ? (
                <View
                  style={{
                    marginTop: '5%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={play}
                    style={{
                      // borderWidth: 1,
                      borderColor: '#003060',
                      // borderRadius: 14,
                      flex: 1,
                      height: 50,
                      marginHorizontal: 10,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="volume-up"
                        size={15}
                        style={{color: '#003060'}}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '700',
                          color: '#003060',
                        }}>
                        Play Audio
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{flex: 0.1}}></View>
                  <TouchableOpacity
                    onPress={() => {
                      handleRemoveAudio();
                    }}
                    style={{
                      // borderWidth: 1,
                      borderColor: 'red',
                      // borderRadius: 14,
                      flex: 1,
                      height: 50,
                      marginHorizontal: 10,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                      }}>
                      <Icon name="trash" size={15} style={{color: 'red'}} />
                      <Text
                        style={{fontSize: 16, fontWeight: '700', color: 'red'}}>
                        Delete Audio
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            {/* <View style={styles.swipebutton}>
              <SwipeButton
                // Icon={<Icon name="arrow" size={24} color="white" />}
                disabled={false}
                //disable the button by doing true (Optional)
                swipeSuccessThreshold={70}
                height={60}
                width={'95%'}
                title="Swipe to Complain"
                onSwipeSuccess={complainassign}
                // onSwipeSuccess={() => {
                //   alert('Assigned Successfully!');
                // }}
                //After the completion of swipe (Optional)
                railFillBackgroundColor="#D0F7F5" //(Optional)
                railFillBorderColor="#357CA5" //(Optional)
                thumbIconBackgroundColor="#357CA5" //(Optional)
                thumbIconBorderColor="#FFF" //(Optional)
                railBackgroundColor="#8FC7E6" //(Optional)
                railBorderColor="#357CA5" //(Optional)
                titleFontSize={16}
                titleColor="white"
              />
            </View> */}
            <View style={styles.parentcontainer}>
            <View style={styles.buttonContainer}>
              <Button
                title="Submit Complaint"
                onPress={complainassign}
                color="#28a745"
              />
            </View>
            </View>
          </ScrollView>
        );
      case 'ComplaintHistory':
        return (
          <View style={styles.tabContent2}>
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={fetchComplaintsData}
                />
              }>
              <View style={styles.content}>
                {loading ? (
                  <ActivityIndicator size="large" color="#000" />
                ) : (
                  complaintsData.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => toggleCollapse(index)}
                      style={styles.collapsibleHeader}>
                      <View style={styles.collapheaderItem}>
                        <Text
                          style={
                            styles.collapheaderText
                          }>{`Complaint id: ${item.id}`}</Text>
                        <Text style={styles.statusText}>{`Status: ${
                          item.status === 'Pending'
                            ? 'Not Process'
                            : item.status || 'Not Process'
                        }`}</Text>
                        <Icon
                          name={
                            collapsedStates[index]
                              ? 'chevron-down'
                              : 'chevron-up'
                          }
                          size={12}
                          color="#666"
                        />
                      </View>
                      <Collapsible collapsed={collapsedStates[index]}>
                        <View style={styles.collapsibleContent}>
                          {/* <View style={styles.rowContainer}>
                    <Text style={styles.labelText}>Complaint Number</Text>
                    <Text style={styles.innerlabelText}>{item.id}</Text>
                  </View> 
                   <View style={styles.rowContainer}>
                    <Text style={styles.labelText}>Complaint Type</Text>
                    <Text style={styles.innerlabelText}>{item.complaint_type}</Text>
                  </View> 
                   <View style={styles.rowContainer}>
                    <Text style={styles.labelText}>Service Provider</Text>
                    <Text style={styles.innerlabelText}>{item.service_provider_name}</Text>
                  </View>  */}
                          {/* <View style={styles.rowContainer}>
                    <Text style={styles.labelText}>District</Text>
                    <Text style={styles.innerlabelText}>{item.district}</Text>
                  </View> 
                   <View style={styles.rowContainer}>
                    <Text style={styles.labelText}>System</Text>
                    <Text style={styles.innerlabelText}>{item.system_name}</Text>
                  </View> 
                   <View style={styles.rowContainer}>
                    <Text style={styles.labelText}>Station</Text>
                    <Text style={styles.innerlabelText}>{item.station_name}</Text>
                  </View>
                  <View style={styles.rowContainer}>
                    <Text style={styles.labelText}>Category</Text>
                    <Text style={styles.innerlabelText}>{item.category}</Text>
                  </View>
                  <View style={styles.rowContainer}>
                    <Text style={styles.labelText}>SubCategory</Text>
                    <Text style={styles.innerlabelText}>{item.subcategory}</Text>
                  </View>  */}
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>
                              Registration date
                            </Text>
                            <Text style={styles.innerlabelText}>
                              {item.reg_date}
                            </Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>
                              Last Updation date
                            </Text>
                            <Text style={styles.innerlabelText}>
                              {item.updated_at}
                            </Text>
                          </View>
                          <View style={styles.actionButtonContainer}>
                            <TouchableOpacity
                              style={styles.actionButton}
                              onPress={() =>
                                navigation.navigate('PFIViewDetails', {
                                  complaintsData: complaintsData,
                                  currentIndex: index, // Pass the current index
                                })
                              }>
                              <Text style={styles.actionButtonText}>
                                View Details
                              </Text>
                            </TouchableOpacity>
                          </View>

                          {/* Add more rows for additional information */}
                        </View>
                      </Collapsible>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </ScrollView>
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                onPress={prevPage}
                style={[
                  styles.paginationButton,
                  isPrevDisabled ? styles.disabledButton : null,
                ]}
                disabled={isPrevDisabled}>
                <Icon name="arrow-left" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={{color: 'black'}}>
                {' '}
                Page: {Math.floor(offset / complaintsPerPage) + 1}
              </Text>
              <TouchableOpacity
                onPress={nextPage}
                style={[
                  styles.paginationButton,
                  isNextDisabled ? styles.disabledButton : null,
                ]}
                disabled={isNextDisabled}>
                <Icon name="arrow-right" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containern}>
      <LinearGradient
      colors={['#4CAF50', '#3E8944']}
      style={styles.headerContainer}
    >
      <View style={styles.leftContainer}>
        <Icon name="exclamation-circle" size={24} color="#fff" style={styles.dashboardIcon} />
        <Text style={styles.headerText}>Complaint</Text>
      </View>
      {/* <TouchableOpacity 
      onPress={() => handleLogout(navigation)}
      >
        <View style={styles.rightContainer}>
          <Text style={styles.logoutText}>Logout</Text>
          <Animatable.View
            animation={{
              from: { translateX: 0 }, // Starting position
              to: { translateX: 3 }, // Ending position
            }}
            duration={1000}
            iterationCount="infinite"
            easing="linear"
            useNativeDriver
            style={styles.logouticon}>
            <Icon
              name="sign-out"
              size={15}
              color="#fff"
              style={styles.icon}
            />
          </Animatable.View>
        </View>
      </TouchableOpacity> */}
    </LinearGradient>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'LodgeComplaint' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('LodgeComplaint')}>
            <Icon
              name="edit"
              size={20}
              color={activeTab === 'LodgeComplaint' ? '#357CA5' : '#333'}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'LodgeComplaint' && styles.activeTabButtonText,
              ]}>
              Lodge Complaint
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'ComplaintHistory' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('ComplaintHistory')}>
            <Icon
              name="history"
              size={20}
              color={activeTab === 'ComplaintHistory' ? '#357CA5' : '#333'}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'ComplaintHistory' && styles.activeTabButtonText,
              ]}>
              Complaint History
            </Text>
          </TouchableOpacity>
        </View>

        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containern: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '5%',
    paddingBottom: '4%',
    backgroundColor: '#006400',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10, // Adjust the marginLeft for left spacing
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '10%', // Adjust the marginRight for right spacing
  },
  dashboardIcon: {
    marginRight: 5, // Adjust the marginRight for icon spacing
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: '8%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  navTitle: {
    fontSize: 20,
    color: '#5E0034',
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#357CA5',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  activeTabButtonText: {
    color: '#357CA5',
  },
  tabContent: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginBottom:'5%',
    paddingHorizontal: 20,
  },
  tabContent2: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  input: {
    color: 'black',
    borderWidth: 0.5,
    borderColor: '#36454f',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    width: '100%',
  },
  textinputtext: {
    color: '#36454f',
    marginBottom: 8,
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  dropdowntext: {
    color: '#36454f',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
  },
  dropdown: {
    height: 40,
    borderColor: '#36454f',
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
  headern: {
    backgroundColor: '#357CA5',
    paddingVertical: '4%',
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTextContainern: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginTop:'20%',
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  headerTextn: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginLeft: '5%',
  },
  icon: {
    marginLeft: 10,
  },
  logoutcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: '5%',
  },
  swipebutton: {
    marginTop: '5%',
  },
  content: {
    flex: 1,
    padding: '5%',
  },
  collapsibleHeader: {
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 2,
    width: '100%',
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderLeftWidth: 2,
    // borderRightWidth: 2,
  },
  collapheaderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  collapheaderText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
  },
  collapsibleContent: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText: {
    marginRight: 20,
    fontWeight: 'bold',
    fontSize: 12,
    color: 'black',
  },
  innerlabelText: {
    marginRight: 20,
    fontWeight: 'bold',
    fontSize: 12,
    color: 'gray',
  },

  actionButtonContainer: {
    alignItems: 'center',
    marginBottom: 1,
  },
  actionButton: {
    backgroundColor: '#027148',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  paginationButton: {
    backgroundColor: '#357CA5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#CCC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  parentcontainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '90%',
    height:'100%',
    marginTop: '20%',
    borderRadius:10
  },
});

export default PFILodgecomplaint;
