import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { GradientButton } from '@/components/gradient-button';
import { useScreenInsets } from '@/hooks/use-screen-insets';
import { TAB_BAR } from '@/theme/layout';
import { formatPrice } from '@/utils/format-price';

/** "Buy Now" bar (1:188): price and "Add to Cart", pinned to the bottom over the sheet. */

/** Figma: 30dp above the row; 30dp below it on the 34dp home-indicator device. */
const ROW_PADDING = 30;
const ROW_HEIGHT = 44;
/** How long the button reads "Added" after a tap. */
const CONFIRM_MS = 1400;

/** Total bar height for the current device, so scrolling content can clear it. */
export function useBuyBarHeight() {
  const { bottom } = useScreenInsets();
  // The lower padding grows with any home-indicator area taller than Figma's.
  return ROW_PADDING + ROW_HEIGHT + ROW_PADDING + bottom - TAB_BAR.homeIndicator;
}

export type BuyBarProps = {
  price: number;
  onAddToCart: () => void;
};

export function BuyBar({ price, onAddToCart }: BuyBarProps) {
  const height = useBuyBarHeight();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handlePress = () => {
    onAddToCart();
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), CONFIRM_MS);
  };

  return (
    <View
      className="absolute right-0 bottom-0 left-0 rounded-t-bar border-t-2 border-t-white/20 bg-surface-bar px-[35px] shadow-bar"
      style={{ height, paddingTop: ROW_PADDING }}
    >
      <View className="h-11 flex-row items-center justify-between">
        <AppText variant="price" tone="accent">
          {formatPrice(price, { spaced: true })}
        </AppText>
        <GradientButton
          label={added ? 'Added ✓' : 'Add to Cart'}
          accessibilityLabel="Add to Cart"
          accessibilityHint={added ? 'Added to your cart' : undefined}
          onPress={handlePress}
        />
      </View>
    </View>
  );
}
