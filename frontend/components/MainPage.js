import React from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LibraryImage from './LibraryImage';
import CameraOption from './CameraOption';
import Header from './Header'; // Add the header with discard featur
import Mainstyles from '../styles/Mainstyles';

export default function MainPage() {
  return (
    <SafeAreaView style={Mainstyles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#FFFFFF', '#FFCCCC']}
        style={Mainstyles.gradient}
      >
        <View style={Mainstyles.main_container}>
          <View style={Mainstyles.options_container}>
            <LibraryImage />  
            <CameraOption />   
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
