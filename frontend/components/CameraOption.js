import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';
import styles from '../styles/CameraoptionStyles';
import { useNavigation } from '@react-navigation/native';
import CameraoptionStyles from '../styles/CameraoptionStyles';

export default function CameraOption() {
    const [hasPermission, setHasPermission] = useState(null);
    const [error, setError] = useState(null);
    const navigation = useNavigation(); // Navigation instance

    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    const TakePhoto = async () => {
      try {
        if (hasPermission) {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
          });

          if (result.cancelled) {
            setError('No photo selected');
            return;// Handle if user cancels taking a photo
          }
          if (result.assets[0].uri) {
            // Navigate to the ImagePreview component and pass the selected image URI
            navigation.navigate('ImagePreview', { imageUri: result.assets[0].uri });
            setError(null);
            return
          } 
        } else {
          setError('Camera permission not granted');
          Alert.alert('Permission required', 'We need camera permissions to take pictures.');
        }
      } catch (error) {
        Alert.alert("No Photo taken", "Please capture an Image and proceed");
      }
    };

    return (
      <View style={CameraoptionStyles.Cameracontainer}>
        <TouchableOpacity style={CameraoptionStyles.button} onPress={TakePhoto}>
          <MaterialCommunityIcons name="camera" style={CameraoptionStyles.icon} />
        </TouchableOpacity>
        {error && <Text style={CameraoptionStyles.errorText}>{error}</Text>}
      </View>
    );
}
