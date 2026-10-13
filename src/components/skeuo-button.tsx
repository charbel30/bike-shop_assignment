import { useEffect } from 'react';
import { Pressable, type PressableProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { SkeuoSurface } from '@/components/skeuo-surface';
import { timings } from '@/theme/motion';

/**
 * Segmented-control button (Description / Specification): pressed when idle, raised with an
 * accent label when selected, crossfading between the two (MOTION: "smooth transition").
 */

export type SkeuoButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  selected: boolean;
  className?: string;
};

export function SkeuoButton({ label, selected, className, ...props }: SkeuoButtonProps) {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.set(withTiming(selected ? 1 : 0, timings.skeuo));
  }, [progress, selected]);

  const raisedStyle = useAnimatedStyle(() => ({ opacity: progress.get() }));
  const pressedStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.get() }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      className={`h-[43px] justify-center px-5 ${className ?? ''}`}
      {...props}
    >
      <SkeuoSurface variant="pressed" className="absolute inset-0" />
      <Animated.View style={raisedStyle} className="absolute inset-0">
        <SkeuoSurface variant="raised" className="flex-1" />
      </Animated.View>
      {/* The bold label stays in flow so the cell never changes width while crossfading. */}
      <View className="items-center">
        <Animated.View style={raisedStyle}>
          <AppText weight="bold" tone="accent" tracking="wide">
            {label}
          </AppText>
        </Animated.View>
        <Animated.View style={pressedStyle} className="absolute">
          <AppText tone="muted" tracking="wide">
            {label}
          </AppText>
        </Animated.View>
      </View>
    </Pressable>
  );
}
