import { useState } from 'react';
import { TextInput } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { GradientButton } from '@/components/gradient-button';
import { SkeuoSurface } from '@/components/skeuo-surface';
import { useCart } from '@/store/cart';
import { springs, timings } from '@/theme/motion';

/** Coupon well with the "Apply" button (1:213). Invalid codes shake the field. */

type Status = 'idle' | 'applied' | 'invalid';

const STATUS_COPY: Record<Exclude<Status, 'idle'>, string> = {
  applied: 'Applied',
  invalid: 'Invalid code',
};

export function CouponField() {
  const couponCode = useCart((state) => state.couponCode);
  const applyCoupon = useCart((state) => state.applyCoupon);
  const clearCoupon = useCart((state) => state.clearCoupon);
  const [code, setCode] = useState(couponCode ?? '');
  const [status, setStatus] = useState<Status>('idle');
  const shakeX = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.get() }] }));

  const apply = () => {
    if (code.trim() === '') {
      clearCoupon();
      setStatus('idle');
      return;
    }
    if (applyCoupon(code)) {
      setStatus('applied');
      return;
    }
    setStatus('invalid');
    shakeX.set(
      withSequence(
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(-4, { duration: 50 }),
        withTiming(4, { duration: 50 }),
        withSpring(0, springs.press),
      ),
    );
  };

  return (
    <Animated.View style={shakeStyle}>
      <SkeuoSurface variant="field" className="h-11 flex-row items-center">
        <TextInput
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setStatus('idle');
          }}
          onSubmitEditing={apply}
          placeholder="Coupon code"
          placeholderTextColorClassName="accent-fg-muted"
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          accessibilityLabel="Coupon code"
          className="h-11 min-w-0 flex-1 pl-3 font-poppins text-caption tracking-snug text-fg-muted"
        />
        {status !== 'idle' ? (
          <Animated.View
            key={status}
            entering={FadeIn.duration(timings.fade.duration)}
            exiting={FadeOut.duration(timings.fade.duration)}
            className="pr-3"
          >
            <AppText
              variant="caption"
              weight="medium"
              tracking="snug"
              tone={status === 'applied' ? 'accent-light' : 'muted'}
              accessibilityLiveRegion="polite"
            >
              {STATUS_COPY[status]}
            </AppText>
          </Animated.View>
        ) : null}
        <GradientButton
          label="Apply"
          onPress={apply}
          className="h-11 w-[114px]"
          labelProps={{ variant: 'caption', weight: 'bold', tracking: 'snug' }}
        />
      </SkeuoSurface>
    </Animated.View>
  );
}
