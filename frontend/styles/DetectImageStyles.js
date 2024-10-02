import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  originalimageContainer: {
    width: width * 0.9,
    height: height * 0.25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
  },
  croppedimageContainer: {
    width: width * 0.9,
    height: height * 0.1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
  },
  plotimageContainer: {
    width: width * 0.9,
    height: height * 0.1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
  },

  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultContainer: {
    marginVertical: 20,
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28a745",
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  lineLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    flex: 1,
  },
  lineValueBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
    flex: 1,
  },
  lineValue: {
    fontSize: 16,
    textAlign: "center",
  },
});
