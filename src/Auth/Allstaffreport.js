import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import baseUrl from '../Config/url';
import Loader from '../Components/Loader'; // Assuming you have a Loader component

const Allstaffreport = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    fetch(`${baseUrl}/allstaffprogressreport`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setData(data.data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false on error as well
      });
  }, []);

  const DataRow = ({ index, user }) => {
    return (
      <View style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
        <Text style={styles.dataText}>{index + 1}</Text>
        <Text style={[styles.dataText, styles.nameText]}>{user.name}</Text>
        <Text style={styles.dataText}>{user.comp_pend_count}</Text>
        <Text style={styles.dataText}>{user.comp_inp_count}</Text>
        <Text style={styles.dataText}>{user.comp_resol_count}</Text>
        <Text style={styles.dataText}>{user.comp_forward_count}</Text>
        <Text style={styles.dataText}>{user.task_pend_count}</Text>
        <Text style={styles.dataText}>{user.task_inp_count}</Text>
        <Text style={styles.dataText}>{user.task_resol_count}</Text>
        <Text style={styles.dataText}>{user.task_forward_count}</Text>
        <Text style={styles.dataText}>{user.comp_total_count}</Text>
        <Text style={styles.dataText}>{user.task_total_count}</Text>
      </View>
    );
  };

  const Footer = () => {
    return (
      <TouchableOpacity style={styles.footerContainer}>
        {/* <View style={styles.iconContainerfoot}>
          <Icon name="print" size={15} color="white" />
          <Text style={[styles.iconTextfoot, { color: 'white' }]}>Print Report</Text>
        </View> */}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <Loader />; // Render the Loader component while data is loading
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#A00000', '#EA2027']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Progress Report</Text>
      </LinearGradient>

      <View style={styles.cardd}>
        <View style={{ paddingHorizontal: 10, paddingBottom: 5 }}>
          <Text style={styles.headerTextt}>Complaint Management System </Text>
          <Text style={styles.headerTexttt}>All Staff Progress Report</Text>
        </View>
        <View style={styles.headerContainer}>
          <Text style={[styles.headerext, styles.flex1]}>Sr#</Text>
          <Text style={[styles.headerext, styles.flex2]}>Name</Text>
          <Text style={[styles.headerext, styles.flex1]}>Pending Complaints</Text>
          <Text style={[styles.headerext, styles.flex1]}>In Process Complaints</Text>
          <Text style={[styles.headerext, styles.flex1]}>Completed Complaints</Text>
          <Text style={[styles.headerext, styles.flex1]}>Forwarded Complaints</Text>
          <Text style={[styles.headerext, styles.flex1]}>Pending Tasks</Text>
          <Text style={[styles.headerext, styles.flex1]}>In Process Tasks</Text>
          <Text style={[styles.headerext, styles.flex1]}>Completed Tasks</Text>
          <Text style={[styles.headerext, styles.flex1]}>Forwarded Tasks</Text>
          <Text style={[styles.headerext, styles.flex1]}>Total Complaints</Text>
          <Text style={[styles.headerext, styles.flex1]}>Total Tasks</Text>
        </View>
        <View style={styles.divider} /> 
        <View style={styles.scrollContainer}>
          <ScrollView>
            <View>
              {data.map((user, index) => (
                <DataRow key={user.id} index={index} user={user} />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
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
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row', // Make the container horizontal
    justifyContent: 'space-between', // Distribute items evenly along the row
    paddingHorizontal: 1,
    paddingBottom: 5,
    paddingTop: 10,
    // Color of the borderBottom
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  headerext: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'maroon',
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardd: {
    borderRadius: 10,
    elevation: 2,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#F8EDED',
    flex: 1, // Ensure the cardd container takes up full available space
  },
  headerTextt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'maroon',
    textAlign: 'center',
  },
  headerTexttt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'maroon',
    textAlign: 'center',
  },
  iconContainerfoot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'maroon',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  iconTextfoot: {
    marginLeft: 5,
    color: '#CD1D0C',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  dataText: {
    flex: 1,
    textAlign: 'center',
    color: '#CD1D0C',
  },
  evenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8EDED',
    paddingVertical: 5,
  },
  oddRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  nameText: {
    flex: 2, // Adjust the value as needed to give the name more space
    // You can also use width property instead of flex
    width: 350, // Adjust the width as needed
  },
  scrollContainer: {
    flex: 1, // Ensure the ScrollView takes up full available space
  },
  divider: {
    borderBottomColor: 'maroon',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default Allstaffreport;
