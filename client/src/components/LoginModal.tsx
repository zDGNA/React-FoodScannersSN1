// client/src/components/LoginModal.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

// Storage utility with fallback
const setStorageItem = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error(`Failed to save ${key}:`, error);
    }
};

// API Base URL - Sesuaikan dengan IP komputer Anda
// Untuk Android Emulator: http://10.0.2.2:3000
// Untuk iOS Simulator: http://localhost:3000
// Untuk Physical Device: http://YOUR_COMPUTER_IP:3000 (contoh: http://192.168.1.100:3000)
import { API_BASE_URL } from '../config/api';

interface LoginModalProps {
    visible: boolean;
    onClose: () => void;
    onLoginSuccess?: (userData: any) => void;
}

const LoginModal = ({ visible, onClose, onLoginSuccess }: LoginModalProps) => {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = async () => {
        // Validation
        if (!fullName.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }
        if (!username.trim()) {
            Alert.alert('Error', 'Please enter a username');
            return;
        }
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password: password,
                full_name: fullName.trim(),
            });

            if (response.data.success) {
                await login(response.data.token, response.data.user);
                // Save token
                await AsyncStorage.setItem('authToken', response.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));

                Alert.alert('Success', 'Account created successfully!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            resetForm();
                            if (onLoginSuccess) {
                                onLoginSuccess(response.data.user);
                            }
                            onClose();
                        },
                    },
                ]);
            }
        } catch (error: any) {
            console.error('Register error:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            Alert.alert('Registration Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        // Validation
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        if (!password) {
            Alert.alert('Error', 'Please enter your password');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email: email.trim().toLowerCase(),
                password: password,
            });

            if (response.data.success) {
                await login(response.data.token, response.data.user);
                // Save token
                await AsyncStorage.setItem('authToken', response.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));

                Alert.alert('Success', 'Welcome back!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            resetForm();
                            if (onLoginSuccess) {
                                onLoginSuccess(response.data.user);
                            }
                            onClose();
                        },
                    },
                ]);
            }
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        if (isLogin) {
            handleLogin();
        } else {
            handleRegister();
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setFullName('');
        setUsername('');
        setIsLogin(true);
        setShowPassword(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setFullName('');
        setUsername('');
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleClose}
                        disabled={isLoading}
                    >
                        <Ionicons name="close" size={28} color="#333" />
                    </TouchableOpacity>

                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {isLogin ? 'Welcome Back!' : 'Create Account'}
                        </Text>
                        <Text style={styles.modalSubtitle}>
                            {isLogin
                                ? 'Sign in to track your nutrition'
                                : 'Start your health journey today'
                            }
                        </Text>
                    </View>

                    <View style={styles.modalBody}>
                        {!isLogin && (
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Full Name</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="person-outline" size={20} color="#666" />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter your name"
                                            placeholderTextColor="#999"
                                            value={fullName}
                                            onChangeText={setFullName}
                                            editable={!isLoading}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Username</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="at-outline" size={20} color="#666" />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Choose a username"
                                            placeholderTextColor="#999"
                                            value={username}
                                            onChangeText={setUsername}
                                            autoCapitalize="none"
                                            editable={!isLoading}
                                        />
                                    </View>
                                </View>
                            </>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#666" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#999"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!isLoading}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#999"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    editable={!isLoading}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {isLogin && (
                            <TouchableOpacity>
                                <Text style={styles.forgotPassword}>Forgot Password?</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    {isLogin ? 'Sign In' : 'Sign Up'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
                            <Ionicons name="logo-google" size={20} color="#DB4437" />
                            <Text style={styles.socialButtonText}>Continue with Google</Text>
                        </TouchableOpacity>

                        <View style={styles.switchAuth}>
                            <Text style={styles.switchAuthText}>
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            </Text>
                            <TouchableOpacity onPress={switchMode} disabled={isLoading}>
                                <Text style={styles.switchAuthLink}>
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 24,
        maxHeight: '90%',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 8,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#082374',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    modalBody: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#f9f9f9',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
    },
    forgotPassword: {
        color: '#082374',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'right',
        marginTop: -10,
        marginBottom: 20,
    },
    primaryButton: {
        backgroundColor: '#082374',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    primaryButtonDisabled: {
        opacity: 0.6,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        marginHorizontal: 15,
        color: '#999',
        fontSize: 13,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingVertical: 14,
    },
    socialButtonText: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    switchAuth: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    switchAuthText: {
        color: '#666',
        fontSize: 14,
    },
    switchAuthLink: {
        color: '#082374',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default LoginModal;