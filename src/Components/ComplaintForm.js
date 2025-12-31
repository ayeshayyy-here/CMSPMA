import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ToastAndroid,
  Alert,
  Image,
  Platform,
  RefreshControl
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import baseUrl from '../Config/url';
import AudioRecorder from '../Components/AudioRecorder';
import DocumentPicker from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native';

// Enhanced logging utility
const logger = {
  info: (message, data = null) => {
    console.log(`[INFO] ${message}`, data ? data : '');
  },
  error: (message, error = null) => {
    console.error(`[ERROR] ${message}`, error ? error : '');
  },
  warn: (message, data = null) => {
    console.warn(`[WARN] ${message}`, data ? data : '');
  },
  debug: (message, data = null) => {
    console.debug(`[DEBUG] ${message}`, data ? data : '');
  }
};

const ComplaintForm = ({ onSubmit }) => {
  const [isFocus, setIsFocus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [complaintdetail, setComplaintdetail] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [currentLongitude, setCurrentLongitude] = useState(null);
  const [currentLatitude, setCurrentLatitude] = useState(null);
  const [errors, setErrors] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  
  // State for dropdown data
  const [cities, setCities] = useState([]);
  const [operations, setOperations] = useState([]);
  const [systemNames, setSystemNames] = useState([]);
  const [stations, setStations] = useState([]);
  const [stopname, setStopname] = useState([]);
  const [categoryy, setCategoryy] = useState([]);
  const [subcategoryy, setSubcategoryy] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]); // For complaint type dropdown
  
  // State for selected values
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedSystemName, setSelectedSystemName] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedStopname, setSelectedStopname] = useState(null);
  const [selectedCategoryy, setSelectedCategoryy] = useState(null);
  const [selectedSubcategoryy, setSelectedSubcategoryy] = useState(null);
  
  // State for file attachments
  const [stateFunction, setStateFunction] = useState({
    URI: '',
    Type: '',
    Name: '',
  });
  const [capturedImage, setCapturedImage] = useState('');
  const [recordedAudio, setRecordedAudio] = useState(null);

  // Loading states
  const [loading, setLoading] = useState({
    cities: false,
    operations: false,
    complaintTypes: false,
    systems: false,
    stations: false,
    stops: false,
    categories: false,
    subcategories: false,
    submission: false
  });

  // Initial data fetching on component mount
  useEffect(() => {
    logger.info('ComplaintForm component mounted');
    fetchInitialData();
    
    const getLocation = () => {
      logger.info('Attempting to get current location');
      Geolocation.getCurrentPosition(
        position => {
          logger.info('Location fetched successfully', {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          });
          setCurrentLongitude(position.coords.longitude);
          setCurrentLatitude(position.coords.latitude);
        },
        error => {
          logger.error('Error fetching location', error);
          Alert.alert('Location Error', 'Please switch on the Location Services!');
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 1000
        }
      );
    };

    getLocation();

    return () => {
      logger.info('ComplaintForm component unmounted');
      Geolocation.clearWatch();
    };
  }, []);

  // Fetch all initial data
  const fetchInitialData = async () => {
    await Promise.all([
      fetchCities(),
      fetchComplaintTypes(),
      fetchOperations()
    ]);
  };

  // Refresh function
  const onRefresh = async () => {
    logger.info('Refreshing form data');
    setRefreshing(true);
    
    // Reset all form fields
    resetForm();
    
    // Fetch fresh data
    await fetchInitialData();
    
    // Fetch location again
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setCurrentLongitude(position.coords.longitude);
          setCurrentLatitude(position.coords.latitude);
        },
        error => {
          logger.error('Error fetching location on refresh', error);
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 1000
        }
      );
    };
    
    getLocation();
    
    setRefreshing(false);
    ToastAndroid.show('Form refreshed successfully!', ToastAndroid.SHORT);
  };

  // Enhanced validate form
  const validateForm = () => {
    logger.info('Starting form validation');
    
    let valid = true;
    const newErrors = {};
    
    if (!name) {
      newErrors.name = 'Name is required';
      valid = false;
      logger.warn('Form validation failed: Name is required');
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
      logger.warn('Form validation failed: Email is required');
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
      logger.warn('Form validation failed: Invalid email format', { email });
    }
    
    if (!phoneno) {
      newErrors.phoneno = 'Phone number is required';
      valid = false;
      logger.warn('Form validation failed: Phone number is required');
    } else if (!/^[0-9]{11,13}$/.test(phoneno)) {
      newErrors.phoneno = 'Invalid phone number';
      valid = false;
      logger.warn('Form validation failed: Invalid phone number', { phoneno });
    }
    
    if (!selectedOption) {
      newErrors.complaintType = 'Complaint type is required';
      valid = false;
      logger.warn('Form validation failed: Complaint type is required');
    }
    
    if (!selectedCity) {
      newErrors.city = 'City is required';
      valid = false;
      logger.warn('Form validation failed: City is required');
    }
    
    // Operation is now dependent on Category, so check only if Category is selected
    if (!selectedCategoryy) {
      newErrors.category = 'Category is required';
      valid = false;
      logger.warn('Form validation failed: Category is required');
    } else if (!selectedOperation) {
      // Only check operation if category is selected
      newErrors.operation = 'Operation is required';
      valid = false;
      logger.warn('Form validation failed: Operation is required');
    }
    
    if (!selectedSystemName) {
      newErrors.systemName = 'System name is required';
      valid = false;
      logger.warn('Form validation failed: System name is required');
    }
    
    if (!selectedStation) {
      newErrors.station = 'Station/Route is required';
      valid = false;
      logger.warn('Form validation failed: Station/Route is required');
    }
    
    if (!selectedStopname) {
      newErrors.stopname = 'Stop name is required';
      valid = false;
      logger.warn('Form validation failed: Stop name is required');
    }
    
    if (!selectedSubcategoryy) {
      newErrors.subcategory = 'Subcategory is required';
      valid = false;
      logger.warn('Form validation failed: Subcategory is required');
    }
    
    if (!complaintdetail) {
      newErrors.details = 'Complaint details are required';
      valid = false;
      logger.warn('Form validation failed: Complaint details are required');
    }
    
    setErrors(newErrors);
    logger.info(`Form validation ${valid ? 'passed' : 'failed'}`, { errors: newErrors });
    return valid;
  };

  // Enhanced fetch cities
  const fetchCities = async () => {
    logger.info('Starting to fetch cities');
    setLoading(prev => ({ ...prev, cities: true }));
    
    try {
      const response = await fetch('https://complaint-pma.punjab.gov.pk/api/cities');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('CITIES API RESPONSE:', data);
      
      let citiesArray = [];
      
      if (data.cities && Array.isArray(data.cities)) {
        citiesArray = data.cities;
      } else if (Array.isArray(data)) {
        citiesArray = data;
      } else if (data.complaint && Array.isArray(data.complaint)) {
        citiesArray = data.complaint;
      } else {
        throw new Error('No cities array found in response');
      }
      
      const citiesData = citiesArray.map(city => ({ 
        id: city.id, 
        name: city.name 
      }));
      
      console.log('PROCESSED CITIES:', citiesData);
      setCities(citiesData);
      
    } catch (error) {
      console.error('Error fetching cities:', error);
      ToastAndroid.show('Failed to load cities. Please try again.', ToastAndroid.LONG);
      setCities([]);
    } finally {
      setLoading(prev => ({ ...prev, cities: false }));
    }
  };

  // Fetch complaint types from API
  const fetchComplaintTypes = async () => {
    logger.info('Starting to fetch complaint types');
    setLoading(prev => ({ ...prev, complaintTypes: true }));
    
    try {
      // Replace with your actual complaint types API endpoint
      const response = await fetch('https://complaint-pma.punjab.gov.pk/api/complaint-types');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('COMPLAINT TYPES API RESPONSE:', data);
      
      let typesArray = [];
      
      if (data.types && Array.isArray(data.types)) {
        typesArray = data.types;
      } else if (Array.isArray(data)) {
        typesArray = data;
      } else {
        // Fallback to default types if API fails
        typesArray = [
          {id: 1, name: 'Complaint'},
          {id: 2, name: 'General Query'},
          {id: 3, name: 'Advice / Suggestion'},
        ];
      }
      
      setComplaintTypes(typesArray);
      
    } catch (error) {
      console.error('Error fetching complaint types:', error);
      // Use default types as fallback
      setComplaintTypes([
        {id: 1, name: 'Complaint'},
        {id: 2, name: 'General Query'},
        {id: 3, name: 'Advice / Suggestion'},
      ]);
    } finally {
      setLoading(prev => ({ ...prev, complaintTypes: false }));
    }
  };

  // Fetch operations (will be fetched initially but populated when category is selected)
  const fetchOperations = async () => {
    logger.info('Starting to fetch operations');
    setLoading(prev => ({ ...prev, operations: true }));
    
    try {
      const response = await fetch('https://3e5c6fc4fba0.ngrok-free.app/api/operations');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('OPERATIONS API RESPONSE:', data);
      
      let operationsArray = [];
      
      if (data.operations && Array.isArray(data.operations)) {
        operationsArray = data.operations;
      } else if (Array.isArray(data)) {
        operationsArray = data;
      } else if (data.complaint && Array.isArray(data.complaint)) {
        operationsArray = data.complaint;
      } else {
        throw new Error('No operations array found in response');
      }
      
      const operationsData = operationsArray.map(operation => ({ 
        id: operation.id, 
        name: operation.name 
      }));
      
      console.log('PROCESSED OPERATIONS:', operationsData);
      setOperations(operationsData);
      
    } catch (error) {
      console.error('Error fetching operations:', error);
      ToastAndroid.show('Failed to load operations. Please try again.', ToastAndroid.LONG);
      setOperations([]);
    } finally {
      setLoading(prev => ({ ...prev, operations: false }));
    }
  };

  // Fetch operations by category ID
  const fetchOperationsByCategory = async (categoryId) => {
    logger.info('Fetching operations for category', { categoryId });
    setLoading(prev => ({ ...prev, operations: true }));
    
    try {
      const response = await fetch(`https://3e5c6fc4fba0.ngrok-free.app/api/operations-by-category/${categoryId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('OPERATIONS BY CATEGORY API RESPONSE:', data);
      
      let operationsArray = [];
      
      if (data.operations && Array.isArray(data.operations)) {
        operationsArray = data.operations;
      } else if (Array.isArray(data)) {
        operationsArray = data;
      } else {
        throw new Error('No operations array found in response');
      }
      
      const operationsData = operationsArray.map(operation => ({ 
        id: operation.id, 
        name: operation.name 
      }));
      
      console.log('PROCESSED OPERATIONS BY CATEGORY:', operationsData);
      setOperations(operationsData);
      
    } catch (error) {
      console.error('Error fetching operations by category:', error);
      ToastAndroid.show('Failed to load operations for this category.', ToastAndroid.LONG);
      setOperations([]);
    } finally {
      setLoading(prev => ({ ...prev, operations: false }));
    }
  };

  // Enhanced fetch system names
  const fetchSystemNames = async (cityId) => {
    logger.info('Fetching system names for city', { cityId });
    setLoading(prev => ({ ...prev, systems: true }));
    
    try {
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/citiesname/${cityId}`);
      logger.debug('System names API response', { status: response.status });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      logger.debug('System names data received', data);
      
      if (data && Array.isArray(data)) {
        const systemsData = data.map(system => ({ 
          id: system.id, 
          name: system.name 
        }));
        
        logger.info('System names processed', { count: systemsData.length });
        setSystemNames(systemsData);
      } else {
        throw new Error('Invalid data structure for system names');
      }
    } catch (error) {
      logger.error('Error fetching system names:', error);
      ToastAndroid.show('Failed to load system names.', ToastAndroid.SHORT);
      setSystemNames([]);
    } finally {
      setLoading(prev => ({ ...prev, systems: false }));
    }
  };

  // Enhanced fetch stations
  const fetchStations = async (systemId) => {
    logger.info('Fetching stations for system', { systemId });
    setLoading(prev => ({ ...prev, stations: true }));
    
    try {
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/stations/${systemId}`);
      logger.debug('Stations API response', { status: response.status });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      logger.debug('Stations data received', data);
      
      if (data && Array.isArray(data)) {
        const stationsData = data.map(station => ({ 
          id: station.id, 
          name: station.name 
        }));
        
        logger.info('Stations processed', { count: stationsData.length });
        setStations(stationsData);
        setSelectedStation(null);
      } else {
        throw new Error('Invalid data structure for stations');
      }
    } catch (error) {
      logger.error('Error fetching stations:', error);
      ToastAndroid.show('Failed to load stations.', ToastAndroid.SHORT);
      setStations([]);
    } finally {
      setLoading(prev => ({ ...prev, stations: false }));
    }
  };

  // Enhanced fetch stops
  const fetchStops = async (stationId) => {
    logger.info('Fetching stops for station', { stationId });
    setLoading(prev => ({ ...prev, stops: true }));
    
    try {
      const response = await fetch(`${baseUrl}/stopname/${stationId}`);
      logger.debug('Stops API response', { 
        url: `${baseUrl}/stopname/${stationId}`,
        status: response.status 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      logger.debug('Stops data received', data);
      
      if (data && Array.isArray(data)) {
        const stopsData = data.map(stop => ({ 
          id: stop.id, 
          name: stop.name 
        }));
        
        logger.info('Stops processed', { count: stopsData.length });
        setStopname(stopsData);
      } else {
        throw new Error('Invalid data structure for stops');
      }
    } catch (error) {
      logger.error('Error fetching stop names:', error);
      ToastAndroid.show('Failed to load stops.', ToastAndroid.SHORT);
      setStopname([]);
    } finally {
      setLoading(prev => ({ ...prev, stops: false }));
    }
  };

  // Enhanced fetch categories - Now based on operation ID
  const fetchCategoryy = async (operationId) => {
    logger.info('Fetching categories for operation', { operationId });
    setLoading(prev => ({ ...prev, categories: true }));
    
    try {
      const response = await fetch(`https://3e5c6fc4fba0.ngrok-free.app/api/categoryyy/${operationId}`);
      logger.debug('Categories API response', { 
        url: `https://3e5c6fc4fba0.ngrok-free.app/api/categoryyy/${operationId}`,
        status: response.status 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      logger.debug('Categories data received', data);
      
      if (data && Array.isArray(data)) {
        const categoriesData = data.map(category => ({ 
          id: category.id, 
          name: category.name 
        }));
        
        logger.info('Categories processed', { count: categoriesData.length });
        setCategoryy(categoriesData);
      } else {
        throw new Error('Invalid data structure for categories');
      }
    } catch (error) {
      logger.error('Error fetching categories:', error);
      ToastAndroid.show('Failed to load categories.', ToastAndroid.SHORT);
      setCategoryy([]);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  // Enhanced fetch subcategories
  const fetchSubcategoryy = async (categoryId) => {
    logger.info('Fetching subcategories for category', { categoryId });
    setLoading(prev => ({ ...prev, subcategories: true }));
    
    try {
      const response = await fetch(`${baseUrl}/subcategoryy/${categoryId}`);
      logger.debug('Subcategories API response', { 
        url: `${baseUrl}/subcategoryy/${categoryId}`,
        status: response.status 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      logger.debug('Subcategories data received', data);
      
      if (data && Array.isArray(data)) {
        const subcategoriesData = data.map(subcategory => ({ 
          id: subcategory.id, 
          name: subcategory.name 
        }));
        
        logger.info('Subcategories processed', { count: subcategoriesData.length });
        setSubcategoryy(subcategoriesData);
      } else {
        throw new Error('Invalid data structure for subcategories');
      }
    } catch (error) {
      logger.error('Error fetching subcategories:', error);
      ToastAndroid.show('Failed to load subcategories.', ToastAndroid.SHORT);
      setSubcategoryy([]);
    } finally {
      setLoading(prev => ({ ...prev, subcategories: false }));
    }
  };

  // Reset form function
  const resetForm = () => {
    logger.info('Resetting form data');
    
    // Clear all form fields
    setName('');
    setEmail('');
    setPhoneno('');
    setSelectedOption(null);
    setSelectedCity(null);
    setSelectedOperation(null);
    setSelectedSystemName(null);
    setSelectedStation(null);
    setSelectedStopname(null);
    setSelectedCategoryy(null);
    setSelectedSubcategoryy(null);
    setComplaintdetail('');
    setStateFunction({ URI: '', Type: '', Name: '' });
    setCapturedImage('');
    setRecordedAudio(null);
    setErrors({});
    
    // Clear all dropdown data
    setSystemNames([]);
    setStations([]);
    setStopname([]);
    setCategoryy([]);
    setSubcategoryy([]);
    
    // Reset operations to initial state
    fetchOperations();
  };

  // Enhanced dropdown change handlers
  const handleCityChange = (item) => {
    logger.info('City selected', { cityId: item.id, cityName: item.name });
    setSelectedCity(item.id);
    setSelectedSystemName(null);
    setSelectedStation(null);
    setSelectedStopname(null);
    setSystemNames([]);
    setStations([]);
    setStopname([]);
    fetchSystemNames(item.id);
  };

  const handleSystemChange = (item) => {
    logger.info('System selected', { systemId: item.id, systemName: item.name });
    setSelectedSystemName(item.id);
    setSelectedStation(null);
    setSelectedStopname(null);
    setStations([]);
    setStopname([]);
    fetchStations(item.id);
  };

  const handleStationChange = (item) => {
    logger.info('Station selected', { stationId: item.id, stationName: item.name });
    setSelectedStation(item.id);
    setSelectedStopname(null);
    setStopname([]);
    fetchStops(item.id);
  };

  const handleCategoryChange = (item) => {
    logger.info('Category selected', { categoryId: item.id, categoryName: item.name });
    setSelectedCategoryy(item.id);
    setSelectedOperation(null); // Reset operation when category changes
    setSelectedSubcategoryy(null);
    setOperations([]);
    setSubcategoryy([]);
    
    // Fetch operations based on selected category
    fetchOperationsByCategory(item.id);
  };

  const handleOperationChange = (item) => {
    logger.info('Operation selected', { operationId: item.id, operationName: item.name });
    setSelectedOperation(item.id);
    
    // Fetch categories based on selected operation
    fetchCategoryy(item.id);
  };
// Enhanced file selection
  const openGallery = async () => {
    logger.info('Opening gallery for file selection');
    
    try {
      const response = await DocumentPicker.pick({
        allowMultiSelection: false,
        type: [DocumentPicker.types.allFiles],
      });
      
      logger.info('File selected from gallery', {
        name: response[0].name,
        type: response[0].type,
        size: response[0].size
      });
      
      setStateFunction({
        Name: response[0].name,
        Type: response[0].type,
        URI: response[0].uri,
      });
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        logger.info('User cancelled document picker');
      } else {
        logger.error('Document picking error:', error);
      }
    }
  };

  // Enhanced camera capture
  const openCamera = async () => {
    logger.info('Opening camera for photo capture');
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      
      logger.debug('Camera permission result', { granted });
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const options = {
          mediaType: 'photo',
          includeBase64: true,
          maxHeight: 2000,
          maxWidth: 2000,
        };

        launchCamera(options, response => {
          logger.debug('Camera response', {
            didCancel: response.didCancel,
            error: response.error,
            assetsCount: response.assets?.length
          });
          
          if (!response.didCancel && !response.error) {
            logger.info('Photo captured successfully', {
              uri: response.assets[0].uri,
              width: response.assets[0].width,
              height: response.assets[0].height
            });
            setCapturedImage(response.assets[0].uri);
          } else if (response.error) {
            logger.error('Camera error:', response.error);
          }
        });
      } else {
        logger.warn('Camera permission denied by user');
        Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      }
    } catch (err) {
      logger.error('Camera permission error:', err);
    }
  };

  // Enhanced audio recording handler
  const handleAudioRecorded = (audioData) => {
    logger.info('Audio recording completed', {
      hasData: !!audioData,
      type: typeof audioData
    });
    setRecordedAudio(audioData);
  };
  // Enhanced form submission
  const handleSubmit = async () => {
    logger.info('Form submission initiated');
    
    if (!validateForm()) {
      logger.warn('Form submission cancelled due to validation errors');
      return;
    }

    setLoading(prev => ({ ...prev, submission: true }));

    const complaintData = {
      users_id: 0,
      name: name,
      email: email,
      phoneno: phoneno,
      district: 1,
      notification: 1,
      complaint_type: selectedOption ? selectedOption.name : '',
      source: 'App',
      city_id: selectedCity,
      operation_id: selectedOperation,
      system_name: selectedSystemName,
      station_name: selectedStation,
      stop_name: selectedStopname,
      category: selectedCategoryy,
      subcategory: selectedSubcategoryy,
      complaint_details: complaintdetail,
      complaint_audio: recordedAudio, 
      complaint_file: stateFunction.URI,
      longitude: currentLongitude,
      latitude: currentLatitude,
      complaint_pic: capturedImage
    };

    logger.info('Submitting complaint data', complaintData);

    try {
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/userstoreComplainnew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData),
      });

      logger.debug('Submission API response', {
        status: response.status,
        statusText: response.statusText
      });

      if (response.ok) {
        const responseData = await response.json();
        logger.info('Complaint submitted successfully', responseData);
        
        ToastAndroid.show('Complaint submitted successfully!', ToastAndroid.SHORT);
        
        // Reset form after successful submission
        resetForm();
        
        if (onSubmit) {
          onSubmit();
        }
      } else {
        const errorData = await response.json();
        logger.error('Submission failed with server error:', errorData);
        ToastAndroid.show('Failed to submit complaint. Please try again.', ToastAndroid.LONG);
      }
    } catch (error) {
      logger.error('Error submitting complaint:', error);
      ToastAndroid.show('Network error. Please check your connection and try again.', ToastAndroid.LONG);
    } finally {
      setLoading(prev => ({ ...prev, submission: false }));
    }
  };

  // Refresh button component
  const RefreshButton = () => (
    <TouchableOpacity 
      style={styles.refreshButton}
      onPress={onRefresh}
      disabled={refreshing}
    >
      <Icon name="refresh" size={16} color="#fff" />
      <Text style={styles.refreshButtonText}>
        {refreshing ? 'Refreshing...' : 'Refresh Form'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#444']}
            tintColor="#444"
          />
        }
      >
        {/* Header with refresh button */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Register Complaint</Text>
          <RefreshButton />
        </View>

        {/* Loading indicator for cities */}
        {loading.cities && (
          <Text style={styles.loadingText}>Loading cities...</Text>
        )}

        {/* Personal Information */}
        <View style={styles.inputContainer}>
          <Icon name="user" size={18} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor="#999"
          />
        </View>
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <View style={styles.inputContainer}>
          <Icon name="envelope" size={18} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <View style={styles.inputContainer}>
          <Icon name="phone" size={18} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={phoneno}
            onChangeText={setPhoneno}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>
        {errors.phoneno && <Text style={styles.errorText}>{errors.phoneno}</Text>}

        {/* Complaint Type Dropdown */}
        <View style={styles.inputContainer}>
          <Icon name="exclamation-circle" size={18} color="#666" style={styles.inputIcon} />
          <Dropdown
            style={styles.dropdown}
            placeholder={loading.complaintTypes ? "Loading..." : "Complaint Type"}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={complaintTypes}
            labelField="name"
            valueField="id"
            value={selectedOption}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={setSelectedOption}
            containerStyle={styles.dropdownList}
            itemTextStyle={styles.dropdownItemText}
            activeColor="#f5f5f5"
            disable={loading.complaintTypes}
          />
        </View>
        {errors.complaintType && <Text style={styles.errorText}>{errors.complaintType}</Text>}

 {/* Operation Dropdown */}
        <View style={styles.inputContainer}>
          <Icon name="map-marker" size={18} color="#666" style={styles.inputIcon} />
          <Dropdown
            style={styles.dropdown}
            placeholder={loading.operations ? "Loading operations..." : "Select Operation"}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={operations}
            labelField="name"
            valueField="id"
            value={selectedCity}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={handleCityChange}
            containerStyle={styles.dropdownList}
            itemTextStyle={styles.dropdownItemText}
            activeColor="#f5f5f5"
            disable={loading.operations}
          />
        </View>
        {errors.operation && <Text style={styles.errorText}>{errors.operation}</Text>}

        {/* City Dropdown */}
        <View style={styles.inputContainer}>
          <Icon name="map-marker" size={18} color="#666" style={styles.inputIcon} />
          <Dropdown
            style={styles.dropdown}
            placeholder={loading.cities ? "Loading cities..." : "Select City"}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={cities}
            labelField="name"
            valueField="id"
            value={selectedCity}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={handleCityChange}
            containerStyle={styles.dropdownList}
            itemTextStyle={styles.dropdownItemText}
            activeColor="#f5f5f5"
            disable={loading.cities}
          />
        </View>
        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

        {/* System Name Dropdown */}
        {selectedCity && (
          <View style={styles.inputContainer}>
            <Icon name="bus" size={18} color="#666" style={styles.inputIcon} />
            <Dropdown
              style={styles.dropdown}
              placeholder={loading.systems ? "Loading systems..." : "Select System Name"}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={systemNames}
              labelField="name"
              valueField="id"
              value={selectedSystemName}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={handleSystemChange}
              containerStyle={styles.dropdownList}
              itemTextStyle={styles.dropdownItemText}
              activeColor="#f5f5f5"
              disable={loading.systems}
            />
          </View>
        )}
        {errors.systemName && <Text style={styles.errorText}>{errors.systemName}</Text>}

        {/* Station/Routes Dropdown */}
        {selectedSystemName && (
          <View style={styles.inputContainer}>
            <Icon name="map-signs" size={18} color="#666" style={styles.inputIcon} />
            <Dropdown
              style={styles.dropdown}
              placeholder={loading.stations ? "Loading stations..." : "Station/Routes"}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={stations}
              labelField="name"
              valueField="id"
              value={selectedStation}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={handleStationChange}
              containerStyle={styles.dropdownList}
              itemTextStyle={styles.dropdownItemText}
              activeColor="#f5f5f5"
              disable={loading.stations}
            />
          </View>
        )}
        {errors.station && <Text style={styles.errorText}>{errors.station}</Text>}

        {/* Stop Name Dropdown */}
        {selectedStation && (
          <View style={styles.inputContainer}>
            <Icon name="map-pin" size={18} color="#666" style={styles.inputIcon} />
            <Dropdown
              style={styles.dropdown}
              placeholder={loading.stops ? "Loading stops..." : "Stop Name"}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={stopname}
              labelField="name"
              valueField="id"
              value={selectedStopname}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => setSelectedStopname(item.id)}
              containerStyle={styles.dropdownList}
              itemTextStyle={styles.dropdownItemText}
              activeColor="#f5f5f5"
              disable={loading.stops}
            />
          </View>
        )}
        {errors.stopname && <Text style={styles.errorText}>{errors.stopname}</Text>}

        {/* Category Dropdown - This will trigger operation fetch */}
        {selectedSystemName && (
          <View style={styles.inputContainer}>
            <Icon name="list" size={18} color="#666" style={styles.inputIcon} />
            <Dropdown
              style={styles.dropdown}
              placeholder="Select Category"
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={categoryy}
              labelField="name"
              valueField="id"
              value={selectedCategoryy}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={handleCategoryChange}
              containerStyle={styles.dropdownList}
              itemTextStyle={styles.dropdownItemText}
              activeColor="#f5f5f5"
              disable={loading.categories}
            />
          </View>
        )}
        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

        {/* Operation Dropdown - Dependent on Category */}
        {selectedCategoryy && (
          <View style={styles.inputContainer}>
            <Icon name="cogs" size={18} color="#666" style={styles.inputIcon} />
            <Dropdown
              style={styles.dropdown}
              placeholder={loading.operations ? "Loading operations..." : "Select Operation"}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={operations}
              labelField="name"
              valueField="id"
              value={selectedOperation}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={handleOperationChange}
              containerStyle={styles.dropdownList}
              itemTextStyle={styles.dropdownItemText}
              activeColor="#f5f5f5"
              disable={loading.operations}
            />
          </View>
        )}
        {errors.operation && <Text style={styles.errorText}>{errors.operation}</Text>}

        {/* Subcategory Dropdown - Dependent on Operation */}
        {selectedOperation && (
          <View style={styles.inputContainer}>
            <Icon name="list-ol" size={18} color="#666" style={styles.inputIcon} />
            <Dropdown
              style={styles.dropdown}
              placeholder={loading.subcategories ? "Loading subcategories..." : "Subcategory"}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={subcategoryy}
              labelField="name"
              valueField="id"
              value={selectedSubcategoryy}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => setSelectedSubcategoryy(item.id)}
              containerStyle={styles.dropdownList}
              itemTextStyle={styles.dropdownItemText}
              activeColor="#f5f5f5"
              disable={loading.subcategories}
            />
          </View>
        )}
        {errors.subcategory && <Text style={styles.errorText}>{errors.subcategory}</Text>}

        {/* Complaint Details */}
        <View style={[styles.inputContainer, {height: 120, alignItems: 'flex-start'}]}>
          <Icon name="align-left" size={18} color="#666" style={[styles.inputIcon, {marginTop: 15}]} />
          <TextInput
            style={[styles.input, {height: 110, textAlignVertical: 'top', paddingTop: 15}]}
            value={complaintdetail}
            onChangeText={setComplaintdetail}
            placeholder="Describe your complaint here..."
            placeholderTextColor="#999"
            multiline={true}
          />
        </View>
        {errors.details && <Text style={styles.errorText}>{errors.details}</Text>}

        {/* Attachments Section */}
        <View>
          <Text style={styles.sectionTitle}>Attachments</Text>
          
          <View style={styles.attachmentButtons}>
            <TouchableOpacity 
              style={styles.attachmentButton} 
              onPress={openGallery}
              disabled={loading.submission}
            >
              <Icon name="file" size={16} color="#fff" />
              <Text style={styles.attachmentButtonText}>Select File</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.attachmentButton} 
              onPress={openCamera}
              disabled={loading.submission}
            >
              <Icon name="camera" size={16} color="#fff" />
              <Text style={styles.attachmentButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          
          {stateFunction.Name && (
            <Text style={styles.attachmentInfo}>Selected file: {stateFunction.Name}</Text>
          )}
          
          {capturedImage && (
            <View style={styles.imagePreview}>
              <Image source={{uri: capturedImage}} style={styles.previewImage} />
            </View>
          )}
          
          <Text style={styles.sectionTitle}>Record Audio:</Text>
          <AudioRecorder onAudioRecorded={handleAudioRecorded} />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            loading.submission && styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={loading.submission}
        >
          <Icon name="paper-plane" size={18} color="white" style={styles.buttonIcon} />
          <Text style={styles.submitButtonText}>
            {loading.submission ? 'Submitting...' : 'Submit Complaint'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
  },
  dropdown: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  dropdownList: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: Platform.OS === 'android' ? -36 : 0,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  attachmentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '48%',
    justifyContent: 'center',
  },
  attachmentButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  attachmentInfo: {
    color: '#666',
    fontSize: 12,
    marginBottom: 12,
  },
  imagePreview: {
    marginBottom: 12,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#444',
    borderRadius: 6,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: -25,
  },
  submitButtonDisabled: {
    backgroundColor: '#888',
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#da1703',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 12,
  },
  loadingText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
});

export default ComplaintForm;