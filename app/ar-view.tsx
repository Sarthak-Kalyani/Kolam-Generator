import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SHADOWS } from '../src/styles/GlobalStyles';
import * as MediaLibrary from 'expo-media-library';

const ARViewScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { generatedKolamUri } = params;
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const cameraRef = useRef<Camera>(null);

  // Request camera and media library permissions on component mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await requestPermission();
      if (!cameraStatus.granted) {
        Alert.alert('Permission Required', 'Please grant camera access to use this feature.');
      }
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      if (!mediaStatus.granted) {
        Alert.alert('Permission Required', 'Please grant media library access to save photos.');
      }
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current && generatedKolamUri) {
      setIsTakingPicture(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        
        // This 'photo' object now contains the URI of the captured image
        // which includes both the camera feed and the overlay.
        
        const mediaStatus = await MediaLibrary.requestPermissionsAsync();
        if (mediaStatus.granted) {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
            Alert.alert("Photo Saved!", "Your AR photo has been saved to your gallery.");
        } else {
            Alert.alert("Permission Denied", "Couldn't save the photo. Media library permission not granted.");
        }

      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert("Error", "Failed to capture photo. Please try again.");
      } finally {
        setIsTakingPicture(false);
      }
    } else {
        Alert.alert("Error", "Kolam image not available or camera not ready.");
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} /> 
      <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
        <View style={styles.overlayContainer}>
          {generatedKolamUri && (
            <Image
              source={{ uri: generatedKolamUri as string }}
              style={styles.overlayImage}
            />
          )}
        </View>
      </Camera>
      
      {/* Back button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
      
      {/* Capture button */}
      <View style={styles.captureButtonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture} disabled={isTakingPicture}>
          {isTakingPicture ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <MaterialIcons name="camera" size={48} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  permissionText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.subtitle,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  permissionButtonText: {
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  overlayImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    opacity: 0.8,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 10,
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 15,
    borderWidth: 2,
    borderColor: 'white',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ARViewScreen;