import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, Dimensions, RefreshControl } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../Components/Loader';
import SubcategoryModal from '../Components/SubcategoryModal';
import syncStorage from 'react-native-sync-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
const Cat = ({ navigation, route }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numColumns, setNumColumns] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = 300; // Width of each item in the grid
    const newNumColumns = Math.floor(screenWidth / itemWidth);
    setNumColumns(newNumColumns > 1 ? newNumColumns : 1);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = syncStorage.get('user_detail').id;
      console.log('Fetching data for userId:', userId);
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/categorywisedata/${userId}`);
      const jsonData = await response.json();
      console.log('Fetched data:', jsonData); // Log the entire response
      if (Array.isArray(jsonData)) {
        setCategories(jsonData);
      } else {
        console.error('Unexpected data format:', jsonData);
      }
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
  const navigatetoverified = () => {
    navigation.navigate('Cccverified');
  };
  const handleSubcategoryPress = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setModalVisible(true);
  };

  const renderItem = ({ item, index }) => {
    const bgColors = {
      'bg-primary': '#007bff',
      'bg-success': '#28a745',
      'bg-warning': '#FFC107',
      'bg-danger': '#DC3545',
      'bg-info': '#17A2B8',
      'bg-secondary': '#6C757D',
      'bg-dark': '#343A40',
    };

    const bgClass = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary', 'bg-dark'][index % 7];
    const imageUrl = `https://complaint-pma.punjab.gov.pk/img/${item.category_name}.png`;

    return (
      <TouchableOpacity style={styles.item}>
        <LinearGradient colors={[bgColors[bgClass], bgColors[bgClass]]} style={styles.gradient}>
          <Text style={styles.itemTextt}>{item.sname}</Text>
          <Text style={styles.itemText}>{item.category_name}</Text>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.circle} />
          </View>
          <TouchableOpacity
            style={styles.subcategoryButton}
            onPress={() => handleSubcategoryPress(item.category_id)}>
            <Text style={styles.subcategoryButtonText}>Subcategories</Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const keyExtractor = useMemo(() => (item, index) => `${item.id}-${numColumns}`, [numColumns]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#A00000', '#EA2027']}>
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Icon name="tasks" size={18} color="#fff" style={styles.icon} />
              <Text style={styles.headerText}>Assign Complaints As Task</Text>
            </View>
            <TouchableOpacity
              onPress={navigatetoverified}
              style={styles.additionalContainer}>
             <Text style={styles.headerTextt}>Verified Complaints</Text>
            </TouchableOpacity>
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
      <SubcategoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        categoryId={selectedCategoryId}
        userId={syncStorage.get('user_detail').id}
      />
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
    elevation: 5,
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
  headerTextt: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: '25%', 
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
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  itemText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemTextt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subcategoryButton: {
    marginTop: 5,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 5,
  },
  subcategoryButtonText: {
    color: '#000',
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
  icon2: {
    marginLeft: '60%',
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#ddd',
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: '100%', // Ensure it takes the full width available
  },
  optionText: {
    fontSize: 17,
    color: '#333',
  },
});

export default Cat;
