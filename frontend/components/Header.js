import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/Headerstyles'; // Your custom styles

export default function Header() {
  const navigation = useNavigation();

  const handleHomePress = () => {
    Alert.alert(
      'Discard Changes?',
      'Are you sure you want to discard all changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            
            navigation.navigate('Main');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>StripLens</Text>
      <TouchableOpacity style={styles.homeButton} onPress={handleHomePress}>
        <MaterialCommunityIcons name="home" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
