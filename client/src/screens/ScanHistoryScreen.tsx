import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LoginModal from '../components/LoginModal';
import { useAuth } from '../context/AuthContext';

interface MealItem {
    id: string;
    date: string;
    mealType: string;
    time: string;
    foodName: string;
    calories: number;
    image: string;
    nutrients: { protein: number; carbs: number; fat: number };
}

interface ScanHistoryScreenProps {
    navigation: NativeStackNavigationProp<any>;
}

const ScanHistoryScreen = ({ navigation }: ScanHistoryScreenProps) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Guest mode
    const { isLoggedIn } = useAuth();
    const isGuest = !isLoggedIn;

    // Mock data - hanya ditampilkan jika bukan guest
    const historyData: MealItem[] = isGuest ? [] : [
        {
            id: '1',
            date: '2026-01-25',
            mealType: 'Breakfast',
            time: '08:30 AM',
            foodName: 'Omelette with Toast',
            calories: 450,
            image: '🍳',
            nutrients: { protein: 25, carbs: 35, fat: 18 }
        },
        {
            id: '2',
            date: '2026-01-25',
            mealType: 'Lunch',
            time: '12:45 PM',
            foodName: 'Caesar Salad with Chicken',
            calories: 680,
            image: '🥗',
            nutrients: { protein: 42, carbs: 28, fat: 35 }
        },
        {
            id: '3',
            date: '2026-01-25',
            mealType: 'Snack',
            time: '03:20 PM',
            foodName: 'Greek Yogurt with Berries',
            calories: 220,
            image: '🍓',
            nutrients: { protein: 15, carbs: 30, fat: 5 }
        },
        {
            id: '4',
            date: '2026-01-25',
            mealType: 'Dinner',
            time: '07:15 PM',
            foodName: 'Grilled Salmon with Vegetables',
            calories: 520,
            image: '🐟',
            nutrients: { protein: 45, carbs: 22, fat: 25 }
        },
    ];

    const filters = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

    const todayData = historyData.filter(item => item.date === '2026-01-25');
    const totalCalories = isGuest ? 0 : todayData.reduce((sum, item) => sum + item.calories, 0);
    const totalProtein = isGuest ? 0 : todayData.reduce((sum, item) => sum + item.nutrients.protein, 0);
    const totalCarbs = isGuest ? 0 : todayData.reduce((sum, item) => sum + item.nutrients.carbs, 0);
    const totalFat = isGuest ? 0 : todayData.reduce((sum, item) => sum + item.nutrients.fat, 0);

    const filteredData = selectedFilter === 'All'
        ? historyData
        : historyData.filter(item => item.mealType === selectedFilter);

    const handleCalendarClick = () => {
        if (isGuest) {
            setShowLoginModal(true);
        } else {
            // TODO: Open date picker
            console.log('Open calendar picker');
        }
    };

    const renderMealItem = ({ item }: { item: MealItem }) => (
        <TouchableOpacity
            style={styles.mealCard}
            onPress={() => {
                console.log('View meal detail:', item.id);
            }}
        >
            <View style={styles.mealCardLeft}>
                <View style={styles.mealImageContainer}>
                    <Text style={styles.mealEmoji}>{item.image}</Text>
                </View>
                <View style={styles.mealDetails}>
                    <Text style={styles.mealName}>{item.foodName}</Text>
                    <View style={styles.mealMeta}>
                        <View style={styles.mealTypeBadge}>
                            <Text style={styles.mealTypeText}>{item.mealType}</Text>
                        </View>
                        <Text style={styles.mealTime}>• {item.time}</Text>
                    </View>
                    <View style={styles.nutrientQuick}>
                        <Text style={styles.nutrientQuickText}>P: {item.nutrients.protein}g</Text>
                        <Text style={styles.nutrientQuickText}>C: {item.nutrients.carbs}g</Text>
                        <Text style={styles.nutrientQuickText}>F: {item.nutrients.fat}g</Text>
                    </View>
                </View>
            </View>
            <View style={styles.mealCardRight}>
                <Text style={styles.mealCalories}>{item.calories}</Text>
                <Text style={styles.mealCaloriesLabel}>kcal</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meal History</Text>
                <TouchableOpacity
                    style={styles.calendarButton}
                    onPress={handleCalendarClick}
                >
                    <Ionicons name="calendar-outline" size={24} color="#082374" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Daily Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryTitle}>Today's Summary</Text>
                        <Text style={styles.summaryDate}>
                            {new Date().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </Text>
                    </View>

                    <View style={styles.summaryStats}>
                        <View style={styles.summaryMainStat}>
                            <Text style={styles.summaryMainNumber}>{totalCalories}</Text>
                            <Text style={styles.summaryMainLabel}>Total Calories</Text>
                        </View>

                        <View style={styles.summaryDivider} />

                        <View style={styles.summaryNutrients}>
                            <View style={styles.summaryNutrient}>
                                <View style={[styles.nutrientDot, { backgroundColor: '#f87171' }]} />
                                <Text style={styles.nutrientSmallLabel}>Protein</Text>
                                <Text style={styles.nutrientSmallValue}>{totalProtein}g</Text>
                            </View>
                            <View style={styles.summaryNutrient}>
                                <View style={[styles.nutrientDot, { backgroundColor: '#fbbf24' }]} />
                                <Text style={styles.nutrientSmallLabel}>Carbs</Text>
                                <Text style={styles.nutrientSmallValue}>{totalCarbs}g</Text>
                            </View>
                            <View style={styles.summaryNutrient}>
                                <View style={[styles.nutrientDot, { backgroundColor: '#60a5fa' }]} />
                                <Text style={styles.nutrientSmallLabel}>Fat</Text>
                                <Text style={styles.nutrientSmallValue}>{totalFat}g</Text>
                            </View>
                        </View>
                    </View>

                    {/* Guest Banner dalam Summary */}
                    {isGuest && (
                        <TouchableOpacity
                            style={styles.summaryGuestBanner}
                            onPress={() => setShowLoginModal(true)}
                        >
                            <Ionicons name="lock-closed" size={16} color="#082374" />
                            <Text style={styles.summaryGuestText}>
                                Login to start tracking your meals
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Tabs - Disabled untuk guest */}
                <View style={styles.filterContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScroll}
                    >
                        {filters.map((filter) => (
                            <TouchableOpacity
                                key={filter}
                                style={[
                                    styles.filterButton,
                                    selectedFilter === filter && styles.filterButtonActive,
                                    isGuest && styles.filterButtonDisabled
                                ]}
                                onPress={() => !isGuest && setSelectedFilter(filter)}
                                disabled={isGuest}
                            >
                                <Text style={[
                                    styles.filterText,
                                    selectedFilter === filter && styles.filterTextActive,
                                    isGuest && styles.filterTextDisabled
                                ]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Meal List */}
                <View style={styles.historyList}>
                    {filteredData.length > 0 ? (
                        <FlatList
                            data={filteredData}
                            renderItem={renderMealItem}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="restaurant-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyText}>No meals found</Text>
                            <Text style={styles.emptySubtext}>
                                {isGuest
                                    ? 'Login to start tracking your meals'
                                    : 'Start scanning your meals to track your nutrition'
                                }
                            </Text>
                            {isGuest && (
                                <TouchableOpacity
                                    style={styles.emptyLoginButton}
                                    onPress={() => setShowLoginModal(true)}
                                >
                                    <Text style={styles.emptyLoginButtonText}>Login Now</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>

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
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#082374',
    },
    calendarButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    summaryCard: {
        backgroundColor: '#ffffff',
        margin: 15,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    summaryDate: {
        fontSize: 14,
        color: '#666',
    },
    summaryStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryMainStat: {
        flex: 1,
        alignItems: 'center',
    },
    summaryMainNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#082374',
        marginBottom: 4,
    },
    summaryMainLabel: {
        fontSize: 13,
        color: '#666',
    },
    summaryDivider: {
        width: 1,
        height: 60,
        backgroundColor: '#e0e0e0',
        marginHorizontal
            : 15,
    },
    summaryNutrients: {
        flex: 1,
        gap: 12,
    },
    summaryNutrient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    nutrientDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    nutrientSmallLabel: {
        fontSize: 13,
        color: '#666',
        flex: 1,
    },
    nutrientSmallValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    summaryGuestBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e7ff',
        padding: 12,
        borderRadius: 12,
        marginTop: 16,
        gap: 8,
    },
    summaryGuestText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#082374',
    },
    filterContainer: {
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    filterScroll: {
        paddingHorizontal: 15,
        gap: 10,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    filterButtonActive: {
        backgroundColor: '#082374',
    },
    filterButtonDisabled: {
        backgroundColor: '#e0e0e0',
        opacity: 0.6,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    filterTextActive: {
        color: '#ffffff',
    },
    filterTextDisabled: {
        color: '#999',
    },
    historyList: {
        padding: 15,
    },
    mealCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    mealCardLeft: {
        flex: 1,
        flexDirection: 'row',
    },
    mealImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    mealEmoji: {
        fontSize: 30,
    },
    mealDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    mealName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    mealMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    mealTypeBadge: {
        backgroundColor: '#e0e7ff',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    mealTypeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#082374',
    },
    mealTime: {
        fontSize: 12,
        color: '#999',
        marginLeft: 6,
    },
    nutrientQuick: {
        flexDirection: 'row',
        gap: 8,
    },
    nutrientQuickText: {
        fontSize: 11,
        color: '#666',
    },
    mealCardRight: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginLeft: 12,
    },
    mealCalories: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#082374',
    },
    mealCaloriesLabel: {
        fontSize: 11,
        color: '#666',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#999',
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    emptyLoginButton: {
        backgroundColor: '#082374',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 20,
    },
    emptyLoginButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
export default ScanHistoryScreen;