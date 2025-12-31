import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function InfoBanner() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isCollapsed ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isCollapsed]);

  const toggleBanner = () => {
    setIsCollapsed(!isCollapsed);
  };

  const heightInterpolate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 110],
  });

  return (
    <View style={styles.container}>
      {isCollapsed ? (
        <TouchableOpacity style={styles.iconButton} onPress={toggleBanner}>
          <Icon name="information-circle-outline" size={28} color="maroon" />
        </TouchableOpacity>
      ) : (
        <Animated.View style={[styles.banner, { height: heightInterpolate }]}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>ℹ️ What do these terms mean?</Text>
            <Text style={styles.item}><Text style={styles.bold}>MTD</Text>: Month to Date</Text>
            <Text style={styles.item}><Text style={styles.bold}>FYTD</Text>: Fiscal Year to Date</Text>
            <Text style={styles.item}><Text style={styles.bold}>ITD</Text>: Inception To Date</Text>
          </View>
          <TouchableOpacity onPress={toggleBanner} style={styles.minimizeButton}>
            <Icon name="chevron-up" size={24} color="maroon" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  banner: {
    backgroundColor: '#fcebea', // soft maroonish-pink
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#7b1e3a', // dark maroon
    fontSize: 14,
  },
  item: {
    fontSize: 12,
    color: '#5c1b2e', // muted maroon
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
    color: '#3e0d1c',
  },
  minimizeButton: {
    padding: 4,
  },
  iconButton: {
    backgroundColor: '#f8d7da',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});