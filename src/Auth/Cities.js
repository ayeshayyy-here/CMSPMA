import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import metro from '../../assets/images/metro.png';
import olmt from '../../assets/images/olmt.jpeg';
import fr from '../../assets/images/fr.jpeg';
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import InfoBanner from '../Components/InfoBanner';
const VerticalLine = () => <View style={styles.verticalLine}></View>;

const Cities = ({route, navigation}) => {
  const [cities, setCities] = useState([]);
  const [selectedTab, setSelectedTab] = useState('');
  const [cityData, setCityData] = useState([]);

  useEffect(() => {
    fetchCityData(1); // Load data for Lahore by default
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  const handlePress = provider => {
    navigation.navigate('Cat', {
      providerId: provider.id,
      providerName: provider.name,
      complaintType: selectedTab, // Pass the selectedTab as complaintType
    });
  };
  

  const cityIds = {
    Lahore: 1,
    Multan: 2,
    Rawalpindi: 3,
  };

  const fetchCityData = cityId => {
    console.log('cityId', cityId);
    fetch(`https://complaint-pma.punjab.gov.pk/api/service-providersnew/${cityId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('City data:', data);
        setCityData(data);
      })
      .catch(error => {
        console.error('Error fetching city data:', error);
      });
  };

  useEffect(() => {
    fetch('https://complaint-pma.punjab.gov.pk/api/cities')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data && Array.isArray(data.complaint)) {
          const cityNames = data.complaint.map(city => city.name);
          setCities(cityNames);
          setSelectedTab(cityNames.length > 0 ? cityNames[0] : '');
        }
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
      });
  }, []);

  const handleTabPress = tab => {
    const cityId = cityIds[tab]; // Get the corresponding ID from the object
    setSelectedTab(tab);
    setCityData([]); // Clear city data
    fetchCityData(cityId);
  };
  const pieData = [
    {value: 54, color: '#177AD5', text: 'OLMRTS'},
    {value: 20, color: '#ED6665', text: 'LMBS'},
    {value: 30, color: '#F6C34E', text: 'LFR'},
  ];

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
  const getColorByCityName = (name) => {
    // Define color mappings based on city name or route type
    switch (name) {
      case 'Lahore Metrobus System':
        return { color: 'green', image: metro };
      case 'Lahore Feeder Routes':
        return { color: '#bb2124', image: fr };
      case 'Orange Line Metro Rail Transit System':
        return { color: '#FF8C00', image: olmt };
      case 'Multan Metrobus System':
        return { color: '#bb2124', image: metro };
      case 'Multan Feeder Routes':
        return { color: '#bb2124', image: fr };
      case 'Pakistan Metrobus System':
        return { color: '#198754', image: metro };
      default:
        return { color: '#177AD5', image: '' }; // Default color for other cases
    }
  };
  const renderCityContent = () => {
    switch (selectedTab) {
      case 'Lahore':
      case 'Multan':
      case 'Rawalpindi':
        return (
          <View style={styles.contentContainer}>
            {cityData.map(provider => (
              <View key={provider.id} style={styles.containerRow}>
                <View style={[styles.cityContainer]}>
                  <View style={[styles.greenTopHalf, { backgroundColor: getColorByCityName(provider.name).color }]} />
                  <View style={styles.circularImageContainer}>
                    {getColorByCityName(provider.name).image && (
                      <Image source={getColorByCityName(provider.name).image} style={styles.circularImage} />
                    )}
                  </View>
                  <View style={styles.providerNameContainer}>
                    <TouchableOpacity onPress={() => handlePress(provider)}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                    </TouchableOpacity>
                  </View>
                  {/* <View style={styles.textContainer}> */}
                    {/* <TouchableOpacity onPress={() => navigation.navigate('CitiesComplaint', { data: [{ cityIds: provider.id, complaintType: 'total', providerT: provider.total }] })}>
                      <View>
                        <Text style={styles.numberText}>{provider.total}</Text>
                        <Text style={[styles.text, { marginLeft: 10 }]}>Total</Text>
                      </View>
                    </TouchableOpacity> */}
                    {/* <VerticalLine /> */}
                    {/* <TouchableOpacity onPress={() => navigation.navigate('CitiesComplaint', { data: [{ cityIds: provider.id, complaintType: 'pending', providerP: provider.pen }] })}>
                      <View>
                        <Text style={styles.numberText}>{provider.pen}</Text>
                        <Text style={styles.text}>In process</Text>
                      </View>
                    </TouchableOpacity> */}
                    {/* <VerticalLine /> */}
                    {/* <TouchableOpacity onPress={() => navigation.navigate('CitiesComplaint', { data: [{ cityIds: provider.id, complaintType: 'resolved', providerR: provider.res }] })}>
                      <View>
                        <Text style={styles.numberText}>{provider.res}</Text>
                        <Text style={styles.text}>Resolved</Text>
                      </View>
                    </TouchableOpacity> */}
                  {/* </View> */}
                  <View style={styles.statsContainer}>
  <View style={styles.statsRow}>
    <Text style={styles.statsHeader1}>Today</Text>
    {/* <VerticalLine /> */}
    <Text style={styles.statsHeader}>MTD</Text>
    
    {/* <VerticalLine /> */}
    <Text style={styles.statsHeader3}>FYTD</Text>
      {/* <VerticalLine /> */}
      <Text style={styles.statsHeader3}>ITD</Text>
  </View>
  <View style={styles.statsRow}>
    <Text style={styles.statsLabel}>Received</Text>
    
    <TouchableOpacity style={styles.centeredTouchable} 
    onPress={() => navigation.navigate('CitiesComplaint', { data: [{ cityIds: provider.id, complaintType: 'pending', providerT: provider.total,  period: 'today' }] })}>
      <Text style={styles.statsValue}>{provider.today.today_incoming}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.centeredTouchable}
    onPress={() => navigation.navigate('CitiesComplaint', { data: [{ cityIds: provider.id, complaintType: 'pending', providerT: provider.total,  period: 'month' }] })}>
      <Text style={styles.statsValue}>{provider.month.month_incoming}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.centeredTouchable}
    onPress={() => navigation.navigate('CitiesComplaint', { data: [{ cityIds: provider.id, complaintType: 'pending', providerT: provider.total,  period: 'year' }] })}>
      <Text style={styles.statsValue}>{provider.year.year_incoming}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.centeredTouchable}
    onPress={() => navigation.navigate('CitiesComplaint', { data: [{ cityIds: provider.id, complaintType: 'pending', providerT: provider.total,  period: 'year' }] })}>
      <Text style={styles.statsValue}>{provider.itd.itd_incoming}</Text>
    </TouchableOpacity>
  </View>
  <View style={styles.horizontalLine}/>
  <View style={styles.statsRow}>
    <Text style={styles.statsLabel}>Resolved</Text>
    <TouchableOpacity style={styles.centeredTouchable}
    onPress={() => navigation.navigate('CitiesComplaintresolved', { data: [{ cityIds: provider.id, complaintType: 'resolved', providerT: provider.total,  period: 'today' }] })}>
      <Text style={styles.statsValue}>{provider.today.today_resolved}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.centeredTouchable}
    onPress={() => navigation.navigate('CitiesComplaintresolved', { data: [{ cityIds: provider.id, complaintType: 'resolved', providerT: provider.total,  period: 'month' }] })}>
      <Text style={styles.statsValue}>{provider.month.month_resolved}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.centeredTouchable}
    onPress={() => navigation.navigate('CitiesComplaintresolved', { data: [{ cityIds: provider.id, complaintType: 'resolved', providerT: provider.total,  period: 'year' }] })}>
      <Text style={styles.statsValue}>{provider.year.year_resolved}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.centeredTouchable}
    onPress={() => navigation.navigate('CitiesComplaintresolved', { data: [{ cityIds: provider.id, complaintType: 'resolved', providerT: provider.total,  period: 'year' }] })}>
      <Text style={styles.statsValue}>{provider.itd.itd_resolved}</Text>
    </TouchableOpacity>
  </View>
  <View style={styles.horizontalLine}/>
  <View style={styles.statsRow}>
    <Text style={styles.statsLabel}>Pending</Text>
    <TouchableOpacity style={styles.centeredTouchable}
    onPress={() => navigation.navigate('CitiesComplaint', { data: [{ cityIds: provider.id, complaintType: 'inprocess', providerT: provider.total,  period: 'today' }] })}>
      <Text style={styles.statsValue}>{provider.today.today_inprocess}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.centeredTouchable}
    onPress={() => navigation.navigate('CitiesComplaint', { data: [{ cityIds: provider.id, complaintType: 'inprocess', providerT: provider.total,  period: 'month' }] })}>
      <Text style={styles.statsValue}>{provider.month.month_inprocess}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.centeredTouchable}
    onPress={() => navigation.navigate('CitiesComplaint', { data: [{ cityIds: provider.id, complaintType: 'inprocess', providerT: provider.total,  period: 'year' }] })}>
      <Text style={styles.statsValue}>{provider.year.year_inprocess}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.centeredTouchable}
    onPress={() => navigation.navigate('CitiesComplaint', { data: [{ cityIds: provider.id, complaintType: 'inprocess', providerT: provider.total,  period: 'year' }] })}>
      <Text style={styles.statsValue}>{provider.itd.itd_inprocess}</Text>
    </TouchableOpacity>
  </View>
</View>

                </View>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
         
      <LinearGradient colors={['#A00000', '#EA2027']} style={styles.header}>
        <View style={styles.headerTextContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="building" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.headerText}>Cities</Text>
          </View>
          {/* This empty view will push the text to the right */}
          <View style={{flex: 1}} />
        </View>
      </LinearGradient>
   <InfoBanner />
      <View style={styles.tabsContainer}>
        {/* Render tabs for each city */}
        {cities.map(city => (
          <TouchableOpacity
            key={city}
            style={[
              styles.tabButton,
              selectedTab === city && styles.selectedTabButton,
            ]}
            onPress={() => handleTabPress(city)}>
            <Text
              style={[
                styles.tabButtonText,
                selectedTab === city && styles.selectedTabText,
              ]}>
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Render selected tab content */}
      <ScrollView>
        {renderCityContent()}
        {/* <View style={styles.contentContainer}>
          <View style={styles.containerRow}>
            <View style={styles.piecityContainer}>
              <View style={styles.piechartTopHalf}>
                <Text style={styles.centeredText}>
                  PMA Staff Efficiency Regarding Complaints
                </Text>
              </View>
              <View style={styles.pieChartWrapper}>
                <PieChart
                  showText
                  textColor="white"
                  radius={110}
                  textSize={10}
                  focusOnPress
                  showValuesAsLabels
                  // showTextBackground
                  // textBackgroundRadius={0}
                  data={pieData}
                />
                <View style={styles.legendContainer}>
                  {pieData.map((data, index) => (
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
          </View>
        </View> */}
    <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
            marginTop: 20,
          }}>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: 'black'}}>
          System vise Vendor Status
          </Text>
      
        </View>
    
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    padding: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Space evenly for better alignment
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center', // Center items vertically
  },
  statsHeader1: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginLeft:'20%'
  },
  statsHeader3: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  statsHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  statsLabel: {
    fontSize: 14,
    color: '#555',
  },
  statsValue: {
    fontSize: 14,
    color: 'grey',
  },
  centeredTouchable: {
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    flex: 1, // Ensures each TouchableOpacity takes equal space
  },
  horizontalLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    marginVertical: 4,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginLeft: 5,
  },
  providerNameContainer: {
    position: 'absolute',
    top: '10%', // Adjust the position vertically
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Adjust text color as needed
  },
  containerRow: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedTabButton: {
    borderColor: '#CD1D0C',
  },
  tabButtonText: {
    color: '#D3D3D3',
    fontWeight: 'bold',
  },
  selectedTabText: {
    color: '#CD1D0C',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  circularImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    // backgroundColor: '#ccc', // Placeholder color for the image
    marginBottom: 10,
  },
  circularImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '20%',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333', // Adjust color as needed
  },
  numberText: {
    fontSize: 12,
    marginLeft: 8,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333', // Adjust color as needed
    textAlign: 'center', // Center the text horizontally
    marginTop: 5, // Add some margin to separate the text from the labels
  },
  verticalLine: {
    width: 0.9,
    height: '700%',
    backgroundColor: '#ccc',
    marginLeft: 7,
  },
  contentText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  containerRow: {
    flexDirection: 'row',
  },
  cityContainer: {
    marginTop: '5%',
    width: '85%',
    height: 350,
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
  },
  piecityContainer: {
    marginTop: '5%',
    width: '85%',
    height: 350,
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
  pieChartWrapper: {
    marginTop: '15%', // Add margin-top as needed
  },

  greenTopHalf: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%', // Half height for green color
    backgroundColor: '#198754',
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
    fontSize: 14,
    color: 'black',
  },
});

export default Cities;
