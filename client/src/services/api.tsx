// client/src/services/api.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL Configuration
// Android Emulator: http://10.0.2.2:3000
// iOS Simulator: http://localhost:3000
// Physical Device: http://YOUR_IP:3000

const API_BASE_URL = 'http://192.168.1.66:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor untuk handle errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired, logout user
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');
        }
        return Promise.reject(error);
    }
);

export default api;