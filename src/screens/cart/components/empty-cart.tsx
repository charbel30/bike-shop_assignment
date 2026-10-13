import { router } from 'expo-router';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useCSSVariable } from 'uniwind';

import { AppText } from '@/components/app-text';
import { GradientButton } from '@/components/gradient-button';
import { CartIcon } from '@/components/icons';
import { timings } from '@/theme/motion';

/** Shown when the cart has no lines: a sunken cart tile, a short message and a way back. */
export function EmptyCart() {
  const [muted] = useCSSVariable(['--color-fg-muted']);
  return (
    <Animated.View
      entering={FadeInDown.duration(timings.skeuo.duration)}
      className="flex-1 items-center justify-center gap-8 pb-16"
    >
      <View className="size-[100px] items-center justify-center rounded-card bg-bg inset-shadow-well">
        <CartIcon size={36} color={String(muted)} />
      </View>
      <View className="items-center gap-1">
        <AppText variant="title">Your cart is empty</AppText>
        <AppText tone="muted">Find your next ride in the shop.</AppText>
      </View>
      <GradientButton label="Browse bikes" onPress={() => router.navigate('/')} />
    </Animated.View>
  );
}
