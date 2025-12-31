import React, {useState, useEffect} from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Collapsible from 'react-native-collapsible';
import Loader from '../Components/Loader';
const Cccveco = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { subcategoryId, categoryId, subcategoryName } = route.params;
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
     
      const response = await fetch(
        `https://complaint-pma.punjab.gov.pk/api/cccveco/${categoryId}/${subcategoryId}/${offset}`,
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
      <LinearGradient colors={['#A00000', '#EA2027']} style={styles.gradient}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon name="arrow-left" size={20} color="white" style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{subcategoryName}</Text>
          </View>
          <TouchableOpacity style={styles.additionalContainer}>
            <Text style={styles.headerTextt}></Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      {/* <View style={styles.content}>
        <Text style={styles.text}>Subcategory ID: {subcategoryId}</Text>
        <Text style={styles.text}>Category ID: {categoryId}</Text>
        <Text style={styles.text}>Subcategory Name: {subcategoryName}</Text>
      </View> */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      
        <View style={styles.content}>
          {loading ? (
            <Loader />
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
                          complaint.status === 'pending' ||
                          complaint.status === 'in process'
                            ? 'skyblue'
                            : 'black',
                      },
                    ]}>
                    {complaint.status === 'pending' ||
                    complaint.status === 'in process'
                      ? 'In Process'
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
                          navigation.navigate('NetworkViewDetails', {
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
  gradient: {
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerTextt: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: '25%',
  },
  icon: {
    marginRight: 10,
  },
  content: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
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


export default Cccveco;
