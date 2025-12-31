import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import baseUrl from '../Config/url';
import Collapsible from 'react-native-collapsible';
import syncStorage from 'react-native-sync-storage'; 

const SystemScreenCCC = ({route, navigation}) => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedDesignation2, setSelectedDesignation2] = useState(null);
  const [designationStaffData, setDesignationStaffData] = useState(null);
  const [designationStaffData2, setDesignationStaffData2] = useState(null);
  const [staffData, setStaffData] = useState(null);
  const [collapsedStates, setCollapsedStates] = useState(null);
  const scrollViewRef = useRef(null);
  const scrollViewReff = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showStaffNames, setShowStaffNames] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showRightArrow, setShowRightArrow] = useState(true);
    const [provider, setProvider] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedproviderName, setSelectedProviderName] = useState(null);
  const [systemWiseHierarchy, setSystemWiseHierarchy] = useState([]);
  const [providerStaffData, setproviderStaffData] = useState(null)
  
  const colors = ['#8b0000', '#7d0000', '#6f0000', '#610000', '#530000'];
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const isEndReached =
      layoutMeasurement.width + contentOffset.x >= contentSize.width;
    setShowRightArrow(!isEndReached);
    setShowLeftArrow(contentOffset.x > 0);
  };
  const [showRightArroww, setShowRightArroww] = useState(true);
  const [showLeftArroww, setShowLeftArroww] = useState(false);
  const handleScrolll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const isEndReached =
      layoutMeasurement.width + contentOffset.x >= contentSize.width;
    setShowRightArroww(!isEndReached);
    setShowLeftArroww(contentOffset.x > 0);
  };
  // Function to toggle visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const navigateToAllStaffReport = () => {
    navigation.navigate('AllStaffReport'); // Replace 'AllStaffReport' with the name of your screen
  };
  const truncateName = name => {
    const maxLength = 10; // Define your desired maximum length
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...'; // Truncate the name and add ellipsis
    } else {
      return name; // Return the full name if it's shorter than the maximum length
    }
  };

  useEffect(() => {
    // console.log("Fetching service providers...");
    fetch('https://complaint-pma.punjab.gov.pk/api/serviceproviders')
      .then(response => response.json())
      .then(data => {
        // console.log("Service providers fetched successfully:", data);
        setServiceProviders(data.complaint);
      })
      .catch(error => {
        console.error('Error fetching service providers:', error);
      });
  }, []);


  
  const fetchSystemWiseHierarchy = (providerId) => {
    fetch(`https://complaint-pma.punjab.gov.pk/api/systemwisehierarchy/${providerId}`)
      .then(response => response.json())
      .then(data => {
        setSystemWiseHierarchy(data);
      })
      .catch(error => {
        console.error('Error fetching system wise hierarchy:', error);
      });
  };

  useEffect(() => {
    // console.log("Fetching designations...");
    fetchData2();
  }, []);

  const fetchData2 = async () => {
    try {
      const response = await fetch(`${baseUrl}/designationssam`); // Corrected the URL
      const data = await response.json();
      // console.log("Designations fetched successfully:", data);
      setDesignations(data.designations);
      setCollapsedStates(new Array(data.designations.length).fill(false)); // Initialize collapsed states
    } catch (error) {
      console.error('Error fetching designations:', error);
    }
  };
  const fetchStaffData = async userId => {
    try {
      const response = await fetch(`${baseUrl}/staffhierarchy/${userId}`);
      const data = await response.json();
      console.log('Fetched staff data:', data);
      // Do something with the fetched data, such as storing it in state
      setStaffData(data);
    } catch (error) {
      console.error('Error fetching staff data:', error);}
    };

  const handleUserPress = async userId => {
    await fetchStaffData(userId);
    setShowStaffNames(true); // Set showStaffNames to true when a user is pressed
  };

  const handleCompanyPress = company => {
    console.log('Company details:', company);
    setSelectedCompany(company);
  };

  const fetchDesignationStaffData = async designationId => {
    try {
      const response = await fetch(
        `${baseUrl}/designationpmastaff/${designationId}`,
      );
      const data = await response.json();
      // console.log("Fetched designation staff data:", data);
      setDesignationStaffData(data);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };
  const fetchDesignationStaffData2 = async () => {
    try {
      const userDetail = syncStorage.get('user_detail');
  
      if (userDetail) {
        const designation = userDetail.designation;
        let designationId;
  
        if (designation === 'Assistant Manager Operations') {
          designationId = 5;
        } else if (designation === 'Deputy Manager') {
          designationId = 4;
        } else if (designation === 'Manager') {
          designationId = 3;
        }
  
        if (designationId) {
          const response = await fetch(
            `${baseUrl}/designationpmastaff/${designationId}`,
          );
          const data = await response.json();
          console.log(`Fetched ${designation}'s staff data:`, data);
          setDesignationStaffData2(data);
        } else {
          console.error('Error: Invalid designation');
        }
      } else {
        console.error('Error: User detail not found');
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };
  
  

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
                 onPress={() => fetchSystemWiseHierarchy(provider.id)}>
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
              onPress={() => fetchSystemWiseHierarchy(provider.id)}>
              <Text style={styles.heading}>{provider.name}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    ));
  };
 



  


  const renderContent2 = () => {
    return designations.map(designation => (
      <TouchableOpacity
        key={designation.id}
        onPress={() => {
          setSelectedDesignation(designation.id);
          fetchDesignationStaffData(designation.id);
        }}>
        <LinearGradient
          colors={['rgba(255, 182, 193, 0)', 'rgba(255, 218, 185, 0)']} // Set alpha to 0 for transparency
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[
            styles.scrollItem,
            selectedDesignation === designation.id && styles.selectedScrollItem, // Apply selected style if designation is selected
          ]}>
          <Text
            style={[
              styles.scrollText,
              selectedDesignation === designation.id &&
                styles.selectedScrollText, // Apply selected text color if designation is selected
            ]}>
            {designation.name}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    ));
  };
  const [selectedDesignation4, setSelectedDesignation4] = useState('General Manager'); // Add this state at the top of your component

  const renderContent4 = () => {
    const userDetail = syncStorage.get('user_detail');
    let userDesignation;
  
    if (userDetail) {
      userDesignation = userDetail.designation;
    }
  
    const handlePress = () => {
      setSelectedDesignation4(userDesignation);
      fetchDesignationStaffData2();
    };
  
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.5}
      >
        <LinearGradient
          colors={[
            userDesignation === 'Assistant Manager'
              ? 'rgba(255, 218, 185, 0.5)'
              : userDesignation === 'Deputy Manager'
              ? 'rgba(255, 182, 193, 0.5)'
              : userDesignation === 'Manager'
              ? 'rgba(255, 160, 122, 0.5)'
              : 'rgba(255, 182, 193, 0)', 
            'rgba(255, 218, 185, 0)',
          ]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[
            styles.scrollItem,
            (userDesignation === 'Assistant Manager' ||
              userDesignation === 'Deputy Manager' ||
              userDesignation === 'Manager') &&
              styles.selectedScrollItem,
          ]}>
          <Text
            style={[
              styles.scrollText,
              (userDesignation === 'Assistant Manager' ||
                userDesignation === 'Deputy Manager' ||
                userDesignation === 'Manager') && {color: '#000000'},
            ]}>
            {userDesignation}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  const renderContent3 = () => {
    if (!designationStaffData || designationStaffData.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      );
    }

    const selectedDesignationName = designations.find(
      designation => designation.id === selectedDesignation,
    )?.name;
    const colors = ['#8b0000', '#7d0000', '#6f0000', '#610000', '#530000'];

    return (
      <View>
        {/* Heading */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginTop: 10,
          }}>
          <Text style={{fontSize: 12, fontWeight: 'bold', color: 'gray'}}>
            {selectedDesignationName}
          </Text>
        </View>

        {/* User Details */}
        <View
          style={{
            marginLeft: 10,
            // flexDirection: 'row',
            // flexWrap: 'wrap',
            // paddingHorizontal: 10,
            // marginTop: 10,
          }}>
          <View style={styles.userDetailsGrid}>
            {designationStaffData.map((user, index) => (
              <View style={styles.userDetailsContainer} key={index}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Progressreport', {
                      user: user,
                      designation: selectedDesignationName,
                    })
                  }
                  style={[
                    styles.profileContainerdes,
                    {
                      // marginRight: (index + 1) % 3 === 0 ? 0 : 10,
                      marginBottom: 10,
                    },
                  ]}>
                  <View
                    style={[
                      styles.profilePicdes,
                      {backgroundColor: colors[index % colors.length]},
                    ]}>
                    <View style={styles.profileImagedes}>
                      <Text style={styles.initial}>
                        {user.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.userName}>{truncateName(user.name)}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderContentHierarchy = () => {
    if (!designationStaffData2 || designationStaffData2.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Data Available</Text>
        </View>
      );
    }
  
    const colors = ['#8b0000', '#7d0000', '#6f0000', '#610000', '#530000'];
  
    return (
      <View>
        {/* Heading */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginTop: 10,
          }}>
          <Text style={{fontSize: 12, fontWeight: 'bold', color: 'gray'}}>
            {selectedDesignation4}
          </Text>
        </View>
  
        {/* User Details */}
        <View
          style={{
            marginLeft: 10,
          }}>
          <View style={styles.userDetailsGrid}>
            {designationStaffData2.map(
              (
                user,
                index,
              ) => (
                <View style={styles.userDetailsContainer} key={index}>
                  <TouchableOpacity
                    key={user.id}
                    onPress={() => handleUserPress(user.id)}
                    style={[
                      styles.profileContainerdes,
                      {
                        marginBottom: 10,
                      },
                    ]}>
                    <View
                      style={[
                        styles.profilePicdes,
                        {backgroundColor: colors[index % colors.length]},
                      ]}>
                      <View style={styles.profileImagedes}>
                        <Text style={styles.initial}>
                          {user.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.userName}>
                      {truncateName(user.name)}
                    </Text>
                  </TouchableOpacity>
                </View>
              ),
            )}
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}>
            {showStaffNames && renderstaffname()}
          </ScrollView>
        </View>
        <View style={{flex: 1}}>
          {/* Your other components */}
  
          {/* Render CompanyCard if a company is selected */}
          {selectedCompany && <CompanyCard company={selectedCompany} />}
        </View>
      </View>
    );
  };
  

  const renderstaffname = () => {
    return (
      <>
        <View style={{marginHorizontal: 15}}>
          <Text style={{color: 'maroon', fontSize: 14, fontWeight: 'bold'}}>
            Staff Members
          </Text>
        </View>
        <ScrollView horizontal  style={{marginBottom: '100%'}}>
          {staffData.child_comp_data.map(company => (
            <TouchableOpacity
              key={company.id}
              onPress={() => handleCompanyPress(company)}
              style={[styles.scrollItemc, {backgroundColor: 'white'}]}>
              <Text style={styles.scrollTextc}>{company.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

  const CompanyCard = ({company}) => {
    const firstLetter = company.name.charAt(0).toUpperCase();
    return (
      <View style={styles.cardContainerc}>
        {/* Header */}
        <View style={styles.headerc}>
          {/* Icon Container */}
          <View style={styles.iconContainerc}>
            <Text style={styles.iconTextc}>{firstLetter}</Text>
          </View>
          {/* Name */}
          <Text style={styles.namec}>{company.name}</Text>
        </View>
        {/* Options */}
        <View style={styles.maincontainer}>
        {/* <TouchableOpacity style={styles.optionContainer}>
            <Icon name="tasks" size={15} color="white" style={styles.icon} />
            <Text style={[styles.optionTextc, { lineHeight: 30 }]}>
              Total Tasks: {company.task_total}
            </Text>
          </TouchableOpacity> */} 
          <TouchableOpacity style={styles.optionContainer}>
            <Icon name="clock-o" size={17} color="white" style={styles.icon} />
            <Text style={[styles.optionTextc, { lineHeight: 30 }]}>
              In Process Tasks: {company.task_inprocess}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionContainer}>
            <Icon
              name="exclamation-circle"
              size={17}
              color="white"
              style={styles.icon}
            />
            <Text style={[styles.optionTextc, { lineHeight: 30 }]}>
              Pending Tasks: {company.task_pending}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionContainer}>
            <Icon
              name="check-circle"
              size={17}
              color="white"
              style={styles.icon}
            />
            <Text style={[styles.optionTextc, { lineHeight: 30 }]}>
              Resolved Tasks: {company.task_resolved}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const iconMapping = {
    'Lahore Metrobus System': 'bus',
    'Pakistan Metrobus System': 'bus',
    'Multan Metrobus System': 'bus',
    'Lahore Feeder Routes': 'map-marker',
    'Multan Feeder Routes': 'map-marker',
    'Orange Line Metro Rail Transit System': 'subway',
  };

  const colorMapping = {
    'Lahore Metrobus System': 'maroon',
    'Pakistan Metrobus System': 'maroon',
    'Multan Metrobus System': 'maroon',
    'Lahore Feeder Routes': 'maroon',
    'Multan Feeder Routes': 'maroon',
    'Orange Line Metro Rail Transit System': 'maroon',
  };

  return (
    <View>
      <LinearGradient colors={['#A00000', '#EA2027']}>
        <View style={styles.header}>
          <View
            style={[
              styles.headerTextContainer,
              {justifyContent: 'space-between'},
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="sliders"
                size={24}
                color="#fff"
                style={{marginRight: 5}}
              />
              <Text style={styles.headerText}>Systems</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      <ScrollView style={{marginBottom: '20%'}}>
      <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginTop: 10,
          }}>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'black'}}>
            Systems Wise staff
          </Text>
          <TouchableOpacity>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 10}}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', flex: 1}}>
              {showLeftArroww && (
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
                        scrollViewReff.current.scrollTo({x: 0, animated: true});
                      }}>
                      <Icon
                        name="angle-double-left"
                        size={15}
                        color="maroon"
                        // style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              )}
              <ScrollView
                ref={scrollViewReff}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
                onScroll={handleScrolll}
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
                        scrollViewReff.current.scrollToEnd({animated: true});
                      }}>
                      <Icon
                        name="angle-double-right"
                        size={15}
                        color="maroon"
                        // style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              )}
     
            </View>
          </View>
          <View style={styles.systemWiseHierarchyContainer}>
  {systemWiseHierarchy.map(item => (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        // Navigate to SystemWiseComplaint screen with item.id or any necessary data
        navigation.navigate('SystemWiseComplaint', { itemId: item.id , itemName: item.name });
      }}
      style={styles.systemWiseItem}
    >
      <View style={styles.profileImageContainerr}>
        <Text style={styles.initiall}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.systemWiseItemText}>{item.name}</Text>
    </TouchableOpacity>
  ))}
