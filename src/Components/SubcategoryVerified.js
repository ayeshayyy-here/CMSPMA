import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SubcategoryVerified = ({ visible, onClose, categoryId, userId }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (visible && categoryId) {
      fetchSubcategories();
    }
  }, [visible, categoryId]);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/categorywisedataveco/${userId}/${categoryId}`);
      const jsonData = await response.json();
      if (Array.isArray(jsonData)) {
        setSubcategories(jsonData);
      } else {
        console.error('Unexpected data format:', jsonData);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryPress = (subcategoryId, subcategoryName) => {
    navigation.navigate('Cccveco', { subcategoryId, categoryId, subcategoryName });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              {loading ? (
                <Text>Loading...</Text>
              ) : (
                <FlatList
                  data={subcategories}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.subcategoryItem}
                      onPress={() => handleSubcategoryPress(item.id, item.name)}
                    >
                      <Text style={styles.subcategorytext}>{item.name} {item.c}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    maxHeight: height * 0.6,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  subcategoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  subcategorytext: {
    color: 'black',
  },
});

export default SubcategoryVerified;
