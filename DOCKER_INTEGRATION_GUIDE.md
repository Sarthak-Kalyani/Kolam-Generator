# Docker Integration Guide for Kolam Explorer Frontend

## Overview
Your frontend is a React Native Expo app with these main screens:
- **Home** (`home.tsx`) - Main dashboard
- **Gallery** (`gallery.tsx`) - Browse kolams (currently uses static data)
- **Create** (`create.tsx`) - Generate kolams (currently uses mock data)
- **Analyze** (`analyze.tsx`) - Analyze uploaded kolams (currently uses mock data)
- **Generated Kolam** (`generated-kolam.tsx`) - Display generated kolam results
- **Analysis Results** (`analysis-results.tsx`) - Display analysis results

Your backend (created by your friend) is running in Docker with these important features:
- **Base64 encoded images** - Images are returned as base64 strings
- **REST API endpoints** - For generate, detect, and analyze operations

---

## Step 1: Identify Your Docker Backend URL

Ask your friend for:
1. **Docker Backend URL** - Where is the backend running?
   - Local: `http://localhost:5000` or `http://192.168.x.x:5000`
   - Cloud: `http://your-domain.com` or IP address
   
2. **API Endpoints** - What are the exact endpoints?
   - `/api/generate` or `/generate` ?
   - `/api/detect` or `/detect` ?
   - `/api/analyze` or `/analyze` ?
   - What parameters do they expect?

3. **Response Format** - Example response from backend:
   - Does it return `{ image: "base64string", ...other_data }` ?
   - Or `{ imageUrl: "data:image/jpeg;base64,...", ...other_data }` ?
   - Or something else?

---

## Step 2: Base64 Image Decoding in React Native

### What is Base64?
Base64 is a text representation of binary data. Your Docker backend returns images as base64 strings instead of URLs.

### How to Display Base64 Images in React Native

In your components, instead of:
```tsx
<Image source={{ uri: "https://example.com/image.jpg" }} />
```

Use this format for base64 images:
```tsx
<Image source={{ uri: `data:image/jpeg;base64,${base64String}` }} />
```

### Example:
```tsx
// If your backend returns: { image: "iVBORw0KGgoAAAANS..." }
const response = await fetch('http://your-docker-backend/api/generate');
const data = await response.json();

// Display it like this:
<Image source={{ uri: `data:image/jpeg;base64,${data.image}` }} style={styles.image} />
```

---

## Step 3: Files to Modify for Docker Integration

### **File 1: `app/create.tsx`**
**Current state:** Uses mock data, sends request to commented-out backend

**What to change:**
- Line 33-44: Replace the mock response with real Docker API call
- Send `gridSizeX`, `gridSizeY`, `symmetryType` to Docker backend
- Receive base64 image and decode it

**Before:**
```tsx
const mockResponse = {
  generatedKolamUri: 'https://...',  // URL
  // ...
};
```

**After:**
```tsx
const response = await fetch('http://YOUR_DOCKER_URL/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    gridSizeX, 
    gridSizeY, 
    symmetryType 
  }),
});
const data = await response.json();
// data.image is base64, convert to: data:image/jpeg;base64,${data.image}
```

---

### **File 2: `app/analyze.tsx`**
**Current state:** Uses mock data, has commented-out backend call

**What to change:**
- Line 92-112: Replace mock response with real Docker API call
- Upload the image file to Docker backend
- Receive base64 detected pattern and decode it

**Before:**
```tsx
const mockResponse = {
  originalImageUri: "https://...",
  detectedPatternUri: 'https://...',
  // ...
};
```

**After:**
```tsx
const formData = new FormData();
formData.append('image', {
  uri: selectedImage,
  name: 'kolam.jpg',
  type: 'image/jpeg',
});

const response = await fetch('http://YOUR_DOCKER_URL/api/detect', {
  method: 'POST',
  body: formData,
});
const data = await response.json();
// data.detectedPattern is base64, convert to: data:image/jpeg;base64,${data.detectedPattern}
```

---

### **File 3: `app/gallery.tsx`**
**Current state:** Displays static kolam types, no backend connection

**What to change:**
- Remove the `kolamTypes` static array
- Add `useEffect` to fetch kolams from Docker backend
- Display kolams dynamically

**Add this:**
```tsx
const [kolams, setKolams] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchKolams = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://YOUR_DOCKER_URL/api/kolams');
      const data = await response.json();
      setKolams(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchKolams();
}, []);
```

Then in render:
```tsx
{kolams.map(kolam => (
  <View key={kolam.id}>
    <Image source={{ uri: `data:image/jpeg;base64,${kolam.image}` }} />
  </View>
))}
```

