import { Alert } from "react-native";

export async function handleprocess(imageUri, setIsProcessing, navigation) {
  if (!imageUri) {
    Alert.alert("No Image Selected", "Please select an image to proceed");
    return;
  }

  setIsProcessing(true);

  try {
    const formData = new FormData();
    const formattedUri = imageUri.startsWith("file://")
      ? imageUri
      : "file://" + imageUri;

    formData.append("image", {
      uri: formattedUri,
      type: "image/jpeg",
      name: "image.jpg",
    });

    const response = await fetch("http://10.110.44.197:3000/processImage", {
      method: "POST",
      body: formData,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });

    if (response.ok) {
      const result = await response.json();
      navigation.navigate("DetectImage", {
        croppedImageS3Url: result.processedImageUri.croppedImage,
        originalImageS3Url: result.processedImageUri.originalImage,
        plotImageS3Url: result.processedImageUri.plotImage,
      });
      Alert.alert("Image detected successfully");
    } else {
      const error = await response.text();
      alert("Error processing Image: " + error);
    }
  } catch (error) {
    console.log("Error processing image", error);
    Alert.alert("Error processing image", "Please try again");
  } finally {
    setIsProcessing(false);
  }
}
