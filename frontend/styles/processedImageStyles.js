import { StyleSheet } from "react-native";

export default StyleSheet.create({
  imagePreviewPage: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  imagePreviewBox: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: "#3b5998",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imageInBox: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
