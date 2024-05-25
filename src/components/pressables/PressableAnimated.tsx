import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, useColorScheme } from 'react-native';

type AnimatedButtonProps = {
    onPress: () => void;
    children: React.ReactNode;
    style?: object;
    className?: string
};

export function PressableAnimated({ onPress, children, style, className }: AnimatedButtonProps) {
    const colorScheme = useColorScheme();
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.8,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            className={`${className}`}
        >
            <Animated.View className={`py-2 px-4 rounded-full ${colorScheme == 'dark' ? "bg-secondary" : "bg-zinc-200"}`} style={[{ transform: [{ scale: scaleValue }] }, style]}>
                <Text className='text-base'>{children}</Text>
            </Animated.View>
        </Pressable>
    );
}