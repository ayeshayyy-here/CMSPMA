import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any other icon library

const FloatingButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Icon name="add" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const YourList = () => {
  // Example of a long list
  const listItems = Array.from(Array(50).keys()).map((item) => (
    <View key={item} style={styles.listItem}>
      <Text>List Item {item + 1}</Text>
    </View>
  ));

  return (
    <ScrollView style={styles.scrollView}>
      {listItems}
    </ScrollView>
  );
};

const App = () => {
  const handlePress = () => {
    // Handle the floating button press action
    console.log('Floating button pressed');
  };

  return (
    <View style={styles.container}>
      <YourList />
      <FloatingButton onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#03A9F4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color:'black'
  },
});

export default App;
