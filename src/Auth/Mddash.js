/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {useEffect, useState, useRef} from 'react';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import pmaimg from '../../assets/images/pmaimg.png';
import baseUrl from '../Config/url';
import * as Animatable from 'react-native-animatable';
import {
  StyleSheet,
  onPress,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ImageBackground,
  TextInput,
  Modal,
  Button,
  ScrollView,
  onLoginPress,
  Alert,
} from 'react-native';

import {Image} from 'react-native';
import {BarChart, PieChart} from 'react-native-gifted-charts';
import syncStorage from 'react-native-sync-storage';
import Loader from '../Components/Loader';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const Mddash = ({route, navigation}) => {
  const [loading, setLoading] = useState(true);
  const [headerText, setHeaderText] = useState('Dashboard-MD PMA');
  const [facebookData, setFacebookData] = useState(null);
  const [instagramData, setInstagramData] = useState(null);
  const [CCCData, setCCCData] = useState(null);
  const [PFIData, setPFIData] = useState(null);
  const [loadingPFIData, setLoadingPFIData] = useState(true);
  const [serviceProviders, setServiceProviders] = useState([]);
  const scrollViewRef = useRef(null);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const isEndReached =
      layoutMeasurement.width + contentOffset.x >= contentSize.width;
    setShowRightArrow(!isEndReached);
    setShowLeftArrow(contentOffset.x > 0);
  };
  const pieData = [
    {value: 54, color: '#E57B3D', text: 'Facebook'},
    {value: 20, color: '#3A4352', text: 'Twitter'},
    {value: 30, color: '#FFC349', text: 'Instagram'},
    {value: 30, color: '#68B3C8', text: 'WhatsApp'},
    {value: 30, color: '#99050D', text: 'CCC'},
    {value: 30, color: '#FFC349', text: 'PFI'},
  ];
  const firstHalf = pieData.slice(0, Math.ceil(pieData.length / 2));
  const secondHalf = pieData.slice(Math.ceil(pieData.length / 2));
  <View style={styles.legendContainer}>
    {pieData.map((data, index) => (
      <View style={styles.legendItem} key={index}>
        <View
          style={[styles.legendColorBox, {backgroundColor: data.color}]}></View>
        <Text style={styles.legendText}>{data.text}</Text>
      </View>
    ))}
  </View>;
  const barData = [
    {
      value: 40,
      label: 'OLMRTS',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray', fontSize: 10},
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665'},
    {
      value: 50,
      label: 'LMBS',
      spacing: 1,
      labelWidth: 40,
      labelTextStyle: {color: 'gray', fontSize: 10},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: '#ED6665'},
    {
      value: 75,
      label: 'LFR',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray', fontSize: 10},
      frontColor: '#177AD5',
    },
    {value: 25, frontColor: '#ED6665'},
    {
      value: 30,
      label: 'MMBS',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray', fontSize: 10},
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665'},
    {
      value: 60,
      label: 'MFR',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray', fontSize: 10},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: '#ED6665'},
    {
      value: 65,
      label: 'PMBS',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray', fontSize: 10},
      frontColor: '#177AD5',
    },
    {value: 30, frontColor: '#ED6665'},
  ];

  useEffect(() => {
    const user = syncStorage.get('user_detail');
    if (user && user.role === 'General_Manager') {
      setHeaderText('Dashboard-GM PMA');
    }
  }, []);

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

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const [isContainer1Visible, setIsContainer1Visible] = useState(false);
  const [isContainer2Visible, setIsContainer2Visible] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data

  useEffect(() => {
    // Fetch user details from sync storage
    const userDetail = syncStorage.get('user_detail');
    setUserData(userDetail);
  }, []);
  const toggleContainerVisibility = containerNumber => {
    if (containerNumber === 1) {
      setIsContainer1Visible(!isContainer1Visible);
      setIsContainer2Visible(false); // Close other container
    } else if (containerNumber === 2) {m
      setIsContainer2Visible(!isContainer2Visible);
      setIsContainer1Visible(false); // Close other container
    }
  };

  useEffect(() => {
    // Fetch data from API for Facebook
    const fetchFacebookData = async () => {
      try {
        // Replace with your base URL
        const response = await fetch(`${baseUrl}/complainss/facebook`);
        const jsonData = await response.json();
        setFacebookData(jsonData);
      } catch (error) {
        console.error('Error fetching Facebook data:', error);
      }
    };

    fetchFacebookData();
  }, []);

  useEffect(() => {
    // Fetch data from API for Instagram
    const fetchInstagramData = async () => {
      try {
        // Replace with your base URL
        const response = await fetch(`${baseUrl}/complainss/instagram`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        setInstagramData(jsonData);
      } catch (error) {
        console.error('Error fetching Instagram data:', error);
      }
    };

    fetchInstagramData();
  }, []);

  useEffect(() => {
    // Fetch data from API for CCC 1762
    const fetchCCCData = async () => {
      try {
        // Replace with your base URL
        const response = await fetch(`${baseUrl}/complainss/CCC`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        // console.log('CCC Data:', jsonData); // Debugging statement
        setCCCData(jsonData);
      } catch (error) {
        console.error('Error fetching CCC data:', error);
      }
    };

    fetchCCCData();
  }, []);

  useEffect(() => {
    // Fetch data from API for PFI
    const fetchPFIData = async () => {
      try {
        // Replace with your base URL
        const response = await fetch(`${baseUrl}/complainss/PFI`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        // console.log('PFIData:', jsonData); // Debugging statement
        setPFIData(jsonData);
        setLoadingPFIData(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching PFI data:', error);
        setLoadingPFIData(false); // Set loading to false in case of error
      }
    };

    fetchPFIData();
  }, []);

  const handleCardfb = () => {
    const source = {
      source: 'facebook',
    };

    navigation.navigate('Sourcedetail', {complaintsData: source});
  };

  const handlePFI = () => {
   

    navigation.navigate('PfiMDdash');
  };
  const handleCardinsta = () => {
    // Static data for Instagram
    const source = {
      source: 'instagram',
      // Other static properties if needed
    };

    // Navigate to the next screen with static Instagram data
    navigation.navigate('Sourcedetail', {complaintsData: source});
  };

  const handleCardccc = () => {
    const source = {
      source: 'ccc',
      // Other static properties if needed
    };

    // Navigate to the next screen with static Instagram data
    navigation.navigate('Sourcedetail', {complaintsData: source});
  };

  const handleCardpfi = () => {
    const source = {
      source: 'pfi',
    };

    // Navigate to the next screen with static Instagram data
    navigation.navigate('Sourcedetail', {complaintsData: source});
  };

  useEffect(() => {
    fetch('https://complaint-pma.punjab.gov.pk/api/serviceproviders')
      .then(response => response.json())
      .then(data => setServiceProviders(data.complaint))
      .catch(error =>
        console.error('Error fetching service providers:', error),
      );
  }, []);

  // Mapping of service provider names to icon names
  const iconMapping = {
    'Lahore Metrobus System': 'bus',
    'Pakistan Metrobus System': 'bus',
    'Multan Metrobus System': 'bus',
    'Lahore Feeder Routes': 'map-marker',
    'Multan Feeder Routes': 'map-marker',
    'Orange Line Metro Rail Transit System': 'subway',
  };
  const colorMapping = {
    'Lahore Metrobus System': 'red',
    'Pakistan Metrobus System': 'green',
    'Multan Metrobus System': 'red',
    'Lahore Feeder Routes': 'red',
    'Multan Feeder Routes': '#0000ff',
    'Orange Line Metro Rail Transit System': 'orange',
  };

  // Render content with icons
  const renderContent = () => {
    return serviceProviders.map(provider => (
      <View key={provider.id}>
        <LinearGradient
          colors={['rgba(255, 182, 193, 0.5)', 'rgba(255, 218, 185, 0.5)']} // Soft pink to light peach gradient colors
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.card}>
          <View style={styles.tabs}>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Cat', {
                    providerId: provider.id,
                    providerName: provider.name,
                  })
                }>
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
              style={styles.detailsContainer}
              onPress={() =>
                navigation.navigate('Cat', {
                  providerId: provider.id,
                  providerName: provider.name,
                })
              }>
              <Text style={styles.heading}>{provider.name}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.containern}>
        <LinearGradient colors={['#A00000', '#EA2027']}>
          <View style={styles.headern}>
            <View style={styles.headerTextContainern}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.imageContainer}>
                  <Image source={pmaimg} style={styles.image} />
                </View>
                <Text style={styles.headerTextn}>{headerText}</Text>
              </View>
              <View style={styles.logoutcontainer}>
                <TouchableOpacity onPress={handlePFI}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* <Text style={styles.logoutText}>PFI Dashboard</Text>
                    <Animatable.View
                      animation={{
                        from: {translateX: 0}, // Starting position
                        to: {translateX: 3}, // Ending position
                      }}
                      duration={1000}
                      iterationCount="infinite"
                      easing="linear"
                      useNativeDriver
                      style={styles.logouticon}>
                      <Icon
                        name="tasks"
                        size={12}
                        color="#fff"
                        style={styles.icon}
                      />
                    </Animatable.View> */}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '5%',
          }}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={handleCardinsta}>
              <View style={styles.iconContainers}>
                <View style={styles.iconWrapper}>
                  <Icon name="instagram" size={18} color="#405DE6" />
                </View>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>Instagram</Text>
                {instagramData && (
                  <>
                    <Text style={styles.subtitle}>
                      Total Complains: {instagramData.totalComplains}{' '}
                    </Text>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.costtext}>Resolved</Text>

                      <Text style={styles.percentagetext}>Pending</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <Text style={styles.resolved}>
                        {instagramData.resolvedComplains}
                      </Text>
                      <Text style={styles.pending}>
                        {instagramData.pendingComplains}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Second rectangular box - Facebook */}

          <View style={styles.container}>
            <TouchableOpacity style={styles.touchable} onPress={handleCardfb}>
              <View style={styles.iconContainers}>
                <View style={styles.iconWrapper}>
                  <Icon name="facebook" size={18} color="#3b5998" />
                </View>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>Facebook</Text>
                {facebookData && (
                  <>
                    <Text style={styles.subtitle}>
                      Total Complains: {facebookData.totalComplains}{' '}
                    </Text>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.costtext}>Resolved</Text>

                      <Text style={styles.percentagetext}>Pending</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <Text style={styles.resolved}>
                        {facebookData.resolvedComplains}
                      </Text>
                      <Text style={styles.pending}>
                        {facebookData.pendingComplains}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* Third rectangular box - CCC */}

          <View style={styles.container}>
            <TouchableOpacity style={styles.touchable} onPress={handleCardccc}>
              <View style={styles.iconContainers}>
                <View style={styles.iconWrapper}>
                  <Icon name="phone" size={18} color="orange" />
                </View>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>CCC 1762</Text>
                {CCCData && (
                  <>
                    <Text style={styles.subtitle}>
                      Total Complains: {CCCData.totalComplains}{' '}
                    </Text>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.costtext}>Resolved</Text>

                      <Text style={styles.percentagetext}>Pending</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        // alignItems: 'center',
                        // justifyContent: 'center',
                        marginTop: 10,
                        marginLeft:'5%'
                      }}>
                      <Text style={styles.resolvedCCC}>
                        {CCCData.resolvedComplains}
                      </Text>
                      <Text style={styles.pendingCCC}>
                        {CCCData.pendingComplains}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Fourth rectangular box - PFI */}

          <View style={styles.container}>
            <TouchableOpacity style={styles.touchable} onPress={handleCardpfi}>
              <View style={styles.iconContainers}>
                <View style={styles.iconWrapper}>
                  <Icon name="user" size={18} color="#405DE6" />
                </View>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>PFI</Text>
                {loadingPFIData ? ( // Render loader if loading state is true for PFI data
                  <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                  PFIData && (
                    <>
                      <Text style={styles.subtitle}>
                        Total Complains: {PFIData.totalComplains}{' '}
                      </Text>

                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.pficosttext}>Resolved</Text>

                        <Text style={styles.percentagetext}>Pending</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 10,
                          // marginLeft:'2%'
                        }}>
                        <Text style={styles.resolved}>
                          {PFIData.resolvedComplains}
                        </Text>
                        <Text style={styles.pending}>
                          {PFIData.pendingComplains}
                        </Text>
                      </View>
                    </>
                  )
                )}
              </View>
            </TouchableOpacity>
            {/* Render other components here */}
          </View>
        </View>

        <View style={{marginTop: 10}}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', flex: 1}}>
              {showLeftArrow && (
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
                        color="red"
                        // style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              )}
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
                onScroll={handleScroll}
                scrollEventThrottle={16}>
                {renderContent()}
              </ScrollView>
              {showRightArrow && (
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
                        color="red"
                        // style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              )}
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: 'black'}}>
           System Status
          </Text>
          {/* <TouchableOpacity>
            <Icon name={'ellipsis-h'} size={20} color="gray" />
          </TouchableOpacity> */}
        </View>

        <View style={styles.contentContainer}>
        <View style={styles.containerRow}>
      <View style={styles.piecityContainer}>

      
          <View style={{ transform: [{ rotate: '90deg' }] }}>
            <BarChart
              data={barData}
              barWidth={4}
              spacing={30}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: 'gray', fontSize: 8 }}
              noOfSections={3}
              maxValue={75}
              style={{ flex: 1 }}
            />
              </View>
            </View>
          </View>
        </View>
        {/* <View style={styles.contentContainer}>
          <View style={styles.containerRow}>
            <View style={styles.piecityContainer}>
              <View style={styles.piechartTopHalf}>
                <Text style={styles.centeredText}>
                  <Icon name="pie-chart" size={20} color="white" /> Complaint
                  Status
                </Text>
              </View>
              <View style={styles.pieChartWrapper}>
                <PieChart
                  showText
                  textColor="white"
                  radius={110}
                  textSize={6} // Adjust the textSize as needed
                  focusOnPress
                  showValuesAsLabels
                  // showTextBackground // Enable text background
                  // textBackgroundRadius={10} // Adjust text background radius as needed
                  data={pieData}
                />
              </View>
              <View style={styles.legendContainer}>
                {firstHalf.map((data, index) => (
                  <View style={styles.legendItem} key={index}>
                    <View
                      style={[
                        styles.legendColorBox,
                        {backgroundColor: data.color},
                      ]}></View>
                    <Text style={styles.legendText}>{data.text}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.legendContainer}>
                {secondHalf.map((data, index) => (
                  <View style={styles.legendItem} key={index}>
                    <View
                      style={[
                        styles.legendColorBox,
                        {backgroundColor: data.color},
                      ]}></View>
                    <Text style={styles.legendText}>{data.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pieChartWrapper: {
    marginTop: '22%', // Add margin-top as needed
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  containerRow: {
    flexDirection: 'row',
  },
  piecityContainer: {
    marginTop: '5%',
    width: '85%',
    height: 400,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 10,
    position: 'relative', // Position relative for absolute positioning
    overflow: 'hidden', // Clip overflow for gradient
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  piechartTopHalf: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '18%', // Half height for green color
    backgroundColor: '#dc3545',
  },
  centeredText: {
    marginTop: '6%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
  },

  ovalButton: {
    marginLeft: '10%',
  },
  oval: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderColor: 'red',
  },
  buttonText: {
    fontSize: 12,
    color: 'red', // Text color
  },
  toprow: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // paddingHorizontal: '2%',
    marginTop: 10,
  },
  containern: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  headern: {
    // backgroundColor: '#CD1D0C',
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
    height: 30,
    width: 30,
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
    fontSize: 12,
    marginLeft: '12%',
  },
  additionalTextn: {
    fontSize: 14,
    color: '#fff',
    marginLeft: '60%',
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '110%',
    height: '100%',
    marginTop: '35%',
    marginLeft: '5%',
  },
  navTitle: {
    fontSize: 20,
    color: '#CD1D0C',
    fontWeight: 'bold',
  },
  //search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 25,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    ...Platform.select({
      android: {
        elevation: 5,
      },
    }),
  },
  iconn: {
    marginRight: 10,
  },
  input: {
    fontSize: 12,
    height: 35,
    marginRight: 10,
    marginLeft: 10,
    flex: 1,
  },

  //
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'white',
    marginTop: 10,
    paddingBottom: 5,
    paddingTop: 5,
    marginHorizontal: 10,
    height: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '40%',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },

  iconContainers: {
    width: '40%',
    height: 40,
    bottom: '18%',
    left: '30%',
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'red',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },

  textContainer: {
    marginLeft: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0B0006',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    color: 'gray',
    textAlign: 'center',
  },
  resolved: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    left: 20,
    // top: 2,
    color: 'green',
  },
  resolvedCCC: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    left: 10,
    // top: 2,
    color: 'green',
  },
  pendingCCC: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    // top: 7,
    left: 25,
  },
  pending: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    // top: 7,
    left: 55,
  },
  costtext: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    // right: 35,
    top: 5,
    marginLeft: 5,
    color: 'green',
  },
  pficosttext: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    // right: 35,
    top: 5,
    marginLeft: 15,
    color: 'green',
  },
  percentagetext: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'red',
    top: 5,
    textAlign: 'center',
    left: 13,
  },
  //scroll view
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
  scrollViewContent2: {
    flexDirection: 'row',
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
  time: {
    fontSize: 10,
    color: '#CD1D0C',
    marginRight: 5,
  },
  date: {
    fontSize: 10,
    color: '#CD1D0C',
  },
  //oval container
  ovalContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    // Change the background color as needed
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20, // Adjust the border radius to make it more oval-shaped
  },

  ovalContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ovalContainer3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC3545',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ovalContainer4: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17A2B8',
    // Change the background color as needed
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20, // Adjust the border radius to make it more oval-shaped
  },
  ovalContainer5: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC107',
    // Change the background color as needed
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20, // Adjust the border radius to make it more oval-shaped
  },
  ovalContainer6: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    // Change the background color as needed
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20, // Adjust the border radius to make it more oval-shaped
  },
  text: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
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

  detailsContainer: {
    flex: 1,
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '2%',
    marginTop: '2%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  animatedArrow: {
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logouticon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8%',
    // transform: [{translateX: 0}],
  },
  crossIcon: {
    marginLeft: 10,
  },
  additionalContainer: {
    backgroundColor: 'gray',
    width: '100%',
    bottom: 10,
    height: 150,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Adjust this value as needed
    borderTopLeftRadius: 0, // No border radius for top left corner
    borderTopRightRadius: 0, // No border radius for top right corner
    borderBottomLeftRadius: 5, // Border radius for bottom left corner
    borderBottomRightRadius: 5,
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendColorBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: 'black',
  },
});

export default Mddash;

