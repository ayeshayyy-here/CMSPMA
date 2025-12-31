import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = ({ title, isEllipsis, onToggleModal }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
      <TouchableOpacity onPress={onToggleModal}>
        {/* Displaying either ellipsis or cross button based on the state */}
        {isEllipsis ? (
          <Icon name="bars" size={25} color="white" style={styles.menuIcon} />
        ) : (
          <Icon name="times" size={25} color="white" style={styles.menuIcon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 0.2,
    borderBottomColor: '#ccc',
    backgroundColor: '#357CA5',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  menuIcon: {
    marginLeft: 10,
  },
});

export default Header;
