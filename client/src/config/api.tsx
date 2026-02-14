// client/src/config/api.ts
import { Platform } from 'react-native';

// ============================================
// CHANGE THIS TO YOUR COMPUTER'S IP ADDRESS
// ============================================
const YOUR_COMPUTER_IP = '192.168.1.66'; // ← GANTI DENGAN IP ANDA!

const BACKEND_PORT = '3000';

export const getApiBaseUrl = (): string => {
    // Android Emulator uses special IP to access host machine
    if (Platform.OS === 'android' && __DEV__) {
        return `http://192.168.1.66:${BACKEND_PORT}/api`;
    }

    // iOS Simulator or Physical Devices use actual IP
    return `http://${YOUR_COMPUTER_IP}:${BACKEND_PORT}/api`;
};

export const API_BASE_URL = getApiBaseUrl();

// For debugging
export const logApiConfig = () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📡 API Configuration:');
    console.log('  Platform:', Platform.OS);
    console.log('  Dev Mode:', __DEV__);
    console.log('  API Base URL:', API_BASE_URL);
    console.log('  Full Detect URL:', `${API_BASE_URL}/ai/detect`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};