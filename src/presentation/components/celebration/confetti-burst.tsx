import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const PARTICLE_COUNT = 35;
const COLORS = ['#E8435A', '#FF7854', '#FBBF24', '#34D399', '#8B5CF6', '#fff'];
const DURATION = 1500;

interface Particle {
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
  isCircle: boolean;
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: (Math.random() - 0.5) * 300,
    y: -(Math.random() * 400 + 100),
    rotation: Math.random() * 720 - 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 6 + 4,
    delay: Math.random() * 200,
    isCircle: Math.random() > 0.5,
  }));
}

function ConfettiParticle({ particle, trigger }: { particle: Particle; trigger: boolean }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    if (trigger) {
      opacity.value = withDelay(
        particle.delay,
        withSequence(
          withTiming(1, { duration: 100 }),
          withDelay(DURATION - 400, withTiming(0, { duration: 400 }))
        )
      );
      translateX.value = withDelay(
        particle.delay,
        withTiming(particle.x, { duration: DURATION, easing: Easing.out(Easing.cubic) })
      );
      translateY.value = withDelay(
        particle.delay,
        withSequence(
          withTiming(particle.y, { duration: DURATION * 0.5, easing: Easing.out(Easing.cubic) }),
          withTiming(particle.y + 200, { duration: DURATION * 0.5, easing: Easing.in(Easing.quad) })
        )
      );
      rotate.value = withDelay(
        particle.delay,
        withTiming(particle.rotation, { duration: DURATION, easing: Easing.linear })
      );
      scale.value = withDelay(
        particle.delay,
        withSequence(
          withTiming(1, { duration: 150 }),
          withDelay(DURATION - 500, withTiming(0, { duration: 350 }))
        )
      );
    } else {
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;
      opacity.value = 0;
      scale.value = 0;
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: particle.size,
          height: particle.size,
          backgroundColor: particle.color,
          borderRadius: particle.isCircle ? particle.size / 2 : 2,
        },
        animatedStyle,
      ]}
    />
  );
}

interface ConfettiBurstProps {
  trigger: boolean;
}

export function ConfettiBurst({ trigger }: ConfettiBurstProps) {
  const particles = React.useMemo(() => generateParticles(), []);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle, index) => (
        <ConfettiParticle key={index} particle={particle} trigger={trigger} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  particle: {
    position: 'absolute',
  },
});
