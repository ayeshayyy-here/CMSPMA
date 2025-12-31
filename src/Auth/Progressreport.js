import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const Progressreport = ({ route, navigation }) => {
  const { user, designation } = route.params;
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("User ID:", user.id);

  useEffect(() => {
    fetch(`https://complaint-pma.punjab.gov.pk/api/progressreportusers/${user.id}`)
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data); // Log the API response
        setReportData(data[0]); // Assuming the response is an array with one object
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [user.id]);

  const Footer = () => {
    return (
      <TouchableOpacity style={styles.footerContainer}>
        <View style={styles.iconContainerfoot}>
          <Icon name="print" size={15} color="white" />
          <Text style={[styles.iconTextfoot, { color: 'white' }]}>
            Print Report
          </Text>
        </View>
      </TouchableOpacity>
    );
  };



  if (!reportData) {
    return (
      <View style={styles.container}>
      <LinearGradient colors={['#A00000', '#EA2027']} style={styles.header}>
        <View style={styles.headerTextContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Progress Report</Text>
        </View>
      </LinearGradient>

      <View style={styles.cardd}>
        <View style={{ paddingHorizontal: 20, paddingBottom: 5 }}>
          <Text style={styles.headerTextt}>
            Complaint Management System Progress Report
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 20,
            marginBottom: 15,
          }}>
          <View style={styles.userIconContainer}>
            <Text style={styles.initiall}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.designation}>{designation}</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          <View style={{ flexDirection: 'column' }}>
            <ListItem
              label="Pending Complaints"
              value={0}
            />
            <ListItem
              label="Resolved Complaints"
              value={0}
            />
            <ListItem
              label="Overdue Complaints"
              value={0}
            />
            <ListItem
              label="Total Complaints"
              value={0}
            />
            <ListItem
              label="Completed Tasks"
              value={0}
            />
            <ListItem
              label="Pending Tasks"
              value={0}
            />
            <ListItem
              label="In Process Tasks"
              value={0}
            />
            <ListItem
              label="Forwarded Tasks"
              value={0}
            />
            <ListItem
              label="Total Tasks"
              value= {0}
            />
          </View>
        </View>
      </View>

      <Footer />
    </View>
    );
  }

  return (
    <View style={styles.content}>
      <LinearGradient colors={['#A00000', '#EA2027']} style={styles.header}>
        <View style={styles.headerTextContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Progress Report</Text>
        </View>
      </LinearGradient>

      <View style={styles.cardd}>
        <View style={{ paddingHorizontal: 20, paddingBottom: 5 }}>
          <Text style={styles.headerTextt}>
            Complaint Management System Progress Report
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 20,
            marginBottom: 15,
          }}>
          <View style={styles.userIconContainer}>
            <Text style={styles.initiall}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.designation}>{designation}</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          <View style={{ flexDirection: 'column' }}>
            <ListItem
              label="Pending Complaints"
              value={reportData.pending_complaints_count}
            />
            <ListItem
              label="Resolved Complaints"
              value={reportData.resolved_complaints_count}
            />
            <ListItem
              label="Overdue Complaints"
              value={reportData.overdue_complaints_count}
            />
            <ListItem
              label="Total Complaints"
              value={reportData.total_complaints_count}
            />
            <ListItem
              label="Completed Tasks"
              value={reportData.resolved_tasks_count}
            />
            <ListItem
              label="Pending Tasks"
              value={reportData.pending_tasks_count}
            />
            <ListItem
              label="In Process Tasks"
              value={reportData.in_process_tasks_count}
            />
            <ListItem
              label="Forwarded Tasks"
              value={reportData.forwarded_tasks_count}
            />
            <ListItem
              label="Total Tasks"
              value={reportData.total_tasks_count}
            />
          </View>
        </View>
      </View>

      <Footer />
    </View>
  );
};

const ListItem = ({ label, value }) => {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemLabel}>{label}</Text>
      <Text style={styles.listItemValue}>{value}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
    content: {
    flex: 1,
    // Your content styles here
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    borderRadius: 10,
    elevation: 2,
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 15,
  },
  cardd: {
    borderRadius: 10,
    elevation: 2,
    marginHorizontal: 30,
    marginVertical: 35,
    paddingVertical: 35,
    backgroundColor: '#F8EDED',
  },
  headerTextt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'maroon',
    textAlign: 'center',
  },
  userIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'maroon',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'maroon',
  },
  designation: {
    fontSize: 14,
    color: 'maroon',
  },
  iconRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 50,
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
  listContainer: {
    paddingHorizontal: 20,
    maxHeight: 300, // Adjust the height as needed
  },
  listItem: {
    flexDirection: 'row', // Arrange label and value horizontally
    justifyContent: 'space-between', // Add space between label and value
    marginVertical: 1, // Adjust vertical margin as needed
    paddingHorizontal: 10, // Adjust horizontal padding as needed
  },
  listItemLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'maroon',
  },
  listItemValue: {
    fontSize: 14,
    color: 'maroon',
  },
  highlightedTotal: {
    flexDirection: 'row', // Arrange label and value horizontally
    justifyContent: 'space-between', // Add space between label and value
    marginVertical: 5, // Adjust vertical margin as needed
    paddingHorizontal: 20, // Adjust margin as needed
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'maroon',
  },
  totalValue: {
    fontSize: 14,
    color: 'maroon',
  },
  initiall: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Progressreport;
