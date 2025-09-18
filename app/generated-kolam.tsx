import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { COLORS, FONT_SIZES, SHADOWS } from "../src/styles/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const backgroundImage = require("../assets/images/background_image.jpeg");

const GeneratedKolamScreen = () => {
  const router: any = useRouter();
  const params = useLocalSearchParams();
  const { generatedKolamUri, gridSize, symmetry, lines, complexity } = params;

  const handleSaveToGallery = async () => {
    // Check if the URI exists
    if (!generatedKolamUri) {
      Alert.alert("Save Failed", "No image to save.");
      return;
    }

    // Request permission to access the media library
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant media library access to save the image."
      );
      return;
    }

    try {
      // Check if the URI is a local file or a remote URL
      const uriToSave = String(generatedKolamUri);
      let assetUri;

      if (uriToSave.startsWith("file://")) {
        assetUri = uriToSave;
      } else {
        // It's a remote URL, so download it first
        const filename = uriToSave.split("/").pop() || "generated_kolam.jpeg";
        const fileUri = FileSystem.cacheDirectory + filename;

        const { uri: downloadedUri } = await FileSystem.downloadAsync(
          uriToSave,
          fileUri
        );
        assetUri = downloadedUri;
      }

      await MediaLibrary.createAssetAsync(assetUri);

      Alert.alert(
        "Saved!",
        "Your generated kolam has been saved to your gallery."
      );
      router.replace("home");
    } catch (error: any) {
      Alert.alert("Save Failed", "Could not save the image to your gallery.");
      console.error(error);
    }
  };

  const handleViewInAR = () => {
    // Navigate to the AR view and pass the URI of the generated kolam
    router.push({
      pathname: 'ar-view',
      params: {
        generatedKolamUri: generatedKolamUri,
      },
    });
  };

  const goToHome = () => {
    router.replace("home");
  };
  const goToCreate = () => {
    router.replace("create");
  };
  const goToGallery = () => {
    router.replace("gallery");
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Generated Kolam</Text>

        <View style={styles.imageCard}>
          <Image
            source={{ uri: generatedKolamUri as string }}
            style={styles.kolamImage}
          />
          <Text style={styles.imageLabel}>Generated Kolam</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Kolam Details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Grid Size:</Text>
            <Text style={styles.summaryText}>{gridSize}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Symmetry:</Text>
            <Text style={styles.summaryText}>{symmetry}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Lines:</Text>
            <Text style={styles.summaryText}>{lines}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Complexity:</Text>
            <Text style={styles.summaryText}>{complexity}</Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.arButton} onPress={handleViewInAR}>
            <MaterialIcons name="camera-alt" size={24} color={COLORS.primary} />
            <Text style={styles.arButtonText}>VIEW IN AR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveToGallery}
          >
            <MaterialIcons name="save" size={24} color={COLORS.textLight} />
            <Text style={styles.saveButtonText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomButton} onPress={goToHome}>
          <MaterialIcons name="home" size={24} color={COLORS.textLight} />
          <Text style={styles.bottomButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={goToCreate}>
          <MaterialIcons name="create" size={28} color={COLORS.textLight} />
          <Text style={styles.bottomButtonText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={goToGallery}>
          <MaterialIcons name="image" size={28} color={COLORS.textLight} />
          <Text style={styles.bottomButtonText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  content: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: FONT_SIZES.largeTitle,
    fontWeight: "bold",
    color: COLORS.textLight,
    marginBottom: 20,
    marginTop: 50,
  },
  imageCard: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 10,
    ...SHADOWS.card,
    marginBottom: 30,
  },
  kolamImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 5,
  },
  imageLabel: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.body,
    fontWeight: "bold",
  },
  summaryCard: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: 20,
    ...SHADOWS.card,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: "bold",
    color: COLORS.textLight,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.body,
    fontWeight: "bold",
  },
  summaryText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.body,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 40,
    gap: 20,
  },
  arButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.textLight,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    ...SHADOWS.card,
  },
  arButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.subtitle,
    fontWeight: "bold",
    marginLeft: 10,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    ...SHADOWS.card,
  },
  saveButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.subtitle,
    fontWeight: "bold",
    marginLeft: 10,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    position: "absolute", // Positions it at the bottom relative to the ImageBackground
    bottom: 20,
  },
  bottomButton: {
    alignItems: "center",
  },
  bottomButtonText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 5,
  },
});

export default GeneratedKolamScreen;
