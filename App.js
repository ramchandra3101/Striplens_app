// App.js
import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import LibraryImage from './components/LibraryImage';
import CameraOption from './components/CameraOption';


import styles from './styles/styles';;

export default function App() {

  return (
    <View style={styles.main_container}>
      <View style={styles.title_container}>
        <Text style={styles.title}>StripLens</Text>
      </View>
      <View>
        <LibraryImage />
        <CameraOption/>
      </View>
    </View>
  );
}
