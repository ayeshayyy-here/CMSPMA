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
  Button, 
  Alert
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Collapsible from 'react-native-collapsible';
import pmaimg from '../../assets/images/pmaimg.png';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import syncStorage from 'react-native-sync-storage';
import baseUrl from '../Config/url';
import AudioRecorder from '../Components/AudioRecorder';
import DocumentPicker from 'react-native-document-picker';

const Complaint = ({route, navigation}) => {
  const [activeTab, setActiveTab] = useState('LodgeComplaint');
  const [isFocus, setIsFocus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [complaintdetail, setcomplaintdetail] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [stateFunction, setStateFunction] = useState({
    URI: '',
    Type: '',
    Name: '',
  });
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [currentLongitude, setCurrentLongitude] = useState(null);
  const [currentLatitude, setCurrentLatitude] = useState(null);
  
  // State variables to hold data fetched from APIs
  const [cities, setCities] = useState([]);
  const [systemNames, setSystemNames] = useState([]);
  const [stations, setStations] = useState([]);
  const [stopname, setStopname] = useState([]);
  const [categoryy, setCategoryy] = useState([]);
  const [subcategoryy, setSubcategoryy] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  
  // State variables to hold selected values
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSystemName, setSelectedSystemName] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedStopname, setSelectedStopname] = useState(null);
  const [selectedcategoryy, setSelectedCategoryy] = useState(null);
  const [selectedsubcategoryy, setSelectedSubcategoryy] = useState(null);
  const [capturedImage, setCapturedImage] = useState('');
  const [capturedfile, setCapturedfile] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);

  // State for complaint history
  const [complaintsData, setComplaintsData] = useState([]);
  const [collapsedStates, setCollapsedStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const complaintsPerPage = 10;

  // Initialize location and user data
  useEffect(() => {
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          setCurrentLongitude(longitude);
          setCurrentLatitude(latitude);
        },
        error => {
          console.log('Error:', error);
          Alert.alert('Please switch on the Location Services!');
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 1000
        }
      );
    };

    getLocation();

    return () => Geolocation.clearWatch();
  }, []);

  // Initialize user details and fetch cities
  useEffect(() => {
    const userDetails = syncStorage.get('user_detail');
    if (userDetails) {
      setName(userDetails.name);
      setCnic(userDetails.cnic);
      setPhoneno(userDetails.phoneno);
    }
    fetchCities();
  }, []);

  // Fetch complaints data
  useEffect(() => {
    if (activeTab === 'ComplaintHistory') {
      fetchComplaintsData();
    }
  }, [offset, activeTab]);

  // Fetch system names when city changes
  useEffect(() => {
    if (selectedCity) {
      fetchSystemNames(selectedCity);
      resetDependentDropdowns('city');
    }
  }, [selectedCity]);

  // Fetch stations when system changes
  useEffect(() => {
    if (selectedSystemName) {
      fetchStations(selectedSystemName);
      fetchcategoryy(selectedSystemName);
      resetDependentDropdowns('system');
    }
  }, [selectedSystemName]);

  // Fetch stops when station changes
  useEffect(() => {
    if (selectedStation) {
      fetchStops(selectedStation);
      resetDependentDropdowns('station');
    }
  }, [selectedStation]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedcategoryy) {
      fetchsubcategoryy(selectedcategoryy);
      setSelectedSubcategoryy(null);
      setSubcategoryy([]);
    }
  }, [selectedcategoryy]);

  // Reset dependent dropdowns based on which dropdown changed
  const resetDependentDropdowns = (changedField) => {
    switch (changedField) {
      case 'city':
        setSelectedSystemName(null);
        setSelectedStation(null);
        setSelectedStopname(null);
        setSelectedCategoryy(null);
        setSelectedSubcategoryy(null);
        setSystemNames([]);
        setStations([]);
        setStopname([]);
        setCategoryy([]);
        setSubcategoryy([]);
        break;
      case 'system':
        setSelectedStation(null);
        setSelectedStopname(null);
        setSelectedCategoryy(null);
        setSelectedSubcategoryy(null);
        setStations([]);
        setStopname([]);
        setSubcategoryy([]);
        break;
      case 'station':
        setSelectedStopname(null);
        setStopname([]);
        break;
      default:
        break;
    }
  };

  // Function to fetch cities from API
