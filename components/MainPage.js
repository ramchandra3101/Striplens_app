import React from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LibraryImage from './LibraryImage';
import CameraOption from './CameraOption';
import Header from './Header'; // Add the header with discard feature
import styles from '../styles/Mainstyles';

export default function MainPage() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        

        <View style={styles.main_container}>
          <View style={styles.options_container}>
            <LibraryImage />  
            <CameraOption />   
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
