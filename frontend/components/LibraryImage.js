import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LibraryImagestyles from "../styles/LibraryImagestyles";

export default function LibraryImage() {
  const [error, setError] = useState(null); // Stores any error message
  const navigation = useNavigation();

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setError("Sorry, we need camera roll permissions to make this work!");
        Alert.alert(
          "Permission required",
          "We need camera roll permissions to upload images."
        );
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
        quality: 1, // High-quality image
      });
      console.log(result);
      if (result.cancelled) {
        setError("No image selected");
        return; // Set the error message
      }
      if (!result.cancelled && result.assets[0].uri) {
        // Navigate to the ImagePreview component and pass the selected image URI
        navigation.navigate("ImagePreview", { imageUri: result.assets[0].uri });
        setError(null);
      }
    } catch (error) {
      Alert.alert("No Image Selected", "Please select an image to proceed");
    }
  };
  return (
    <View style={LibraryImagestyles.imageContainer}>
      {/* Button to choose image from library */}
      <TouchableOpacity style={LibraryImagestyles.button} onPress={pickImage}>
        <MaterialCommunityIcons
          name="folder-multiple-image"
          style={LibraryImagestyles.icon}
        />
      </TouchableOpacity>

      {/* Display any error */}
      {error && <Text style={LibraryImagestyles.errorText}>{error}</Text>}
    </View>
  );
}
