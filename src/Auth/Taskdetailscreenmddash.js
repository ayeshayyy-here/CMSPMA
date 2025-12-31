import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Taskdetailscreenmddash = ({ route, navigation }) => {
    const { rowData } = route.params;



  return (
    
    <View style={styles.container}>
   
  <View style={styles.navBar}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    <Icon name="arrow-left" size={25} color="black" />
    <Text style={styles.backText}>Back</Text>
  </TouchableOpacity>

</View>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Task Details</Text>
          <Text style={styles.subtitle}>{rowData.name}</Text>
          <TouchableOpacity style={styles.queryButton}  onPress={() => navigation.navigate('Queryforassiss')}>
          <Text style={styles.queryButtonText}>Query of Assisstance</Text>
        </TouchableOpacity>

        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => { /* Handle button press */ }}>
          <Text style={styles.editButtonText}>Edit Task</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
      <View style={styles.contentContainer}>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Assigned To:</Text>
            <Text style={styles.value}>{rowData.name}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Task Title:</Text>
            <Text style={styles.value}>{rowData.taskTitle}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Task Description:</Text>
            <Text style={styles.value}>{rowData.description}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Task Priority:</Text>
            <Text style={styles.value}>{rowData.priority}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Assign Date:</Text>
            <Text style={styles.value}>{rowData.created_at}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>EndDate:</Text>
            <Text style={styles.value}>{rowData.resolve_date}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Task File:</Text>
            <Text style={styles.value}>{rowData.fattach}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Task Audio:</Text>
            <Text style={styles.value}>{rowData.complaint_audio}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Resolved Task File:</Text>
            <Text style={styles.value}>{rowData.resolvefile}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Resolved Task Audio:</Text>
            <Text style={styles.value}>{rowData.resolveaudio}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{rowData.status}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Remark:</Text>
            <Text style={styles.value}>{rowData.remarks}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Verify Status:</Text>
            <Text style={styles.value}>{rowData.verify}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Remarks:</Text>
            <Text style={styles.value}>{rowData.verifyremarks}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.label}></Text>
            <Text style={styles.value}></Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}></Text>
            <Text style={styles.value}></Text>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#ECECEC',
    shadowColor: '#888', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 5, // Elevation (for Android)
  },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10, // No border radius for top left corner
        borderTopRightRadius: 10, // No border radius for top right corner
        borderBottomLeftRadius: 0, // Border radius for bottom left corner
        borderBottomRightRadius: 0,
        borderWidth: 1,
        borderColor: '#ECF0F5',
        paddingLeft: 10,
        paddingRight: 10,
     
        paddingBottom: 20,
        top: 20,
      },
      title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
      },
      subtitle: {
        fontSize: 14,
        color: '#666',
      },
      contentContainer: {
        flex: 1,
        backgroundColor: '#ECF0F5',
        borderTopLeftRadius: 0, // No border radius for top left corner
        borderTopRightRadius: 0, // No border radius for top right corner
        borderBottomLeftRadius: 10, // Border radius for bottom left corner
        borderBottomRightRadius: 10,
        borderWidth: 1,
        borderColor: '#ECF0F5',
        padding: 10,
       
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Align items horizontally
        alignItems: 'center',
        marginBottom: 26,
      },
      textContainer: {
        flex: 1, // Each text container takes up equal space within the row
      },
      label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
      },
      value: {
        fontSize: 10,
        color: '#333',
      },
      queryButton: {
        backgroundColor: '#0069D9',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
      },
      queryButtonText: {
        color: '#fff',
        fontSize: 12,
      },
      editButton: {
        backgroundColor: '#218838',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        bottom: 25,
      },
      editButtonText: {
        color: '#fff',
        fontSize: 12,
      },
      navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
      
      },
      backButton: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      backText: {
        marginLeft: 5,
        fontSize: 18,
      },
    });
    
    export default Taskdetailscreenmddash;