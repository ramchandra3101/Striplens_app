// Purpose: This file contains the code for the ImagePreview component which is used to display the selected image and process it.
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndiactor,
} from "react-native";
import Imagepreviewstyles from "../styles/Imagepreviewstyles"; // Importing the styles
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

export default function ImagePreview({ route }) {
  const { imageUri } = route.params;
  console.log(imageUri);
  const [isprocessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();

  //process Image function

  const handleProcess = async () => {
    setprocessing(true);

    Alert.alert(
      "Image Processing . . .",
      "Please wait while we process the image",
      [{ text: "OK" }]
    );
    setTimeout(() => {
      setisprocessing(false);
      navigation.navigate("ProcessedImage", { proccessedImageUri: imageUri });
    }, 4000);
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
        disabled={isProcessing} // Disable the button while processing
      >
        {isProcessing ? (
          <ActivityIndicator size="small" color="#FFF" /> // Loading indicator while processing
        ) : (
          <Text style={Imagepreviewstyles.processButtonText}>Process</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
