import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, withTiming, useSharedValue, withDelay } from 'react-native-reanimated';
import { useEffect } from 'react';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  label?: string;
  isDark?: boolean;
}

export function ProgressRing({ progress, size = 120, strokeWidth = 8, label, isDark = false }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const innerDiameter = size - strokeWidth * 2 - 8;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withDelay(300, withTiming(progress, { duration: 1000 }));
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  const percentage = Math.round(progress * 100);
  const isSmall = size < 140;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? '#404040' : '#E5E5E5'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E8435A"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={[styles.labelContainer, { width: innerDiameter }]}>
        <Text style={[styles.percentage, isSmall && styles.percentageSmall, isDark && styles.percentageDark]}>{percentage}%</Text>
        {label && <Text style={[styles.label, isSmall && styles.labelSmall, isDark && styles.labelDark]} numberOfLines={1}>{label}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 28,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -1,
  },
  percentageDark: {
    color: '#F5F5F5',
  },
  percentageSmall: {
    fontSize: 22,
  },
  label: {
    fontSize: 11,
    color: '#737373',
    marginTop: 2,
    textAlign: 'center',
  },
  labelDark: {
    color: '#A3A3A3',
  },
  labelSmall: {
    fontSize: 10,
  },
});
