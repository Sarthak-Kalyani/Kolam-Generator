import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, Dimensions, Image, ActivityIndicator, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { COLORS, FONT_SIZES, SHADOWS } from '../src/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { BACKEND_URL } from '../config/backend';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 60) / 2;

const backgroundImage = require('../assets/images/background_image.jpeg'); 

// Kolam gallery types shown in the UI
const kolamTypesMeta = [
  {
    id: '1d',
    name: '1D Kolam',
    description: 'Basic line-based Kolam pattern.',
  },
  {
    id: 'diamond',
    name: 'Diamond Kolam',
    description: 'Diamond shaped Kolam pattern.',
  },
  {
    id: 'lotus',
    name: 'Lotus Kolam',
    description: 'Lotus-flower Kolam pattern.',
  },
  {
    id: 'star',
    name: 'Star Kolam',
    description: 'Star shaped Kolam pattern.',
  },
];

type KolamTypeId = '1d' | 'diamond' | 'lotus' | 'star';

type GalleryResponse = {
  [key in KolamTypeId]?: string[]; // array of data URIs
};

const GalleryScreen = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [galleryData, setGalleryData] = useState<GalleryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Load gallery images from backend
  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/gallery`);
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || 'Failed to load gallery');
        }
        setGalleryData(json as GalleryResponse);
      } catch (err: any) {
        console.error('Gallery load error:', err);
        Alert.alert('Error', err?.message || 'Failed to load kolam gallery.');
        setGalleryData(null);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const renderKolamType = ({ item }: { item: typeof kolamTypesMeta[0] }) => (
    <TouchableOpacity
      style={styles.typeButton}
      onPress={() => setSelectedType(item.id)}
    >
      <Text style={styles.typeButtonText}>{item.name}</Text>
      <Text style={styles.typeDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderKolamImage = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.kolamImage} />
    </View>
  );

  // Find the selected kolam type data
  const kolamMeta = kolamTypesMeta.find(type => type.id === selectedType);
  const imagesForType = selectedType && galleryData ? galleryData[selectedType as KolamTypeId] || [] : [];

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
    >
      <Stack.Screen options={{ headerShown: false }} /> 
      
      <View style={styles.content}>
        {loading && !galleryData ? (
          <ActivityIndicator size="large" color={COLORS.textLight} />
        ) : selectedType ? (
          // Display the gallery of images for the selected type
          <View style={styles.galleryView}>
            <TouchableOpacity onPress={() => setSelectedType(null)} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color={COLORS.textLight} />
              <Text style={styles.backButtonText}>Back to Types</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{kolamMeta?.name}</Text>
            {imagesForType.length === 0 ? (
              <Text style={styles.subtitle}>No kolams generated yet for this type.</Text>
            ) : (
              <FlatList
                data={imagesForType}
                renderItem={renderKolamImage}
                keyExtractor={(_item, index) => `${selectedType}-${index}`}
                numColumns={2}
                columnWrapperStyle={styles.row}
                key={selectedType}
              />
            )}
          </View>
        ) : (
          // Display the initial list of kolam types
          <View style={styles.listView}>
            <Text style={styles.title}>Kolam Gallery</Text>
            <Text style={styles.subtitle}>Explore different types of kolams.</Text>
            <FlatList
              data={kolamTypesMeta}
              renderItem={renderKolamType}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              key="list-view" // Added a key here to distinguish it from the gallery FlatList
            />
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
    paddingTop: 50,
  },
  title: {
    fontSize: FONT_SIZES.largeTitle,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  // Styles for the list view
  listView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:100
  },
  listContainer: {
    paddingTop: 20,
  },
  typeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: width * 0.9,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  typeButtonText: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 5,
  },
  typeDescription: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  // Styles for the gallery view
  galleryView: {
    flex: 1,
    width: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.body,
    marginLeft: 5,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  kolamImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default GalleryScreen;