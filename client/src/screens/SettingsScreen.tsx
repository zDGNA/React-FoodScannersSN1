import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, ScrollView, ActivityIndicator, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SettingsScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};
const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
    // User data - Mock (nanti dari context/state management)
    const [user, setUser] = useState({
        name: 'Guest User',
        email: 'guest@foodscan.com',
        isLoggedIn: false,
    });

    const [showEditModal, setShowEditModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Settings states
    const [userName, setUserName] = useState(user.name);
    const [dailyCalorieGoal, setDailyCalorieGoal] = useState('2000');
    const [weightGoal, setWeightGoal] = useState('70');
    const [notifications, setNotifications] = useState(true);
    const [unitSystem, setUnitSystem] = useState('metric'); // metric or imperial

    const handleLogin = () => {
        navigation.navigate('LoginScreen');
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        setUser({
                            name: 'Guest User',
                            email: 'guest@foodscan.com',
                            isLoggedIn: false,
                        });
                        Alert.alert('Success', 'You have been logged out');
                    }
                }
            ]
        );
    };

    const handleSaveProfile = () => {
        setIsLoading(true);
        setTimeout(() => {
            setUser({ ...user, name: userName });
            setIsLoading(false);
            setShowEditModal(false);
            Alert.alert('Success', 'Profile updated successfully');
        }, 1000);
    };

    const handleSaveGoals = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowGoalModal(false);
            Alert.alert('Success', 'Goals updated successfully');
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile & Settings</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={40} color="#082374" />
                        </View>
                        {user.isLoggedIn && (
                            <View style={styles.verifiedBadge}>
                                <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
                            </View>
                        )}
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>

                    {!user.isLoggedIn ? (
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                        >
                            <Text style={styles.loginButtonText}>Login to Continue</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.editProfileButton}
                            onPress={() => setShowEditModal(true)}
                        >
                            <Ionicons name="create-outline" size={16} color="#082374" />
                            <Text style={styles.editProfileText}>Edit Profile</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Health Goals Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Health Goals</Text>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => setShowGoalModal(true)}
                    >
                        <View style={styles.settingItemLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#fef3c7' }]}>
                                <Ionicons name="flame" size={24} color="#f59e0b" />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={styles.settingLabel}>Daily Calorie Goal</Text>
                                <Text style={styles.settingValue}>{dailyCalorieGoal} kcal</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => setShowGoalModal(true)}
                    >
                        <View style={styles.settingItemLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#dbeafe' }]}>
                                <Ionicons name="trending-down" size={24} color="#3b82f6" />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={styles.settingLabel}>Target Weight</Text>
                                <Text style={styles.settingValue}>{weightGoal} kg</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingItemLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#fce7f3' }]}>
                                <Ionicons name="notifications" size={24} color="#ec4899" />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={styles.settingLabel}>Meal Reminders</Text>
                                <Text style={styles.settingValue}>Get notified for meals</Text>
                            </View>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#e0e0e0', true: '#a0b0ff' }}
                            thumbColor={notifications ? '#082374' : '#f4f3f4'}
                        />
                    </View>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingItemLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#e0f2fe' }]}>
                                <Ionicons name="scale" size={24} color="#0ea5e9" />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={styles.settingLabel}>Unit System</Text>
                                <Text style={styles.settingValue}>
                                    {unitSystem === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lb, in)'}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                {/* App Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App</Text>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingItemLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#f3e8ff' }]}>
                                <Ionicons name="help-circle" size={24} color="#a855f7" />
                            </View>
                            <Text style={styles.settingLabel}>Help & Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingItemLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#e0e7ff' }]}>
                                <Ionicons name="shield-checkmark" size={24} color="#6366f1" />
                            </View>
                            <Text style={styles.settingLabel}>Privacy Policy</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingItemLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#fef3c7' }]}>
                                <Ionicons name="star" size={24} color="#f59e0b" />
                            </View>
                            <Text style={styles.settingLabel}>Rate This App</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                {user.isLoggedIn && (
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#ffffff" />
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                )}

                {/* App Version */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>FoodScan AI</Text>
                    <Text style={styles.versionNumber}>Version 1.0.0</Text>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                visible={showEditModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                <Text style={styles.modalHeaderButton}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Edit Profile</Text>
                            <TouchableOpacity onPress={handleSaveProfile} disabled={isLoading}>
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#082374" />
                                ) : (
                                    <Text style={styles.modalHeaderButtonSave}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter your name"
                                placeholderTextColor="#94a3b8"
                                value={userName}
                                onChangeText={setUserName}
                                autoFocus
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Goals Modal */}
            <Modal
                visible={showGoalModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowGoalModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setShowGoalModal(false)}>
                                <Text style={styles.modalHeaderButton}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Health Goals</Text>
                            <TouchableOpacity onPress={handleSaveGoals} disabled={isLoading}>
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#082374" />
                                ) : (
                                    <Text style={styles.modalHeaderButtonSave}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Daily Calorie Goal</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="2000"
                                placeholderTextColor="#94a3b8"
                                value={dailyCalorieGoal}
                                onChangeText={setDailyCalorieGoal}
                                keyboardType="numeric"
                            />
                            <Text style={styles.inputHint}>
                                Recommended: 1800-2500 kcal per day
                            </Text>

                            <Text style={[styles.inputLabel, { marginTop: 20 }]}>Target Weight (kg)</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="70"
                                placeholderTextColor="#94a3b8"
                                value={weightGoal}
                                onChangeText={setWeightGoal}
                                keyboardType="numeric"
                            />
                            <Text style={styles.inputHint}>
                                Your ideal weight goal
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#082374',
    },
    profileCard: {
        backgroundColor: '#ffffff',
        margin: 15,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderRadius: 12,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    loginButton: {
        backgroundColor: '#082374',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 10,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e7ff',
        backgroundColor: '#f8faff',
    },
    editProfileText: {
        color: '#082374',
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingText: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    settingValue: {
        fontSize: 13,
        color: '#666',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ef4444',
        marginHorizontal: 15,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    versionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#082374',
        marginBottom: 4,
    },
    versionNumber: {
        fontSize: 12,
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    modalHeaderButton: {
        fontSize: 16,
        color: '#94a3b8',
        fontWeight: '600',
    },
    modalHeaderButtonSave: {
        fontSize: 16,
        color: '#082374',
        fontWeight: '700',
    },
    modalBody: {
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    inputHint: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 12,
    },
});

export default SettingsScreen;