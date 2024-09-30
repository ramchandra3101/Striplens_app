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

export default function ImagePreview({ route }) {
  const { imageUri } = route.params;
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);

  //process Image function

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("http://10.0.2.2:3000/processImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUri }),
      });
      const result = await response.json();
      if (result.success) {
        navigation.navigate("ProcessedImage", {
          processedImageUri: result.processedImageUri,
        });
      } else {
        throw new Error(result.error || "Unknown Error");
      }
    } catch (error) {
      console.error(`Error processing image: ${error.message}`);
      Alert.alert("Error", "Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };

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
        onPress={handleProcess}
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
