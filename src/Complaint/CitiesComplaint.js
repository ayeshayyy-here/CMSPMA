import React, { useState, useEffect, useCallback  } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
  FlatList,
  SafeAreaView, 
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Collapsible from 'react-native-collapsible';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import Loader from '../Components/Loader'; // Import Loader component

const CitiesComplaint = ({ navigation, route }) => {
  const [items, setItems] = useState([]);
  const [collapsedStates, setCollapsedStates] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [headerComplain, setHeaderComplain] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setLoadingData] = useState(false); // State for loading data
  const [archivedCount, setArchivedCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArchivedCount = async () => {
    try {
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/archivedCount/${route.params.data[0]['complaintType']}/${route.params.data[0]['cityIds']}`);
      const responseData = await response.json();
      setArchivedCount(responseData.archivedCount || 0);
      console.log('Archived Count:', responseData.archivedCount || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchArchivedCount();
  }, []);

    const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchArchivedCount();
    await fetchData();
    setRefreshing(false);
  }, []);



  
  useEffect(() => {
    const { providerT, providerR, providerP, cityIds, complaintType, period } = route.params.data[0];
    setHeaderComplain(complaintType , period);
    fetchData(0);
  }, []);

  useEffect(() => {
    // Call fetchData when searchTerm changes
    const delaySearch = setTimeout(() => {
      fetchData(0);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const fetchData = async (page) => {
    setRefreshing(true);
    setLoading(true);
    setLoadingData(true); // Set loadingData to true when starting to fetch data
    try {
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/citiescomplaint/${route.params.data[0]['complaintType']}/${route.params.data[0]['cityIds']}/${route.params.data[0]['period']}?page=${page + 1}`);
      const responseData = await response.json();
      setTotalPages(responseData.last_page);
      setItems(responseData.data);
      setCollapsedStates(new Array(responseData.data.length).fill(true));
      setRefreshing(false);
      setLoading(false);
      setLoadingData(false); // Set loadingData to false when data fetch completes
    } catch (error) {
      setRefreshing(false);
      setLoading(false);
      setLoadingData(false); // Set loadingData to false in case of error
      console.log(error);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    fetchData(page);
  };

  const renderPaginationButtons = () => {
    const maxButtonsToShow = 5;
    const ellipsisThreshold = 3; // Number of pages after which to show ellipsis
  
    let startPage = Math.max(0, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxButtonsToShow - 1);
  
    // Adjust startPage and endPage when not enough pages to fill maxButtonsToShow
    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(0, endPage - maxButtonsToShow + 1);
    }
  
    const buttons = [];
  
    // Add first page button
    if (startPage > 0) {
      buttons.push(
        <TouchableOpacity
          key={0}
          onPress={() => handlePageClick(0)}
          style={[styles.paginationButton, 0 === currentPage ? styles.activeButton : null]}
        >
          <Text style={{ color: 'white' }}>1</Text>
        </TouchableOpacity>
      );
  
      // Add ellipsis if startPage is greater than ellipsisThreshold functionusama
      if (startPage > ellipsisThreshold) {
        buttons.push(
          <Text key={'ellipsis-start'} style={{ color: 'black', marginHorizontal: 5 }}>
            ...
          </Text>
        );
      }
    }
  
    //  buttons for  pages to be show
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageClick(i)}
          style={[styles.paginationButton, i === currentPage ? styles.activeButton : null]}
        >
          <Text style={{ color: 'white' }}>{i + 1}</Text>
        </TouchableOpacity>
      );
    }
  
    if (endPage < totalPages - 1) {
      if (totalPages - endPage > ellipsisThreshold) {
        buttons.push(
          <Text key={'ellipsis-end'} style={{ color: 'black', marginHorizontal: 5 }}>
            ...
          </Text>
        );
      }

      buttons.push(
        <TouchableOpacity
          key={totalPages - 1}
          onPress={() => handlePageClick(totalPages - 1)}
          style={[styles.paginationButton, (totalPages - 1) === currentPage ? styles.activeButton : null]}
        >
          <Text style={{ color: 'white' }}>{totalPages}</Text>
        </TouchableOpacity>
      );
    }
  
    return buttons;
  };
  

  const toggleCollapse = (index) => {
    setCollapsedStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'overdue':
        return 'red';
      case 'resolved':
      case 'RESOLVED': // Consider both cases for resolved
        return 'green';
      default:
        return 'black';
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'pending':
        return { borderRightColor: 'orange', borderLeftColor: 'orange' };
      case 'overdue':
        return { borderRightColor: 'red', borderLeftColor: 'red' };
      case 'resolved':
      case 'RESOLVED': // Consider both cases for resolved
        return { borderRightColor: 'green', borderLeftColor: 'green' };
      default:
        return { borderRightColor: 'grey', borderLeftColor: 'grey' }; // Default border color
    }
  };
  const renderRightActions = (progress, dragX, onPress) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.rightAction}>
         <FontAwesomeIcon name="archive" size={15} color="maroon" style={styles.archiveIcon} />
        <Text style={styles.actionText}>Archive</Text>
      </TouchableOpacity>
    );
  };
  const renderItem = ({ item, index }) => (
    // <Swipeable
    //   renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, () => handleArchive(item.id, item.status))}
    // >
      <TouchableOpacity
        key={index}
        onPress={() => toggleCollapse(index)}
        style={[
          styles.collapsibleHeader,
          getStatusBorderColor(item.status),
        ]}
      >
        <View style={styles.collapheaderItem}>
          <Text
            style={
              styles.collapheaderText
            }>{`Complaint ID: ${item.id}`}</Text>
  
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status) },
            ]}>{`Status: ${item.status}`}</Text>
          <Icon
            name={collapsedStates[index] ? 'chevron-down' : 'chevron-up'}
            size={12}
            color="#666"
          />
        </View>
  
        <Collapsible collapsed={collapsedStates[index]}>
          <View style={styles.collapsibleContent}>
            <View style={styles.rowContainer}>
              <Text style={styles.labelText}>
                Complaint Type:{' '}
                <Text style={styles.innerlabelText}>
                  {item.complaint_type}
                </Text>
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.labelText}>
                Complaint Details:{' '}
                <Text style={styles.innerlabelText}>
                  {item.complaint_details}
                </Text>
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.labelText}>
                Service Provider:
                <Text style={styles.innerlabelText}>
                  {' '}
                  {item.service_provider_name}
                </Text>
              </Text>
            </View>
          <View style={styles.rowContainer}>
            <Text style={styles.labelText}>
              Picture: {item.complain_pic}
            </Text>
          </View>
        </View>
      </Collapsible>
    </TouchableOpacity>
    // </Swipeable>
  );
  

  const handleArchive = (id, status) => {
    console.log('Attempting to archive complaint with ID:', id, 'and status:', status);
  
    if (status !== 'resolved' && status !== 'RESOLVED') {
      Alert.alert('Error', 'Only resolved complaints can be archived.');
      return;
    }
  
    fetch('https://complaint-pma.punjab.gov.pk/api/comparchive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then(response => response.json())
      .then(async data => {
        if (data.message) {
          Alert.alert('Success', data.message);
          await fetchData(currentPage); // Pass current page to fetchData
          await fetchArchivedCount(); // Update the archived count
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to archive the complaint.');
      });
  };
  
  


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
      <LinearGradient colors={['#A00000', '#EA2027']} style={styles.gradient}>
    <View style={styles.header}>
      <View style={styles.leftHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon name="arrow-left" size={20} color="white" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>
        {headerComplain === 'pending'
          ? 'Incoming Complaints'
          : headerComplain === 'inprocess'
            ? 'In Process Complaints'
            : headerComplain === ''
            ? 'PFI Complaints'
            : headerComplain === 'resolved'
              ? 'Resolved Complaints'
              : `${headerComplain} Complaints`}
      </Text>
      <View style={styles.rightHeader}>
        {/* <TouchableOpacity onPress={() => navigation.navigate('ArchivedComplaintsScreen', { data: route.params.data })}>
          <View style={styles.archiveContainer}>
            <FontAwesomeIcon name="archive" size={20} color="white" style={styles.archiveIcon} />
            <Text style={styles.archivedCount}>{archivedCount || 0}</Text>

          </View>
        </TouchableOpacity> */}
      </View>
    </View>
  </LinearGradient>
 

      {loading && <ActivityIndicator size="large" color='red' />}
        <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          </View>
          <View style={styles.paginationContainer}>
            {renderPaginationButtons()}
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  noResultsText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 10,
 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },

  rightHeader: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
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
    color: '#666',
    marginTop: 5,
  },
  collapsibleContent: {
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  paginationButton: {
    backgroundColor: 'gray',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: 'maroon',
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
    fontWeight: 'normal',
    color: 'black',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 25,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    elevation: 5,
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
  rightAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  
  },
  actionText: {
    color: 'maroon',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 12 ,
    marginLeft: 5, // Add some space between the icon and text
  },
  // archiveIcon: {
  //   marginRight: 5,
  //   marginLeft: 5, // Add some space between the icon and the text
  // },
  archivedButton: {
  
    padding: 10,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'start',
    
  },
  archivedButto: {
  

    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'start',
    
  },
  archivedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18 ,
    marginLeft: 5,
    bottom: '2%',
  },
  archiveIconn: {
    marginRight: 5,
    marginLeft: 5, // Add some space between the icon and the text
  },

 
  icon: {
    marginHorizontal: 5,
  },
  archiveContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  archiveIcon: {
    marginHorizontal: 15,
  },
  archivedCount: {
    position: 'absolute',
    top: -10, // Adjust this value as needed to position the count above the icon
    right: 2, // Adjust this value as needed to align the count with the icon
    color: 'maroon',
    fontSize: 12,
    backgroundColor: 'white', // Optional: Background color for better visibility
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
});

export default CitiesComplaint;
