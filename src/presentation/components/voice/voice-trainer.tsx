import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/components/useColorScheme';
import { useSettingsStore } from '@/src/store/settings-store';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import { VoiceFeedback } from './voice-feedback';
import * as api from '@/src/services/api';
import type { VoiceAnalysis } from '@/src/services/api';

type State = 'idle' | 'recording' | 'recorded' | 'analyzing' | 'results';

const MIN_DURATION = 10; // seconds
const MAX_DURATION = 120; // seconds

export function VoiceTrainer() {
  const { t } = useTranslation();
  const locale = useSettingsStore((s) => s.locale);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [state, setState] = useState<State>('idle');
  const [duration, setDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recording = useRef<Audio.Recording | null>(null);
  const sound = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pulsing animation for recording dot
  const pulseOpacity = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));

  useEffect(() => {
    if (state === 'recording') {
      pulseOpacity.value = withRepeat(
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulseOpacity.value = 1;
    }
  }, [state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recording.current?.stopAndUnloadAsync().catch(() => {});
      sound.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setError(t('voice.permissionDenied'));
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording.current = rec;
      setState('recording');
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => {
          if (d + 1 >= MAX_DURATION) {
            stopRecording();
            return MAX_DURATION;
          }
          return d + 1;
        });
      }, 1000);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.error('Start recording error:', err);
      setError(t('voice.recordingError'));
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
        const uri = recording.current.getURI();
        setAudioUri(uri);
        recording.current = null;
        setState('recorded');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (err) {
      console.error('Stop recording error:', err);
      setError(t('voice.recordingError'));
      setState('idle');
    }
  };

  const playRecording = async () => {
    if (!audioUri) return;
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      if (sound.current) {
        await sound.current.unloadAsync();
      }
      const { sound: s } = await Audio.Sound.createAsync({ uri: audioUri });
      sound.current = s;
      await s.playAsync();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (err) {
      console.error('Playback error:', err);
    }
  };

  const analyzeRecording = async () => {
    if (!audioUri) return;
    setState('analyzing');
    setError(null);
    try {
      const result = await api.analyzeVoice(audioUri, locale);
      setAnalysis(result.analysis);
      setState('results');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || t('voice.analysisError'));
      setState('recorded');
    }
  };

  const reset = () => {
    setState('idle');
    setDuration(0);
    setAudioUri(null);
    setAnalysis(null);
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (state === 'results' && analysis) {
    return <VoiceFeedback analysis={analysis} onTryAgain={reset} />;
  }

  return (
    <GlassCard>
      {state === 'idle' && (
        <View style={styles.content}>
          <View style={[styles.iconCircle, isDark && styles.iconCircleDark]}>
            <Ionicons name="mic" size={28} color="#E8435A" />
          </View>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            {t('voice.title')}
          </Text>
          <Text style={[styles.desc, isDark && styles.descDark]}>
            {t('voice.instructions')}
          </Text>
          <BrandButton
            title={t('voice.startRecording')}
            onPress={startRecording}
            icon={<Ionicons name="mic" size={18} color="#fff" />}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}

      {state === 'recording' && (
        <View style={styles.content}>
          <View style={styles.recordingRow}>
            <Animated.View style={[styles.recordingDot, pulseStyle]} />
            <Text style={[styles.timer, isDark && styles.timerDark]}>
              {formatTime(duration)}
            </Text>
          </View>
          <Text style={[styles.recordingHint, isDark && styles.descDark]}>
            {duration < MIN_DURATION
              ? t('voice.keepGoing', { seconds: MIN_DURATION - duration })
              : t('voice.recordingActive')}
          </Text>
          <BrandButton
            title={t('voice.stopRecording')}
            onPress={stopRecording}
            disabled={duration < MIN_DURATION}
            variant="secondary"
            icon={<Ionicons name="stop" size={18} color={isDark ? '#F5F5F5' : '#171717'} />}
          />
        </View>
      )}

      {state === 'recorded' && (
        <View style={styles.content}>
          <View style={[styles.iconCircle, isDark && styles.iconCircleDark]}>
            <Ionicons name="checkmark" size={28} color="#10B981" />
          </View>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            {t('voice.recorded')} - {formatTime(duration)}
          </Text>
          <View style={styles.buttonRow}>
            <Pressable onPress={playRecording} style={[styles.iconBtn, isDark && styles.iconBtnDark]}>
              <Ionicons name="play" size={20} color="#E8435A" />
              <Text style={styles.iconBtnText}>{t('voice.play')}</Text>
            </Pressable>
            <Pressable onPress={reset} style={[styles.iconBtn, isDark && styles.iconBtnDark]}>
              <Ionicons name="refresh" size={20} color="#737373" />
              <Text style={[styles.iconBtnText, { color: '#737373' }]}>{t('voice.reRecord')}</Text>
            </Pressable>
          </View>
          <BrandButton
            title={t('voice.analyze')}
            onPress={analyzeRecording}
            icon={<Ionicons name="analytics" size={18} color="#fff" />}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}

      {state === 'analyzing' && (
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#E8435A" />
          <Text style={[styles.desc, isDark && styles.descDark, { marginTop: 16 }]}>
            {t('voice.analyzing')}
          </Text>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: 14, paddingVertical: 8 },
  iconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(232,67,90,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  iconCircleDark: { backgroundColor: 'rgba(232,67,90,0.15)' },
  title: { fontSize: 17, fontWeight: '700', color: '#171717', letterSpacing: -0.2 },
  titleDark: { color: '#F5F5F5' },
  desc: { fontSize: 14, color: '#737373', textAlign: 'center', lineHeight: 20, paddingHorizontal: 8 },
  descDark: { color: '#A3A3A3' },
  recordingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  recordingDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#EF4444' },
  timer: { fontSize: 32, fontWeight: '800', color: '#171717', letterSpacing: -0.5 },
  timerDark: { color: '#F5F5F5' },
  recordingHint: { fontSize: 14, color: '#737373' },
  buttonRow: { flexDirection: 'row', gap: 16 },
  iconBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)',
  },
  iconBtnDark: { backgroundColor: 'rgba(255,255,255,0.08)' },
  iconBtnText: { fontSize: 14, fontWeight: '600', color: '#E8435A' },
  errorText: { fontSize: 13, color: '#EF4444', textAlign: 'center', marginTop: 4 },
});
