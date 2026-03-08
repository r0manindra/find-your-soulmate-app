import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/components/useColorScheme';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { SocialAuthButtons } from '@/src/presentation/components/ui/social-auth-buttons';
import { useAuthStore } from '@/src/store/auth-store';
import { useSettingsStore } from '@/src/store/settings-store';
import { useHeartsStore } from '@/src/store/hearts-store';
import { useUserProfileStore } from '@/src/store/user-profile-store';
import { useOAuth } from '@/src/hooks/useOAuth';
import * as api from '@/src/services/api';
import { loginRevenueCat } from '@/src/services/purchases';

export default function RegisterScreen() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const locale = useSettingsStore((s) => s.locale);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    signInWithGoogle,
    signInWithApple,
    googleLoading,
    appleLoading,
    error: oauthError,
    setError: setOAuthError,
    googleReady,
  } = useOAuth();

  const error = formError || oauthError;

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      setFormError(locale === 'de' ? 'Bitte alle Felder ausfüllen' : 'Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setFormError(locale === 'de' ? 'Passwort muss mindestens 8 Zeichen lang sein' : 'Password must be at least 8 characters');
      return;
    }
    // Validate date of birth
    const day = parseInt(birthDay, 10);
    const month = parseInt(birthMonth, 10);
    const year = parseInt(birthYear, 10);
    if (!day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
      setFormError(locale === 'de' ? 'Bitte gib ein gültiges Geburtsdatum ein' : 'Please enter a valid date of birth');
      return;
    }
    const birthDate = new Date(year, month - 1, day);
    const now = new Date();
    const age = now.getFullYear() - birthDate.getFullYear() -
      (now < new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);
    if (age < 16) {
      setFormError(locale === 'de' ? 'Du musst mindestens 16 Jahre alt sein' : 'You must be at least 16 years old');
      return;
    }
    const birthDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setFormError('');
    setOAuthError('');
    setLoading(true);
    try {
      const { user } = await api.register(email.trim(), password, name.trim() || undefined, birthDateStr);
      setUser(user);
      // Ensure onboarding triggers for new account
      useUserProfileStore.getState().resetProfile();
      // Welcome gift: 10 bonus hearts for new users
      useHeartsStore.getState().claimWelcomeGift();
      loginRevenueCat(user.id).catch(() => {});
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (err: any) {
      setFormError(err.message || (locale === 'de' ? 'Registrierung fehlgeschlagen' : 'Registration failed'));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <LinearGradient
              colors={['#E8435A', '#FF7854']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoContainer}
            >
              <Text style={styles.logoText}>S</Text>
            </LinearGradient>

            <Text style={[styles.title, isDark && styles.titleDark]}>
              {locale === 'de' ? 'Konto erstellen' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {locale === 'de' ? 'Starte deine Reise zum Seelenverwandten' : 'Start your journey to finding your soulmate'}
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <SocialAuthButtons
              onGooglePress={signInWithGoogle}
              onApplePress={signInWithApple}
              googleLoading={googleLoading}
              appleLoading={appleLoading}
              googleReady={googleReady}
            />

            <GlassCard style={styles.formCard} padding={20}>
              <View style={styles.form}>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder={locale === 'de' ? 'Name (optional)' : 'Name (optional)'}
                  placeholderTextColor="#A3A3A3"
                  value={name}
                  onChangeText={setName}
                  autoComplete="name"
                />
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder={locale === 'de' ? 'E-Mail' : 'Email'}
                  placeholderTextColor="#A3A3A3"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder={locale === 'de' ? 'Passwort (8+ Zeichen)' : 'Password (8+ characters)'}
                  placeholderTextColor="#A3A3A3"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="new-password"
                />

                <Text style={[styles.dobLabel, isDark && styles.dobLabelDark]}>
                  {locale === 'de' ? 'Geburtsdatum' : 'Date of Birth'}
                </Text>
                <View style={styles.dobRow}>
                  <TextInput
                    style={[styles.input, styles.dobInput, isDark && styles.inputDark]}
                    placeholder={locale === 'de' ? 'TT' : 'DD'}
                    placeholderTextColor="#A3A3A3"
                    value={birthDay}
                    onChangeText={(t) => setBirthDay(t.replace(/[^0-9]/g, '').slice(0, 2))}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <TextInput
                    style={[styles.input, styles.dobInput, isDark && styles.inputDark]}
                    placeholder={locale === 'de' ? 'MM' : 'MM'}
                    placeholderTextColor="#A3A3A3"
                    value={birthMonth}
                    onChangeText={(t) => setBirthMonth(t.replace(/[^0-9]/g, '').slice(0, 2))}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <TextInput
                    style={[styles.input, styles.dobInputYear, isDark && styles.inputDark]}
                    placeholder={locale === 'de' ? 'JJJJ' : 'YYYY'}
                    placeholderTextColor="#A3A3A3"
                    value={birthYear}
                    onChangeText={(t) => setBirthYear(t.replace(/[^0-9]/g, '').slice(0, 4))}
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                </View>

                <BrandButton
                  title={loading
                    ? (locale === 'de' ? 'Konto wird erstellt...' : 'Creating account...')
                    : (locale === 'de' ? 'Konto erstellen' : 'Create Account')}
                  onPress={handleRegister}
                  disabled={loading}
                />
              </View>
            </GlassCard>

            <Pressable onPress={() => router.push('/auth/login')} style={styles.switchButton}>
              <Text style={styles.switchText}>
                {locale === 'de' ? 'Schon ein Konto? ' : 'Already have an account? '}
                <Text style={styles.switchLink}>
                  {locale === 'de' ? 'Anmelden' : 'Sign In'}
                </Text>
              </Text>
            </Pressable>

            <Pressable onPress={() => router.replace('/(tabs)')} style={styles.skipButton}>
              <Text style={styles.skipText}>
                {locale === 'de' ? 'Ohne Konto fortfahren' : 'Continue without account'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  safeAreaDark: { backgroundColor: '#171717' },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 24 },
  logoContainer: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: 24,
  },
  logoText: { fontSize: 28, fontWeight: '800', color: '#fff' },
  title: {
    fontSize: 28, fontWeight: '700', color: '#171717',
    textAlign: 'center', letterSpacing: -0.5, marginBottom: 4,
  },
  titleDark: { color: '#F5F5F5' },
  subtitle: {
    fontSize: 15, color: '#737373', textAlign: 'center', marginBottom: 24,
  },
  error: {
    fontSize: 14, color: '#E8435A', textAlign: 'center',
    marginBottom: 16, fontWeight: '500',
  },
  formCard: { marginBottom: 4 },
  form: { gap: 12 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: '#171717',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.08)',
  },
  inputDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#F5F5F5',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dobLabel: {
    fontSize: 13, fontWeight: '600', color: '#737373', marginBottom: -4,
  },
  dobLabelDark: { color: '#A3A3A3' },
  dobRow: {
    flexDirection: 'row', gap: 8,
  },
  dobInput: {
    flex: 1, textAlign: 'center',
  },
  dobInputYear: {
    flex: 1.5, textAlign: 'center',
  },
  switchButton: { marginTop: 24, alignItems: 'center' },
  switchText: { fontSize: 15, color: '#737373' },
  switchLink: { color: '#E8435A', fontWeight: '600' },
  skipButton: { marginTop: 16, alignItems: 'center' },
  skipText: { fontSize: 14, color: '#A3A3A3' },
});
