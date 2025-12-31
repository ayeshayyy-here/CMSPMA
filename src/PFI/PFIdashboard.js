import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,  RefreshControl,
} from 'react-native';
// import ProgressCircle from 'react-native-progress-circle';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import syncStorage from 'react-native-sync-storage'; 

const PFIdashboard = ({ navigation }) => {
  const [buttonsData, setButtonsData] = useState([]);
  const [stopButtonsData, setStopButtonsData] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState(null);
  const [selectedButtonId, setSelectedButtonId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }; 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = syncStorage.get('user_detail').id;
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/serviceprovision/${userId}`);
      const data = await response.json();
      setButtonsData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialButtonPress = async (buttonId) => {
    setLoading(true);
    try {
      const userId = syncStorage.get('user_detail').id;
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/stopprovision/${userId}/${buttonId}`);
      const data = await response.json();
      setStopButtonsData(data);
    } catch (error) {
      console.error('Error fetching stop buttons data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStopButtonPress = async (stopId) => {
    setSelectedStopId(stopId);
    setSelectedButtonId(stopId);
    setLoading(true);
    try {
      const userId = syncStorage.get('user_detail').id;
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/pfiprogresscirclee/${userId}/${stopId}`);
      const data = await response.json();
      setProgressData(data);
    } catch (error) {
      console.error('Error fetching progress circle data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (vendor, progressData, stopId) => {
    navigation.navigate('ProgressCircleDetails', { vendor, stopId });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4CAF50', '#3E8944']}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Icon name="dashboard" size={20} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>PFI | Dashboard</Text>
        </View>
      </LinearGradient>

      <View style={styles.buttonContainer}>
        {buttonsData.map((buttonItem) => (
          <TouchableOpacity
            key={buttonItem.id}
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => handleInitialButtonPress(buttonItem.id)}
          >
            <Text style={styles.buttonText}>{buttonItem.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.stopbuttonContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {stopButtonsData.map((stopButtonItem) => (
            <TouchableOpacity
              key={stopButtonItem.id}
              style={[
                styles.stopbutton,
                selectedButtonId === stopButtonItem.id && styles.selectedButton,
              ]}
              activeOpacity={0.8}
              onPress={() => handleStopButtonPress(stopButtonItem.id)}
            >
              <Text style={styles.stopbuttonText}>{stopButtonItem.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
   <ScrollView contentContainerStyle={styles.scrollViewContent} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
     
        {loading ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          <View style={styles.chartContainer}>
            {progressData.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handlePress(item.vendor, progressData, selectedStopId)}>
                <View style={[styles.progressContainer, index % 2 === 1 && styles.marginLeft]}>
                {/* <ProgressCircle
                    percent={(item.totaltotaltaskcount / item.totalcount) * 100}
                    radius={60}
                    borderWidth={10}
                    color="green"
                    shadowColor="#ddd"
                    bgColor="#fff"
                  >
                    <Text style={styles.progressText}>{item.totaltotaltaskcount}/{item.totalcount}</Text>
                  </ProgressCircle> */}
                  <Text style={styles.labelText}>{item.vendor}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  scrollViewContent: {
    paddingTop: 1,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 4,
  },
  stopbuttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginTop: 0,
    marginBottom: 0,
  },
  button: {
    borderRadius: 10,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#215E21',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  stopbutton: {
    borderRadius: 18,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: 'white',
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginHorizontal: 5,
    marginBottom: 5,
    paddingVertical: 8,
  },
  stopbuttonText: {
    fontSize: 10,
    color: 'gray',
    fontWeight: 'bold',
  },
  selectedButton: {
    backgroundColor: '#E6F9E6', // Very light green shade
    borderColor: 'white',
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  chartContainer: {
    marginTop: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  progressContainer: {
    alignItems: 'center',
    marginRight: '8%',
    paddingVertical: 15,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006400',
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
});

export default PFIdashboard;
