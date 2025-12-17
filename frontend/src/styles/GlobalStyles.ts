import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const COLORS = {
  primary: '#e94560',
  secondary: '#3498db',
  accent: '#16213e',
  textLight: '#f0f0f0',
  textDark: '#333333',
  background: '#f5f5f5',
  card: '#ffffff',
  border: '#dddddd',
};

export const PADDING = {
  horizontal: width * 0.05,
  vertical: 20,
};

export const FONT_SIZES = {
  largeTitle: 32,
  title: 24,
  subtitle: 18,
  body: 16,
};

export const SHADOWS = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});