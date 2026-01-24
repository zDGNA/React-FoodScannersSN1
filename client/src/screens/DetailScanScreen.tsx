import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { ProgressBar } from 'react-native-paper';

import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
    DetailScanScreen: { /* define expected params here if any */ };
    HomeTab: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'DetailScanScreen'>;

const DetailScanScreen = (props: Props) => {
    const { route, navigation } = props;
    // Mock data - nanti akan diganti dengan data dari route.params
    const [foodData, setFoodData] = useState({
        name: 'Grilled Chicken Breast',
        portion: 100,
        unit: 'g',
        calories: 165,
        image: null,
        nutrients: {
            protein: 31,
            carbs: 0,
            fat: 3.6,
            fiber: 0,
            sugar: 0,
        },
        vitamins: {
            vitaminA: 5,
            vitaminC: 0,
            calcium: 15,
            iron: 1,
        },
        mealType: 'Lunch',
    });

    const [portion, setPortion] = useState(foodData.portion.toString());
    const [selectedMeal, setSelectedMeal] = useState(foodData.mealType);

    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    // Calculate nutrients based on portion
    const calculateNutrient = (baseValue: number, basePortion: number, currentPortion: number): string => {
        return ((baseValue / basePortion) * currentPortion).toFixed(1);
    };

    const currentPortion = parseFloat(portion) || foodData.portion;
    const multiplier = currentPortion / foodData.portion;

    const handleSave = () => {
        // Save to database/context
        console.log('Saving food data:', {
            ...foodData,
            portion: currentPortion,
            mealType: selectedMeal,
        });
        navigation.navigate('HomeTab');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#082374" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Food Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Food Image & Name */}
                <View style={styles.foodHeader}>
                    <View style={styles.foodImageContainer}>
                        {foodData.image ? (
                            <Image source={{ uri: foodData.image }} style={styles.foodImage} />
                        ) : (
                            <View style={styles.foodImagePlaceholder}>
                                <Text style={styles.foodEmoji}>🍗</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.foodName}>{foodData.name}</Text>
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
                        <Text style={styles.verifiedText}>AI Verified</Text>
                    </View>
                </View>

                {/* Portion Adjustment */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Adjust Portion</Text>
                    <View style={styles.portionControls}>
                        <TouchableOpacity
                            style={styles.portionButton}
                            onPress={() => setPortion((parseFloat(portion) - 10).toString())}
                        >
                            <Ionicons name="remove" size={24} color="#082374" />
                        </TouchableOpacity>

                        <View style={styles.portionInput}>
                            <TextInput
                                style={styles.portionValue}
                                value={portion}
                                onChangeText={setPortion}
                                keyboardType="numeric"
                            />
                            <Text style={styles.portionUnit}>{foodData.unit}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.portionButton}
                            onPress={() => setPortion((parseFloat(portion) + 10).toString())}
                        >
                            <Ionicons name="add" size={24} color="#082374" />
                        </TouchableOpacity>
                    </View>

                    {/* Quick Portion Buttons */}
                    <View style={styles.quickPortions}>
                        {[50, 100, 150, 200].map((amount) => (
                            <TouchableOpacity
                                key={amount}
                                style={[
                                    styles.quickPortionButton,
                                    parseFloat(portion) === amount && styles.quickPortionButtonActive
                                ]}
                                onPress={() => setPortion(amount.toString())}
                            >
                                <Text style={[
                                    styles.quickPortionText,
                                    parseFloat(portion) === amount && styles.quickPortionTextActive
                                ]}>
                                    {amount}{foodData.unit}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Meal Type Selection */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Meal Type</Text>
                    <View style={styles.mealTypeContainer}>
                        {mealTypes.map((meal) => (
                            <TouchableOpacity
                                key={meal}
                                style={[
                                    styles.mealTypeButton,
                                    selectedMeal === meal && styles.mealTypeButtonActive
                                ]}
                                onPress={() => setSelectedMeal(meal)}
                            >
                                <Text style={[
                                    styles.mealTypeText,
                                    selectedMeal === meal && styles.mealTypeTextActive
                                ]}>
                                    {meal}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Calorie Summary */}
                <View style={[styles.card, styles.calorieCard]}>
                    <View style={styles.calorieRow}>
                        <Text style={styles.calorieLabel}>Total Calories</Text>
                        <Text style={styles.calorieValue}>
                            {calculateNutrient(foodData.calories, foodData.portion, currentPortion)} kcal
                        </Text>
                    </View>
                </View>

                {/* Macronutrients */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Macronutrients</Text>

                    <View style={styles.macroItem}>
                        <View style={styles.macroHeader}>
                            <View style={[styles.macroIcon, { backgroundColor: "#f87171" }]}>
                                <Ionicons name="fitness" size={20} color="#ffffff" />
                            </View>
                            <Text style={styles.macroLabel}>Protein</Text>
                        </View>
                        <Text style={styles.macroValue}>
                            {calculateNutrient(foodData.nutrients.protein, foodData.portion, currentPortion)}g
                        </Text>
                        <ProgressBar
                            progress={foodData.nutrients.protein / 100}
                            color="#f87171"
                            style={styles.macroBar}
                        />
                    </View>

                    <View style={styles.macroItem}>
                        <View style={styles.macroHeader}>
                            <View style={[styles.macroIcon, { backgroundColor: "#fbbf24" }]}>
                                <Ionicons name="nutrition" size={20} color="#ffffff" />
                            </View>
                            <Text style={styles.macroLabel}>Carbohydrates</Text>
                        </View>
                        <Text style={styles.macroValue}>
                            {calculateNutrient(foodData.nutrients.carbs, foodData.portion, currentPortion)}g
                        </Text>
                        <ProgressBar
                            progress={foodData.nutrients.carbs / 100}
                            color="#fbbf24"
                            style={styles.macroBar}
                        />
                    </View>

                    <View style={styles.macroItem}>
                        <View style={styles.macroHeader}>
                            <View style={[styles.macroIcon, { backgroundColor: "#60a5fa" }]}>
                                <Ionicons name="water" size={20} color="#ffffff" />
                            </View>
                            <Text style={styles.macroLabel}>Fat</Text>
                        </View>
                        <Text style={styles.macroValue}>
                            {calculateNutrient(foodData.nutrients.fat, foodData.portion, currentPortion)}g
                        </Text>
                        <ProgressBar
                            progress={foodData.nutrients.fat / 100}
                            color="#60a5fa"
                            style={styles.macroBar}
                        />
                    </View>

                    <View style={styles.macroItem}>
                        <View style={styles.macroHeader}>
                            <View style={[styles.macroIcon, { backgroundColor: "#a78bfa" }]}>
                                <Ionicons name="leaf" size={20} color="#ffffff" />
                            </View>
                            <Text style={styles.macroLabel}>Fiber</Text>
                        </View>
                        <Text style={styles.macroValue}>
                            {calculateNutrient(foodData.nutrients.fiber, foodData.portion, currentPortion)}g
                        </Text>
                        <ProgressBar
                            progress={foodData.nutrients.fiber / 100}
                            color="#a78bfa"
                            style={styles.macroBar}
                        />
                    </View>
                </View>

                {/* Vitamins & Minerals */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Vitamins & Minerals</Text>
                    <Text style={styles.cardSubtitle}>% of Daily Value</Text>

                    <View style={styles.vitaminGrid}>
                        <View style={styles.vitaminItem}>
                            <View style={styles.vitaminCircle}>
                                <Text style={styles.vitaminPercent}>{foodData.vitamins.vitaminA}%</Text>
                            </View>
                            <Text style={styles.vitaminLabel}>Vitamin A</Text>
                        </View>

                        <View style={styles.vitaminItem}>
                            <View style={styles.vitaminCircle}>
                                <Text style={styles.vitaminPercent}>{foodData.vitamins.vitaminC}%</Text>
                            </View>
                            <Text style={styles.vitaminLabel}>Vitamin C</Text>
                        </View>

                        <View style={styles.vitaminItem}>
                            <View style={styles.vitaminCircle}>
                                <Text style={styles.vitaminPercent}>{foodData.vitamins.calcium}%</Text>
                            </View>
                            <Text style={styles.vitaminLabel}>Calcium</Text>
                        </View>

                        <View style={styles.vitaminItem}>
                            <View style={styles.vitaminCircle}>
                                <Text style={styles.vitaminPercent}>{foodData.vitamins.iron}%</Text>
                            </View>
                            <Text style={styles.vitaminLabel}>Iron</Text>
                        </View>
                    </View>
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Action Buttons */}
            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                    <Text style={styles.saveText}>Add to Journal</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#082374',
    },
    content: {
        flex: 1,
    },
    foodHeader: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#ffffff',
        marginBottom: 15,
    },
    foodImageContainer: {
        marginBottom: 20,
    },
    foodImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    foodImagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    foodEmoji: {
        fontSize: 60,
    },
    foodName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    verifiedText: {
        color: '#16a34a',
        fontSize: 12,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#ffffff',
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: -10,
        marginBottom: 15,
    },
    portionControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    portionButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    portionInput: {
        flexDirection: 'row',
        alignItems: 'baseline',
        backgroundColor: '#082374',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 16,
    },
    portionValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        minWidth: 60,
        textAlign: 'center',
    },
    portionUnit: {
        fontSize: 18,
        color: '#a0b0ff',
        marginLeft: 5,
    },
    quickPortions: {
        flexDirection: 'row',
        gap: 10,
    },
    quickPortionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    quickPortionButtonActive: {
        backgroundColor: '#e0e7ff',
    },
    quickPortionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    quickPortionTextActive: {
        color: '#082374',
    },
    mealTypeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    mealTypeButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    mealTypeButtonActive: {
        backgroundColor: '#082374',
        borderColor: '#082374',
    },
    mealTypeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    mealTypeTextActive: {
        color: '#ffffff',
    },
    calorieCard: {
        backgroundColor: '#082374',
    },
    calorieRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    calorieLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    calorieValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    macroItem: {
        marginBottom: 20,
    },
    macroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    macroIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    macroLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    macroValue: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    macroBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#f0f0f0',
    },
    vitaminGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    vitaminItem: {
        width: '22%',
        alignItems: 'center',
    },
    vitaminCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    vitaminPercent: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#082374',
    },
    vitaminLabel: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
    },
    bottomActions: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    saveButton: {
        flex: 2,
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#082374',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    saveText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default DetailScanScreen;