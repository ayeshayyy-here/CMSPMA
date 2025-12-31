import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const PFIViewDetails = ({ navigation, route }) => {
  const { complaintsData, currentIndex } = route.params;
//   console.log('Complaints Data:', complaintsData);

  const currentComplaint = complaintsData[currentIndex];

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
      <LinearGradient
      colors={['#4CAF50', '#3E8944']}
      style={styles.headerContainer}
    >
      <View style={styles.leftContainer}>
        <Icon name="file-text" size={24} color="#fff" style={styles.dashboardIcon} />
        <Text style={styles.headerText}>View Details</Text>
      </View>
    </LinearGradient>
        <View style={{ flex: 1, padding: '5%' }}>
          <Text style={styles.text}>Full Name:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.name}
              editable={false}
            />
          </View>
          <Text style={styles.text}>CNIC Number:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.cnic}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Contact Number:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.phoneno}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Complain Type:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.complaint_type}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Source:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.source}
              editable={false}
            />
          </View>

          {/* <Text style={styles.text}>Complain Number:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.id}
              editable={false}
            />
          </View> */}
          <Text style={styles.text}>Reg. Date:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.reg_date}
              editable={false}
            />
          </View>
          <Text style={styles.text}>City Name:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.city_name}
              editable={false}
            />
          </View>
          <Text style={styles.text}>System Name:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.sp_name}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Stop Name:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.stop_name}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Category:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.category_name}
              editable={false}
            />
          </View>
          <Text style={styles.text}>SubCategory:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.subcategory_name}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Complaint Details:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={[
                styles.textInput,
                {height: 100, textAlignVertical: 'top'},
              ]}
              value={currentComplaint.complaint_details}
              editable={false}
              multiline={true}
              numberOfLines={10} 
            />
          </View>
          <Text style={styles.text}>Status:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.status || 'N/A'}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Service Provider Name:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.service_provider_name}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Remark:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentComplaint.remark || 'N/A'}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Complaint File:</Text>
<View style={{ alignItems: 'center' }}>
  {currentComplaint.complaint_file ? (
    <Text>{currentComplaint.complaint_file}</Text>
  ) : (
    <Text>No complaint file available</Text>
  )}
</View>



        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#006400',
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    marginLeft:10,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '5%',
    paddingBottom: '4%',
    backgroundColor: '#006400',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10, // Adjust the marginLeft for left spacing
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    color: '#000',
    height: 45,
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 5,
  },
  text: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default PFIViewDetails;
