import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { useSettingsStore } from '@/src/store/settings-store';
import { GlassCard } from './glass-card';

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
  isDark,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
  isDark: boolean;
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
      style={[animatedStyle, (loading || disabled) && styles.socialButtonDisabled]}
    >
      <GlassCard borderRadius={14} padding={14}>
        <View style={styles.socialButtonInner}>
          <Ionicons name={icon} size={20} color={isDark ? '#F5F5F5' : '#171717'} style={styles.icon} />
          <Text style={[styles.socialButtonText, isDark && styles.socialButtonTextDark]}>
            {loading ? 'Signing in...' : label}
          </Text>
        </View>
      </GlassCard>
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const locale = useSettingsStore((s) => s.locale);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
    }
  }, []);

  return (
    <View style={styles.container}>
      <SocialButton
        icon="logo-google"
        label={locale === 'de' ? 'Weiter mit Google' : 'Continue with Google'}
        onPress={onGooglePress}
        loading={googleLoading}
        disabled={!googleReady}
        isDark={isDark}
      />

      {appleAvailable && (
        <SocialButton
          icon="logo-apple"
          label={locale === 'de' ? 'Weiter mit Apple' : 'Continue with Apple'}
          onPress={onApplePress}
          loading={appleLoading}
          disabled={false}
          isDark={isDark}
        />
      )}

      <View style={styles.divider}>
        <View style={[styles.dividerLine, isDark && styles.dividerLineDark]} />
        <Text style={styles.dividerText}>{locale === 'de' ? 'oder' : 'or'}</Text>
        <View style={[styles.dividerLine, isDark && styles.dividerLineDark]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 4,
  },
  socialButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  socialButtonTextDark: {
    color: '#F5F5F5',
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
  dividerLineDark: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#A3A3A3',
    fontWeight: '500',
  },
});
