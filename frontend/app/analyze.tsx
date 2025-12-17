import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert, Image, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS, FONT_SIZES, SHADOWS } from '../src/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {safeEncode} from '../commom_js/common'
import { BACKEND_URL } from '../config/backend';
const backgroundImage = require('../assets/images/background_image.jpeg');

const AnalyzeScreen = () => {
  const router:any = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to open the camera and take a photo
  const takePhotoAsync = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera access to take a photo.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Function to open the gallery and pick an image
  const pickImageAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant gallery access to select an image.');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Function to send the image to a backend for analysis
  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('kolamImage', {
        uri: selectedImage,
        name: 'kolam_to_analyze.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      // Validate response data
      if (!data.originalImageUri || !data.detectedPatternUri) {
        throw new Error('Invalid response from server');
      }

      // Navigate to the analysis-results screen with the data
      router.push({
        pathname: "analysis-results",
        params: {
          originalImageUri: safeEncode(data.originalImageUri),
          detectedPatternUri: safeEncode(data.detectedPatternUri),
          gridSize: safeEncode(data.gridSize || 'Unknown'),
          symmetry: safeEncode(data.symmetry || 'Unknown'),
          lines: safeEncode(data.lines || '0'),
          complexity: safeEncode(data.complexity || 'Unknown'),
        },
      });
      
    } catch (error: any) {
      console.error('Analysis error:', error);
      Alert.alert(
        'Analysis Failed', 
        error.message || 'Could not connect to the analysis server. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
    >
      <Stack.Screen options={{ headerShown: false }} /> 
      
      <View style={styles.content}>
        <Text style={styles.title}>Analyze Kolam</Text>
        <Text style={styles.subtitle}>Upload or capture an image of a kolam to analyze its patterns and design.</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={takePhotoAsync}>
          <MaterialIcons name="camera" size={40} color={COLORS.textLight} />
          <Text style={styles.actionButtonText}>Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={pickImageAsync}>
          <MaterialIcons name="image" size={40} color={COLORS.textLight} />
          <Text style={styles.actionButtonText}>Select from Gallery</Text>
        </TouchableOpacity>

        {selectedImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : (
              <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
                <Text style={styles.analyzeButtonText}>ANALYZE</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: FONT_SIZES.largeTitle,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.subtitle,
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textLight,
  },
  analyzeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
    ...SHADOWS.card,
  },
  analyzeButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.subtitle,
    fontWeight: 'bold',
  },
});

export default AnalyzeScreen;