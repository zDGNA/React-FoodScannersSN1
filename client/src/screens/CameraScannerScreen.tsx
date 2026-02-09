// client/src/screens/CameraScannerScreen.tsx

import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Platform, Linking, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import LoginModal from '../components/LoginModal';
import axios from 'axios';
import FormData from 'form-data';

const { width, height } = Dimensions.get('window');

// API Base URL - Sesuaikan dengan setup Anda
const API_BASE_URL = 'http://10.0.2.2:3000/api';

type CameraScannerScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

type DetectedFood = {
    name: string;
    calories: number;
    portion: string;
    confidence: number;
    nutrients: {
        protein: number;
        carbs: number;
        fat: number;
    };
    food_id?: number;
};

const CameraScannerScreen = ({ navigation }: CameraScannerScreenProps) => {
    const [isScanning, setIsScanning] = useState(false);
    const [detectedFood, setDetectedFood] = useState<DetectedFood | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');

    // Guest mode - TODO: Nanti ganti dengan state dari AuthContext
    const isGuest = true;

    // Camera hooks
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const camera = useRef<Camera>(null);


    // Request camera permission on mount
    useEffect(() => {
        checkCameraPermission();
    }, []);

    const checkCameraPermission = async () => {
        if (!hasPermission) {
            const permission = await requestPermission();
            if (!permission) {
                Alert.alert(
                    'Camera Permission Required',
                    'Please enable camera access in your device settings to use this feature.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ]
                );
            }
        }
    };

    const handleTakePhoto = async () => {
        if (isGuest) {
            setShowLoginModal(true);
            return;
        }

        if (!camera.current) {
            Alert.alert('Error', 'Camera not ready');
            return;
        }

        try {
            setIsScanning(true);

            // Take photo
            const photo = await camera.current.takePhoto({
                flash: flashMode,
            });

            console.log('Photo taken:', photo.path);
            setCapturedImage(`file://${photo.path}`);

            // Send to AI for detection
            await detectFood(`file://${photo.path}`);

        } catch (error) {
            console.error('Take photo error:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
            setIsScanning(false);
        }
    };

    const handleGallery = async () => {
        if (isGuest) {
            setShowLoginModal(true);
            return;
        }

        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 1,
            });

            if (result.didCancel) {
                return;
            }

            if (result.assets && result.assets[0]) {
                const asset = result.assets[0];
                console.log('Image selected:', asset.uri);

                setIsScanning(true);
                setCapturedImage(asset.uri || null);

                // Send to AI for detection
                await detectFood(asset.uri || '');
            }
        } catch (error) {
            console.error('Gallery picker error:', error);
            Alert.alert('Error', 'Failed to select image from gallery.');
        }
    };

    const detectFood = async (imageUri: string) => {
        try {
            // Create form data
            const formData = new FormData();

            // Prepare image file
            const filename = imageUri.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('image', {
                uri: imageUri,
                type: type,
                name: filename,
            } as any);

            // Send to backend API
            const response = await axios.post(`${API_BASE_URL}/ai/detect`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000, // 30 seconds
            });

            console.log('AI Detection Response:', response.data);

            if (response.data.success) {
                const detection = response.data.detection;

                setDetectedFood({
                    name: detection.food_name,
                    calories: detection.nutrition.calories,
                    portion: detection.portion,
                    confidence: detection.confidence,
                    nutrients: {
                        protein: detection.nutrition.protein,
                        carbs: detection.nutrition.carbs,
                        fat: detection.nutrition.fat,
                    },
                    food_id: detection.food_id,
                });

                setShowResult(true);
            } else {
                Alert.alert(
                    'No Food Detected',
                    'Could not identify any food in the image. Please try again with a clearer photo.',
                    [{ text: 'OK', onPress: () => handleRetake() }]
                );
            }
        } catch (error: any) {
            console.error('Food detection error:', error);

            let errorMessage = 'Failed to analyze image. ';

            if (error.code === 'ECONNABORTED') {
                errorMessage += 'Request timed out. Please try again.';
            } else if (error.response?.status === 503) {
                errorMessage += 'AI service is currently unavailable.';
            } else {
                errorMessage += 'Please check your connection and try again.';
            }

            Alert.alert('Detection Failed', errorMessage, [
                { text: 'OK', onPress: () => handleRetake() }
            ]);
        } finally {
            setIsScanning(false);
        }
    };

    const handleRetake = () => {
        setShowResult(false);
        setDetectedFood(null);
        setCapturedImage(null);
    };

    const handleConfirm = () => {
        if (isGuest) {
            setShowLoginModal(true);
            return;
        }

        // Navigate to detail screen with food data
        navigation.navigate('DetailScanScreen', {
            foodData: detectedFood,
            imageUri: capturedImage
        });

        // Reset state
        handleRetake();
    };

    const toggleFlash = () => {
        setFlashMode(flashMode === 'off' ? 'on' : 'off');
    };

    // If no permission, show permission screen
    if (!hasPermission) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Ionicons name="camera-outline" size={80} color="#666" />
                    <Text style={styles.permissionTitle}>Camera Permission Required</Text>
                    <Text style={styles.permissionText}>
                        We need access to your camera to scan and identify food items.
                    </Text>
                    <TouchableOpacity
                        style={styles.permissionButton}
                        onPress={checkCameraPermission}
                    >
                        <Text style={styles.permissionButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // If no device, show error
    if (!device) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Ionicons name="camera-outline" size={80} color="#666" />
                    <Text style={styles.permissionTitle}>Camera Not Available</Text>
                    <Text style={styles.permissionText}>
                        No camera device found on this device.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Camera View or Captured Image */}
            {!capturedImage ? (
                <Camera
                    ref={camera}
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={!showResult && !isGuest}
                    photo={true}
                    videoStabilizationMode="auto" // Opsi: "off", "standard", "cinematic", "cinematic-extended"
                />
            ) : (
                <Image
                    source={{ uri: capturedImage }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                />
            )}

            {/* Guest Overlay */}
            {isGuest && !capturedImage && (
                <View style={styles.guestOverlay}>
                    <Ionicons name="lock-closed" size={60} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.guestOverlayText}>Login to use camera</Text>
                </View>
            )}

            {/* Scanning Overlay */}
            {isScanning && (
                <View style={styles.scanningOverlay}>
                    <View style={styles.scanBox}>
                        <View style={[styles.corner, styles.cornerTopLeft]} />
                        <View style={[styles.corner, styles.cornerTopRight]} />
                        <View style={[styles.corner, styles.cornerBottomLeft]} />
                        <View style={[styles.corner, styles.cornerBottomRight]} />
                    </View>
                    <Text style={styles.scanningText}>Analyzing food...</Text>
                </View>
            )}

            {/* Detection Result Overlay */}
            {showResult && detectedFood && (
                <View style={styles.resultOverlay}>
                    <View style={styles.detectionBox}>
                        <View style={styles.detectionHeader}>
                            <View style={styles.confidenceBadge}>
                                <Text style={styles.confidenceText}>
                                    {detectedFood.confidence}% Match
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.foodName}>{detectedFood.name}</Text>
                    </View>
                </View>
            )}

            {/* Top Controls */}
            <View style={styles.topControls}>
                <TouchableOpacity
                    style={styles.topButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="close" size={28} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.topButton}
                    onPress={toggleFlash}
                    disabled={isGuest}
                >
                    <Ionicons
                        name={flashMode === 'on' ? "flash" : "flash-off"}
                        size={24}
                        color={isGuest ? "#666" : "#ffffff"}
                    />
                </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
                {!showResult ? (
                    <View style={styles.captureControls}>
                        <TouchableOpacity
                            style={[
                                styles.galleryButton,
                                isGuest && styles.buttonDisabled
                            ]}
                            onPress={handleGallery}
                        >
                            <Ionicons
                                name="images-outline"
                                size={24}
                                color={isGuest ? "#666" : "#ffffff"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.captureButton,
                                isGuest && styles.captureButtonGuest,
                                isScanning && styles.captureButtonActive
                            ]}
                            onPress={handleTakePhoto}
                            disabled={isScanning || isGuest}
                        >
                            <View style={styles.captureButtonInner}>
                                {isGuest && (
                                    <Ionicons name="lock-closed" size={24} color="#666" />
                                )}
                            </View>
                        </TouchableOpacity>

                        <View style={styles.galleryButton} />
                    </View>
                ) : (
                    <View style={styles.resultPanel}>
                        <View style={styles.resultInfo}>
                            <View style={styles.nutrientQuick}>
                                <View style={styles.nutrientItem}>
                                    <Text style={styles.nutrientLabel}>Calories</Text>
                                    <Text style={styles.nutrientValue}>
                                        {detectedFood?.calories}
                                    </Text>
                                </View>
                                <View style={styles.nutrientItem}>
                                    <Text style={styles.nutrientLabel}>Protein</Text>
                                    <Text style={styles.nutrientValue}>
                                        {detectedFood?.nutrients.protein}g
                                    </Text>
                                </View>
                                <View style={styles.nutrientItem}>
                                    <Text style={styles.nutrientLabel}>Carbs</Text>
                                    <Text style={styles.nutrientValue}>
                                        {detectedFood?.nutrients.carbs}g
                                    </Text>
                                </View>
                                <View style={styles.nutrientItem}>
                                    <Text style={styles.nutrientLabel}>Fat</Text>
                                    <Text style={styles.nutrientValue}>
                                        {detectedFood?.nutrients.fat}g
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.resultActions}>
                            <TouchableOpacity
                                style={styles.retakeButton}
                                onPress={handleRetake}
                            >
                                <Ionicons name="refresh" size={20} color="#666" />
                                <Text style={styles.retakeText}>Retake</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleConfirm}
                            >
                                <Text style={styles.confirmText}>Confirm & Save</Text>
                                <Ionicons name="checkmark" size={20} color="#ffffff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {/* Instructions */}
            {!isScanning && !showResult && !capturedImage && (
                <View style={styles.instructions}>
                    <Text style={styles.instructionText}>
                        {isGuest
                            ? 'Login to scan food and track nutrition'
                            : 'Position food in the center and tap to scan'
                        }
                    </Text>
                </View>
            )}

            {/* Login Modal */}
            <LoginModal
                visible={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={() => {
                    console.log('Login successful!');
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    permissionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    permissionText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    permissionButton: {
        backgroundColor: '#082374',
        paddingHorizontal: 30,
        paddingVertical: 14,
        borderRadius: 12,
    },
    permissionButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    guestOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    guestOverlayText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 18,
        marginTop: 16,
        fontWeight: '600',
    },
    scanningOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    scanBox: {
        width: 280,
        height: 280,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#4ade80',
        borderWidth: 3,
    },
    cornerTopLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    cornerTopRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    cornerBottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    cornerBottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    scanningText: {
        color: '#ffffff',
        fontSize: 18,
        marginTop: 40,
        fontWeight: '600',
    },
    resultOverlay: {
        position: 'absolute',
        top: height * 0.15,
        left: 20,
        right: 20,
    },
    detectionBox: {
        backgroundColor: 'rgba(8, 35, 116, 0.95)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: '#4ade80',
    },
    detectionHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    confidenceBadge: {
        backgroundColor: '#4ade80',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    confidenceText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: 'bold',
    },
    foodName: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    topControls: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    topButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 40,
    },
    captureControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    galleryButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: 'rgba(100,100,100,0.2)',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    captureButtonActive: {
        borderColor: '#4ade80',
    },
    captureButtonGuest: {
        backgroundColor: '#e0e0e0',
        borderColor: '#999',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultPanel: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
    },
    resultInfo: {
        marginBottom: 20,
    },
    nutrientQuick: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    nutrientItem: {
        alignItems: 'center',
    },
    nutrientLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    nutrientValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#082374',
    },
    resultActions: {
        flexDirection: 'row',
        gap: 12,
    },
    retakeButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    retakeText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    confirmButton: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: '#082374',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    confirmText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    instructions: {
        position: 'absolute',
        bottom: 160,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    instructionText: {
        color: '#ffffff',
        fontSize: 14,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        textAlign: 'center',
    },
});

export default CameraScannerScreen;