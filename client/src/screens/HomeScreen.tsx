import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { ProgressBar } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoginModal from '../components/LoginModal';


type HomeScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Guest mode - semua data di set ke 0
    const isGuest = true; // TODO: Nanti ganti dengan state dari AuthContext

    const dailyCalories = isGuest ? 0 : 1847;
    const targetCalories = 2000;
    const progress = dailyCalories / targetCalories;

    const nutritionData = {
        carbs: { current: isGuest ? 0 : 180, target: 250 },
        protein: { current: isGuest ? 0 : 65, target: 100 },
        fat: { current: isGuest ? 0 : 45, target: 70 },
    };

    const handleFeatureClick = () => {
        if (isGuest) {
            setShowLoginModal(true);
        }
    };

    const handleScanClick = () => {
        if (isGuest) {
            setShowLoginModal(true);
        } else {
            navigation.navigate('Scanner');
        }
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
                    {/* Guest Banner - Optional */}
                    {isGuest && (
                        <TouchableOpacity
                            style={styles.guestBanner}
                            onPress={() => setShowLoginModal(true)}
                        >
                            <Ionicons name="information-circle" size={24} color="#082374" />
                            <View style={styles.guestBannerText}>
                                <Text style={styles.guestBannerTitle}>Guest Mode</Text>
                                <Text style={styles.guestBannerSubtitle}>
                                    Login to start tracking your nutrition
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#082374" />
                        </TouchableOpacity>
                    )}

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
                            color={isGuest ? "#e0e0e0" : "#4ade80"}
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
                                color={isGuest ? "#e0e0e0" : "#fbbf24"}
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
                                color={isGuest ? "#e0e0e0" : "#f87171"}
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
                                color={isGuest ? "#e0e0e0" : "#60a5fa"}
                                style={styles.nutrientBar}
                            />
                        </View>
                    </View>

                    {/* Scan Button - Large Central Button */}
                    <TouchableOpacity
                        style={styles.scanButton}
                        onPress={handleScanClick}
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

                        {isGuest ? (
                            <View style={styles.emptyMeals}>
                                <Ionicons name="restaurant-outline" size={48} color="#ccc" />
                                <Text style={styles.emptyMealsText}>No meals yet</Text>
                                <Text style={styles.emptyMealsSubtext}>
                                    Login to start tracking your meals
                                </Text>
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={styles.mealItem}
                                    onPress={handleFeatureClick}
                                >
                                    <View style={styles.mealImagePlaceholder}>
                                        <Text style={styles.mealEmoji}>🍳</Text>
                                    </View>
                                    <View style={styles.mealInfo}>
                                        <Text style={styles.mealName}>Breakfast</Text>
                                        <Text style={styles.mealTime}>8:30 AM</Text>
                                    </View>
                                    <Text style={styles.mealCalories}>450 kcal</Text>
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
                                        <Text style={styles.mealTime}>12:45 PM</Text>
                                    </View>
                                    <Text style={styles.mealCalories}>680 kcal</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Login Modal */}
            <LoginModal
                visible={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={() => {
                    // TODO: Handle successful login
                    console.log('Login successful!');
                }}
            />
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
    guestBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e7ff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        gap: 12,
    },
    guestBannerText: {
        flex: 1,
    },
    guestBannerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#082374',
        marginBottom: 4,
    },
    guestBannerSubtitle: {
        fontSize: 13,
        color: '#4338ca',
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
    emptyMeals: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyMealsText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#999',
        marginTop: 12,
    },
    emptyMealsSubtext: {
        fontSize: 13,
        color: '#ccc',
        marginTop: 6,
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
});

export default HomeScreen;