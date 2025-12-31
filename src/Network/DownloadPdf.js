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
import Header from '../Components/Header';
import ModalContent from '../Components/ModalContent';
import Collapsible from 'react-native-collapsible';
import Loadernetwork from '../Components/Loadernetwork';
import syncStorage from 'react-native-sync-storage';
import baseUrl from '../Config/url';

const DownloadPdf = ({route, navigation}) => {
  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints' or 'tasks'
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEllipsis, setIsEllipsis] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefreshc = () => {
    setRefreshing(true);
    fetchComplaints();
    setRefreshing(false);
  };
  const onRefresht = () => {
    setRefreshing(true);
    fetchTasks();
    setRefreshing(false);
  };
  useEffect(() => {
    fetchTasks();
  }, [offset]); // Fetch tasks whenever offset changes

  const fetchTasks = async () => {
    setLoading(true); // Set loading state to true at the start of fetch

    try {
      // Retrieve user ID from Sync Storage
      const userId = syncStorage.get('user_detail').id;

      // Make the fetch request with the user ID and offset
      const response = await fetch(
        `https://complaint-pma.punjab.gov.pk/api/getTotalTaskAssign/${userId}/${offset}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const responseData = await response.json();

      // Check if the response contains a 'data' property
      if (responseData && responseData.data) {
        const tasksData = responseData.data;

        if (offset === 0) {
          // If offset is 0, replace tasks data
          setTasks(tasksData);
        } else {
          // If offset is not 0, append new tasks data
          setTasks(prevTasks => [...prevTasks, ...tasksData]);
        }
        setCollapsedStates(new Array(tasksData.length).fill(true));
      } else {
        console.error(
          'Invalid response format. Missing data property:',
          responseData,
        );
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false); // Set loading state to false after fetch (whether it succeeded or failed)
    }
  };
 
  

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setIsEllipsis(!isEllipsis); // Toggle between ellipsis and cross button
  };
// complaints 

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsedStates, setCollapsedStates] = useState([]);
  const [offset, setOffset] = useState(0);
  const tasksPerPage = 10; // Assuming a fixed number of tasks per page

  useEffect(() => {
    fetchComplaints();
  }, [offset]);

  const fetchComplaints = async () => {
    setLoading(true);
    
    try {
      const serviceProvider = syncStorage.get('user_detail').name;
      console.log('serviceProvider:', serviceProvider); // Proper log statement
      
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/compdownloadpdf/${serviceProvider}/${offset}`);
      const data = await response.json();
      console.log('API response:', data);
  
      // Check if the response has a complains key and it's an array
      if (data && Array.isArray(data.complains)) {
        setComplaints(data.complains);
  
        const initialCollapsedStates = new Array(data.complains.length).fill(true);
        setCollapsedStates(initialCollapsedStates);
      } else {
        console.error('Unexpected data structure:', data);
        // Handle unexpected data structure
        setComplaints([]);
        setCollapsedStates([]);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const toggleCollapse = (index) => {
    const newCollapsedStates = [...collapsedStates];
    newCollapsedStates[index] = !newCollapsedStates[index];
    setCollapsedStates(newCollapsedStates);
  };

  const goToPreviousPagec = () => {
    if (offset > 0) {
      setOffset(offset - tasksPerPage);
    }
  };

  const goToNextPagec = () => {
    if (complaints.length === tasksPerPage) {
      setOffset(offset + tasksPerPage);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'red';
      case 'inProcess':
        return 'orange';
      case 'resolved':
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
  const switchTab = tab => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <Header
        title="CMS| Network"
        isEllipsis={isEllipsis}
        onToggleModal={toggleModal}
      />
      <ModalContent isVisible={isModalVisible} toggleModal={toggleModal} />
      <View style={styles.tabButtons}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'complaints' && styles.activeTab,
          ]}
          onPress={() => switchTab('complaints')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'complaints' && styles.activeTabText,
            ]}>
            All Complaints Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'tasks' && styles.activeTab]}
          onPress={() => switchTab('tasks')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'tasks' && styles.activeTabText,
            ]}>
            All Tasks Data
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab content */}
      <View style={styles.tabContent}>
      {activeTab === 'complaints' && (
     <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefreshc} />
    }>
     <View style={styles.content}>
       {loading ? (
         <Loadernetwork />
       ) : (
         complaints.map((complaint, index) => (
           <TouchableOpacity
             key={complaint.id}
             onPress={() => toggleCollapse(index)}
             style={styles.collapsibleHeader}
           >
             <View style={styles.collapheaderItem}>
               <Text style={styles.collapheaderText}>
                 Complaint No: {complaint.id}
               </Text>
               <Text
  style={[
    styles.collapheaderText,
    { color: getStatusColor(complaint.status) }  // Ensure proper nesting of the style object
  ]}
>
  {complaint.status}
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
                     Applicant Contact: <Text style={styles.innerlabelText}>{complaint.phoneno}</Text>
                   </Text>
                 </View>
                 <View style={styles.rowContainer}>
                   <Text style={styles.labelText}>
                     Service Provider: <Text style={styles.innerlabelText}>{complaint.service_provider_name}</Text>
                   </Text>
                 </View>
                 <View style={styles.rowContainer}>
                   <Text style={styles.labelText}>
                     Source: <Text style={styles.innerlabelText}>{complaint.source}</Text>
                   </Text>
                 </View>
                 <View style={styles.rowContainer}>
                 <Text style={styles.labelText}>
                     Reg Date: <Text style={styles.innerlabelText}>{complaint.reg_date}</Text>
                   </Text>
                 </View>
                 <View style={styles.rowContainer}>
                 <Text style={styles.labelText}>
                     Description: <Text style={styles.innerlabelText}>{complaint.description}</Text>
                   </Text>
                 </View>
                 <View style={styles.rowContainer}>
                   <Text style={styles.labelText}>
                     Picture: <Text style={styles.innerlabelText}>{complaint.complain_pic}</Text>
                   </Text>
                 </View>
               </View>
             </Collapsible>
           </TouchableOpacity>
         ))
       )}
     </View>
     <View style={styles.paginationContainer}>
       <TouchableOpacity
         onPress={goToPreviousPagec}
         style={[styles.paginationButton, offset === 0 ? styles.disabledButton : null]}
       >
         <Icon name="arrow-left" size={20} color="#fff" />
       </TouchableOpacity>
       <Text style={{ color: 'black' }}>
         Page: {Math.floor(offset / tasksPerPage) + 1}
       </Text>
       <TouchableOpacity
         onPress={goToNextPagec}
         style={[
           styles.paginationButton,
           (complaints.length < tasksPerPage || loading) && complaints.length !== 0
             ? styles.disabledButton
             : null
         ]}
         disabled={complaints.length < tasksPerPage || loading}
       >
         {loading ? (
           <ActivityIndicator size="small" color="#fff" />
         ) : (
           <Icon name="arrow-right" size={20} color="#fff" />
         )}
       </TouchableOpacity>
     </View>
   </ScrollView>
   
)}

        {activeTab === 'tasks' && (
          <ScrollView contentContainerStyle={{flexGrow: 1}} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresht} />
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
                    {/* Collapsible content */}
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

                    {/* Status and priority */}
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

                    {/* Collapsible content */}
                    <Collapsible collapsed={collapsedStates[index]}>
                      <View style={styles.collapsibleContent}>
                        {/* Task details */}
                        <View style={styles.rowContainer}>
                          <Text style={styles.labelText}>
                            Task Title:{' '}
                            <Text style={{color: 'gray'}}>
                              {task.taskTitle}
                            </Text>
                          </Text>
                        </View>
                        <View style={styles.rowContainer}>
                          <Text style={styles.labelText}>
                            Task Description:{' '}
                            <Text style={{color: 'gray'}}>
                              {task.description}
                            </Text>
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
          </ScrollView>
        )}

        {/* Pagination */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 10,
  },
  tabButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: '5%',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  activeTab: {
    borderBottomColor: '#357CA5', // Change color for active tab
  },
  tabButtonText: {
    fontSize: 16,
    color: 'grey',
  },
  activeTabText: {
    color: '#357CA5', // Change color for active tab text
  },
  tabContent: {
    flex: 1,
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

export default DownloadPdf;
