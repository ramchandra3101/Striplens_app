import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';
import styles from '../styles/styles';

export default function CameraOption() {

  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null)
  const [error, setError] = useState(null);

  useEffect(()=>{
    (async()=>{
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  },[]);

  const TakePhoto = async() => {
    if(hasPermission) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if(!result.cancelled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setError(null);
      }
      else {
        setError('Camera Permission not granted');
        Alert.alert('Permission required', 'We need camera permissions to take pictures.');
      }
    };


  }

  return (
    <View style={styles.Cameracontainer}>
      <TouchableOpacity style= {styles.button} onPress={TakePhoto}>
        <MaterialCommunityIcons name="camera" style={styles.icon} />
      </TouchableOpacity>
      {image ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
        </View>
      ) : (
        error && <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}