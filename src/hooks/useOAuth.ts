import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/src/store/auth-store';
import * as api from '@/src/services/api';
import { loginRevenueCat } from '@/src/services/purchases';
import {
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID,
} from '@/src/config/oauth';

export function useOAuth() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [error, setError] = useState('');

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || undefined,
  });

  // Handle Google response
  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const idToken = response.params.id_token;
      if (idToken) {
        handleGoogleSuccess(idToken);
      }
    } else if (response.type === 'error') {
      setError(response.error?.message || 'Google sign-in failed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    // Cancelled: do nothing
  }, [response]);

  const handleGoogleSuccess = async (idToken: string) => {
    setGoogleLoading(true);
    setError('');
    try {
      const { user } = await api.loginWithGoogle(idToken);
      setUser(user);
      loginRevenueCat(user.id).catch(() => {});
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const signInWithGoogle = useCallback(() => {
    setError('');
    promptAsync();
  }, [promptAsync]);

  const signInWithApple = useCallback(async () => {
    setError('');
    setAppleLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token from Apple');
      }

      const fullName = [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean)
        .join(' ') || undefined;

      const { user } = await api.loginWithApple(
        credential.identityToken,
        fullName,
        credential.email || undefined
      );
      setUser(user);
      loginRevenueCat(user.id).catch(() => {});
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (err: any) {
      // Apple cancellation — code ERR_REQUEST_CANCELED or code 1001
      if (err.code === 'ERR_REQUEST_CANCELED' || err.code === '1001') {
        setAppleLoading(false);
        return;
      }
      setError(err.message || 'Apple sign-in failed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setAppleLoading(false);
    }
  }, []);

  return {
    signInWithGoogle,
    signInWithApple,
    googleLoading,
    appleLoading,
    error,
    setError,
    googleReady: !!request,
  };
}
