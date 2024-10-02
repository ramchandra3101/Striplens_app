// Purpose: This file contains the code for the ImagePreview component which is used to display the selected image and process it.
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import Imagepreviewstyles from "../styles/Imagepreviewstyles"; // Importing the styles
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { handleprocess } from "./handleprocess";

export default function ImagePreview({ route }) {
  const { imageUri } = route.params;
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <View style={Imagepreviewstyles.imagePreviewPage}>
      {/* Display the selected image in a box */}
      <View style={Imagepreviewstyles.imagePreviewBox}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={Imagepreviewstyles.imageInBox}
          />
        ) : (
          <Text>No image selected</Text>
        )}
      </View>

      {/* Button to process image */}
      <TouchableOpacity
        style={Imagepreviewstyles.processButton}
        onPress={() => handleprocess(imageUri, setIsProcessing, navigation)}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={Imagepreviewstyles.processButtonText}>Process</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
