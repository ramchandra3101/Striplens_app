import { StyleSheet } from "react-native";
export default StyleSheet.create({


    title_container: {
        marginTop: 200,
        marginBottom: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        
      },
    
      // Circular button with centered content
      button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100, // Larger width for circular button
        height: 100, // Make height and width equal for a circle
        borderRadius: 50, // Border radius should be half of width/height to create a circle
        backgroundColor: '#4CAF50', // Green background color
        marginBottom: 20, // Space below the button
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 4 }, // Offset for iOS shadow
        shadowOpacity: 0.3, // Opacity of iOS shadow
        shadowRadius: 4, // Blur radius of shadow
        elevation: 6, // Shadow for Android
      },
    
      // Icon styling with larger size to fit the circular button
      icon: {
        fontSize: 48, // Larger font size for the icon
        color: '#FFF', // White color for contrast
      },
    
      // Optional text below the button (if needed)
      buttonText: {
        color: '#333', // Darker text color for readability
        fontSize: 18, // Larger font size for better readability
        fontWeight: 'bold',
        marginTop: 10, // Space above the text
      },
    
      errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 15,
      }


});