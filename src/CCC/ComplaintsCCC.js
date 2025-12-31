import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import baseUrl from '../Config/url';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Collapsible from 'react-native-collapsible';
import Loader from '../Components/Loader';
import syncStorage from 'react-native-sync-storage';

const ComplaintsCCC = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEllipsis, setIsEllipsis] = useState(true);
  const [collapsedStates, setCollapsedStates] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tasksPerPage, setTasksPerPage] = useState(10);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints(true);
  };

  useEffect(() => {
    fetchComplaints();
  }, [offset]);

  const fetchComplaints = async (isRefreshing = false) => {
    setLoading(true);
    try {
      const userId = syncStorage.get('user_detail').id;
      const response = await fetch(`${baseUrl}/ccccomplaintsas/${userId}/${offset}`);
      const responseData = await response.json();
      const data = responseData;

      if (offset === 0 || isRefreshing) {
        setTasks(data);
      } else {
        setTasks((prevTasks) => [...prevTasks, ...data]);
      }
      setCollapsedStates(new Array(data.length).fill(true));
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleCollapse = (index) => {
    const newCollapsedStates = [...collapsedStates];
    newCollapsedStates[index] = !newCollapsedStates[index];
    setCollapsedStates(newCollapsedStates);
  };

  const navigateToAssignedTask = () => {
    navigation.navigate('Assignedtasksccc');
  };
  const goToNextPage = () => {
    if (complaints.length === tasksPerPage) {
      setOffset(prevOffset => prevOffset + tasksPerPage);
    }
  };

  const goToPreviousPage = () => {
    if (offset >= tasksPerPage) {
      setOffset(prevOffset => prevOffset - tasksPerPage);
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.container}>
        <LinearGradient colors={['#A00000', '#EA2027']}>
          <View style={styles.header}>
            <View style={[styles.headerTextContainer, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="building" size={22} color="#fff" style={styles.icon} />
                <Text style={styles.headerText}>Assigned Complaints</Text>
              </View>
              <TouchableOpacity onPress={navigateToAssignedTask}>
                <Text style={styles.additionalText}>Your Complaints Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.content}>
          {loading ? (
            <Loader />
          ) : complaints.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <Icon name="exclamation-circle" size={30} color="grey" style={{ marginBottom: 10 }} />
              <Text style={{ color: 'grey', textAlign: 'center' }}>No Assigned Complaints</Text>
            </View>
          ) : (
            complaints.map((complaint, index) => (
              <TouchableOpacity
                key={complaint.id}
                onPress={() => toggleCollapse(index)}
                style={styles.collapsibleHeader}
              >
                <View style={styles.collapheaderItem}>
                  <Text style={styles.collapheaderText}>Complaint No: {complaint.id}</Text>
                  <Text
                    style={[
                      styles.collapheaderText,
                      { color: complaint.status === 'resolved' ? 'red' : 'black' },
                    ]}
                  >
                    {complaint.status === 'resolved' ? 'Closed' : complaint.status}
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
                        Assigned To: <Text style={styles.innerlabelText}>{complaint.name}</Text>
                      </Text>
                    </View>
                    <View style={styles.rowContainer}>
                      <Text style={styles.labelText}>
                        Task title: <Text style={styles.innerlabelText}>{complaint.taskTitle}</Text>
                      </Text>
                    </View>
                    <View style={styles.rowContainer}>
                      <Text style={styles.labelText}>
                        Priority: <Text style={styles.innerlabelText}>{complaint.priority}</Text>
                      </Text>
                    </View>
                    <View style={styles.actionButtonContainer}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                          navigation.navigate('Cccaction', {
                            complaint: complaint,
                          })
                        }
                      >
                        <Text style={styles.actionButtonText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Collapsible>
              </TouchableOpacity>
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
        <Text style={{color: 'black'}}>
          {' '}
          Page: {Math.floor(offset / tasksPerPage) + 1}
        </Text>
        <TouchableOpacity
          onPress={goToNextPage}
          style={[
            styles.paginationButton,
            (tasks.length < tasksPerPage || loading) && complaints.length !== 0
              ? styles.disabledButton
              : null,
          ]}
          disabled={complaints.length < tasksPerPage || loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="arrow-right" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  swipebutton: {
    marginTop: '5%',
  },
  actionButtonContainer: {
    alignItems: 'center',
    marginBottom: 1,
  },
  actionButton: {
    backgroundColor: '#027148',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  registerFormTextInput: {
    flex: 1,
    color: 'black',
    borderWidth: 0.5,
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 40,
    borderColor: 'gray',
  },
  assignButton: {
    backgroundColor: '#CD1D0C',
    paddingHorizontal: '40%',
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  assignButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  additionalText: {
    fontSize: 10,
    color: '#fff',
    marginLeft: '15%',
  },
  taskDescription: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 0.5,
    paddingHorizontal: 10,
  },
  datepicker: {
    height: 48,
    backgroundColor: '#ffffff',
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingHorizontal: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
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
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
  content: {
    flex: 1,
    padding: '5%',
  },
  separator: {
    height: 0.5,
    backgroundColor: 'grey',
    marginVertical: 15,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'center', // Align button to the start of the container
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    // fontWeight: 'bold',
  },
  icon: {
    marginLeft: 5, // Add some margin to separate the icon from the text
  },
  dropdowntext: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginVertical: 10,
  },
  placeholderStyle: {
    color: 'grey',
    fontSize: 14,
    margin: 2,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  inputSearchStyle: {
    color: 'black',
  },
  itemTextStyle: {
    color: 'black',
  },
  textInputContainer: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    height: 45,
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#000',
  },
  radioContainer: {
    marginTop: 10,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 5,
    color: '#555',
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
    // borderLeftWidth: 2,
  },
  designationText: {
    fontSize: 12,
    color: 'gray',
  },

  collapheaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
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

  userInfoContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  collapheaderText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  dropdownIcon: {
    marginLeft: 10,
    top: 10,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginLeft: 5,
  },
  timeleftText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginLeft: 5,
  },
  priorityText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginLeft: 5,
  },
  collapsibleContent: {
    marginTop: '2%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText: {
    marginRight: 20,
    fontWeight: '600',
    fontSize: 12,
    color: 'black',
  },
  iconRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
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
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
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

export default ComplaintsCCC;
