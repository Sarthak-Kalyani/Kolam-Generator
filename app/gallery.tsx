import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import { Stack } from 'expo-router';
import { COLORS, FONT_SIZES, SHADOWS } from '../src/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 60) / 2;

const backgroundImage = require('../assets/images/background_image.jpeg'); 

// Data for each kolam type and their images
const kolamTypes = [
  {
    id: 'pulli',
    name: 'Pulli Kolam',
    description: 'Drawn around a grid of dots, creating intricate patterns.',
    images: [
      require('../assets/images/icon.png'),
      require('../assets/images/icon.png'),
      require('../assets/images/icon.png'),
    ],
  },
  {
    id: 'kambi',
    name: 'Kambi Kolam',
    description: 'A single, continuous line forming a beautiful maze-like pattern.',
    images: [
      require('../assets/images/icon.png'),
      require('../assets/images/icon.png'),
      require('../assets/images/icon.png'),
    ],
  },
  {
    id: 'sikku',
    name: 'Sikku Kolam',
    description: 'A complex version of the dot Kolam where lines interlace to form a single, continuous loop.',
    images: [
      require('../assets/images/icon.png'),
      require('../assets/images/icon.png'),
      require('../assets/images/icon.png'),
    ],
  },
  {
    id: 'pulli',
    name: 'Pulli Kolam',
    description: 'Drawn around a grid of dots, creating intricate patterns.',
    images: [
      require('../assets/images/icon.png'),
      require('../assets/images/icon.png'),
      require('../assets/images/icon.png'),
    ],
  },
  {
    id: 'kambi',
    name: 'Kambi Kolam',
    description: 'A single, continuous line forming a beautiful maze-like pattern.',
    images: [
      require('../assets/images/icon.png'),
      require('../assets/images/icon.png'),
      require('../assets/images/icon.png'),
    ],
  },
  {
    id: 'sikku',
    name: 'Sikku Kolam',
    description: 'A complex version of the dot Kolam where lines interlace to form a single, continuous loop.',
    images: [
      require('../assets/images/icon.png'),
      require('../assets/images/icon.png'),
      require('../assets/images/icon.png'),
    ],
  },
];

const GalleryScreen = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const renderKolamType = ({ item }: { item: typeof kolamTypes[0] }) => (
    <TouchableOpacity
      style={styles.typeButton}
      onPress={() => setSelectedType(item.id)}
    >
      <Text style={styles.typeButtonText}>{item.name}</Text>
      <Text style={styles.typeDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderKolamImage = ({ item }: { item: any }) => (
    <View style={styles.imageContainer}>
      <Image source={item} style={styles.kolamImage} />
    </View>
  );

  // Find the selected kolam type data
  const kolamData = kolamTypes.find(type => type.id === selectedType);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
    >
      <Stack.Screen options={{ headerShown: false }} /> 
      
      <View style={styles.content}>
        {selectedType ? (
          // Display the gallery of images for the selected type
          <View style={styles.galleryView}>
            <TouchableOpacity onPress={() => setSelectedType(null)} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color={COLORS.textLight} />
              <Text style={styles.backButtonText}>Back to Types</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{kolamData?.name}</Text>
            <FlatList
              data={kolamData?.images}
              renderItem={renderKolamImage}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              columnWrapperStyle={styles.row}
              key={selectedType} // Added a key here to force a re-render when the type changes
            />
          </View>
        ) : (
          // Display the initial list of kolam types
          <View style={styles.listView}>
            <Text style={styles.title}>Kolam Gallery</Text>
            <Text style={styles.subtitle}>Explore different types of kolams.</Text>
            <FlatList
              data={kolamTypes}
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