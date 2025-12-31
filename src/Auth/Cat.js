import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, Dimensions, RefreshControl } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Components/Loader'; // Import the Loader component

const Cat = ({ navigation, route }) => {
  const { providerId, providerName, complaintType } = route.params;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numColumns, setNumColumns] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [providerId]);

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = 150; // Width of each item in the grid
    const newNumColumns = Math.floor(screenWidth / itemWidth);
    setNumColumns(newNumColumns > 1 ? newNumColumns : 1);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/categories/${providerId}`);
      const jsonData = await response.json();
      setCategories(jsonData.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };
  const handlePress = (catid) => {
    navigation.navigate('SubCat', { catid: catid });
  };
  

  const renderItem = ({ item, index }) => {
    // Define mapping of background classes to colors
    const bgColors = {
      'bg-primary': '#007bff',
      'bg-success': '#28a745',
      'bg-warning': '#FFC107',
      'bg-danger': '#DC3545',
      'bg-info': '#17A2B8',
      'bg-secondary': '#6C757D',
      'bg-dark': '#343A40',
    };

    // Get the background class based on the index
    const bgClass = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary', 'bg-dark'][index % 7];
    const imageUrl = `https://complaint-pma.punjab.gov.pk/img/${item.name}.png`;
    // console.log('Image URL:', imageUrl);

    return (
      <TouchableOpacity style={styles.item} onPress={() => handlePress(item.id)}>
      <LinearGradient colors={[bgColors[bgClass], bgColors[bgClass]]} style={styles.gradient}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.circle} />
        </View>
        <Text style={styles.itemText}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
    );
  };

  const keyExtractor = useMemo(() => (item, index) => `${item.id}-${numColumns}`, [numColumns]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#A00000', '#EA2027']}>
        <View style={styles.header}>
          <View style={[styles.headerTextContainer, { justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon name="arrow-left" size={20} color="white" style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.headerText}>Categories of {providerName}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      {loading ? (
        <Loader /> 
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={numColumns}
          contentContainerStyle={styles.flatListContentContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      )}
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
  circle: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // This is only for Android
  },
  
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
  icon: {
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    margin: 5,
    flex: 1,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden', // Ensure gradient doesn't overflow
    elevation: 4, // Add elevation for shadow on Android
    shadowColor: '#000', // Shadow color
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  itemText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContentContainer: {
    flexGrow: 1,
  },
});

export default Cat;
