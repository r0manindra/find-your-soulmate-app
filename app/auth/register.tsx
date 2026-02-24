import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BrandButton } from '@/src/presentation/components/ui/brand-button';
import { useAuthStore } from '@/src/store/auth-store';
import * as api from '@/src/services/api';
import { loginRevenueCat } from '@/src/services/purchases';

export default function RegisterScreen() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { user } = await api.register(email.trim(), password, name.trim() || undefined);
      setUser(user);
      loginRevenueCat(user.id).catch(() => {});
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your journey to finding your soulmate</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Name (optional)"
              placeholderTextColor="#A3A3A3"
              value={name}
              onChangeText={setName}
              autoComplete="name"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A3A3A3"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <TextInput
              style={styles.input}
              placeholder="Password (8+ characters)"
              placeholderTextColor="#A3A3A3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />

            <BrandButton
              title={loading ? 'Creating account...' : 'Create Account'}
              onPress={handleRegister}
              disabled={loading}
            />
          </View>

          <Pressable onPress={() => router.push('/auth/login')} style={styles.switchButton}>
            <Text style={styles.switchText}>
              Already have an account? <Text style={styles.switchLink}>Sign In</Text>
            </Text>
          </Pressable>

          <Pressable onPress={() => router.replace('/(tabs)')} style={styles.skipButton}>
            <Text style={styles.skipText}>Continue without account</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
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
  subtitle: {
    fontSize: 15, color: '#737373', textAlign: 'center', marginBottom: 24,
  },
  error: {
    fontSize: 14, color: '#E8435A', textAlign: 'center',
    marginBottom: 16, fontWeight: '500',
  },
  form: { gap: 12 },
  input: {
    backgroundColor: '#fff', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: '#171717',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.1)',
  },
  switchButton: { marginTop: 24, alignItems: 'center' },
  switchText: { fontSize: 15, color: '#737373' },
  switchLink: { color: '#E8435A', fontWeight: '600' },
  skipButton: { marginTop: 16, alignItems: 'center' },
  skipText: { fontSize: 14, color: '#A3A3A3' },
});
