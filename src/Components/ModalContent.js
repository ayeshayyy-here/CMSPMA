import React from 'react';
import { View, Modal, TouchableWithoutFeedback, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import syncStorage from 'react-native-sync-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
const ModalContent = ({ isVisible, toggleModal }) => {
  const navigation = useNavigation();
  const handleLogout = async () => {
    try {
      await EncryptedStorage.clear();
      console.log('User data cleared from encrypted storage');
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={toggleModal}
    >
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <ScrollView>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Networknew')}
                  style={styles.modalItem}
                >
                  <Icon
                    name="exclamation-circle"
                    size={20}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalHeading}>
                    Not Processed Yet Complaint
                  </Text>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('InprocessComplaint')}
                  style={styles.modalItem}
                >
                  <Icon
                    name="cogs"
                    size={20}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalHeading}>In Process Complaint</Text>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ResolvedComplaint')}
                  style={styles.modalItem}
                >
                  <Icon
                    name="check-circle"
                    size={20}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalHeading}>Resolved Complaint</Text>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('DownloadPdf')}
                  style={styles.modalItem}
                >
                  <Icon
                    name="file-pdf-o"
                    size={20}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalHeading}>Download PDF</Text>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('YourTask')}
                  style={styles.modalItem}
                >
                  <Icon
                    name="tasks"
                    size={20}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalHeading}>Your Tasks</Text>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('YourAssignedComplaints')}
                  style={styles.modalItem}
                >
                  <Icon
                    name="clipboard"
                    size={20}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalHeading}>
                    Your Assigned Complaints
                  </Text>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Getalltask')}
                  style={styles.modalItem}
                >
                  <Icon
                    name="list-alt"
                    size={20}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalHeading}>Assigned Task</Text>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Networkassignedquery')}
                  style={styles.modalItem}
                >
                  <Icon
                    name="question-circle"
                    size={20}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalHeading}>New Query</Text>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Networkqueries')}
                  style={styles.modalItem}
                >
                  <Icon
                    name="question"
                    size={20}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalHeading}>Queries</Text>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity
                  onPress={handleLogout}
                  style={styles.modalItem}
                >
                  <Icon
                    name="sign-out"
                    size={20}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalHeading}>Logout</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#2c3e50',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  modalIcon: {
    marginRight: 10,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  line: {
    height: 0.5,
    backgroundColor: 'grey',
    marginVertical: 5,
  },
});

export default ModalContent;
