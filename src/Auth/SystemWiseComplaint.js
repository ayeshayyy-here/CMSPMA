import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput,  ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Collapsible from 'react-native-collapsible';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const SystemWiseComplaint = ({ navigation, route }) => {
  const { itemId, itemName } = route.params;
  const [searchTerm, setSearchTerm] = useState('');
  const [complaintsData, setComplaintsData] = useState([]);
  const [collapsedStates, setCollapsedStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [complaintStats, setComplaintStats] = useState(null);
  const complaintsPerPage = 20; // Number of complaints per page

  useEffect(() => {
    fetchComplaintsData();
  }, [offset, refreshing]); 

  const fetchComplaintsData = () => {
    setLoading(true);
    console.log('Fetching complaints data...');
    fetch(`https://complaint-pma.punjab.gov.pk/api/allStaffComplaints/${itemId}/${offset}`)
      .then(response => response.json())
      .then(data => {
        console.log('Received complaints data:', data);
        if (data && Array.isArray(data)) {
          setComplaintsData(data);
          setCollapsedStates(new Array(data.length).fill(true));
        } else {
          console.log('No complaints data received or data format incorrect.');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching complaints data:', error);
        setLoading(false);  
      });
  };
  
  const toggleCollapse = index => {
    const newCollapsedStates = [...collapsedStates];
    newCollapsedStates[index] = !newCollapsedStates[index];
    setCollapsedStates(newCollapsedStates);
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      const filteredData = complaintsData.filter(complaint =>
        complaint.complaint_id.toString().includes(searchTerm),
      );
      setComplaintsData(filteredData);
    } else {
      fetchComplaintsData();
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaintsData();
    setRefreshing(false);
  };


  useEffect(() => {
    fetchComplaintstats();
  }, []);

  const fetchComplaintstats = () => {
    fetch(`https://complaint-pma.punjab.gov.pk/api/allStaffComplaintsstatts/${itemId}`)
      .then(response => response.json())
      .then(data => {
        // Update state with fetched data
        setComplaintStats(data[0]);
        console.log('Fetched Complaint Stats:', data[0]);
      })
      .catch(error => console.error('Error fetching data: ', error));
  };

  if (!complaintStats) {
    return (
      <View style={styles.loaderContainerr}>
        <View style={styles.loaderr}>
          <ActivityIndicator size="large" color="#A00000" />
        </View>
      </View>
    );
  }
  
  

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#A00000', '#EA2027']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{itemName}</Text>
      </LinearGradient>

      {/* <View style={styles.searchBar}>
        <TextInput
          placeholder="Search by Complaint ID"
          placeholderTextColor="grey"
          color="grey"
          keyboardType="numeric"
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          style={styles.input}
          onSubmitEditing={handleSearch}
        />
        <Icon name="search" size={15} color="#5E0034" style={styles.iconn} />
      </View> */}
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
      <View style={styles.rowContainerr}>
      <View style={styles.containerr}>
      <FontAwesomeIcon name="hourglass-half" style={styles.ico} />
        <Text style={styles.titlee}>Pending Complaints</Text>
        <Text style={styles.statss}>{complaintStats.pending_status}</Text>
      </View>
      <View style={styles.containerr}>
      <FontAwesomeIcon name="exclamation-triangle" style={styles.ico} />
        <Text style={styles.titlee}>Overdue Complaints</Text>
        <Text style={styles.statss}>{complaintStats.overdue_status}</Text>
      </View>
      <View style={styles.containerr}>
      <FontAwesomeIcon name="check-circle" style={styles.ico} />
        <Text style={styles.titlee}>Resolved Complaints</Text>
        <Text style={styles.statss}>{complaintStats.resolved_status}</Text>
      </View>
    </View>         
      
        <View style={styles.content}>
        {complaintsData.length === 0 && !loading ? (
  <Text style={styles.noResultsText}>
    <FontAwesomeIcon
      name="exclamation-circle"
      size={20}
      color="black"
    />{' '}
    No results found
  </Text>
) : (
  complaintsData.map((complaint, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => toggleCollapse(index)}
      style={[
        styles.collapsibleHeader,
        getStatusBorderColor(complaint.Status),
      ]}>
      <View style={styles.collapheaderItem}>
        <Text
          style={styles.collapheaderText}>{`Complaint ID: ${complaint['complaint_id']}`}</Text>
        <Text
          style={[
            styles.statusText,
            {color: getStatusColor(complaint.Status)},
          ]}>
          {`Status: ${complaint.status ? complaint.status : 'Pending'}`}
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
            <Text style={styles.labelText}>
              Complaint Type:{' '}
              <Text style={styles.innerlabelText}>
                {complaint['complaint_Type']}
              </Text>
            </Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.labelText}>
              Service Provider:{' '}
              <Text style={styles.innerlabelText}>
                {complaint['service_provider']}
              </Text>
            </Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.labelText}>
              Action: Assigned as Task
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
          onPress={() => {
            if (offset >= complaintsPerPage) {
              setOffset(offset - complaintsPerPage);
            }
          }}
          style={[
            styles.paginationButton,
            offset === 0 ? styles.disabledButton : null,
          ]}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{color: 'black'}}> Page: {offset / complaintsPerPage + 1}</Text>
        <TouchableOpacity
          onPress={() => {
            if (complaintsData.length >= complaintsPerPage) {
              setOffset(offset + complaintsPerPage);
            }
          }}
          style={[
            styles.paginationButton,
            (complaintsData.length < complaintsPerPage || loading) &&
            complaintsData.length !== 0
              ? styles.disabledButton
              : null,
          ]}
          disabled={complaintsData.length < complaintsPerPage || loading}>
          <Icon name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#A00000" />
        </View>
      )}
    </View>
  );
};

const getStatusColor = status => {
  if (!status) {
    return 'black';
  }

  switch (status.toLowerCase()) {
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

const getStatusBorderColor = status => {
  switch (status) {
    case 'pending':
      return {borderRightColor: 'orange', borderLeftColor: 'orange'};
    case 'overdue':
      return {borderRightColor: 'red', borderLeftColor: 'red'};
    case 'resolved':
      return {borderRightColor: 'green', borderLeftColor: 'green'};
    default:
      return {borderRightColor: 'grey', borderLeftColor: 'grey'};
  }
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
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'black',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  paginationButton: {
    backgroundColor: '#A00000',
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 25,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
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
  pendingcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    
    elevation: 5,
    padding: 5,
  
  
  },
  complaintContainer: {
    alignItems: 'center',
  },
  complaintText: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: 'bold', // Adjust as needed
    color: 'black', 
  },
  complaintStat: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black', 
  },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white background
  },
  rowContainerr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  containerr: {
    backgroundColor: 'white', 
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderLeftWidth: 2,
  
  },
  ico: {
    marginBottom: 5,
    color: 'black',
  },
  titlee: {
    fontWeight: 'bold',
    fontSize: 10,
    fontWeight: 'bold', // Adjust as needed
    color: 'black',
  },
  statss: {
    fontSize: 12,
    fontWeight: 'bold', // Adjust as needed
    color: 'maroon',
  },
  loaderContainerr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderr: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default SystemWiseComplaint;
