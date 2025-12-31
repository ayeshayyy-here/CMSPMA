import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  SafeAreaView, 
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Collapsible from 'react-native-collapsible';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

const ArchivedComplaintsource = ({ route, navigation }) => {
    const { data } = route.params; // Access the passed data
  
    useEffect(() => {
      console.log(data); // Log the data to ensure it's being passed correctly
    }, [data]);
  
    const [items, setItems] = useState([]);
    const [collapsedStates, setCollapsedStates] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false); // State for refreshing

    useEffect(() => {
      const delaySearch = setTimeout(() => {
        fetchData(0);
      }, 500);
  
      return () => clearTimeout(delaySearch);
    }, [searchTerm]);
  
    const fetchData = async (page) => {
        setRefreshing(true);
        setLoading(true);
        try {
          const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/Archivelistsource/${data}?per_page=20&page=${page + 1}`);
          const responseData = await response.json();
          console.log('Fetched Data:', responseData); // Log the entire response
          if (responseData.complains) {
            setTotalPages(responseData.complains.last_page);
            setItems(responseData.complains.data);
            setCollapsedStates(new Array(responseData.complains.data.length).fill(true));
          } else {
            setItems([]);
          }
          setRefreshing(false);
          setLoading(false);
        } catch (error) {
          setRefreshing(false);
          setLoading(false);
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
          <Text style={styles.actionText}>Restore</Text>
        </TouchableOpacity>
      );
    };

    const renderItem = ({ item, index }) => (
      <Swipeable
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, () => handleArchive(item.id))}
      >
        <TouchableOpacity
          key={index}
          onPress={() => toggleCollapse(index)}
          style={[
            styles.collapsibleHeader,
            getStatusBorderColor(item.status), // Apply dynamic border colors
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
    </Swipeable>
    );

    const handleArchive = (id) => {
      fetch('https://complaint-pma.punjab.gov.pk/api/restorearchive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id, // Replace with the actual complaint ID
        }),
      })
      .then(response => response.json())
      .then(async data => { // Using async to call fetchData and fetchArchivedCount sequentially
        if (data.message) {
          Alert.alert('Success', data.message);
          await fetchData(); // Reload the list after archiving
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to restore the complaint.');
      });
  };

    const renderEmptyList = () => {
      return (
        <View style={styles.emptyList}>
          <Text style={styles.emptyListText}>No Complaints Found</Text>
        </View>
      );
    };

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <LinearGradient colors={['#A00000', '#EA2027']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon name="arrow-left" size={20} color="white" style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.headerText}>
          Archived Complaints
          </Text>
          </View>
        </LinearGradient>

      {loading && <ActivityIndicator size="large" color='red' />}
        <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            // refreshControl={
            //   <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(0)} />
            // }
          />
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
    alignItems: 'center',
    flexDirection: 'row',
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
  archiveIcon: {
    marginRight: 5,
    marginLeft: 5, // Add some space between the icon and the text
  },
  archivedButton: {
  
    padding: 10,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'start',
    
  },
  archivedButtonText: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 18 ,
    marginLeft: 5,
  },
  archiveIconn: {
    marginRight: 5,
    marginLeft: 5, // Add some space between the icon and the text
  },
  rightAction: {
 
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  actionText: {
    color: 'maroon',
    fontSize: 12,
    padding: 2,
  },
  archiveIcon: {
    padding: 2,
  },
});

export default ArchivedComplaintsource;
