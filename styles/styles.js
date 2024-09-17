import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 3,
  },
  main_container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start', // Changed from 'space-between' to 'flex-start'
  },
  title_container: {
    alignItems: 'center',
    marginTop: 40, // Reduced from 50
    marginBottom: 20, // Added margin bottom to create some space
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  imageContainer: {
    flex: 0.5, 
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 10, 
    marginTop: 150, // Added margin top to create some space
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
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
  Cameracontainer: {
    flex: 0.5, // Reduced from 1 to balance with imageContainer
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop: 200, // Added margin top to create some space
  },
});