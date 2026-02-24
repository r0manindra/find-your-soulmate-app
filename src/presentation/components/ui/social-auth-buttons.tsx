import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SocialAuthButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
  googleLoading: boolean;
  appleLoading: boolean;
  googleReady: boolean;
}

function SocialButton({
  icon,
  label,
  onPress,
  loading,
  disabled,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={loading || disabled}
      style={[animatedStyle, styles.socialButton, (loading || disabled) && styles.socialButtonDisabled]}
    >
      <Ionicons name={icon} size={20} color="#171717" style={styles.icon} />
      <Text style={styles.socialButtonText}>{loading ? 'Signing in...' : label}</Text>
    </AnimatedPressable>
  );
}

export function SocialAuthButtons({
  onGooglePress,
  onApplePress,
  googleLoading,
  appleLoading,
  googleReady,
}: SocialAuthButtonsProps) {
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
    }
  }, []);

  return (
    <View style={styles.container}>
      <SocialButton
        icon="logo-google"
        label="Continue with Google"
        onPress={onGooglePress}
        loading={googleLoading}
        disabled={!googleReady}
      />

      {appleAvailable && (
        <SocialButton
          icon="logo-apple"
          label="Continue with Apple"
          onPress={onApplePress}
          loading={appleLoading}
          disabled={false}
        />
      )}

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 4,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  socialButtonDisabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
    letterSpacing: -0.2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#A3A3A3',
    fontWeight: '500',
  },
});
