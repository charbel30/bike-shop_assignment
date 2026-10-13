import { View } from 'react-native';
import Animated, { Extrapolation, type SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated';

/** Carousel indicator (1:199): 5dp dots, the current page white, the rest at 20%. */

export type PageDotsProps = {
  count: number;
  /** Scroll position in pages (0 = first page), updated on the UI thread. */
  position: SharedValue<number>;
};

export function PageDots({ count, position }: PageDotsProps) {
  return (
    <View className="h-[5px] flex-row justify-center gap-[7px]" accessibilityElementsHidden>
      {Array.from({ length: count }, (_, index) => (
        <Dot key={index} index={index} position={position} />
      ))}
    </View>
  );
}

function Dot({ index, position }: { index: number; position: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const distance = Math.abs(position.get() - index);
    return {
      opacity: interpolate(distance, [0, 1], [1, 0.2], Extrapolation.CLAMP),
      transform: [{ scale: interpolate(distance, [0, 1], [1.15, 1], Extrapolation.CLAMP) }],
    };
  });

  return <Animated.View style={style} className="size-[5px] rounded-full bg-fg" />;
}
