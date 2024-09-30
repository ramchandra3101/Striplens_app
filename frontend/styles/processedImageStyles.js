import { StyleSheet } from "react-native";

const processedImageStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});

export default ProcessedImagestyles;
