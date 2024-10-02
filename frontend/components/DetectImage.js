import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useEffect } from "react";

const DetectImage = ({ route }) => {
  const { croppedImageS3Url, originalImageS3Url, plotImageS3Url } =
    route.params;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: croppedImageS3Url }}
        style={styles.image}
        resizeMode="contain"
      />
      <Image
        source={{ uri: plotImageS3Url }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
});

export default DetectImage;
