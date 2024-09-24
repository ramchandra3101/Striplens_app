import { StyleSheet } from "react-native";
export default StyleSheet.create({
    Cameracontainer: {
    flex: 0.5, 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop: 200, 
    },
    button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  icon: {
    fontSize: 48,
    color: '#FFF',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
  }, 
});