import React from "react";
import { StyleSheet, View } from "react-native";
const BrandComponents = () => {
    return (
        <View style={styles.brandContainer}></View>
    );
};
const styles = StyleSheet.create({
    brandContainer: {
        borderRadius: 80,
        backgroundColor: '#c2bcbcff',
        width: 80,
        height: 80,
    },
    bannerContainer: {
        backgroundColor: '#BDBDBD',
        height: 140,
        borderRadius: 20,
    },
});

export default BrandComponents;