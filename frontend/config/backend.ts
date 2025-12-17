import { Platform } from 'react-native';

/**
 * Dynamic backend URL configuration
 * 
 * For Docker:
 * - Android emulator: http://10.0.2.2:8000 (emulator alias to host)
 * - Physical device: http://<HOST_IP>:8000 (set HOST_IP environment variable or change below)
 * - Docker container on macOS/Windows: http://host.docker.internal:8000
 * 
 * Environment variable: EXPO_PUBLIC_BACKEND_URL
 * Fallback: Android emulator uses 10.0.2.2, iOS/Web use localhost or your actual host IP
 */

export const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000');

export default BACKEND_URL;
