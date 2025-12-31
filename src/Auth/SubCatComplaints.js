import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Components/Loader';

const SubCatComplaints = ({route, navigation}) => {
  const {subcategoryId} = route.params; // Retrieve subcategoryId from route params
  const [complaints, setComplaints] = useState([]);
  const [offset, setOffset] = useState(0);
  const [collapsedStates, setCollapsedStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  const complaintsPerPage = 20;

  useEffect(() => {
    fetchComplaintsData();
  }, [offset]);

  const fetchComplaintsData = async () => {
    try {
      const response = await fetch(
        `https://complaint-pma.punjab.gov.pk/api/complaintDetail/${subcategoryId}/${offset}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }
      const data = await response.json();
      // console.log(data);
      setComplaints(data.compalin_detail);
      setCollapsedStates(new Array(data.compalin_detail.length).fill(true));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setLoading(false);
    }
  };

  const toggleCollapse = index => {
    const newCollapsedStates = [...collapsedStates];
    newCollapsedStates[index] = !newCollapsedStates[index];
    setCollapsedStates(newCollapsedStates);
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
        return {borderRightColor: 'grey', borderLeftColor: 'grey'}; // Default border color
    }
  };
  const onRefresh = () => {
    setRefreshing(true); // Set refreshing to true when refreshing starts
    fetchComplaintsData(); // Fetch new data
    setRefreshing(false); // Set refreshing to false when refreshing ends
  };
  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'overdue':
        return 'red';
      case 'resolved':
        return 'green';
      case 'RESOLVED':
        return 'green';
      default:
        return 'black';
    }
  };
  const goToNextPage = () => {
    if (complaints.length === complaintsPerPage) {
      setOffset(prevOffset => prevOffset + complaintsPerPage);
    }
  };

  const goToPreviousPage = () => {
    if (offset >= complaintsPerPage) {
      setOffset(prevOffset => prevOffset - complaintsPerPage);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#A00000', '#EA2027']}>
        <View style={styles.header}>
          <View
            style={[
              styles.headerTextContainer,
              {justifyContent: 'space-between'},
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon
                  name="arrow-left"
                  size={20}
                  color="white"
                  style={styles.icon}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Sub Categories Complaints</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      {loading ? (
        <Loader /> // Show loader when data is being loaded
      ) : (
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.content}>
            {complaints.length === 0 ? (
              <Text style={styles.noDataText}>No Complaints</Text>
            ) : (
              complaints.map((complaint, index) => (
                // <View>
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleCollapse(index)}
                  style={[
                    styles.collapsibleHeader,
                    getStatusBorderColor(complaint.status), // Apply dynamic border colors
                  ]}>
                  <View style={styles.collapheaderItem}>
                    <Text
                      style={
                        styles.collapheaderText
                      }>{`Complaint ID: ${complaint.id}`}</Text>
                    <Text
                      style={[
                        styles.statusText,
                        {color: getStatusColor(complaint.status)},
                      ]}>{`Status: ${complaint.status}`}</Text>
                    <Icon
                      name={
                        collapsedStates[index] ? 'chevron-down' : 'chevron-up'
                      }
                      size={12}
                      color="#666"
                    />
                  </View>
                  <Collapsible collapsed={collapsedStates[index]}>
                    <View
                      style={[styles.collapsibleContent, {marginBottom: 10}]}>
                      <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>
                          Complaint Type:{' '}
                          <Text style={styles.innerlabelText}>
                            {complaint.complaint_type}
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>
                          Complaint Details:{' '}
                          <Text style={styles.innerlabelText}>
                            {complaint.complaint_details}
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>
                          Service Provider:
                          <Text style={styles.innerlabelText}>
                            {' '}
                            {complaint.service_provider_name}
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.rowContainer}>
                        <Text style={styles.labelText}>
                          Picture: {complaint.complain_pic}
                        </Text>
                      </View>
                      {/* Add grey line separator */}
                      <View style={styles.separator} />
                      <TouchableOpacity
                        style={styles.iconTouchableOpacity}
                        onPress={() => {
                          navigation.navigate('NewTaskmddash', {
                            complaintId: complaint.id,
                          });
                        }}>
                        <Icon name="edit" size={25} color="#CD1D0C" />
                        <Text style={styles.iconText}>Assign as a Task</Text>
                      </TouchableOpacity>
                    </View>
                  </Collapsible>
                </TouchableOpacity>
                // </View>
              ))
            )}
          </View>
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={goToPreviousPage}
              style={[
                styles.paginationButton,
                offset === 0 ? styles.disabledButton : null,
              ]}>
              <Icon name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={{color: 'black'}}> Page: {offset / 20 + 1}</Text>
            <TouchableOpacity
              onPress={goToNextPage}
              style={[
                styles.paginationButton,
                complaints.length < complaintsPerPage || complaints.length === 0
                  ? styles.disabledButton
                  : null,
              ]}>
              <Icon name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#A00000" />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  noDataText: {
    color: 'grey',
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 0.5,
    backgroundColor: 'grey',
    marginVertical: 15,
    width: '100%',
  },

  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginLeft: '4%',
  },
  scrollView: {
    flex: 1,
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
    // borderRightWidth: 2,
  },
  collapsibleContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden', // Ensure border radius works as expected
  },
  collapsibleTab: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  collapheaderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  collapheaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: '5%',
  },
  iconTouchableOpacity: {
    justifyContent: 'center', // Center items horizontally
    alignItems: 'center', // Center items vertically
  },
  iconContainer: {
    width: 50,
    height: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconText: {
    fontSize: 10,
    color: 'gray',
    textAlign: 'center',
  },
  collapsibleContent: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
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
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
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
    backgroundColor: '#CCC', // Change background color to grey
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});

export default SubCatComplaints;
