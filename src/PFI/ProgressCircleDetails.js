import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { RadioButton } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import syncStorage from 'react-native-sync-storage';

const ProgressCircleDetails = ({ route, navigation }) => {
  const { vendor, stopId } = route.params;
  const pfi_id = syncStorage.get('user_detail').id;

  const [data, setData] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedSubcategories, setSelectedSubcategories] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/pfiprogresscircledetail/${vendor}/${pfi_id}/${stopId}`);
        const json = await response.json();
        setData(json.categories);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [vendor, stopId, pfi_id]);

  const toggleCategory = (category) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  const handleRadioButtonPress = async (subcategoryId) => {
    setSelectedSubcategories((prevState) => ({
      ...prevState,
      [subcategoryId]: !prevState[subcategoryId]
    }));

    try {
      const response = await fetch('https://complaint-pma.punjab.gov.pk/api/pfistore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pfi_id,
          subcat_id: subcategoryId,
          stop_id: stopId
        })
      });

      const json = await response.json();
      console.log(json); // Handle the response as needed
    } catch (error) {
      console.error(error);
    }
  };

  const renderSubcategories = (subcategories) => {
    return subcategories.map((subcat) => (
      <View key={subcat.subcategory_id} style={styles.subcategoryContainer}>
        <RadioButton
          value={subcat.subcategory_id.toString()}
          status={selectedSubcategories[subcat.subcategory_id] || subcat.taskcount > 0 ? 'checked' : 'unchecked'}
          onPress={() => handleRadioButtonPress(subcat.subcategory_id)}
          uncheckedColor="#555" // Customize the color of the unchecked radio button
          color="#4CAF50" // Customize the color of the checked radio button
        />
        <Text style={styles.subcategoryText}>{subcat.subcategory}</Text>
      </View>
    ));
  };

  const renderCategory = ({ item }) => {
    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity onPress={() => toggleCategory(item.category)}>
          <Text style={styles.categoryTitle}>{item.category}</Text>
        </TouchableOpacity>
        {expandedCategories[item.category] && renderSubcategories(item.subcategories)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4CAF50', '#3E8944']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={20}
            color="#fff"
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{vendor} Task</Text>
      </LinearGradient>
      <FlatList
        data={data}
        renderItem={renderCategory}
        keyExtractor={(item) => item.category}
      />
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
    marginBottom: 20,
    backgroundColor: '#4CAF50',
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
  categoryContainer: {
    marginBottom: 16,
    backgroundColor: '#E6F9E6',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    marginHorizontal: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  subcategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    marginTop: 8,
  },
  subcategoryText: {
    fontSize: 12,
    marginLeft: 8,
    color: '#555',
  },
});

export default ProgressCircleDetails;
