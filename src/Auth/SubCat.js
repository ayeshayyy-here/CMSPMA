import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Loader from '../Components/Loader'; // Import the Loader component

const SubCat = ({ navigation,route }) => {
  const { catid } = route.params;
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/subcategories/${catid}`);
      const data = await response.json();
      setSubcategories(data.subcategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubcategoryPress = (subcategory) => {
    navigation.navigate('SubCatComplaints', { subcategoryId: subcategory.id }); 
  };

  return (
    <View style={styles.container}>
    <LinearGradient colors={['#A00000', '#EA2027']}>
      <View style={styles.header}>
        <View style={[styles.headerTextContainer, { justifyContent: 'space-between' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon name="arrow-left" size={20} color="white" style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Sub Categories</Text>
          </View>
        </View>
      </View>
    </LinearGradient>

    <View style={styles.tab}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <Loader />
        ) : subcategories.length === 0 ? ( // Check if there are no subcategories
          <View style={styles.content}>
            <Text style={styles.contentText}>No subcategories available</Text>
          </View>
        ) : (
          subcategories.map((subcategory, index) => (
            <TouchableOpacity key={index} style={styles.tabIndicator} onPress={() => handleSubcategoryPress(subcategory)}>
              <Text style={styles.buttonText} numberOfLines={4} ellipsizeMode="tail">
                {subcategory.name}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
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
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginLeft:'4%'
  },
  tab: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tabIndicator: {
    marginTop:10,
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
    // marginBottom: 15,
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 10, 
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    // Add border for the top border only
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRightColor:'#dc3545',
    borderLeftColor: '#dc3545', // Set the border color to red
  },  
  buttonText: {
    color: 'black',
    fontSize: 14,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop:10,
    // marginBottom: 10,
    color: 'grey',
  },
});

export default SubCat;
