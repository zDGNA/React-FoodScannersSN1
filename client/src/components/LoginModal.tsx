import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface LoginModalProps {
    visible: boolean;
    onClose: () => void;
    onLoginSuccess?: () => void;
}

const LoginModal = ({ visible, onClose, onLoginSuccess }: LoginModalProps) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSubmit = () => {
        // TODO: Implement actual login/register logic here
        console.log('Login/Register:', { email, password, fullName });

        // For now, just close modal
        // In future, call API and handle response
        if (onLoginSuccess) {
            onLoginSuccess();
        }
        onClose();
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setFullName('');
        setIsLogin(true);
    };

    const handleClose = () => {
        resetForm();
        onClose();
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
                                    />
                                </View>
                            </View>
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
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        {isLogin && (
                            <TouchableOpacity>
                                <Text style={styles.forgotPassword}>Forgot Password?</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.primaryButtonText}>
                                {isLogin ? 'Sign In' : 'Sign Up'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-google" size={20} color="#DB4437" />
                            <Text style={styles.socialButtonText}>Continue with Google</Text>
                        </TouchableOpacity>

                        <View style={styles.switchAuth}>
                            <Text style={styles.switchAuthText}>
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            </Text>
                            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
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