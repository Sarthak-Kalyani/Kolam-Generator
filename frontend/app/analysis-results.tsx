import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { COLORS, FONT_SIZES, SHADOWS } from '../src/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';

const backgroundImage = require('../assets/images/background_image.jpeg'); 

const AnalysisResultsScreen = () => {
  const router:any = useRouter();
  const params = useLocalSearchParams();
  const { originalImageUri, detectedPatternUri, gridSize, symmetry, lines, complexity } = params;
  

  const handleSaveToGallery = async () => {
    if (!detectedPatternUri) {
      Alert.alert('Save Failed', 'No analyzed image to save.');
      return;
    }

    // Request permission to access the media library
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant media library access to save the image.');
      return;
    }

    try {
      const uriString = String(detectedPatternUri);
      let assetUri: string;

      if (uriString.startsWith('file://')) {
        // Local file path
        assetUri = uriString;
      } else if (uriString.startsWith('data:')) {
        // data:image/...;base64,XXXX -> write to a temp file first
        const base64Data = uriString.split(',')[1] ?? '';
        if (!base64Data) {
          throw new Error('Invalid analyzed image data.');
        }
        const fileUri = `${FileSystem.cacheDirectory}analyzed_kolam_${Date.now()}.png`;
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        assetUri = fileUri;
      } else {
        // Remote URL – download then save
        const filename = uriString.split('/').pop() || `analyzed_kolam_${Date.now()}.png`;
        const fileUri = FileSystem.cacheDirectory + filename;
        const { uri } = await FileSystem.downloadAsync(uriString, fileUri);
        assetUri = uri;
      }

      await MediaLibrary.createAssetAsync(assetUri);

      Alert.alert("Saved!", "Your analyzed kolam has been saved to your gallery.");
      
      // Navigate to the home page after saving
      router.replace('home'); 
    } catch (error) {
      Alert.alert('Save Failed', 'Could not save the image to your gallery.');
      console.error(error);
    }
  };

  const goToHome = () => {
    // Clear the global variable and navigate to the home page
    (global as any).lastAnalyzedImageUri = null;
    router.replace('home');
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
    >
      <Stack.Screen options={{ headerShown: false }} /> 

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Kolam Analysis</Text>

        <View style={styles.imagesContainer}>
          <View style={styles.imageCard}>
            <Image
              source={{ uri: originalImageUri as string }}
              style={styles.analysisImage}
            />
            <Text style={styles.imageLabel}>Original Image</Text>
          </View>

          <View style={styles.imageCard}>
            <Image
              source={{ uri: detectedPatternUri as string }}
              style={styles.analysisImage}
            />
            <Text style={styles.imageLabel}>Detected Pattern</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Analysis Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Grid Size:</Text>
            <Text style={styles.summaryText}>{gridSize}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Symmetry:</Text>
            <Text style={styles.summaryText}>{symmetry}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Lines:</Text>
            <Text style={styles.summaryText}>{lines}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Complexity:</Text>
            <Text style={styles.summaryText}>{complexity}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveToGallery}>
          <Text style={styles.saveButtonText}>Save to Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={goToHome}>
          <Text style={styles.homeButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: FONT_SIZES.largeTitle,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 20,
    marginTop: 50,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  imageCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
    ...SHADOWS.card,
  },
  analysisImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  imageLabel: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.body,
    fontWeight: 'bold',
  },
  summaryCard: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 20,
    ...SHADOWS.card,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.body,
    fontWeight: 'bold',
  },
  summaryText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.body,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 40,
    ...SHADOWS.card,
  },
  saveButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.subtitle,
    fontWeight: 'bold',
  },
  homeButton: {
    marginTop: 20,
  },
  homeButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.subtitle,
    textDecorationLine: 'underline',
  },
});

export default AnalysisResultsScreen;