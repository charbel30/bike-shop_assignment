import { View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { timings } from '@/theme/motion';

import { SuccessAnimation } from './success-animation';

/** Full-screen confirmation shown after the checkout slide completes. */
export function CheckoutSuccess() {
  return (
    <Animated.View
      entering={FadeIn.duration(timings.skeuo.duration)}
      exiting={FadeOut.duration(timings.skeuo.duration)}
      className="absolute inset-0 items-center justify-center bg-bg/90"
      accessibilityViewIsModal
      accessibilityLiveRegion="assertive"
    >
      <SuccessAnimation size={160} />
      <Animated.View entering={FadeInDown.delay(350).duration(timings.skeuo.duration)}>
        <View className="items-center gap-1">
          <AppText variant="title">Order placed!</AppText>
          <AppText tone="muted">Your bikes are on their way.</AppText>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
