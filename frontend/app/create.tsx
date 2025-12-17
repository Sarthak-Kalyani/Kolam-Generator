import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { COLORS, FONT_SIZES, SHADOWS } from '../src/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { safeEncode } from '@/commom_js/common';
import { BACKEND_URL } from '../config/backend';

const backgroundImage = require('../assets/images/background_image.jpeg'); 

const CreateScreen = () => {
  const router:any = useRouter();
  const [gridSizeX, setGridSizeX] = useState(9);
  const [gridSizeY, setGridSizeY] = useState(9);
  // Use generator type names directly so they match backend and gallery
  const [symmetryType, setSymmetryType] = useState<'1d' | 'diamond' | 'lotus' | 'star'>('1d');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateKolam = async () => {
    setIsLoading(true);

    try {
      // Send values to the backend
      const response = await fetch(`${BACKEND_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ gridSizeX, gridSizeY, symmetryType }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      // Validate response data
      if (!data.generatedKolamUri) {
        throw new Error('Invalid response from server: missing generated kolam');
      }

      // Navigate to the new screen and pass the generated kolam data
      router.push({
        pathname: 'generated-kolam',
        params: {
          generatedKolamUri: safeEncode(data.generatedKolamUri),
          gridSize: safeEncode(data.gridSize || `${gridSizeX}x${gridSizeY}`),
          symmetry: safeEncode(data.symmetry || symmetryType),
          lines: safeEncode(data.lines || '0'),
          complexity: safeEncode(data.complexity || 'Unknown'),
        },
      });

    } catch (error: any) {
      console.error('Generation error:', error);
      Alert.alert(
        'Generation Failed', 
        error.message || 'Could not generate the kolam. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderDotGrid = () => {
    const dots = [];
    for (let i = 0; i < gridSizeY; i++) {
      const row = [];
      for (let j = 0; j < gridSizeX; j++) {
        row.push(<View key={`${i}-${j}`} style={styles.dot} />);
      }
      dots.push(
        <View key={i} style={styles.dotRow}>
          {row}
        </View>
      );
    }
    return <View style={styles.dotGridContainer}>{dots}</View>;
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
    >
      <Stack.Screen options={{ headerShown: false }} /> 
      
      <View style={styles.content}>
        <Text style={styles.title}>Create Studio</Text>
        
        {/* Grid Size Sliders */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderControl}>
            <Text style={styles.sliderLabel}>Grid Size X</Text>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={25}
              step={2}
              value={gridSizeX}
              onValueChange={setGridSizeX}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.textLight}
              thumbTintColor={COLORS.primary}
            />
            <Text style={styles.sliderValue}>{gridSizeX}</Text>
          </View>

          <View style={styles.sliderControl}>
            <Text style={styles.sliderLabel}>Grid Size Y</Text>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={25}
              step={2}
              value={gridSizeY}
              onValueChange={setGridSizeY}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.textLight}
              thumbTintColor={COLORS.primary}
            />
            <Text style={styles.sliderValue}>{gridSizeY}</Text>
          </View>
        </View>

        {/* Kolam Type Buttons */}
        <View style={styles.symmetryContainer}>
          <Text style={styles.symmetryLabel}>Kolam Type</Text>
          <View style={styles.symmetryButtons}>
            {['1d', 'diamond', 'lotus', 'star'].map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.symmetryButton, symmetryType === type && styles.symmetryButtonActive]}
                onPress={() => setSymmetryType(type)}
              >
                <Text style={[styles.symmetryButtonText, symmetryType === type && styles.symmetryButtonTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* The Dot Grid */}
        {renderDotGrid()}

        {/* Action Buttons */}
        <TouchableOpacity style={styles.actionButton} onPress={handleGenerateKolam} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.textLight} />
          ) : (
            <Text style={styles.actionButtonText}>GENERATE KOLAM</Text>
          )}
        </TouchableOpacity>
        
        {/* <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>START DRAWING MANUALLY</Text>
        </TouchableOpacity> */}
        
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    width: '100%',
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: FONT_SIZES.largeTitle,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 20,
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sliderControl: {
    marginBottom: 10,
  },
  sliderLabel: {
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.textLight,
  },
  sliderValue: {
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.primary,
    fontWeight: 'bold',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  symmetryContainer: {
    width: '100%',
    marginBottom: 30,
  },
  symmetryLabel: {
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.textLight,
    marginBottom: 10,
  },
  symmetryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  symmetryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  symmetryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  symmetryButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.body,
  },
  symmetryButtonTextActive: {
    fontWeight: 'bold',
  },
  dotGridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  dotRow: {
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textLight,
    margin: 4,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 15,
    ...SHADOWS.card,
    minWidth: 200, // Ensure button has a consistent size
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.subtitle,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.textLight,
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  secondaryButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.subtitle,
  },
});

export default CreateScreen;