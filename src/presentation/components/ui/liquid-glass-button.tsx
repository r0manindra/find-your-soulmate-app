import React from 'react';
import {
  Pressable,
  View,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import { supportsLiquidGlass, withOpacity } from '@/src/theme/glass';

let LiquidGlassView: any = null;
const hasLiquidGlass = supportsLiquidGlass();
if (hasLiquidGlass) {
  try {
    LiquidGlassView = require('@callstack/liquid-glass').LiquidGlassView;
  } catch {}
}

interface LiquidGlassButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  loadingColor?: string;
  tintColor?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export function LiquidGlassButton({
  onPress,
  children,
  disabled = false,
  loading = false,
  loadingColor = '#fff',
  tintColor,
  style,
  containerStyle,
}: LiquidGlassButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (hasLiquidGlass && LiquidGlassView) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={[{ opacity: disabled ? 0.5 : 1 }, containerStyle]}
      >
        <LiquidGlassView
          effect="regular"
          interactive
          colorScheme={isDark ? 'dark' : 'light'}
          tintColor={tintColor}
          style={[styles.glassContainer, style]}
        >
          {loading ? (
            <ActivityIndicator color={loadingColor} />
          ) : (
            <View style={styles.content}>{children}</View>
          )}
        </LiquidGlassView>
      </Pressable>
    );
  }

  // Fallback: styled pressable
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.fallbackContainer,
        {
          backgroundColor: isDark
            ? withOpacity('#fff', 0.1)
            : withOpacity('#000', 0.06),
          opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
        },
        containerStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={loadingColor} />
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glassContainer: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  fallbackContainer: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
