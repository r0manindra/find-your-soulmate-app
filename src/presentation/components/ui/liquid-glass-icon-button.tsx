import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import { supportsLiquidGlass, withOpacity } from '@/src/theme/glass';

let LiquidGlassView: any = null;
const hasLiquidGlass = supportsLiquidGlass();
if (hasLiquidGlass) {
  try {
    LiquidGlassView = require('@callstack/liquid-glass').LiquidGlassView;
  } catch {}
}

interface LiquidGlassIconButtonProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  size?: number;
  hitSlop?: number;
  disabled?: boolean;
}

export function LiquidGlassIconButton({
  onPress,
  icon,
  iconSize = 20,
  iconColor,
  size = 36,
  hitSlop = 8,
  disabled = false,
}: LiquidGlassIconButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const foreground = isDark ? '#F5F5F5' : '#171717';
  const resolvedColor = iconColor ?? foreground;

  if (hasLiquidGlass && LiquidGlassView) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        hitSlop={hitSlop}
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        <LiquidGlassView
          interactive
          effect="regular"
          colorScheme={isDark ? 'dark' : 'light'}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={icon} size={iconSize} color={resolvedColor} />
        </LiquidGlassView>
      </Pressable>
    );
  }

  // Fallback
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: withOpacity(foreground, 0.08),
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
      })}
    >
      <Ionicons name={icon} size={iconSize} color={resolvedColor} />
    </Pressable>
  );
}
