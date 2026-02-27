import React, { useCallback } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/components/useColorScheme';
import { useVoiceSession } from '@/src/hooks/use-voice-session';
import { getCharacter } from '@/src/data/content/coach-characters';

interface Props {
  visible: boolean;
  onClose: () => void;
  characterId: string;
  locale: string;
  chapterContext?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VoiceCoachModal({ visible, onClose, characterId, locale, chapterContext }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const character = getCharacter(characterId);
  const { state, error, elapsed, isAISpeaking, start, stop, remaining } = useVoiceSession();

  // Pulse animations for rings
  const pulse1 = useSharedValue(1);
  const pulse2 = useSharedValue(1);
  const pulse3 = useSharedValue(1);
  const opacity1 = useSharedValue(0.4);
  const opacity2 = useSharedValue(0.3);
  const opacity3 = useSharedValue(0.2);

  React.useEffect(() => {
    if (state === 'connected') {
      pulse1.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration: 1500, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.in(Easing.ease) })
        ),
        -1,
        true
      );
      opacity1.value = withRepeat(
        withSequence(
          withTiming(0.1, { duration: 1500 }),
          withTiming(0.4, { duration: 1500 })
        ),
        -1,
        true
      );
      pulse2.value = withDelay(300,
        withRepeat(
          withSequence(
            withTiming(1.6, { duration: 1800, easing: Easing.out(Easing.ease) }),
            withTiming(1, { duration: 1800, easing: Easing.in(Easing.ease) })
          ),
          -1,
          true
        )
      );
      opacity2.value = withDelay(300,
        withRepeat(
          withSequence(
            withTiming(0.05, { duration: 1800 }),
            withTiming(0.3, { duration: 1800 })
          ),
          -1,
          true
        )
      );
      pulse3.value = withDelay(600,
        withRepeat(
          withSequence(
            withTiming(1.8, { duration: 2100, easing: Easing.out(Easing.ease) }),
            withTiming(1, { duration: 2100, easing: Easing.in(Easing.ease) })
          ),
          -1,
          true
        )
      );
      opacity3.value = withDelay(600,
        withRepeat(
          withSequence(
            withTiming(0.02, { duration: 2100 }),
            withTiming(0.2, { duration: 2100 })
          ),
          -1,
          true
        )
      );
    } else {
      pulse1.value = withTiming(1, { duration: 300 });
      pulse2.value = withTiming(1, { duration: 300 });
      pulse3.value = withTiming(1, { duration: 300 });
      opacity1.value = withTiming(0, { duration: 300 });
      opacity2.value = withTiming(0, { duration: 300 });
      opacity3.value = withTiming(0, { duration: 300 });
    }
  }, [state]);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse1.value }],
    opacity: opacity1.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse2.value }],
    opacity: opacity2.value,
  }));
  const ring3Style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse3.value }],
    opacity: opacity3.value,
  }));

  const handleStart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    start({ characterId, locale, chapterContext });
  }, [characterId, locale, chapterContext, start]);

  const handleEnd = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    stop();
  }, [stop]);

  const handleClose = useCallback(() => {
    if (state === 'connected' || state === 'connecting') {
      stop();
    }
    onClose();
  }, [state, stop, onClose]);

  const statusText = () => {
    switch (state) {
      case 'idle': return t('voiceCoach.readyToTalk');
      case 'connecting': return t('voiceCoach.connecting');
      case 'connected': return isAISpeaking ? t('voiceCoach.speaking') : t('voiceCoach.listening');
      case 'error': return t('voiceCoach.connectionError');
      case 'ended': return t('voiceCoach.sessionEnded');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, isDark && styles.containerDark, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.safeArea}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <View style={styles.topBarSpacer} />
            <Text style={[styles.topBarTitle, isDark && styles.topBarTitleDark]}>
              {t('voiceCoach.title', { defaultValue: 'Voice Coach' })}
            </Text>
            <Pressable onPress={handleClose} style={[styles.closeBtn, isDark && styles.closeBtnDark]}>
              <Ionicons name="close" size={22} color={isDark ? '#A3A3A3' : '#737373'} />
            </Pressable>
          </View>

          {/* Center area */}
          <View style={styles.centerArea}>
            {/* Coach info */}
            <Text style={[styles.coachName, isDark && styles.coachNameDark]}>
              {character.name}
            </Text>
            <Text style={styles.statusText}>{statusText()}</Text>

            {/* Pulse rings + icon */}
            <View style={styles.pulseContainer}>
              <Animated.View style={[styles.pulseRing, styles.ring3, { borderColor: character.color }, ring3Style]} />
              <Animated.View style={[styles.pulseRing, styles.ring2, { borderColor: character.color }, ring2Style]} />
              <Animated.View style={[styles.pulseRing, styles.ring1, { borderColor: character.color }, ring1Style]} />
              <View style={[styles.centerIcon, { backgroundColor: `${character.color}20` }]}>
                <Ionicons
                  name={isAISpeaking ? 'volume-high' : 'mic'}
                  size={48}
                  color={character.color}
                />
              </View>
            </View>

            {/* Timer */}
            {(state === 'connected' || state === 'ended') && (
              <View style={styles.timerRow}>
                <Text style={[styles.timerText, isDark && styles.timerTextDark]}>
                  {formatTime(elapsed)}
                </Text>
                {state === 'connected' && (
                  <Text style={styles.remainingText}>
                    / {formatTime(remaining)}
                  </Text>
                )}
              </View>
            )}

            {/* Idle tip */}
            {state === 'idle' && (
              <Text style={[styles.tipText, isDark && styles.tipTextDark]}>
                {t('voiceCoach.idleTip')}
              </Text>
            )}

            {/* Error message */}
            {state === 'error' && error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>

          {/* Bottom actions */}
          <View style={styles.bottomArea}>
            {state === 'idle' || state === 'error' ? (
              <Pressable onPress={handleStart} style={styles.callButton}>
                <LinearGradient
                  colors={['#34D399', '#10B981']}
                  style={styles.callButtonGradient}
                >
                  <Ionicons name="call" size={32} color="#fff" />
                </LinearGradient>
                <Text style={[styles.callLabel, isDark && styles.callLabelDark]}>
                  {t('voiceCoach.startCall')}
                </Text>
              </Pressable>
            ) : state === 'connecting' ? (
              <View style={styles.callButton}>
                <View style={[styles.callButtonGradient, styles.connectingBtn]}>
                  <Ionicons name="ellipsis-horizontal" size={32} color="#fff" />
                </View>
                <Text style={[styles.callLabel, isDark && styles.callLabelDark]}>
                  {t('voiceCoach.connecting')}
                </Text>
              </View>
            ) : state === 'connected' ? (
              <Pressable onPress={handleEnd} style={styles.callButton}>
                <View style={styles.endCallBtn}>
                  <Ionicons name="call" size={32} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
                </View>
                <Text style={[styles.callLabel, isDark && styles.callLabelDark]}>
                  {t('voiceCoach.endCall')}
                </Text>
              </Pressable>
            ) : (
              /* ended */
              <Pressable onPress={handleClose} style={styles.callButton}>
                <View style={[styles.callButtonGradient, styles.doneBtn]}>
                  <Ionicons name="checkmark" size={32} color="#fff" />
                </View>
                <Text style={[styles.callLabel, isDark && styles.callLabelDark]}>
                  {t('voiceCoach.done')}
                </Text>
              </Pressable>
            )}

            {/* Session limit note */}
            {state === 'connected' && (
              <Text style={styles.limitNote}>
                {t('voiceCoach.sessionLimit')}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  containerDark: { backgroundColor: '#0A0A0A' },
  safeArea: { flex: 1 },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  topBarSpacer: { width: 36 },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#737373',
  },
  topBarTitleDark: { color: '#A3A3A3' },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnDark: { backgroundColor: 'rgba(255,255,255,0.08)' },

  // Center
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  coachName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#171717',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  coachNameDark: { color: '#F5F5F5' },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#A3A3A3',
    marginBottom: 40,
  },

  // Pulse
  pulseContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
  },
  ring1: { width: 140, height: 140 },
  ring2: { width: 170, height: 170 },
  ring3: { width: 200, height: 200 },
  centerIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Timer
  timerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#171717',
    fontVariant: ['tabular-nums'],
  },
  timerTextDark: { color: '#F5F5F5' },
  remainingText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#A3A3A3',
    fontVariant: ['tabular-nums'],
  },

  // Tip
  tipText: {
    fontSize: 14,
    color: '#A3A3A3',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 16,
  },
  tipTextDark: { color: '#737373' },

  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 12,
  },

  // Bottom
  bottomArea: {
    alignItems: 'center',
    paddingBottom: 40,
    gap: 12,
  },
  callButton: {
    alignItems: 'center',
    gap: 8,
  },
  callButtonGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectingBtn: {
    backgroundColor: '#A3A3A3',
  },
  endCallBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtn: {
    backgroundColor: '#E8435A',
  },
  callLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#525252',
  },
  callLabelDark: { color: '#A3A3A3' },
  limitNote: {
    fontSize: 12,
    color: '#A3A3A3',
  },
});