---

### **File 4: `app/generated-kolam.tsx`**
**Current state:** Displays URI passed from create screen

**What to change:**
- If the base64 comes from create.tsx, it already displays correctly
- Just ensure you're using the `data:image/jpeg;base64,` format

---

### **File 5: `app/analysis-results.tsx`**
**Current state:** Displays URI passed from analyze screen

**What to change:**
- Same as generated-kolam.tsx
- If base64 comes from analyze.tsx, ensure proper format in Image component

---

## Step 4: Configuration Setup

### Create a Config File (Optional but Recommended)

Create `constants/config.ts`:
```ts
// Use this instead of hardcoding URLs everywhere
const DOCKER_BACKEND_URL = 'http://YOUR_DOCKER_IP:PORT';

export const API_ENDPOINTS = {
  GENERATE: `${DOCKER_BACKEND_URL}/api/generate`,
  DETECT: `${DOCKER_BACKEND_URL}/api/detect`,
  ANALYZE: `${DOCKER_BACKEND_URL}/api/analyze`,
  GET_KOLAMS: `${DOCKER_BACKEND_URL}/api/kolams`,
};

export default { DOCKER_BACKEND_URL, API_ENDPOINTS };
```

Then use it in your components:
```tsx
import { API_ENDPOINTS } from '../constants/config';

const response = await fetch(API_ENDPOINTS.GENERATE, {
  method: 'POST',
  // ...
});
```

---

## Step 5: Handling Base64 Images in All Screens

### Universal Pattern:
Whenever you receive a base64 image from Docker, use this pattern:

```tsx
// For displaying base64 images:
<Image 
  source={{ uri: `data:image/jpeg;base64,${base64String}` }} 
  style={styles.image} 
/>

// For saving base64 images to device gallery:
import * as FileSystem from 'expo-file-system';

const saveBase64Image = async (base64String) => {
  const base64Data = base64String.split(',')[1] || base64String;
  const fileUri = FileSystem.documentDirectory + 'kolam.jpg';
  
  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });
  
  const asset = await MediaLibrary.createAssetAsync(fileUri);
  return asset;
};
```

---

## Step 6: Deployment Considerations

### For Docker on Same Machine:
```
Backend URL: http://localhost:5000
(or the port your friend specified)
```

### For Docker on Different Machine:
```
Backend URL: http://192.168.x.x:5000
(use the machine's IP address on your network)
```

### For Docker on Cloud:
```
Backend URL: https://your-domain.com
(use the cloud domain)
```

---

## Summary: What You Need to Do

1. **Get backend info from your friend:**
   - Backend URL
   - Endpoint paths
   - Expected request format
   - Response format (especially for images)

2. **Update these files with Docker URLs:**
   - `app/create.tsx` - Replace mock with Docker API call
   - `app/analyze.tsx` - Replace mock with Docker API call
   - `app/gallery.tsx` - Add fetch from Docker API

3. **Handle base64 images:**
   - When displaying: `data:image/jpeg;base64,${base64String}`
   - When saving: Use `FileSystem.writeAsStringAsync` with Base64 encoding

4. **Test locally first** before deploying

---

## Example Integration (create.tsx modification)

Here's what the `handleGenerateKolam` function should look like after Docker integration:

```tsx
const handleGenerateKolam = async () => {
  setIsLoading(true);

  try {
    const response = await fetch('http://YOUR_DOCKER_URL/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gridSizeX,
        gridSizeY,
        symmetryType,
      }),
    });

    if (!response.ok) throw new Error('Generation failed');
    
    const data = await response.json();
    
    // data.image is base64 string from Docker
    const imageUri = `data:image/jpeg;base64,${data.image}`;

    router.push({
      pathname: 'generated-kolam',
      params: {
        generatedKolamUri: safeEncode(imageUri),
        gridSize: safeEncode(data.gridSize || `${gridSizeX}x${gridSizeY}`),
        symmetry: safeEncode(data.symmetry || symmetryType),
        lines: safeEncode(data.lines || 'Generated'),
        complexity: safeEncode(data.complexity || 'Dynamic'),
      },
    });

  } catch (error) {
    Alert.alert('Generation Failed', 'Could not generate the kolam. Please try again.');
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## Questions to Ask Your Friend

1. What is the Docker backend URL?
2. What are the exact API endpoint paths?
3. What format do you expect for request bodies?
4. What do you return in responses? (especially how are images encoded?)
5. Do you need authentication/API keys?
6. Are there any CORS issues I should handle?
7. What are the expected parameters for each endpoint?

Good luck! 🎨
