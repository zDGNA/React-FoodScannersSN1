import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');



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
};

const CameraScannerScreen = ({ navigation }: CameraScannerScreenProps) => {
    const [isScanning, setIsScanning] = useState(false);
    const [detectedFood, setDetectedFood] = useState<DetectedFood | null>(null);
    const [showResult, setShowResult] = useState(false);

    // Simulasi AI Detection
    const handleScan = () => {
        setIsScanning(true);

        // Simulate AI processing
        setTimeout(() => {
            setDetectedFood({
                name: 'Grilled Chicken Breast',
                calories: 165,
                portion: '100g',
                confidence: 95,
                nutrients: {
                    protein: 31,
                    carbs: 0,
                    fat: 3.6,
                }
            });
            setIsScanning(false);
            setShowResult(true);
        }, 2000);
    };

    const handleConfirm = () => {
        // Navigate to detail screen atau simpan data
        setShowResult(false);
        setDetectedFood(null);
        // navigation.navigate('DetailScan', { foodData: detectedFood });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Camera View Placeholder */}
            <View style={styles.cameraView}>
                <View style={styles.cameraPlaceholder}>
                    <Ionicons name="camera-outline" size={80} color="rgba(255,255,255,0.5)" />
                    <Text style={styles.cameraText}>Camera View</Text>
                </View>

                {/* Scanning Overlay */}
                {isScanning && (
                    <View style={styles.scanningOverlay}>
                        <View style={styles.scanBox}>
                            <View style={[styles.corner, styles.cornerTopLeft]} />
                            <View style={[styles.corner, styles.cornerTopRight]} />
                            <View style={[styles.corner, styles.cornerBottomLeft]} />
                            <View style={[styles.corner, styles.cornerBottomRight]} />
                            <View style={styles.scanLine} />
                        </View>
                        <Text style={styles.scanningText}>Analyzing food...</Text>
                    </View>
                )}

                {/* Detection Result (Real-time feedback) */}
                {showResult && (
                    <View style={styles.resultOverlay}>
                        <View style={styles.detectionBox}>
                            <View style={styles.detectionHeader}>
                                <View style={styles.confidenceBadge}>
                                    <Text style={styles.confidenceText}>
                                        {detectedFood ? `${detectedFood.confidence}% Match` : ''}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.foodName}>{detectedFood ? detectedFood.name : ''}</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Top Controls */}
            <View style={styles.topControls}>
                <TouchableOpacity
                    style={styles.topButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="close" size={28} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.topButton}>
                    <Ionicons name="flash-off" size={24} color="#ffffff" />
                </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
                {!showResult ? (
                    <View style={styles.captureControls}>
                        <TouchableOpacity style={styles.galleryButton}>
                            <Ionicons name="images-outline" size={24} color="#ffffff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.captureButton,
                                isScanning && styles.captureButtonActive
                            ]}
                            onPress={handleScan}
                            disabled={isScanning}
                        >
                            <View style={styles.captureButtonInner} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.flipButton}>
                            <Ionicons name="camera-reverse-outline" size={24} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.resultPanel}>
                        <View style={styles.resultInfo}>
                            <View style={styles.nutrientQuick}>
                                <View style={styles.nutrientItem}>
                                    <Text style={styles.nutrientLabel}>Calories</Text>
                                    <Text style={styles.nutrientValue}>{detectedFood ? detectedFood.calories : ''}</Text>
                                </View>
                                <View style={styles.nutrientItem}>
                                    <Text style={styles.nutrientLabel}>Protein</Text>
                                    <Text style={styles.nutrientValue}>{detectedFood ? `${detectedFood.nutrients.protein}g` : ''}</Text>
                                </View>
                                <View style={styles.nutrientItem}>
                                    <Text style={styles.nutrientLabel}>Carbs</Text>
                                    <Text style={styles.nutrientValue}>{detectedFood ? `${detectedFood.nutrients.carbs}g` : ''}</Text>
                                </View>
                                <View style={styles.nutrientItem}>
                                    <Text style={styles.nutrientLabel}>Fat</Text>
                                    <Text style={styles.nutrientValue}>{detectedFood ? `${detectedFood.nutrients.fat}g` : ''}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.resultActions}>
                            <TouchableOpacity
                                style={styles.retakeButton}
                                onPress={() => {
                                    setShowResult(false);
                                    setDetectedFood(null);
                                }}
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
            {!isScanning && !showResult && (
                <View style={styles.instructions}>
                    <Text style={styles.instructionText}>
                        Position food in the center and tap to scan
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    cameraView: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 18,
        marginTop: 20,
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
    scanLine: {
        width: '100%',
        height: 2,
        backgroundColor: '#4ade80',
        position: 'absolute',
        top: '50%',
    },
    scanningText: {
        color: '#ffffff',
        fontSize: 16,
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
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ffffff',
    },
    flipButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
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
    },
});
export default CameraScannerScreen;
