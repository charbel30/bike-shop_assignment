import { Image, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeOut,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AppText } from '@/components/app-text';
import type { CartLineWithProduct } from '@/store/cart';
import { springs, timings } from '@/theme/motion';
import { formatPrice } from '@/utils/format-price';

import { QtyStepper } from './qty-stepper';

/** One cart line (1:237): thumbnail tile, name, price and quantity stepper, over a hairline. */

/** Fraction of the row width a left swipe must pass to remove the line. */
const REMOVE_THRESHOLD = 0.35;

type CartItemRowProps = {
  line: CartLineWithProduct;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

export function CartItemRow({ line, onIncrement, onDecrement, onRemove }: CartItemRowProps) {
  const { product, qty } = line;
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);

  // Swipe left to remove. Horizontal-only activation keeps vertical scrolling untouched.
  const swipe = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-10, 10])
    .onChange((event) => {
      translateX.set(Math.min(0, translateX.get() + event.changeX));
    })
    .onEnd((event) => {
      const passed = translateX.get() < -width * REMOVE_THRESHOLD || event.velocityX < -1200;
      if (passed) {
        translateX.set(
          withTiming(-width, { duration: timings.bar.duration }, (finished) => {
            if (finished) scheduleOnRN(onRemove);
          }),
        );
      } else {
        translateX.set(withSpring(0, springs.press));
      }
    });

  const contentStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.get() }] }));
  // The "Remove" hint fades in behind the row as it slides away.
  const hintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.get(), [0, -width * REMOVE_THRESHOLD], [0, 1], 'clamp'),
  }));

  return (
    <Animated.View
      layout={LinearTransition.duration(timings.bar.duration)}
      exiting={FadeOut.duration(timings.fade.duration)}
      accessible
      accessibilityLabel={`${product.name}, ${formatPrice(product.price)}, quantity ${qty}`}
      accessibilityActions={[
        { name: 'increment', label: 'Increase quantity' },
        { name: 'decrement', label: 'Decrease quantity' },
        { name: 'delete', label: 'Remove from cart' },
      ]}
      onAccessibilityAction={({ nativeEvent }) => {
        if (nativeEvent.actionName === 'increment') onIncrement();
        if (nativeEvent.actionName === 'decrement') onDecrement();
        if (nativeEvent.actionName === 'delete') onRemove();
      }}
    >
      <View>
        <Animated.View
          style={hintStyle}
          className="absolute inset-y-0 right-5 justify-center"
          importantForAccessibility="no"
        >
          <AppText weight="medium" tone="accent-light">
            Remove
          </AppText>
        </Animated.View>
        <GestureDetector gesture={swipe}>
          <Animated.View style={contentStyle} className="h-[90px] flex-row gap-4 bg-bg px-5">
            <View className="h-[90px] w-[100px] items-center justify-center rounded-card border border-t-white/20 border-l-white/20 border-r-black/20 border-b-black/20 bg-linear-to-br from-thumb-from to-thumb-to">
              <Image source={product.image} resizeMode="contain" className="h-[78px] w-[84px]" />
            </View>
            <View className="flex-1 justify-center gap-6">
              <AppText weight="bold" tone="soft" numberOfLines={1}>
                {product.name}
              </AppText>
              <View className="h-[30px] flex-row items-center justify-between">
                <AppText variant="caption" tone="accent">
                  {formatPrice(product.price, { spaced: true })}
                </AppText>
                <QtyStepper
                  qty={qty}
                  label={product.name}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                />
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
      <View className="mt-4 h-[0.5px] bg-separator" />
    </Animated.View>
  );
}
