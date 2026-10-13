import { Pressable, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { PRESS_SCALE, springs } from '@/theme/motion';

/** Pressable that shrinks while held (Figma MOTION: "accent coloured buttons shrink on press"). */

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  className?: string;
  /** Scale while pressed; defaults to the Figma 160→130 ratio. */
  pressedScale?: number;
};

export function PressableScale({
  pressedScale = PRESS_SCALE,
  onPressIn,
  onPressOut,
  accessibilityRole = 'button',
  ...props
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      accessibilityRole={accessibilityRole}
      onPressIn={(event) => {
        scale.set(withSpring(pressedScale, springs.press));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, springs.press));
        onPressOut?.(event);
      }}
      style={animatedStyle}
      {...props}
    />
  );
}
