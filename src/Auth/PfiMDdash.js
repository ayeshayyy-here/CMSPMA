import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
// import ProgressCircle from 'react-native-progress-circle';
const PfiMDdash = ({ navigation }) => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const scrollViewRef = useRef(null);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [selectedProviderData, setSelectedProviderData] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const progressData = [
    { vendor: 'Veda', totaltotaltaskcount: 0, totalcount: 50 },
    { vendor: 'Security 2000', totaltotaltaskcount: 0, totalcount: 32 },
    { vendor: 'SEMC', totaltotaltaskcount: 0, totalcount: 13 },
    { vendor: 'NRTC-GCS', totaltotaltaskcount: 0, totalcount: 31 },
    { vendor: 'Merin', totaltotaltaskcount: 0, totalcount: 13 },
    { vendor: 'Pak German', totaltotaltaskcount: 0, totalcount: 16 },
    { vendor: 'Greaves', totaltotaltaskcount: 0, totalcount: 51 },
    { vendor: 'Electrical', totaltotaltaskcount: 0, totalcount: 12 },
    { vendor: 'Civil', totaltotaltaskcount: 0, totalcount: 1 },
    // Add more data as needed
  ];
  useEffect(() => {
    fetch('https://complaint-pma.punjab.gov.pk/api/serviceproviders')
      .then(response => response.json())
      .then(data => setServiceProviders(data.complaint))
      .catch(error =>
        console.error('Error fetching service providers:', error),
      );
  }, []);

  const iconMapping = {
    'Lahore Metrobus System': 'bus',
    'Pakistan Metrobus System': 'bus',
    'Multan Metrobus System': 'bus',
    'Lahore Feeder Routes': 'map-marker',
    'Multan Feeder Routes': 'map-marker',
    'Orange Line Metro Rail Transit System': 'subway',
  };

  const colorMapping = {
    'Lahore Metrobus System': '#1D2B5A',
    'Pakistan Metrobus System': '#1D2B5A',
    'Multan Metrobus System': '#1D2B5A',
    'Lahore Feeder Routes': '#1D2B5A',
    'Multan Feeder Routes': '#1D2B5A',
    'Orange Line Metro Rail Transit System': '#1D2B5A',
  };

  const handleScroll = event => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isEndReached =
      layoutMeasurement.width + contentOffset.x >= contentSize.width;
    setShowRightArrow(!isEndReached);
    setShowLeftArrow(contentOffset.x > 0);
  };

  const fetchProviderData = async id => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://complaint-pma.punjab.gov.pk/api/showdata/${id}`,
      );
      const data = await response.json();
      setSelectedProviderData(data);
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    return serviceProviders.map(provider => (
      <View key={provider.id}>
        <LinearGradient
          colors={['rgba(173, 216, 230, 0.5)', 'rgba(224, 255, 255, 0.5)']} // Light blue to light cyan gradient colors
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.tabs}>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => {
                  fetchProviderData(provider.id);
                }}
              >
                <View style={styles.circle}>
                  <Icon
                    name={iconMapping[provider.name]}
                    size={22}
                    color={colorMapping[provider.name]}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => {
                  fetchProviderData(provider.id);
                }}
              >
              <Text style={styles.heading}>{provider.name}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    ));
  };

  const renderTable = () => {
    if (!selectedProviderData) return null;

    return (
      <View style={styles.tableContainer}>
        {selectedProviderData.map((routeData, routeIndex) => (
          <View key={routeIndex} style={styles.routeContainer}>
            <Text style={styles.routeHeading}>{routeData.route}</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Stop Name</Text>
              <Text style={styles.tableHeaderText}>Avg Task Time</Text>
              <Text style={styles.tableHeaderText}>Task Completion Rate</Text>
            </View>
            {routeData.stops.map((stopData, stopIndex) => (
              <View key={stopIndex} style={styles.tableRow}>
                <Text style={styles.tableCell}>{stopData.name}</Text>
                <Text style={styles.tableCell}>{stopData.average_task_time}</Text>
                <Text style={styles.tableCell}>{stopData.task_completion_rate}%</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };
  return (
    <View style={styles.container}>
     <LinearGradient colors={['#1D2B5A', '#1D29A0']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>PFI Dashboard</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.rowContainerr}>
          <View style={styles.containerr}>
            <Text style={styles.title}>Task Complete Rate</Text>
            <Text style={styles.stat}>98.9%</Text>
          </View>
          <View style={styles.containerr}>
            <Text style={styles.title}>Average Task Time</Text>
            <Text style={styles.stat}>0%</Text>
          </View>
          </View>
          <View style={styles.rowContainerr}>
          <View style={styles.containerr}>
            <Text style={styles.title}>Total Task</Text>
            <Text style={styles.stat}>0</Text>
          </View>
          <View style={styles.containerr}>
            <Text style={styles.title}>Total Stations</Text>
            <Text style={styles.stat}>193</Text>
          </View>
        </View>

        <View style={styles.progressContainerWrapper}>
        <Text style={styles.title}>Task Complete</Text>
          <ScrollView contentContainerStyle={styles.scrollableContainer}>
            {progressData.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => console.log(item.vendor)}>
                <View style={styles.progressContainer}>
                  {/* <ProgressCircle
                    percent={(item.totaltotaltaskcount / item.totalcount) * 100}
                    radius={40}
                    borderWidth={5}
                    color="#1D2B77"
                    shadowColor="#ddd"
                    bgColor="#fff"
                  >
                    <Text style={styles.progressText}>{item.totaltotaltaskcount}/{item.totalcount}</Text>
                  </ProgressCircle> */}
                  <Text style={styles.labelText}>{item.vendor}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      

        <View style={{marginTop: 10}}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', flex: 1}}>
              {/* {showLeftArrow && (
                <Animatable.View
                  animation={{
                    from: {translateX: 3},
                    to: {translateX: 0},
                  }}
                  duration={1000}
                  iterationCount="infinite"
                  easing="linear"
                  useNativeDriver
                  style={styles.animatedArrowLeft}>
                  <View style={styles.whiteCircle}>
                    <TouchableOpacity
                      onPress={() => {
                        scrollViewRef.current.scrollTo({x: 0, animated: true});
                      }}>
                      <Icon
                        name="angle-double-left"
                        size={15}
                        color="#1D2B5A"
                        // style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              )} */}
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
                onScroll={handleScroll}
                scrollEventThrottle={16}>
                {renderContent()}
              </ScrollView>
              {/* {showRightArrow && (
                <Animatable.View
                  animation={{
                    from: {translateX: 0},
                    to: {translateX: 3},
                  }}
                  duration={1000}
                  iterationCount="infinite"
                  easing="linear"
                  useNativeDriver
                  style={styles.animatedArrowRight}>
                  <View style={styles.whiteCircle}>
                    <TouchableOpacity
                      onPress={() => {
                        scrollViewRef.current.scrollToEnd({animated: true});
                      }}>
                      <Icon
                        name="angle-double-right"
                        size={15}
                        color="#1D2B5A"
                        // style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              )} */}
            </View>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {renderTable()}
      </ScrollView>
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
  content: {
    flex: 1,
    padding: '5%',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1D2B5A',
    marginBottom: 10,},

    stat:  {
      fontSize: 14,
      fontWeight: 'bold',
      color: 'gray'
    },
  rowContainerr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  containerr: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#1D2B5A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderLeftWidth: 1,
    borderBottomWidth: 4,
    borderColor: '#1D2B5A',
  },

  scrollableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  progressContainer: {
    width: '48%', // Adjust width as needed
    marginBottom: 20,
    marginLeft: 20,
    alignItems: 'center',
  },
  labelText: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 10,
    color: 'black',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollItem: {
    backgroundColor: '#CD1D0C',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  scrollText: {
    color: 'white',
    fontSize: 10,
  },
  animatedArrowLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    paddingHorizontal: 10,
    zIndex: 1, // Ensure it's on top of the ScrollView
  },
  animatedArrowRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    paddingHorizontal: 10,
    zIndex: 1, // Ensure it's on top of the ScrollView
  },
  whiteCircle: {
    backgroundColor: 'white',
    borderRadius: 50, // Ensures a perfect circle
    width: 25, // Adjust size as needed
    height: 25, // Adjust size as needed
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5, // Adjust as needed
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    backgroundColor: 'white',
    width: 200,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },

  content: {
    padding: 10,
  },
  heading: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: '5%',
    marginTop: 10,
    // right: 10,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 10,
    color: 'gray',
    marginBottom: 10,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10, // Adjust horizontal padding as needed
    paddingVertical: 15,
  },
  iconContainer: {
    marginRight: 8,
  },
  circle: {
    width: 40, // Adjust width as needed
    height: 40, // Adjust height as needed
    backgroundColor: 'white',
    borderRadius: 20, // Make it a circle
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10, // Add spacing from the left side of the card
    elevation: 2,
  },
  // tableContainer: {
    // padding: 10,
    // backgroundColor: '#fff',
    // marginVertical: 10,
    // borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  // },
  progressContainerWrapper: {
    height: 250,
    backgroundColor: '#fff',
    margin: 10,
    marginTop: 25,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#1D2B5A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderLeftWidth: 1,
    borderTopWidth: 4,
    borderColor: '#1D2B5A',
  },
  
  tableContainer: {
  
    backgroundColor: '#fff',
    margin: 10,
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#1D2B5A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderLeftWidth: 1,
    borderTopWidth: 4,
    borderColor: '#1D2B5A',
  },
  
  routeContainer: {
    marginBottom: 20,
  },
  routeHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1D2B5A',
    marginBottom: 10,
    marginLeft: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1D2B5A',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: 'gary',
    marginBottom: 10,
  },
});

export default PfiMDdash;
