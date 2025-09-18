import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';
import { useRouter, Stack } from 'expo-router'; // Changed useNavigation to useRouter for consistency with Expo Router's approach
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SHADOWS } from '../src/styles/GlobalStyles';

const { width } = Dimensions.get('window');
const mainButtonSize = width * 0.28;

// Path to your Kolam of the Day image (icon.png as you specified)
const kolamOfTheDay = require('../assets/images/icon.png'); 

// Path to your full background image for the home screen
const homeBackgroundImage = require('../assets/images/background_image.jpeg'); // *** IMPORTANT: Make sure this image exists ***

const HomeScreen = () => {
  const router:any = useRouter(); // Using useRouter for navigation consistent with Expo Router

  return (
    <ImageBackground
      source={homeBackgroundImage}
      style={styles.background}
    >
      <Stack.Screen options={{ title: 'Home', headerShown: false }} /> 
      
      {/* Content wrapper to slightly dim the background for readability, if needed */}
      <View style={styles.contentWrapper}> 
        <View style={styles.header}>
          <Text style={styles.logoTitle}>KOLAM EXPLORER</Text>
          <Text style={styles.logoSubtitle}>Art • Code • Culture</Text>
        </View>

        <View style={styles.kolamOfTheDayContainer}>
          <Text style={styles.sectionTitle}>Kolam of the Day</Text>
          <Image 
            source={kolamOfTheDay} 
            style={styles.kolamImage} 
          />
        </View>

        <View style={styles.mainButtonsContainer}>
          <TouchableOpacity style={styles.mainButton} onPress={() => router.push('analyze')}>
            <MaterialIcons name="camera-alt" size={32} color={COLORS.textDark} />
            <Text style={styles.mainButtonText}>ANALYZE KOLAM</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainButton} onPress={() => router.push('create')}>
            <MaterialIcons name="edit" size={32} color={COLORS.textDark} />
            <Text style={styles.mainButtonText}>CREATE STUDIO</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainButton} onPress={() => router.push('gallery')}>
            <MaterialIcons name="photo-library" size={32} color={COLORS.textDark} />
            <Text style={styles.mainButtonText}>KOLAM GALLERY</Text>
          </TouchableOpacity>
        </View>

        {/* The bottom navigation needs to be positioned absolutely within the ImageBackground */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.bottomButton} onPress={() => router.push('learn')}>
            <MaterialIcons name="book" size={24} color={COLORS.textLight} />
            <Text style={styles.bottomButtonText}>LEARN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => router.push('settings')}>
            <MaterialIcons name="settings" size={24} color={COLORS.textLight} />
            <Text style={styles.bottomButtonText}>SETTINGS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the entire background
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: { // Added a wrapper to contain all screen content on top of the background
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 100, // Adjust this as needed for spacing from the top
    // backgroundColor: 'rgba(0,0,0,0.3)', // Optional: a slight dark overlay to make text pop
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoTitle: {
    fontSize: FONT_SIZES.largeTitle,
    fontWeight: 'bold',
    color: COLORS.card, // Assuming COLORS.card is white or light
  },
  logoSubtitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.card,
    opacity: 0.8,
  },
  kolamOfTheDayContainer: {
    alignItems: 'center',
    marginTop:40,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: 'bold',
    color: COLORS.card,
    marginBottom: 10,
  },
  kolamImage: {
    width: 200,
    height: 200,
    borderRadius: 100, // Makes it circular
    borderWidth: 2,
    // borderColor: 'yellow', // Glowing effect
  },
  mainButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '90%',
    // marginBottom: 40,
    // paddingHorizontal: 0,// Added padding to ensure buttons don't touch edges
    marginTop: 80,

  },
  mainButton: {
    width: mainButtonSize,
    height: mainButtonSize,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  mainButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 5,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    position: 'absolute', // Positions it at the bottom relative to the ImageBackground
    bottom: 20,
  },
  bottomButton: {
    alignItems: 'center',
  },
  bottomButtonText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 5,
  },
});

export default HomeScreen;