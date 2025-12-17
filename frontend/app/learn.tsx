import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { COLORS, FONT_SIZES } from '../src/styles/GlobalStyles';

const backgroundImage = require('../assets/images/background_image.jpeg'); // Make sure this image exists

const LearnScreen = () => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
    >
      <Stack.Screen options={{ headerShown: false }} /> 
      
      {/* Content wrapper with a semi-transparent overlay */}
      <View style={styles.contentOverlay}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Learn about Kolam</Text>
          <Text style={styles.subtitle}>Dive into the history, culture, and techniques behind traditional kolam designs.</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. History and Origin</Text>
            <Text style={styles.sectionText}>
              Kolams are traditional geometrical line art drawn by hand on the floor using rice flour. Originating in Southern India, they are a form of daily ritual art practiced by women. The practice dates back thousands of years and is believed to have a special place in ancient Indian spiritual traditions.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Cultural and Spiritual Significance</Text>
            <Text style={styles.sectionText}>
              More than just a decoration, the Kolam is believed to bring prosperity and ward off evil. The rice flour used to draw them serves as a food source for ants and birds, symbolizing a tribute to other beings. The act of drawing a Kolam is considered a spiritual discipline that promotes concentration, patience, and a sense of calm.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Types of Kolam</Text>
            <Text style={styles.sectionText}>
              • **Pulli Kolam (Dot Kolam):** Drawn around a grid of dots. The lines can be straight or curved, forming intricate patterns.
              {"\n\n"}
              • **Kambi Kolam (Line Kolam):** Continuous, unbroken lines drawn in a single motion, often forming a maze-like pattern.
              {"\n\n"}
              • **Chikku Kolam (Knot Kolam):** A complex version of the dot Kolam where lines interlace to form a single, continuous loop.
              {"\n\n"}
              • **Padikolam (Steps Kolam):** Drawn with parallel lines, resembling steps or a ladder, often seen in temples.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. The Art of Drawing Kolam</Text>
            <Text style={styles.sectionText}>
              Creating a Kolam is a meticulous process that requires precision and a steady hand. The designs can be simple or incredibly complex, but each one follows a mathematical and symmetrical pattern. The final design often represents a harmonious balance of nature and geometric forms, a beautiful blend of art and science.
            </Text>
          </View>
        </ScrollView>
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
  contentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a semi-transparent dark overlay
    width: '100%',
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 50,
    paddingBottom: 20,
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
    marginBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textLight,
    lineHeight: 24,
  },
});

export default LearnScreen;