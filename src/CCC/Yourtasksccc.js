import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Collapsible from 'react-native-collapsible';
import baseUrl from '../Config/url';
import Loader from '../Components/Loader'; // Import Loader component
import syncStorage from 'react-native-sync-storage';

const Yourtasksccc = ({navigation}) => {
  const [tasks, setTasks] = useState([]);
  const [collapsedStates, setCollapsedStates] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const [offset, setOffset] = useState(0); // Add offset state with initial value 0
  const [tasksPerPage, setTasksPerPage] = useState(10); // Define number of tasks per page
  const [CompletedCount, setCompletedCount] = useState(10); // Define number of tasks per page
  const [todoCount, setTodoCount] = useState(10); // Define number of tasks per page
  const [forwardCount, setForwardCount] = useState(10); // Define number of tasks per page
  const [overdueCount, setOverdueCount] = useState(10); // Define number of tasks per page



  useEffect(() => {
    fetchTasks();
    fetchCounts();
  }, [offset]); // Fetch tasks whenever offset changes

  const fetchCounts = async () => {
    try {
      // Retrieve user ID from Sync Storage
      const userId = syncStorage.get('user_detail').id;
  
      const response = await fetch(`${baseUrl}/taskcount/${userId}`);
      const { completed_count, todo_count, forward_count, overdue_count } = await response.json();
      setCompletedCount(completed_count);
      setTodoCount(todo_count);
      setForwardCount(forward_count);
      setOverdueCount(overdue_count);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };
  
  
  const fetchTasks = async () => {
    try {
        const userId = syncStorage.get('user_detail').id;

        const response = await fetch(
            `${baseUrl}/getTotalTaskAssign/${userId}/${offset}`,
        );
        const responseData = await response.json();
        const data = responseData.data; 
        console.log('Task data:', data); // Log 
        if (offset === 0) {
            setTasks(data);
        } else {
            setTasks(prevTasks => [...prevTasks, ...data]);
        }
        setCollapsedStates(new Array(data.length).fill(true));
    } catch (error) {
        console.error('Error fetching tasks:', error);
    } finally {
        setLoading(false); 
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
  return (
    <View style={styles.container}>
   <LinearGradient colors={['#A00000', '#EA2027']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-left"
              size={20}
              color="#fff"
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Assigned Tasks</Text>
        </View>
      </LinearGradient>

      <View style={styles.boxContainer}>
  <View style={styles.box}>
    <View style={[styles.leftColor, { backgroundColor: '#28a745', justifyContent: 'center', alignItems: 'center' }]}>
      <Icon name="check-circle" size={25} color="#fff" />
    </View>
    <View
      style={[
        styles.textContainer,
        {
          marginLeft: '20%',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}>
      <Text style={styles.boxText}>Completed</Text>
      <Text style={styles.boxText}>{CompletedCount}</Text>
    </View>
  </View>
  <View style={styles.box}>
    <View style={[styles.leftColor, { backgroundColor: '#17a2b8', justifyContent: 'center', alignItems: 'center' }]}>
      <Icon name="forward" size={25} color="#fff" />
    </View>
    <View
      style={[
        styles.textContainer,
        {
          marginLeft: '15%',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}>
      <Text style={styles.boxText}>Forward</Text>
      <Text style={styles.boxText}>{forwardCount}</Text>
    </View>
  </View>
</View>


<View style={styles.boxContainer}>
  <View style={styles.box}>
    <View style={[styles.leftColor, { backgroundColor: '#ffc107', justifyContent: 'center', alignItems: 'center' }]}>
      <Icon name="check-square-o" size={25} color="#fff" />
    </View>
    <View
      style={[
        styles.textContainer,
        {
          marginLeft: '15%',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}>
      <Text style={styles.boxText}>To Do</Text>
      {/* <Text style={styles.boxText}>Task</Text> */}
      <Text style={styles.boxText}>{todoCount}</Text>
    </View>
  </View>
  <View style={styles.box}>
    <View style={[styles.leftColor, { backgroundColor: '#dc3545', justifyContent: 'center', alignItems: 'center' }]}>
      <Icon name="exclamation-circle" size={25} color="#fff" />
    </View>
    <View
      style={[
        styles.textContainer,
        {
          marginLeft: '15%',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}>
      <Text style={styles.boxText}>Over Due</Text>

      <Text style={styles.boxText}>{overdueCount}</Text>
    </View>
  </View>
</View>

<View style={styles.headingContainer}>
  <View style={styles.line} />

  <Text style={styles.headingText}>Your Task</Text>
</View>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.content}>
          {loading ? (
            <Loader />
          ) : tasks.length === 0 ? (
            <View style={{alignItems: 'center'}}>
              <Icon
                name="exclamation-circle"
                size={30}
                color="black"
                style={{marginBottom: 10}}
              />
              <Text style={{color: 'black', textAlign: 'center'}}>
                No tasks available
              </Text>
            </View>
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
                    {/* <View style={styles.iconRowContainer}> */}
                    <View style={styles.separator} />
                    <TouchableOpacity
                      style={[
                        styles.buttonContainer,
                        {backgroundColor: '#8b0000'},
                      ]}
                      onPress={() => {
                        // Handle button press
                      }}>
                      <Text style={styles.buttonText}>View Details</Text>
                      <Icon
                        name="info-circle"
                        size={15}
                        color="white"
                        style={styles.icon}
                      />
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
  headingContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  headingText: {
    fontSize: 20, // Increase font size for emphasis
    fontWeight: 'bold',
    color: '#333333', // Darker color for better contrast
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Add a subtle text shadow
    textShadowOffset: { width: 1, height: 1 }, // Offset for the text shadow
    textShadowRadius: 2, // Blur radius for the text shadow
    letterSpacing: 1, // Add letter spacing for better readability
    marginBottom: 10, // Increase bottom margin for separation
  },  
  line: {
    height: 1,
    width: '80%', // Adjust width as needed
    backgroundColor: '#D3D3D3', // Adjust color as needed
    marginBottom: 10,
  },
    
  boxContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  box: {
    width: '45%', // Adjust width as needed
    height: 80, // Adjust height as needed
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  leftColor: {
    position: 'absolute',
    left: 5,
    top: 5,
    bottom: 5,
    width: '35%', // Half of the box width
    backgroundColor: 'lightblue', // Example background color
    borderRadius: 8,
    // borderBottomLeftRadius: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  content: {
    flex: 1,
    paddingHorizontal: '5%',
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
    backgroundColor: '#494848',
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
export default Yourtasksccc;
