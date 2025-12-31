import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Collapsible from 'react-native-collapsible';
import baseUrl from '../Config/url';
import Loader from '../Components/Loader'; // Import Loader component
import syncStorage from 'react-native-sync-storage';

const Queries = ({navigation}) => {
  const [queries, setQueries] = useState([]);
  const [collapsedStates, setCollapsedStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [queriesPerPage, setQueriesPerPage] = useState(10);

  useEffect(() => {
    fetchQueries();
  }, [offset]);

  const fetchQueries = async () => {
    try {
      const userId = syncStorage.get('user_detail').id;
      const response = await fetch(
        `https://complaint-pma.punjab.gov.pk/api/totalqueriesassign/${userId}/${offset}`,
      );
      const data = await response.json();
      if (offset === 0) {
        setQueries(data);
      } else {
        setQueries(prevQueries => [...prevQueries, ...data]);
      }
      setCollapsedStates(new Array(data.length).fill(true));

      // Console log the fetched data
      console.log(data);
    } catch (error) {
      console.error('Error fetching queries:', error);
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
  const onRefresh = () => {
    setRefreshing(true);
    fetchQueries();
    setRefreshing(false);
  };
  const goToNextPage = () => {
    if (queries.length === queriesPerPage) {
      setOffset(prevOffset => prevOffset + queriesPerPage);
    }
  };

  const goToPreviousPage = () => {
    if (offset >= queriesPerPage) {
      setOffset(prevOffset => prevOffset - queriesPerPage);
    }
  };
  const navigateToDetails = (query) => {
    navigation.navigate('QueryDetails', { query });
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
          <Text style={styles.headerText}>Queries</Text>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.content}>
          {loading ? (
            <Loader />
          ) : (
            queries.map((query, index) => (
              <TouchableOpacity
                key={query.id}
                onPress={() => toggleCollapse(index)}
                style={styles.collapsibleHeader}>
                <View style={styles.collapheaderItem}>
                  {/* <View style={styles.userIconContainer}>
                    <Icon name="user" size={20} color="gray" />
                  </View> */}
                  <View style={styles.userInfoContainer}>
                    <Text style={styles.collapheaderText}>
                     
                      <Text style={{fontSize: 14, color: 'black'}}>
                        Query From |  {query.name} {'  '}
                      </Text>
                      <Text style={{color: getStatusColor(query.status)}}>
                        {query.status}
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
                    Status:{' '}
                    <Text
                      style={{color: query.reply === null ? 'blue' : 'green'}}>
                      {query.reply === null ? 'In Process' : 'Done'}
                    </Text>
                  </Text>
                </View>

                <Collapsible collapsed={collapsedStates[index]}>
                  <View style={styles.collapsibleContent}>
                    <View style={styles.rowContainer}>
                      <Text style={styles.labelText}>
                        Query Description:{' '}
                        <Text style={{color: 'gray'}}>{query.description}</Text>
                      </Text>
                    </View>
                    <View style={styles.rowContainer}>
                      <Text style={styles.labelText}>
                        Query Date:{' '}
                        <Text style={{color: 'gray'}}>{query.dateTime}</Text>
                      </Text>
                    </View>

                    <View style={styles.separator} />
                    <TouchableOpacity
                  style={[styles.buttonContainer, { backgroundColor: '#8b0000' }]}
                  onPress={() => navigateToDetails(query)}>
                  <Text style={styles.buttonText}>View Details</Text>
                  <Icon
                    name="info-circle"
                    size={15}
                    color="white"
                    style={styles.icon}
                  />
                </TouchableOpacity>
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
          Page: {Math.floor(offset / queriesPerPage) + 1}
        </Text>
        <TouchableOpacity
          onPress={goToNextPage}
          style={[
            styles.paginationButton,
            (queries.length < queriesPerPage || loading) && queries.length !== 0
              ? styles.disabledButton
              : null,
          ]}
          disabled={queries.length < queriesPerPage || loading}>
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
    color: 'black',
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
export default Queries;
