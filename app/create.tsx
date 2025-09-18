import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { COLORS, FONT_SIZES, SHADOWS } from '../src/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { safeEncode } from '@/commom_js/common';

const backgroundImage = require('../assets/images/background_image.jpeg'); 

const CreateScreen = () => {
  const router:any = useRouter();
  const [gridSizeX, setGridSizeX] = useState(9);
  const [gridSizeY, setGridSizeY] = useState(9);
  const [symmetryType, setSymmetryType] = useState('Rotational');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateKolam = async () => {
    setIsLoading(true);

    // Mock a delay to simulate a backend request
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // In a real app, you would send these values to your backend
      // and receive a response with the generated kolam's URI and details.
      // const response = await fetch('YOUR_BACKEND_URL/generate', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ gridSizeX, gridSizeY, symmetryType }),
      // });
      // const data = await response.json();

      // Mock the backend response with a remote image URL
      const mockResponse = {
        generatedKolamUri: 'https://th.bing.com/th/id/R.02f6177e62c98bcd9ef4b4f7bcb40189?rik=GpH2czvJWPcjbA&riu=http%3a%2f%2fwebneel.com%2fdaily%2fsites%2fdefault%2ffiles%2fimages%2fdaily%2f08-2014%2f15-kolam.jpg&ehk=2ugbcBKWlQEevajRj9OjV44auXn7Fj%2flZVJqP4Hh18U%3d&risl=&pid=ImgRaw&r=0',
        gridSize: `${gridSizeX}x${gridSizeY} Dots`,
        symmetry: `${symmetryType} (Generated)`,
        lines: 'Generated',
        complexity: 'Dynamic',
      };
      
      // Navigate to the new screen and pass the generated kolam data
      router.push({
        pathname: 'generated-kolam',
        params: {
          generatedKolamUri: safeEncode(mockResponse.generatedKolamUri),
          gridSize: safeEncode(mockResponse.gridSize),
          symmetry: safeEncode(mockResponse.symmetry),
          lines: safeEncode(mockResponse.lines),
          complexity: safeEncode(mockResponse.complexity),
        },
      });

    } catch (error) {
      Alert.alert('Generation Failed', 'Could not generate the kolam. Please try again.');
      console.error(error);
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

        {/* Symmetry Type Buttons */}
        <View style={styles.symmetryContainer}>
          <Text style={styles.symmetryLabel}>Symmetry Type</Text>
          <View style={styles.symmetryButtons}>
            {['None', 'Rotational', 'Reflective', 'Radial'].map(type => (
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