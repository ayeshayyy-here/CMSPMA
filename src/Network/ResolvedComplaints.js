//Diplaying Not process yet complaints here
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

const Networknew = ({navigation}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEllipsis, setIsEllipsis] = useState(true);
  const [collapsedStates, setCollapsedStates] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [tasksPerPage, setTasksPerPage] = useState(20); 
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
    setRefreshing(false);
  };
  useEffect(() => {
    fetchComplaints();
  }, [offset]);

  const fetchComplaints = async () => {
    setLoading(true);

    try {
      const userName = syncStorage.get('user_detail').name;
      const response = await fetch(
        `https://complaint-pma.punjab.gov.pk/api/resolvedcomp/${userName}/${offset}`,
      );
      const data = await response.json();

      const filteredComplaints = data.filter(complaint => complaint.status);
      setComplaints(filteredComplaints);

      const initialCollapsedStates = new Array(filteredComplaints.length).fill(
        true,
      );
      setCollapsedStates(initialCollapsedStates);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setIsEllipsis(!isEllipsis); // Toggle between ellipsis and cross button
  };

  const toggleCollapse = index => {
    const newCollapsedStates = [...collapsedStates];
    newCollapsedStates[index] = !newCollapsedStates[index];
    setCollapsedStates(newCollapsedStates);
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
    <View style={styles.container}>
      <Header
        title="CMS| Network"
        isEllipsis={isEllipsis}
        onToggleModal={toggleModal}
      />
      <ModalContent isVisible={isModalVisible} toggleModal={toggleModal} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
        <Text style={styles.heading}>Resolved Complaints</Text>
        <View style={styles.content}>
          {loading ? (
            <Loadernetwork />
          ) : (
            complaints.map((complaint, index) => (
              <TouchableOpacity
                key={complaint.id}
                onPress={() => toggleCollapse(index)}
                style={styles.collapsibleHeader}>
                <View style={styles.collapheaderItem}>
                  <Text style={styles.collapheaderText}>
                    Complaint No: {complaint.id}
                  </Text>
                  <Text
                    style={[
                      styles.collapheaderText,
                      {
                        color:
                          complaint.status === 'resolved' ? 'red' : 'black',
                      },
                    ]}>
                    {complaint.status === 'resolved'
                      ? 'Closed'
                      : complaint.status}
                  </Text>

                  {/* <Text
                    style={[
                      styles.innerlabelText,
                      {color: complaint.status ? 'black' : 'red'},
                    ]}>
                    {complaint.status
                      ? complaint.complaint_type
                      : 'Not Process Yet'}
                  </Text> */}
                  <Icon
                    name={
                      collapsedStates[index] ? 'chevron-down' : 'chevron-up'
                    }
                    size={12}
                    color="#666"
                  />
                </View>
                <Collapsible collapsed={collapsedStates[index]}>
                  <View style={styles.collapsibleContent}>
                    <View style={styles.rowContainer}>
                      <Text style={styles.labelText}>
                        Category Name:{' '}
                        <Text style={styles.innerlabelText}>
                          {complaint.category_name}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.rowContainer}>
                      <Text style={styles.labelText}>
                        Reg Date:{' '}
                        <Text style={styles.innerlabelText}>
                          {complaint.reg_date}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.actionButtonContainer}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                          navigation.navigate('ResolvedNetworkViewDetails', {
                            complaint: complaint,
                          })
                        }>
                        <Text style={styles.actionButtonText}>
                          View Details
                        </Text>
                      </TouchableOpacity>
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
            (complaints.length < tasksPerPage || loading) && complaints.length !== 0
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


export default Networknew;
