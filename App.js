import React from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LibraryImage from './components/LibraryImage';
import CameraOption from './components/CameraOption';
import styles from './styles/styles';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <View style={styles.main_container}>
          <View style={styles.title_container}>
            <Text style={styles.title}>StripLens</Text>
          </View>
          <View style={styles.options_container}>
            <LibraryImage />
            <CameraOption />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}