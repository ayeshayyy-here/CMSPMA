import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Collapsible from 'react-native-collapsible';
import baseUrl from '../Config/url';
import Loader from '../Components/Loader'; // Import Loader component
import syncStorage from 'react-native-sync-storage';

const AssignedTaskccc = ({navigation}) => {
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [collapsedStates, setCollapsedStates] = useState([]);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const userId = syncStorage.get('user_detail').id;
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/getalltasks/${userId}?page=${currentPage}&limit=${itemsPerPage}`);
      const responseData = await response.json();
      setTotalPages(Math.ceil(responseData.metadata.total / itemsPerPage));
      setItems(responseData.results);
      setCollapsedStates(new Array(responseData.results.length).fill(true));
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      console.log(error);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
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
        return 'red';
      case 'Completed':
        return 'orange';
      case 'forward':
        return 'green';
      default:
        return 'black';
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.content}>
          <TouchableOpacity
            key={item.id}
            onPress={() => toggleCollapse(index)}
            style={styles.collapsibleHeader}>
            <View style={styles.collapheaderItem}>
              <View style={styles.userIconContainer}>
                <Icon name="user" size={20} color="gray" />
              </View>
              <View style={styles.userInfoContainer}>
                <Text style={styles.collapheaderText}>
                  {item.name} {'  '}
                  <Text style={{fontSize: 12, color: 'grey'}}>
                    Status |&nbsp;
                  </Text>
                  <Text style={{color: getStatusColor(item.status), fontSize: 12,}}>
                    {item.status}
                  </Text>
                </Text>
              </View>
              <Icon
                name={collapsedStates[index] ? 'chevron-down' : 'chevron-up'}
                size={10}
                color="gray"
                style={styles.dropdownIcon}
              />
            </View>

            <View style={styles.statusContainer}>
              <Text style={styles.timeleftText}>
                Time Left : {item.timeLeft}
                {item.timeLeft ? (
                  <Icon name="arrow-up" size={12} color="green" />
                ) : (
                  <Icon name="arrow-down" size={12} color="red" />
                )}
              </Text>
              <Text style={styles.priorityText}>
                Priority: {item.priority}
              </Text>
            </View>
            <Collapsible collapsed={collapsedStates[index]}>
              <View style={styles.collapsibleContent}>
                <View style={styles.rowContainer}>
                  <Text style={styles.labelText}>
                    Task Title:{' '}
                    <Text style={{color: 'gray'}}>{item.taskTitle}</Text>
                  </Text>
                </View>
                <View style={styles.rowContainer}>
                  <Text style={styles.labelText}>
                    Task Description:{' '}
                    <Text style={{color: 'gray'}}>{item.description}</Text>
                  </Text>
                </View>
                <View style={styles.rowContainer}>
                  <Text style={styles.labelText}>
                    Assign Date:{' '}
                    <Text style={{color: 'gray'}}>{item.dateTime}</Text>
                  </Text>
                </View>
                <View style={styles.rowContainer}>
                  <Text style={styles.labelText}>
                    End Date:{' '}
                    <Text style={{color: 'gray'}}>{item.dateTime}</Text>
                  </Text>
                </View>
                <View style={styles.separator} />
                <TouchableOpacity
                  style={[styles.buttonContainer, {backgroundColor: '#8b0000'}]}
                  onPress={() => {
                    navigation.navigate('Assignedviewdetail', { item });  // Pass the 'task' object as route parameter
                  }}>
                  <Text style={styles.buttonText}>View Details</Text>
                  <Icon name="info-circle" size={15} color="white" style={styles.icon} />
                </TouchableOpacity>
              </View>
            </Collapsible>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleEmpty = () => {
    return <Text>No Results!</Text>;
  };

  const renderPaginationButtons = () => {
    const maxButtonsToShow = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxButtonsToShow - 1);

    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(0, endPage - maxButtonsToShow + 1);
    }

    const buttons = [];
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageClick(i)}
          style={[styles.paginationButton, i === currentPage ? styles.activeButton : null]}>
          <Text style={{color: 'white'}}>{i + 1}</Text>
        </TouchableOpacity>
      );
    }
    return buttons;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#A00000', '#EA2027']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Assigned Tasks</Text>
        </View>
      </LinearGradient>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={handleEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />
      <View style={styles.paginationContainer}>{renderPaginationButtons()}</View>
    </SafeAreaView>
  );
};

export default AssignedTaskccc;

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
    paddingVertical: 2,
    paddingHorizontal: 20,
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
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  icon: {
    marginLeft: 5,
  },
  collapsibleHeader: {

    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 5,
    marginTop: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  collapheaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: 10,
  },
  timeleftText: {
    color: 'green',
    fontSize: 10,
    fontWeight: 'bold',
  },
  priorityText: {
    color: 'gray',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft:'5%'
  },
  collapsibleContent: {
    paddingVertical: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  labelText: {
    fontWeight: 'bold',
    color: 'gray',
    fontSize: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  paginationButton: {
    backgroundColor: 'gray',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: 'maroon',
  },
});
