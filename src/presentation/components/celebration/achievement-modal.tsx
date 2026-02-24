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
  FadeIn,
} from 'react-native-reanimated';
import { useSettingsStore } from '@/src/store/settings-store';
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

  useEffect(() => {
    if (visible && achievement) {
      iconScale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 300 })
      );
      buttonOpacity.value = withDelay(600, withSpring(1));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      iconScale.value = 0;
      buttonOpacity.value = 0;
    }
  }, [visible, achievement]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
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

        <Animated.View entering={FadeIn.duration(300)} style={styles.content}>
          <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
            <LinearGradient
              colors={['#E8435A', '#FF7854']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Text style={styles.icon}>{achievement.icon}</Text>
            </LinearGradient>
          </Animated.View>

          <Text style={styles.congratsLabel}>
            {locale === 'de' ? 'Erfolg freigeschaltet!' : 'Achievement Unlocked!'}
          </Text>
          <Text style={styles.title}>{achievement.title[locale]}</Text>
          <Text style={styles.description}>{achievement.description[locale]}</Text>

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
