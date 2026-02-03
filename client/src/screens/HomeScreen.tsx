import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { ProgressBar } from 'react-native-paper'; // Install: npm install react-native-paper
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true); // Toggle between login/register

    // Mock data untuk demo
    const dailyCalories = 1847;
    const targetCalories = 2000;
    const progress = dailyCalories / targetCalories;

    const nutritionData = {
        carbs: { current: 0, target: 250 },
        protein: { current: 0, target: 100 },
        fat: { current: 0, target: 70 },
    };

    const handleFeatureClick = () => {
        setShowLoginModal(true);
    };
    const scanFeatureClick = () => {
        navigation.navigate('Scanner');
    };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.greeting}>Hello, Guest! 👋</Text>
                            <Text style={styles.subtitle}>Track your nutrition today</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.profileIcon}
                            onPress={handleFeatureClick}
                        >
                            <Ionicons name="person-circle-outline" size={40} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Calorie Progress Card */}
                    <TouchableOpacity
                        style={styles.calorieCard}
                        onPress={handleFeatureClick}
                    >
                        <View style={styles.calorieHeader}>
                            <Text style={styles.cardTitle}>Daily Calories</Text>
                            <Text style={styles.dateText}>Today</Text>
                        </View>

                        <View style={styles.calorieStats}>
                            <Text style={styles.calorieNumber}>{dailyCalories}</Text>
                            <Text style={styles.calorieTarget}>/ {targetCalories} kcal</Text>
                        </View>

                        <ProgressBar
                            progress={progress}
                            color="#4ade80"
                            style={styles.progressBar}
                        />

                        <View style={styles.calorieRemaining}>
                            <Text style={styles.remainingText}>
                                {targetCalories - dailyCalories} kcal remaining
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Nutrition Chart */}
                    <View style={styles.nutritionCard}>
                        <Text style={styles.cardTitle}>Macronutrients</Text>

                        {/* Carbs */}
                        <View style={styles.nutrientRow}>
                            <View style={styles.nutrientHeader}>
                                <View style={[styles.nutrientDot, { backgroundColor: '#fbbf24' }]} />
                                <Text style={styles.nutrientLabel}>Carbs</Text>
                            </View>
                            <Text style={styles.nutrientValue}>
                                {nutritionData.carbs.current}g / {nutritionData.carbs.target}g
                            </Text>
                            <ProgressBar
                                progress={nutritionData.carbs.current / nutritionData.carbs.target}
                                color="#fbbf24"
                                style={styles.nutrientBar}
                            />
                        </View>

                        {/* Protein */}
                        <View style={styles.nutrientRow}>
                            <View style={styles.nutrientHeader}>
                                <View style={[styles.nutrientDot, { backgroundColor: '#f87171' }]} />
                                <Text style={styles.nutrientLabel}>Protein</Text>
                            </View>
                            <Text style={styles.nutrientValue}>
                                {nutritionData.protein.current}g / {nutritionData.protein.target}g
                            </Text>
                            <ProgressBar
                                progress={nutritionData.protein.current / nutritionData.protein.target}
                                color="#f87171"
                                style={styles.nutrientBar}
                            />
                        </View>

                        {/* Fat */}
                        <View style={styles.nutrientRow}>
                            <View style={styles.nutrientHeader}>
                                <View style={[styles.nutrientDot, { backgroundColor: '#60a5fa' }]} />
                                <Text style={styles.nutrientLabel}>Fat</Text>
                            </View>
                            <Text style={styles.nutrientValue}>
                                {nutritionData.fat.current}g / {nutritionData.fat.target}g
                            </Text>
                            <ProgressBar
                                progress={nutritionData.fat.current / nutritionData.fat.target}
                                color="#60a5fa"
                                style={styles.nutrientBar}
                            />
                        </View>
                    </View>

                    {/* Scan Button - Large Central Button */}
                    <TouchableOpacity
                        style={styles.scanButton}
                        onPress={scanFeatureClick}
                    >
                        <View style={styles.scanButtonInner}>
                            <Ionicons name="scan-circle" size={60} color="#ffffff" />
                            <Text style={styles.scanButtonText}>Scan Food</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Recent Meals */}
                    <View style={styles.recentCard}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.cardTitle}>Recent Meals</Text>
                            <TouchableOpacity onPress={handleFeatureClick}>
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.mealItem}
                            onPress={handleFeatureClick}
                        >
                            <View style={styles.mealImagePlaceholder}>
                                <Text style={styles.mealEmoji}>🍳</Text>
                            </View>
                            <View style={styles.mealInfo}>
                                <Text style={styles.mealName}>Breakfast</Text>
                                <Text style={styles.mealTime}>Time Not Set Yet</Text>
                            </View>
                            <Text style={styles.mealCalories}>0 kcal</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.mealItem}
                            onPress={handleFeatureClick}
                        >
                            <View style={styles.mealImagePlaceholder}>
                                <Text style={styles.mealEmoji}>🥗</Text>
                            </View>
                            <View style={styles.mealInfo}>
                                <Text style={styles.mealName}>Lunch</Text>
                                <Text style={styles.mealTime}>Time Not Set Yet</Text>
                            </View>
                            <Text style={styles.mealCalories}>0 kcal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Login/Register Modal */}
            <Modal
                visible={showLoginModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowLoginModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowLoginModal(false)}
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
                                        <Text style={styles.inputPlaceholder}>Enter your name</Text>
                                    </View>
                                </View>
                            )}

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="mail-outline" size={20} color="#666" />
                                    <Text style={styles.inputPlaceholder}>Enter your email</Text>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#666" />
                                    <Text style={styles.inputPlaceholder}>Enter your password</Text>
                                </View>
                            </View>

                            {isLogin && (
                                <TouchableOpacity>
                                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={styles.primaryButton}>
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#082374',
    },
    header: {
        backgroundColor: '#082374',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#a0b0ff',
    },
    profileIcon: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#f5f5f5',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        minHeight: '100%',
    },
    calorieCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    calorieHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    dateText: {
        fontSize: 14,
        color: '#666',
    },
    calorieStats: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 15,
    },
    calorieNumber: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#082374',
    },
    calorieTarget: {
        fontSize: 18,
        color: '#666',
        marginLeft: 8,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
    },
    calorieRemaining: {
        marginTop: 10,
    },
    remainingText: {
        fontSize: 14,
        color: '#4ade80',
        fontWeight: '600',
    },
    nutritionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    nutrientRow: {
        marginTop: 15,
    },
    nutrientHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    nutrientDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    nutrientLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    nutrientValue: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    nutrientBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
    },
    scanButton: {
        backgroundColor: '#082374',
        borderRadius: 25,
        padding: 25,
        marginBottom: 20,
        shadowColor: '#082374',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    scanButtonInner: {
        alignItems: 'center',
    },
    scanButtonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    recentCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    seeAll: {
        color: '#082374',
        fontSize: 14,
        fontWeight: '600',
    },
    mealItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    mealImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    mealEmoji: {
        fontSize: 24,
    },
    mealInfo: {
        flex: 1,
    },
    mealName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    mealTime: {
        fontSize: 13,
        color: '#666',
    },
    mealCalories: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#082374',
    },
    // Modal Styles
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
    inputPlaceholder: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#999',
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

export default HomeScreen;