import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    profile_picture?: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Check if user is already logged in on app start
    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('authToken');
            const storedUserData = await AsyncStorage.getItem('userData');

            if (storedToken && storedUserData) {
                const userData = JSON.parse(storedUserData);
                setToken(storedToken);
                setUser(userData);
                setIsLoggedIn(true);
                console.log('✅ User auto-logged in:', userData.email);
            } else {
                console.log('👋 Starting as guest');
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (newToken: string, userData: User) => {
        try {
            await AsyncStorage.setItem('authToken', newToken);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));

            setToken(newToken);
            setUser(userData);
            setIsLoggedIn(true);

            console.log('✅ User logged in:', userData.email);
        } catch (error) {
            console.error('Error saving login data:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');

            setToken(null);
            setUser(null);
            setIsLoggedIn(false);

            console.log('👋 User logged out');
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    };

    const updateUser = async (userData: Partial<User>) => {
        try {
            if (!user) return;

            const updatedUser = { ...user, ...userData };
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
            setUser(updatedUser);

            console.log('✅ User updated:', updatedUser.email);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                isLoading,
                user,
                token,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;