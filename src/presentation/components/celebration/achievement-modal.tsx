import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  withRepeat,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import { useSettingsStore } from '@/src/store/settings-store';
import { ConfettiBurst } from './confetti-burst';
import type { Achievement } from '@/src/core/entities/types';

interface AchievementModalProps {
  achievement: Achievement | null;
  visible: boolean;
  onDismiss: () => void;
}

export function AchievementModal({ achievement, visible, onDismiss }: AchievementModalProps) {
  const locale = useSettingsStore((s) => s.locale);
  const iconScale = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);

  useEffect(() => {
    if (visible && achievement) {
      // Confetti fires immediately, icon springs in after 200ms
      iconScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.2, { damping: 8, stiffness: 200 }),
          withSpring(1, { damping: 12, stiffness: 300 })
        )
      );
      // Glow pulse on the icon
      glowOpacity.value = withDelay(
        400,
        withRepeat(
          withSequence(
            withTiming(0.6, { duration: 800 }),
            withTiming(0.3, { duration: 800 })
          ),
          -1,
          true
        )
      );
      // Title fades up after icon
      titleOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
      titleTranslateY.value = withDelay(500, withSpring(0, { damping: 15, stiffness: 200 }));
      // Button appears last
      buttonOpacity.value = withDelay(800, withSpring(1));
      // Enhanced haptics
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 150);
    } else {
      iconScale.value = 0;
      buttonOpacity.value = 0;
      glowOpacity.value = 0.3;
      titleOpacity.value = 0;
      titleTranslateY.value = 20;
    }
  }, [visible, achievement]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  if (!achievement) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.overlay} />

        {/* Confetti behind everything */}
        <ConfettiBurst trigger={visible} />

        <Animated.View entering={FadeIn.duration(300)} style={styles.content}>
          <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
            {/* Glow ring */}
            <Animated.View style={[styles.glowRing, glowAnimatedStyle]} />
            <LinearGradient
              colors={['#E8435A', '#FF7854']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Text style={styles.icon}>{achievement.icon}</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={titleAnimatedStyle}>
            <Text style={styles.congratsLabel}>
              {locale === 'de' ? 'Erfolg freigeschaltet!' : 'Achievement Unlocked!'}
            </Text>
            <Text style={styles.title}>{achievement.title[locale]}</Text>
            <Text style={styles.description}>{achievement.description[locale]}</Text>
          </Animated.View>

          <Animated.View style={buttonAnimatedStyle}>
            <Pressable onPress={onDismiss} style={styles.button}>
              <Text style={styles.buttonText}>
                {locale === 'de' ? 'Weiter' : 'Continue'}
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#E8435A',
    shadowColor: '#E8435A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E8435A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  icon: {
    fontSize: 44,
  },
  congratsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E8435A',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
});
