import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SplashScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const SplashScreen = ({ navigation }: SplashScreenProps) => {
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.3);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 10,
                friction: 2,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            navigation.replace('Main');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <View style={styles.logoCircle}>
                    <Text style={styles.logoIcon}>🍎</Text>
                </View>
                <Text style={styles.appName}>FoodScan AI</Text>
                <Text style={styles.tagline}>Smart Nutrition Tracking</Text>
            </Animated.View>

            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                <View style={styles.loadingBar}>
                    <View style={styles.loadingFill} />
                </View>
                <Text style={styles.footerText}>Powered by AI Technology</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#082374',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 100,
    },
    logoCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    logoIcon: {
        fontSize: 70,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 16,
        color: '#a0b0ff',
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 60,
        alignItems: 'center',
    },
    loadingBar: {
        width: 200,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        marginBottom: 20,
        overflow: 'hidden',
    },
    loadingFill: {
        height: '100%',
        width: '70%',
        backgroundColor: '#ffffff',
        borderRadius: 2,
    },
    footerText: {
        color: '#a0b0ff',
        fontSize: 12,
        fontWeight: '500',
    },
});

export default SplashScreen;