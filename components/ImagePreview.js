import React, { startTransition } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import Imagepreviewstyles from '../styles/Imagepreviewstyles'; // Importing the styles
import { useNavigation } from '@react-navigation/native';

export default function ImagePreview({ route }) {
  const { imageUri } = route.params;
  const navigation = useNavigation()
  return (
    <View style={Imagepreviewstyles.imagePreviewPage}>
      {/* Display the selected image in a box */}
      <View style={Imagepreviewstyles.imagePreviewBox}>
      {imageUri ? (
          <Image source={{ uri: imageUri }} style={Imagepreviewstyles.imageInBox} />
        ) : (
          <Text>No image selected</Text>
        )}
      </View>

      {/* Button to process image */}
      <TouchableOpacity style={Imagepreviewstyles.processButton} onPress={()=>{}}>
        <Text style={Image.processButtonText}>Process</Text>
      </TouchableOpacity>
    </View>
  );
}
