import React from "react";
import { View, Image, Text } from "react-native";
import processedImageStyles from "../styles/processedImageStyles";

export default function ProcessedImage({ route }) {
  const { processedImageUri } = route.params;

  return (
    <View style={processedImageStyles.imagePreviewPage}>
      <View style={processedImageStyles.imagePreviewBox}>
        {processedImageUri ? (
          <Image
            source={{ uri: processedImageUri }}
            style={processedImageStyles.imageInBox}
          />
        ) : (
          <Text>No processed image available</Text>
        )}
      </View>
    </View>
  );
}
