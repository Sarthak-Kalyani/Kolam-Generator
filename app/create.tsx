import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Stack } from 'expo-router';
import { COLORS, FONT_SIZES } from '../src/styles/GlobalStyles';

const backgroundImage = require('../assets/images/background_image.jpeg'); // Replace with your create screen background image

const CreateScreen = () => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
    >
      <Stack.Screen options={{ headerShown: false }} /> 
      
      <View style={styles.content}>
        <Text style={styles.title}>Create Studio</Text>
        <Text style={styles.subtitle}>Design and create your own digital kolams with various tools and patterns.</Text>
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
  },
});

export default CreateScreen;