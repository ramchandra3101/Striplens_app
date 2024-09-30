import React from "react";
import { View, Image, Text } from "react-native";
import ProcessedImagestyles from "../styles/processedImageStyles"; // You can create a new style file if needed

export default function ProcessedImage({ route }) {
  const { processedImageUri } = route.params;

  return (
    <View style={processedImageStyles.container}>
      {processedImageUri ? (
        <Image
          source={{ uri: processedImageUri }}
          style={processedImageStyles.image}
        />
      ) : (
        <Text>No processed image available</Text>
      )}
    </View>
  );
}
