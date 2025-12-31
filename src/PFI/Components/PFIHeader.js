import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = ({navigation})  => {

  return (
    <LinearGradient
      colors={['#4CAF50', '#3E8944']}
      style={styles.headerContainer}
    >
      <View style={styles.leftContainer}>
        <Icon name="dashboard" size={22} color="#fff" style={styles.dashboardIcon} />
        <Text style={styles.headerText}>PFI | Dashboard</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
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
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '10%', // Adjust the marginRight for right spacing
  },
  dashboardIcon: {
    marginRight: 5, // Adjust the marginRight for icon spacing
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutText: {
    fontSize: 15,
    marginRight:'5%',
    color: '#fff',
  },
});

export default Header;