</View>
        </View>

       
     


      
        {/* <View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '2%',
    marginTop: '2%',
  }}>
  <Animatable.View 
    animation={{
      from: { translateX: 0 },
      to: { translateX: 3 },
    }}
    duration={1000}
    iterationCount="infinite"
    easing="linear"
    useNativeDriver
    style={styles.animatedArrow}>
    <TouchableOpacity
      onPress={() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }}>
      <Icon
        name="angle-double-right"
        size={20}
        color="#778899"
        style={styles.icon}
      />
    </TouchableOpacity>
  </Animatable.View>
</View> */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginTop: 10,
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'black'}}>
            Designations Wise staff
          </Text>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('Allstaffreport')}>
            <Text style={{fontSize: 10, fontWeight: 'bold', color: 'gray'}}>
              All Staff Report
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={{marginTop: 10 , marginBottom: 10,}}>
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
                        color="maroon"
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
                {renderContent2()}
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
                        color="maroon"
                        // style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              )} */}
            </View>
          </View>
        </View>

        {selectedDesignation && (
          <View style={{marginTop: 10}}>{renderContent3()}</View>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginTop: 10,
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'black'}}>
            Hierarchy Wise staff
          </Text>
          <TouchableOpacity></TouchableOpacity>
        </View>
        <View style={{marginTop: 10, marginLeft: 10}}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}>
            {renderContent4()}
          </ScrollView>
        </View>

        <View style={{marginTop: 10}}>{renderContentHierarchy()}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: 'grey',
    textAlign: 'center',
    fontSize: 16,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginLeft: '5%',
  },
  icon: {
    marginRight: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  iconContainer: {
    width: 40,
    height: 40,
    bottom: 15,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'pink',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  card: {
    backgroundColor: 'white',
    width: 200,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
  },
  heading: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: '5%',
    marginTop: 10,
    textAlign: 'center',
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
  scrollViewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollItem: {
    // backgroundColor: 'maroon',
    borderColor: 'maroon',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  scrollItemc: {
    borderColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginBottom: 10,
    borderRadius: 20,
    shadowColor: 'black', // for iOS
    shadowOffset: {width: 0, height: 2}, // for iOS
    shadowOpacity: 0.2, // for iOS
    shadowRadius: 2, // for iOS
    elevation: 2, // for Android
  },
  scrollText: {
    color: 'maroon',
    fontSize: 10,
  },
  scrollTextc: {
    color: 'maroon',
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
  userDetailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    marginTop: 5,
    width: '30%',
    height: 120,
    marginRight: '3%',
    marginBottom: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  userDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'center', // Align items horizontally
    // alignItems: 'center',
  },

  selectedScrollItem: {
    borderColor: 'maroon', // Border color when selected
    backgroundColor: 'maroon', // Background color when selected
  },
  selectedScrollText: {
    color: 'white',
  },

  containerdes: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Change this to set background color if needed
  },
  profileContainerdes: {
    alignItems: 'center',
    paddingHorizontal: 5,
    marginHorizontal: 5,
    marginTop: 10,
  },
  profilePicdes: {
    width: 50,
    height: 50,
    borderRadius: 50, // Half of width and height to make it circular
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  initial: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center', // Center the text horizontally
    lineHeight: 40, // Ensure the text is vertically centered
    fontSize: 20, // Adjust font size as needed
  },

  profileImagedes: {
    width: '80%',
    height: '80%',
    borderRadius: 50,
    alignItems: 'center',
  },
  userName: {
    fontSize: 10, // Adjust as needed
    fontWeight: 'bold', // Adjust as needed
    color: 'black', // Adjust as needed
  },
  cardContainerc: {
    backgroundColor: 'maroon',
    borderRadius: 20,
    padding: 20,
    marginBottom: '5%',
    marginTop: '5%',
    marginLeft: '10%',
    marginRight: '10%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  headerc: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainerc: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  namec: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  optionc: {
    paddingVertical: 8,
  },
  optionTextc: {
    fontSize: 12,
    color: 'white',
  },
  iconTextc: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'maroon', // Color opposite to the background color
  },
  systemWiseHierarchyContainer: {
    padding: 10, 
    
   
  },
  systemWiseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 5,
  
  },
  profileImageContainerr: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'maroon',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  initiall: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  systemWiseItemText: {
    fontSize: 10,
    fontWeight: 'bold', // Adjust as needed
    color: 'black', 
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10, // Adjust horizontal padding as needed
    paddingVertical: 15,
  },
});

export default SystemScreenCCC;
