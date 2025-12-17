import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  PanResponder,
  Animated,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SHADOWS } from '../src/styles/GlobalStyles';
import Slider from '@react-native-community/slider';

const ARViewScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { generatedKolamUri } = params;
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef<Camera>(null);

  // Overlay transform state (size, position, opacity)
  const [opacity, setOpacity] = useState(0.8);
  const scale = useRef(new Animated.Value(1)).current;
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;

  // Request camera and media library permissions on component mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await requestPermission();
      if (!cameraStatus.granted) {
        Alert.alert('Permission Required', 'Please grant camera access to use this feature.');
      }
    })();
  }, []);

    if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} /> 
      <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
        <View style={styles.overlayContainer}>
          {generatedKolamUri && (
            <Animated.Image
              {...panResponder.panHandlers}
              source={{ uri: generatedKolamUri as string }}
              style={[
                styles.overlayImage,
                {
                  opacity,
                  transform: [...pan.getTranslateTransform(), { scale }],
                },
              ]}
            />
          )}
        </View>
      </Camera>
      
      {/* Back button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>

      {/* Size & opacity controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlBlock}>
          <Text style={styles.controlLabel}>Size</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2.0}
            value={1}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.textLight}
            thumbTintColor={COLORS.primary}
            onValueChange={(value) => {
              scale.setValue(value);
            }}
          />
        </View>
        <View style={styles.controlBlock}>
          <Text style={styles.controlLabel}>Opacity</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.2}
            maximumValue={1}
            value={opacity}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.textLight}
            thumbTintColor={COLORS.primary}
            onValueChange={setOpacity}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  permissionText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.subtitle,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  permissionButtonText: {
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  overlayImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    opacity: 0.8,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 10,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
  controlBlock: {
    marginBottom: 10,
  },
  controlLabel: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.body,
    marginBottom: 4,
  },
  slider: {
    width: '100%',
    height: 30,
  },
});

export default ARViewScreen;