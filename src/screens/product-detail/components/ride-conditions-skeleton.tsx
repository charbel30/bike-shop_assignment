import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  type SharedValue,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

/** Loading state for the ride card: the same layout as the loaded card, with a sweeping sheen. */

const BAND_WIDTH = 120;
/** Far enough to cross the widest block (the 335dp card). */
const SWEEP = 360;

function Block({ progress, className }: { progress: SharedValue<number>; className: string }) {
  const bandStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -BAND_WIDTH + progress.get() * (SWEEP + BAND_WIDTH) }],
  }));

  return (
    <View className={`overflow-hidden bg-white/5 ${className}`}>
      <Animated.View style={bandStyle} className="absolute top-0 bottom-0 left-0">
        <Svg width={BAND_WIDTH} height="100%">
          <Defs>
            <LinearGradient id="ride-skeleton-sheen" x1="0" y1="0" x2="1" y2="0">
              <Stop stopColor="white" stopOpacity={0} />
              <Stop offset={0.5} stopColor="white" stopOpacity={0.09} />
              <Stop offset={1} stopColor="white" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect width={BAND_WIDTH} height="100%" fill="url(#ride-skeleton-sheen)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

export function RideConditionsSkeleton() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(withRepeat(withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.quad) }), -1));
    return () => cancelAnimation(progress);
  }, [progress]);

  return (
    <View accessibilityLabel="Loading ride conditions" accessibilityRole="progressbar" className="gap-2.5">
      <Block progress={progress} className="h-[16.5px] w-48 rounded-stepper" />
      <View className="flex-row items-center gap-3">
        <Block progress={progress} className="size-12 rounded-control" />
        <View className="flex-1 gap-2">
          <Block progress={progress} className="h-5 w-36 rounded-stepper" />
          <Block progress={progress} className="h-4 w-44 rounded-stepper" />
        </View>
        <Block progress={progress} className="size-12 rounded-control" />
      </View>
      <View className="mt-0.5 flex-row gap-3">
        <Block progress={progress} className="h-14 flex-1 rounded-control" />
        <Block progress={progress} className="h-14 flex-1 rounded-control" />
        <Block progress={progress} className="h-14 flex-1 rounded-control" />
      </View>
      <Block progress={progress} className="mt-0.5 h-16 rounded-field" />
    </View>
  );
}
