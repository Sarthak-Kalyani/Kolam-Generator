import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONT_SIZES } from '../src/styles/GlobalStyles';

const backgroundImage = require('../assets/images/home.jpeg'); // Make sure this image exists

const IndexPage = () => {
  const router:any = useRouter();

  const handleGetStarted = () => {
    router.replace('home');
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
    >
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
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
    paddingBottom: '10%',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '600',
  },
});

export default IndexPage;