import React, { startTransition } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import styles from '../styles/Imagepreviewstyles'; // Importing the styles

export default function ImagePreview({ route, navigation }) {
  const { imageUri } = route.params; // Access the image URI passed as parameter
  console.log("Received imageUri:", imageUri);
  console.log("hello")
  return (
    <View style={styles.imagePreviewPage}>
      {/* Display the selected image in a box */}
      <View style={styles.imagePreviewBox}>
      {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imageInBox} />
        ) : (
          <Text>No image selected</Text>
        )}
      </View>

      {/* Button to process image */}
      <TouchableOpacity style={styles.processButton} onPress={() => {/* Add image processing logic later */}}>
        <Text style={styles.processButtonText}>Process</Text>
      </TouchableOpacity>
    </View>
  );
}
