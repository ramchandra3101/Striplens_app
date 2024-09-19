import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/styles"; // Importing the styles
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 

export default function LibraryImage() {
  const [error, setError] = useState(null); // Stores any error message
  const navigation = useNavigation();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Sorry, we need camera roll permissions to make this work!');
      Alert.alert('Permission required', 'We need camera roll permissions to upload images.');
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
        quality: 1, // High-quality image
      });
      if (!result.cancelled && result.uri) {
        console.log("Image selected: ", result.uri); 
        navigation.navigate('ImagePreview', { imageUri: result.uri });
        setError(null);
      } else {
        setError('No image selected');
      }
    }
  };

  return (
    <View style={styles.imageContainer}>
      {/* Button to choose image from library */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <MaterialCommunityIcons name="folder-multiple-image" style={styles.icon} />
      </TouchableOpacity>

      {/* Display any error */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>

  );
}
