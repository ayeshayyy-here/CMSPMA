import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Collapsible from 'react-native-collapsible';
import baseUrl from '../Config/url';
import Loadernetwork from '../Components/Loadernetwork'; // Import Loader component
import syncStorage from 'react-native-sync-storage';
import ModalContent from '../Components/ModalContent';
import Header from '../Components/Header';
const Getalltask = ({navigation}) => {
  const [tasks, setTasks] = useState([]);
  const [collapsedStates, setCollapsedStates] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const [offset, setOffset] = useState(0); // Add offset state with initial value 0
  const [tasksPerPage, setTasksPerPage] = useState(10); // Define number of tasks per page
  const [isEllipsis, setIsEllipsis] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [offset]); // Fetch tasks whenever offset changes

  const fetchTasks = async () => {
    try {
      // Retrieve user ID from Sync Storage
      const userId = syncStorage.get('user_detail').id;

      // Make the fetch request with the user ID and offset
      const response = await fetch(
        `${baseUrl}/getalltasks/${userId}/${offset}`,
      );
      const data = await response.json();
      if (offset === 0) {
        // If offset is 0, replace tasks data
        setTasks(data);
      } else {
        // If offset is not 0, append new tasks data
        setTasks(prevTasks => [...prevTasks, ...data]);
      }
      setCollapsedStates(new Array(data.length).fill(true));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching tasks
    }
  };

  const toggleCollapse = index => {
    const newCollapsedStates = [...collapsedStates];
    newCollapsedStates[index] = !newCollapsedStates[index];
    setCollapsedStates(newCollapsedStates);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'red';
      case 'Completed':
        return 'orange';
      case 'forward':
        return 'green';
      default:
        return 'black';
    }
  };

  const goToNextPage = () => {
    if (tasks.length === tasksPerPage) {
      setOffset(prevOffset => prevOffset + tasksPerPage);
    }
  };

  const goToPreviousPage = () => {
    if (offset >= tasksPerPage) {
      setOffset(prevOffset => prevOffset - tasksPerPage);
    }
  };
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setIsEllipsis(!isEllipsis); // Toggle between ellipsis and cross button
  };
  return (
    <View style={styles.container}>
    <Header
      title="CMS| Network"
      isEllipsis={isEllipsis}
      onToggleModal={toggleModal}
    />
    <ModalContent isVisible={isModalVisible} toggleModal={toggleModal} />
    
    <Text style={styles.heading}>Assigned Task</Text>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
        <View style={styles.content}>
          {loading ? (
            <Loadernetwork />
          ) : (
            tasks.map((task, index) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => toggleCollapse(index)}
                style={styles.collapsibleHeader}>
                <View style={styles.collapheaderItem}>
                  <View style={styles.userIconContainer}>
                    <Icon name="user" size={20} color="gray" />
                  </View>
                  <View style={styles.userInfoContainer}>
                    <Text style={styles.collapheaderText}>
                      {task.name} {'  '}
                      <Text style={{fontSize: 12, color: 'grey'}}>
                        Status |&nbsp;
                      </Text>
                      <Text style={{color: getStatusColor(task.status)}}>
                        {task.status}
                      </Text>
                    </Text>
                  </View>
                  <Icon
                    name={
                      collapsedStates[index] ? 'chevron-down' : 'chevron-up'
                    }
                    size={10}
                    color="gray"
                    style={styles.dropdownIcon}
                  />
                </View>

                <View style={styles.statusContainer}>
                  <Text style={styles.timeleftText}>
                    Time Left : {task.timeLeft}
                    {task.timeLeft ? (
                      <Icon name="arrow-up" size={12} color="green" />
                    ) : (
                      <Icon name="arrow-down" size={12} color="red" />
                    )}
                  </Text>
                  <Text style={styles.priorityText}>
                    Priority: {task.priority}
                  </Text>
                </View>
                <Collapsible collapsed={collapsedStates[index]}>
                  <View style={styles.collapsibleContent}>
                    <View style={styles.rowContainer}>
                      <Text style={styles.labelText}>
                        Task Title:{' '}
                        <Text style={{color: 'gray'}}>{task.taskTitle}</Text>
                      </Text>
                    </View>
                    <View style={styles.rowContainer}>
                      <Text style={styles.labelText}>
                        Task Description:{' '}
                        <Text style={{color: 'gray'}}>{task.description}</Text>
                      </Text>
                    </View>
                    <View style={styles.rowContainer}>
                      <Text style={styles.labelText}>
                        Assign Date:{' '}
                        <Text style={{color: 'gray'}}>{task.dateTime}</Text>
                      </Text>
                    </View>
                    <View style={styles.rowContainer}>
                      <Text style={styles.labelText}>
                        End Date:{' '}
                        <Text style={{color: 'gray'}}>{task.dateTime}</Text>
                      </Text>
                    </View>
                    <View style={styles.rowContainer}>
                      <Text style={styles.labelText}>Assign Date:</Text>
                    </View>
                    {/* <View style={styles.iconRowContainer}> */}
                    <View style={styles.separator} />
                    <TouchableOpacity
  style={[styles.buttonContainer, {backgroundColor: '#8b0000'}]}
  onPress={() => {
    navigation.navigate('Assignedviewdetail', { task }); // Pass the 'task' object as route parameter
  }}>
  <Text style={styles.buttonText}>View Details</Text>
  <Icon name="info-circle" size={15} color="white" style={styles.icon} />
</TouchableOpacity>


                    {/* <View style={styles.iconContainer}>
                        <Icon name="comment" size={15} color="#CD1D0C" />
                        <Text style={styles.iconText}>
                          Query for Assistance
                        </Text>
                      </View> */}
                    {/* </View> */}
                  </View>
                </Collapsible>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      {/* Pagination */}
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
            (tasks.length < tasksPerPage || loading) && tasks.length !== 0
              ? styles.disabledButton
              : null,
          ]}
          disabled={tasks.length < tasksPerPage || loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="arrow-right" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
        marginTop: 10,
      },
      content: {
        flex: 1,
        padding: '5%',
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
    backgroundColor: '#357CA5',
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
export default Getalltask;