const fetchCities = async () => {
  try {
    setLoadingCities(true);
    console.log('Fetching cities from API...');
    
    const response = await fetch('https://complaint-pma.punjab.gov.pk/api/cities', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Full API Response:', JSON.stringify(data, null, 2));
    
    // First check for the new structure with "cities" key
    if (data && data.cities && Array.isArray(data.cities)) {
      console.log('Found cities array with', data.cities.length, 'items');
      
      const citiesData = data.cities.map(city => {
        console.log('City item:', city);
        return { 
          id: city.id || city.city_id || city.ID, 
          name: city.name || city.city_name || city.Name || 'Unknown'
        };
      }).filter(city => city.id && city.name); // Filter out invalid items
      
      console.log('Processed cities data:', citiesData);
      
      if (citiesData.length > 0) {
        setCities(citiesData);
        ToastAndroid.show(`Loaded ${citiesData.length} cities`, ToastAndroid.SHORT);
      } else {
        console.warn('No valid city data found after processing');
        setCities([]);
        ToastAndroid.show('No cities data available', ToastAndroid.SHORT);
      }
    } 
    // Check for direct array response
    else if (Array.isArray(data)) {
      console.log('Direct array response with', data.length, 'items');
      
      const citiesData = data.map(city => {
        return { 
          id: city.id || city.city_id || city.ID, 
          name: city.name || city.city_name || city.Name || 'Unknown'
        };
      }).filter(city => city.id && city.name);
      
      if (citiesData.length > 0) {
        setCities(citiesData);
        ToastAndroid.show(`Loaded ${citiesData.length} cities`, ToastAndroid.SHORT);
      } else {
        setCities([]);
        ToastAndroid.show('No cities data available', ToastAndroid.SHORT);
      }
    }
    // Check for other possible structures
    else if (data && data.data && Array.isArray(data.data)) {
      console.log('Found data.data array structure');
      
      const citiesData = data.data.map(city => {
        return { 
          id: city.id || city.city_id || city.ID, 
          name: city.name || city.city_name || city.Name || 'Unknown'
        };
      }).filter(city => city.id && city.name);
      
      if (citiesData.length > 0) {
        setCities(citiesData);
        ToastAndroid.show(`Loaded ${citiesData.length} cities`, ToastAndroid.SHORT);
      } else {
        setCities([]);
        ToastAndroid.show('No cities data available', ToastAndroid.SHORT);
      }
    }
    // Handle success message with cities array
    else if (data && data.success && data.cities && Array.isArray(data.cities)) {
      console.log('Found success.cities structure');
      
      const citiesData = data.cities.map(city => {
        return { 
          id: city.id || city.city_id || city.ID, 
          name: city.name || city.city_name || city.Name || 'Unknown'
        };
      }).filter(city => city.id && city.name);
      
      if (citiesData.length > 0) {
        setCities(citiesData);
        ToastAndroid.show(`Loaded ${citiesData.length} cities`, ToastAndroid.SHORT);
      } else {
        setCities([]);
        ToastAndroid.show('No cities data available', ToastAndroid.SHORT);
      }
    }
    else {
      console.warn('Unexpected data structure:', data);
      setCities([]);
      ToastAndroid.show('No cities available', ToastAndroid.SHORT);
    }
  } catch (error) {
    console.error('Error fetching cities:', error);
    console.error('Error stack:', error.stack);
    
    // Check for network errors
    if (error.message.includes('Network request failed')) {
      ToastAndroid.show('Network error. Check your internet connection.', ToastAndroid.LONG);
    } else {
      ToastAndroid.show('Failed to load cities. Please try again.', ToastAndroid.LONG);
    }
    
    setCities([]);
  } finally {
    setLoadingCities(false);
  }
};

  // Function to fetch system names based on selected city
  const fetchSystemNames = async (cityId) => {
    try {
      console.log('Fetching systems for city:', cityId);
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/citiesname/${cityId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Systems API Response:', data);
      
      if (Array.isArray(data)) {
        const systemNamesData = data.map(system => ({ 
          id: system.id, 
          name: system.name 
        }));
        setSystemNames(systemNamesData);
        console.log('Systems loaded:', systemNamesData.length);
      } else {
        console.log('Unexpected data structure for systems:', data);
        setSystemNames([]);
        ToastAndroid.show('No systems available for this city', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error fetching system names:', error);
      ToastAndroid.show('Failed to load system names', ToastAndroid.SHORT);
      setSystemNames([]);
    }
  };

  // Function to fetch stations based on selected system
  const fetchStations = async (systemId) => {
    try {
      console.log('Fetching stations for system:', systemId);
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/stations/${systemId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Stations API Response:', data);
      
      if (Array.isArray(data)) {
        const stationsData = data.map(station => ({ 
          id: station.id, 
          name: station.name 
        }));
        setStations(stationsData);
        console.log('Stations loaded:', stationsData.length);
      } else {
        console.log('Unexpected data structure for stations:', data);
        setStations([]);
        ToastAndroid.show('No stations available for this system', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      ToastAndroid.show('Failed to load stations', ToastAndroid.SHORT);
      setStations([]);
    }
  };

  // Function to fetch stops based on selected station
  const fetchStops = async (stationId) => {
    try {
      console.log('Fetching stops for station:', stationId);
      const response = await fetch(`${baseUrl}/stopname/${stationId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Stops API Response:', data);
      
      if (Array.isArray(data)) {
        const stopsData = data.map(stop => ({ 
          id: stop.id, 
          name: stop.name 
        }));
        setStopname(stopsData);
        console.log('Stops loaded:', stopsData.length);
      } else {
        console.log('Unexpected data structure for stops:', data);
        setStopname([]);
        ToastAndroid.show('No stops available for this station', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error fetching stop names:', error);
      ToastAndroid.show('Failed to load stops', ToastAndroid.SHORT);
      setStopname([]);
    }
  };

  const fetchcategoryy = async (systemId) => {
    try {
      console.log('Fetching categories for system:', systemId);
      const response = await fetch(`${baseUrl}/categoryy/${systemId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Categories API Response:', data);
      
      if (Array.isArray(data)) {
        const categoriesData = data.map(category => ({
          id: category.id,
          name: category.name,
        }));
        setCategoryy(categoriesData);
        console.log('Categories loaded:', categoriesData.length);
      } else {
        console.log('Unexpected data structure for categories:', data);
        setCategoryy([]);
        ToastAndroid.show('No categories available for this system', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      ToastAndroid.show('Failed to load categories', ToastAndroid.SHORT);
      setCategoryy([]);
    }
  };

  const fetchsubcategoryy = async (categoryId) => {
    try {
      console.log('Fetching subcategories for category:', categoryId);
      const response = await fetch(`${baseUrl}/subcategoryy/${categoryId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Subcategories API Response:', data);
      
      if (Array.isArray(data)) {
        const subcategoriesData = data.map(subcategory => ({
          id: subcategory.id,
          name: subcategory.name,
        }));
        setSubcategoryy(subcategoriesData);
        console.log('Subcategories loaded:', subcategoriesData.length);
      } else {
        console.log('Unexpected data structure for subcategories:', data);
        setSubcategoryy([]);
        ToastAndroid.show('No subcategories available for this category', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error fetching subcategory:', error);
      ToastAndroid.show('Failed to load subcategories', ToastAndroid.SHORT);
      setSubcategoryy([]);
    }
  };

  // Submit complaint function
const complainassign = async () => {
  // Validate all required fields
  const requiredFields = [
    { field: name, name: 'Name' },
    { field: cnic, name: 'CNIC' },
    { field: phoneno, name: 'Phone Number' },
    { field: selectedOption, name: 'Complaint Type' },
    { field: selectedSystemName, name: 'System Name' },
    { field: selectedStation, name: 'Station' },
    { field: selectedStopname, name: 'Stop Name' },
    { field: selectedcategoryy, name: 'Category' },
    { field: selectedsubcategoryy, name: 'Subcategory' },
    { field: complaintdetail, name: 'Complaint Details' },
  ];

  const missingFields = requiredFields.filter(item => !item.field || item.field === '');
  
  if (missingFields.length > 0) {
    ToastAndroid.show(`Please fill: ${missingFields.map(f => f.name).join(', ')}`, ToastAndroid.LONG);
    return;
  }

  const userDetail = syncStorage.get('user_detail');
  const userId = userDetail?.id;

  if (!userId) {
    ToastAndroid.show('User not found. Please login again.', ToastAndroid.LONG);
    return;
  }

  try {
    // Prepare request data - ADD NOTIFICATION FIELD
    const requestData = {
      users_id: parseInt(userId),
      name: name,
      cnic: cnic,
      phoneno: phoneno,
      complaint_type: selectedOption ? selectedOption.name : '',
      source: 'App',
      system_name: selectedSystemName ? parseInt(selectedSystemName) : null,
      station_name: selectedStation ? parseInt(selectedStation) : null,
      stop_name: selectedStopname ? parseInt(selectedStopname) : null,
      category: selectedcategoryy ? parseInt(selectedcategoryy) : null,
      subcategory: selectedsubcategoryy ? parseInt(selectedsubcategoryy) : null,
      complaint_details: complaintdetail,
      complaint_audio: recordedAudio || null,
      complaint_file: stateFunction.URI || null,
      complain_pic: capturedImage || null,
      longitude: currentLongitude ? currentLongitude.toString() : '',
      latitude: currentLatitude ? currentLatitude.toString() : '',
      // ADD THESE MISSING FIELDS TO FIX THE ERROR
      notification: 1, // CRITICAL: Add this field
      noc: null, // Add if exists in your form
      complaint_video: null,
      resolvecomplain_pic: null,
      resolvecomplain_file: null,
      resolvecomplain_audio: null,
      resolvecomplain_video: null,
      status: 'pending',
      remark: '',
      amverify: null,
      amremarks: null,
    };

    console.log('Submitting complaint with data:', JSON.stringify(requestData, null, 2));

    // Use FormData for file uploads
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.keys(requestData).forEach(key => {
      // Handle null values
      const value = requestData[key];
      if (value !== null && value !== undefined) {
        // Skip file fields - they will be added separately
        if (key !== 'complaint_file' && key !== 'complain_pic') {
          formData.append(key, value);
        }
      }
    });
    
    // Add file if exists
    if (stateFunction.URI) {
      formData.append('complaint_file', {
        uri: stateFunction.URI,
        type: stateFunction.Type || 'application/octet-stream',
        name: stateFunction.Name || 'file',
      });
    }
    
    // Add image if exists
    if (capturedImage) {
      formData.append('complain_pic', {
        uri: capturedImage,
        type: 'image/jpeg',
        name: 'complaint_image.jpg',
      });
    }
    
    // Add audio as base64 string
    if (recordedAudio) {
      formData.append('complaint_audio', recordedAudio);
    }

    const endpoint = `https://complaint-pma.punjab.gov.pk/api/userstoreComplain`;
    console.log('Using endpoint:', endpoint);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    console.log('Response status:', response.status);

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('JSON parse error:', e);
      responseData = { error: 'Invalid JSON response', raw: responseText };
    }

    if (response.ok) {
      console.log('Success response:', responseData);
      
      ToastAndroid.show(responseData.message || 'Complaint submitted successfully!', ToastAndroid.SHORT);
      
      // Clear form
      clearForm();
      
    } else {
      console.error('Error response:', responseData);
      
      if (responseData.error) {
        ToastAndroid.show(responseData.error, ToastAndroid.LONG);
      } else {
        ToastAndroid.show('Failed to submit complaint. Please try again.', ToastAndroid.LONG);
      }
    }
  } catch (error) {
    console.error('Network/Error submitting complaint:', error);
    console.error('Error stack:', error.stack);
    
    if (error.message.includes('Network request failed')) {
      ToastAndroid.show('Network error. Check your internet connection.', ToastAndroid.LONG);
    } else {
      ToastAndroid.show('Error: ' + error.message, ToastAndroid.LONG);
    }
  }
};
// Helper function to clear form
const clearForm = () => {
  // Don't clear user info if it's from storage
  // setName('');
  // setCnic('');
  // setPhoneno('');
  
  setSelectedOption(null);
  setSelectedCity(null);
  setSelectedSystemName(null);
  setSelectedStation(null);
  setSelectedStopname(null);
  setSelectedCategoryy(null);
  setSelectedSubcategoryy(null);
  setcomplaintdetail('');
  setRecordedAudio(null);
  setStateFunction({URI: '', Type: '', Name: ''});
  setCapturedImage('');
  setCapturedfile('');
  
  // Reset dropdown data but keep cities
  setSystemNames([]);
  setStations([]);
  setStopname([]);
  setCategoryy([]);
  setSubcategoryy([]);
};
  // Fetch complaints history
  const fetchComplaintsData = () => {
    setLoading(true);
    const users_id = syncStorage.get('user_detail')?.id;

    if (!users_id) {
      ToastAndroid.show('User not found. Please login again.', ToastAndroid.LONG);
      setLoading(false);
      return;
    }

    const currentPage = Math.floor(offset / complaintsPerPage) + 1;

    fetch(`${baseUrl}/complainthistory/${users_id}/${currentPage}`)
      .then(response => response.json())
      .then(data => {
        setComplaintsData(data);
        setCollapsedStates(new Array(data.length).fill(true));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching complaints data:', error);
        ToastAndroid.show('Failed to load complaint history', ToastAndroid.SHORT);
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

  const prevPage = () => {
    if (offset - complaintsPerPage >= 0) {
      setOffset(offset - complaintsPerPage);
    }
  };

  const isNextDisabled = complaintsData.length < complaintsPerPage;
  const isPrevDisabled = offset === 0;

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaintsData();
    setRefreshing(false);
  };

  const toggleCollapse = (index) => {
    const newCollapsedStates = [...collapsedStates];
    newCollapsedStates[index] = !newCollapsedStates[index];
    setCollapsedStates(newCollapsedStates);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'overdue':
        return 'red';
      case 'resolved':
        return 'green';
      default:
        return 'black';
    }
  };

  // Audio recording handler
  const handleAudioRecorded = (audioData) => {
    setRecordedAudio(audioData);
  };

  // Camera function
  const openCamera = async () => {
    setModalVisible(false);
    try {
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
          } else if (response.assets && response.assets[0]) {
            const fileBase64 = response.assets[0].base64;
            const imageUri = response.assets[0].uri;
            setCapturedfile(fileBase64);
            setCapturedImage(imageUri);
          }
        });
      }
    } catch (error) {
      console.error('Camera permission error:', error);
    }
  };

  // Gallery function
  const openGallery = async () => {
    try {
      const response = await DocumentPicker.pick({
        allowMultiSelection: false,
        type: [DocumentPicker.types.allFiles],
      });

      if (response[0]) {
        setStateFunction(prev => ({
          ...prev,
          Name: response[0].name,
          Type: response[0].type,
          URI: response[0].uri,
        }));
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Document picking error:', error);
      }
    }
  };

  // Complaint type options
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
              editable={false}
            />
            
            <Text style={styles.textinputtext}>CNIC</Text>
            <TextInput
              style={styles.input}
              value={cnic}
              onChangeText={setCnic}
              editable={false}
            />
            
            <Text style={styles.textinputtext}>Contact Number</Text>
            <TextInput
              style={styles.input}
              value={phoneno}
              onChangeText={setPhoneno}
              editable={false}
            />
            
            <Text style={styles.dropdowntext}>Complaint Type</Text>
            <View>
              <Dropdown
                style={[styles.dropdown, isFocus && {borderColor: 'grey'}]}
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
                onBlur={() => setIsFocus(false)}
                value={selectedOption}
                onChange={value => setSelectedOption(value)}
              />
            </View>

            {/* City Dropdown */}
           {/* City Dropdown */}
<View>
  <Text style={styles.dropdowntext}>Select City</Text>
  {loadingCities ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color="#000" />
      <Text style={styles.loadingText}>Loading cities...</Text>
    </View>
  ) : (
    <Dropdown
      style={[styles.dropdown, isFocus && {borderColor: 'grey'}]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      itemTextStyle={styles.itemTextStyle}
      search
      searchPlaceholder="Search..."
      data={cities}
      labelField="name"
      valueField="id"
      placeholder={cities.length === 0 ? "No cities available" : "Select a city"}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={item => {
        console.log('Selected city:', item);
        setSelectedCity(item.id);
      }}
      value={selectedCity}
    />
  )}
</View>

            {/* System Name Dropdown */}
            <View>
              <Text style={styles.dropdowntext}>Select System Name</Text>
              <Dropdown
                style={[styles.dropdown, isFocus && {borderColor: 'grey'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={styles.itemTextStyle}
                search
                searchPlaceholder="Search..."
                data={systemNames}
                labelField="name"
                valueField="id"
                placeholder={systemNames.length === 0 ? "First select a city" : "Select a system name"}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setSelectedSystemName(item.id);
                }}
                value={selectedSystemName}
                disable={systemNames.length === 0}
              />
            </View>

            {/* Station/Routes Dropdown */}
            <View>
              <Text style={styles.dropdowntext}>Station/Routes</Text>
              <Dropdown
                style={[styles.dropdown, isFocus && {borderColor: 'grey'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={styles.itemTextStyle}
                search
                searchPlaceholder="Search..."
                data={stations}
                labelField="name"
                valueField="id"
                placeholder={stations.length === 0 ? "First select a system" : "Select a station/route"}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setSelectedStation(item.id);
                }}
                value={selectedStation}
                disable={stations.length === 0}
              />
            </View>

            {/* Stop Name Dropdown */}
            <View>
              <Text style={styles.dropdowntext}>Stop Name</Text>
              <Dropdown
                style={[styles.dropdown, isFocus && {borderColor: 'grey'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={styles.itemTextStyle}
                search
                searchPlaceholder="Search..."
                data={stopname}
                labelField="name"
                valueField="id"
                placeholder={stopname.length === 0 ? "First select a station" : "Select a stop name"}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setSelectedStopname(item.id);
                }}
                value={selectedStopname}
                disable={stopname.length === 0}
              />
            </View>

            {/* Category Dropdown */}
            <View>
              <Text style={styles.dropdowntext}>Category</Text>
              <Dropdown
                style={[styles.dropdown, isFocus && {borderColor: 'grey'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={styles.itemTextStyle}
                search
                searchPlaceholder="Search..."
                data={categoryy}
                labelField="name"
                valueField="id"
                placeholder={categoryy.length === 0 ? "First select a system" : "Select a category"}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setSelectedCategoryy(item.id);
                }}
                value={selectedcategoryy}
                disable={categoryy.length === 0}
              />
            </View>

            {/* Subcategory Dropdown */}
            <View>
              <Text style={styles.dropdowntext}>Subcategory</Text>
              <Dropdown
                style={[styles.dropdown, isFocus && {borderColor: 'grey'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={styles.itemTextStyle}
                search
                searchPlaceholder="Search..."
                data={subcategoryy}
                labelField="name"
                valueField="id"
                placeholder={subcategoryy.length === 0 ? "First select a category" : "Select a subcategory"}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => setSelectedSubcategoryy(item.id)}
                value={selectedsubcategoryy}
                disable={subcategoryy.length === 0}
              />
            </View>

            <Text style={styles.textinputtext}>Complaint Details (max 2000 words)</Text>
            <TextInput
              style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
              value={complaintdetail}
              onChangeText={setcomplaintdetail}
              placeholder="Enter complaint details..."
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={10}
              maxLength={2000}
            />

            <View>
              <Text style={styles.textinputtext}>Choose a File/Video:</Text>
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={openGallery}>
                  <Icon name="file" color="black" size={30} />
                </TouchableOpacity>
              </View>
              {stateFunction.Name ? (
                <View style={styles.fileInfo}>
                  <Text style={styles.fileText}>{stateFunction.Name}</Text>
                </View>
              ) : null}
            </View>

            <View>
              <Text style={styles.text}>Record Audio:</Text>
              <AudioRecorder onAudioRecorded={handleAudioRecorded} />
              
              <Text style={styles.text}>Capture Image:</Text>
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={openCamera}>
                  <Icon name="camera" size={30} color="black" />
                </TouchableOpacity>
              </View>
              
              {capturedImage ? (
                <View style={styles.imagePreview}>
                  <Image
                    source={{uri: capturedImage}}
                    style={styles.previewImage}
                  />
                </View>
              ) : null}
            </View>

            <View style={styles.parentcontainer}>
              <View style={styles.buttonContainer}>
                <Button
                  title="Submit Complaint"
                  onPress={complainassign}
                  color="#da1703"
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
                ) : complaintsData.length === 0 ? (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No Complaint History</Text>
                    <Icon name="exclamation-circle" size={24} color="black" />
                  </View>
                ) : (
                  complaintsData.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => toggleCollapse(index)}
                      style={[styles.collapsibleHeader, getStatusBorderColor(item.status)]}>
                      <View style={styles.collapheaderItem}>
                        <Text style={styles.collapheaderText}>{`Complaint id: ${item.id}`}</Text>
                        <Text
                          style={[
                            styles.statusText,
                            {color: getStatusColor(item.status)},
                          ]}>
                          {`Status: ${item.status === 'null' || !item.status ? 'Not Process' : item.status}`}
                        </Text>
                        <Icon
                          name={collapsedStates[index] ? 'chevron-down' : 'chevron-up'}
                          size={12}
                          color="#666"
                        />
                      </View>
                      <Collapsible collapsed={collapsedStates[index]}>
                        <View style={styles.collapsibleContent}>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Full Name</Text>
                            <Text style={styles.innerlabelText}>{item.name}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>CNIC Number</Text>
                            <Text style={styles.innerlabelText}>{item.cnic}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Contact Number</Text>
                            <Text style={styles.innerlabelText}>{item.phoneno}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Complaint Type</Text>
                            <Text style={styles.innerlabelText}>{item.complaint_type}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Reg Date:</Text>
                            <Text style={styles.innerlabelText}>{item.created_at}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>City Name</Text>
                            <Text style={styles.innerlabelText}>{item.city_name}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>System Name</Text>
                            <Text style={styles.innerlabelText}>{item.sp_name}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Station Name</Text>
                            <Text style={styles.innerlabelText}>{item.station_name}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Stop Name</Text>
                            <Text style={styles.innerlabelText}>{item.stop_name}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Category</Text>
                            <Text style={styles.innerlabelText}>{item.category_name}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Sub-Category</Text>
                            <Text style={styles.innerlabelText}>{item.subcategory_name}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Service Provider Name:</Text>
                            <Text style={styles.innerlabelText}>{item.service_provider_name}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Complaint Details</Text>
                            <Text style={styles.innerlabelText}>{item.complaint_details}</Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Complaint File</Text>
                            <Text style={styles.innerlabelText}>
                              {item.complain_file ? item.complain_file : 'No file'}
                            </Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Complains Image</Text>
                            <Text style={styles.innerlabelText}>
                              {item.complain_pic ? item.complain_pic : 'No image'}
                            </Text>
                          </View>
                          <View style={styles.rowContainer}>
                            <Text style={styles.labelText}>Complaint Audio</Text>
                            <Text style={styles.innerlabelText}>
                              {item.complaint_audio ? 'Audio available' : 'No audio'}
                            </Text>
                          </View>
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
                  isPrevDisabled && styles.disabledButton,
                ]}
                disabled={isPrevDisabled}>
                <Icon name="arrow-left" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.pageText}>
                Page: {Math.floor(offset / complaintsPerPage) + 1}
              </Text>
              <TouchableOpacity
                onPress={nextPage}
                style={[
                  styles.paginationButton,
                  isNextDisabled && styles.disabledButton,
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

  const getStatusBorderColor = status => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {borderLeftColor: 'orange', borderLeftWidth: 5};
      case 'overdue':
        return {borderLeftColor: 'red', borderLeftWidth: 5};
      case 'resolved':
        return {borderLeftColor: 'green', borderLeftWidth: 5};
      default:
        return {borderLeftColor: 'grey', borderLeftWidth: 5};
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containern}>
        <View style={styles.headern}>
          <View style={styles.headerTextContainern}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.imageContainer}>
                <Image source={pmaimg} style={styles.image} />
              </View>
              <Text style={styles.headerTextn}>CMS | User</Text>
            </View>
          </View>
        </View>

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
              color={activeTab === 'LodgeComplaint' ? '#da1703' : '#333'}
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
              color={activeTab === 'ComplaintHistory' ? '#da1703' : '#333'}
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
  iconWrapper: {
    marginHorizontal: 20,
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
    borderBottomColor: '#da1703',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  text: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  activeTabButtonText: {
    color: '#da1703',
  },
  tabContent: {
    flex: 1,
    marginBottom: '10%',
    paddingHorizontal: 20,
  },
  tabContent2: {
    flex: 1,
  },
  input: {
    color: 'black',
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    width: '100%',
  },
  textinputtext: {
    color: '#000',
    marginBottom: 8,
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  dropdowntext: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
  },
  dropdown: {
    height: 40,
    borderColor: 'grey',
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
    backgroundColor: '#da1703',
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
    marginTop: '20%',
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
    marginLeft: '30%',
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
  },
  collapheaderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapheaderText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 12,
    marginTop: 5,
  },
  collapsibleContent: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    marginTop: 10,
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
    width: '40%',
  },
  innerlabelText: {
    flex: 1,
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
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  paginationButton: {
    backgroundColor: '#da1703',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  pageText: {
    color: 'black',
    fontSize: 16,
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
  parentcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '90%',
    height: '100%',
    marginTop: '20%',
    borderRadius: 10,
  },
  iconRow: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: '5%',
  },
  fileInfo: {
    marginTop: '5%',
    alignItems: 'flex-start',
  },
  fileText: {
    color: 'black',
  },
  imagePreview: {
    marginTop: 20,
    width: 300,
    height: 120,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: '5%',
  },
  previewImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: 'black',
  },
  noDataContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  noDataText: {
    color: 'black',
    marginBottom: 10,
    fontSize: 16,
  },
});

export default Complaint;