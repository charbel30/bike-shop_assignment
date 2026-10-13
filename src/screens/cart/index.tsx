import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { IconButton } from '@/components/icon-button';
import { ChevronLeftIcon } from '@/components/icons';
import { ScreenBackground } from '@/components/screen-background';
import { useScreenInsets } from '@/hooks/use-screen-insets';
import { useCart, useCartLines, useCartTotals } from '@/store/cart';
import { timings } from '@/theme/motion';
import { formatPrice } from '@/utils/format-price';

import { CartItemRow } from './components/cart-item-row';
import { CartTotals } from './components/cart-totals';
import { CheckoutSlider } from './components/checkout-slider';
import { CheckoutSuccess } from './components/checkout-success';
import { CouponField } from './components/coupon-field';
import { EmptyCart } from './components/empty-cart';

/** Figma 1:210 "Shopping Bag". */

/** How long the success animation stays up before the cart empties. */
const SUCCESS_HOLD_MS = 1800;
/** Gap under the checkout slider (Figma: 30dp to the frame bottom). */
const BOTTOM_GAP = 30;

const goBack = () => (router.canGoBack() ? router.back() : router.navigate('/'));

export function CartScreen() {
  const insets = useScreenInsets();
  const lines = useCartLines();
  const totals = useCartTotals();
  const increment = useCart((state) => state.increment);
  const decrement = useCart((state) => state.decrement);
  const remove = useCart((state) => state.remove);
  const clear = useCart((state) => state.clear);
  const [checkedOut, setCheckedOut] = useState(false);

  // After checkout: hold the success animation, then empty the cart behind it.
  useEffect(() => {
    if (!checkedOut) return;
    const timer = setTimeout(() => {
      clear();
      setCheckedOut(false);
    }, SUCCESS_HOLD_MS);
    return () => clearTimeout(timer);
  }, [checkedOut, clear]);

  const isEmpty = lines.length === 0;

  return (
    <ScreenBackground>
      {/* Gesture Handler's ScrollView so row swipes and the checkout drag coordinate with scrolling. */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingBottom: BOTTOM_GAP }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-[43px] px-5">
          <IconButton accessibilityLabel="Back" onPress={goBack}>
            <ChevronLeftIcon size={16} />
          </IconButton>
          <AppText variant="title" accessibilityRole="header">
            My Shopping Cart
          </AppText>
        </View>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <Animated.View exiting={FadeOut.duration(timings.fade.duration)} className="grow">
            <View className="mt-8 gap-[18px]">
              {lines.map((line) => (
                <CartItemRow
                  key={line.productId}
                  line={line}
                  onIncrement={() => increment(line.productId)}
                  onDecrement={() => decrement(line.productId)}
                  onRemove={() => remove(line.productId)}
                />
              ))}
            </View>

            <Animated.View layout={LinearTransition.duration(timings.bar.duration)} className="grow px-5">
              <AppText tone="muted" className="mt-[26px] text-center">
                {totals.qualifiesForFreeShipping
                  ? 'Your cart qualifies for free shipping'
                  : `Add ${formatPrice(totals.amountToFreeShipping)} more for free shipping`}
              </AppText>
              <View className="mt-6">
                <CouponField />
              </View>
              <View className="mt-4">
                <CartTotals totals={totals} />
              </View>
              <View className="grow" />
              <View className="mt-5 items-center">
                <CheckoutSlider onComplete={() => setCheckedOut(true)} />
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </ScrollView>
      {checkedOut ? <CheckoutSuccess /> : null}
    </ScreenBackground>
  );
}
