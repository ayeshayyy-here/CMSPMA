// screens/TrackComplaint.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import logo from '../images/PMA.png';

const TrackComplaint = () => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleTrack = async () => {
    if (!inputValue) {
      alert('Please enter Phone or Complaint Number');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://complaint-pma.punjab.gov.pk/api/searchtrackcomplaint?phoneno=${inputValue}`);
      const json = await response.json();
      setResults(json.complains || []);
    } catch (error) {
      alert('Error fetching complaint data');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultHeader}>Complaint ID: {item.id}</Text>
      <Text style={styles.resultText}>Name: {item.name}</Text>
      <Text style={styles.resultText}>Contact No: {item.phoneno}</Text>
      <Text style={styles.resultText}>CNIC: {item.cnic}</Text>
      <Text style={styles.resultText}>Status: {item.status}</Text>
      <Text style={styles.resultText}>Source: {item.source}</Text>
      <Text style={styles.resultText}>Reg Date: {item.reg_date}</Text>
      <Text style={styles.resultText}>Description: {item.complaint_details}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ImageBackground style={styles.backgroundImage} source={logo}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Track Your Complaint</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter Phone or Complaint Number"
              placeholderTextColor="#666"
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="default"
            />
            <TouchableOpacity style={styles.trackButton} onPress={handleTrack}>
              <Text style={styles.trackButtonText}>Track</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#444" style={{ marginTop: 15 }} />}

            {!loading && results.length > 0 && (
              <FlatList
                data={results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                style={styles.resultList}
              />
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Icon name="phone" size={20} color="maroon" style={styles.footerIcon} />
          <Text style={styles.helplineText}>Helpline: 1762</Text>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: 100,
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#333',
    marginBottom: 15,
  },
  trackButton: {
    backgroundColor: '#444',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  resultList: {
    marginTop: 20,
  },
  resultItem: {
    padding: 15,
    backgroundColor: '#eaeaea',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  resultHeader: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  resultText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(235, 229, 229, 0.7)',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: 10,
  },
  helplineText: {
    color: 'maroon',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrackComplaint;