import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { timings } from '@/theme/motion';
import type { CartTotals as Totals } from '@/utils/cart-totals';
import { formatPercent, formatPrice } from '@/utils/format-price';

/** Subtotal / Delivery Fee / Discount rows (1:219) and the Total line (1:333). */

/** Re-keyed on value so a changed amount fades in instead of snapping. */
function Amount({ value, children }: { value: string; children: ReactNode }) {
  return (
    <Animated.View key={value} entering={FadeIn.duration(timings.skeuo.duration)}>
      {children}
    </Animated.View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <AppText weight="medium" tone="soft">
        {label}
      </AppText>
      <Amount value={value}>
        <AppText tone="muted">{value}</AppText>
      </Amount>
    </View>
  );
}

export function CartTotals({ totals }: { totals: Totals }) {
  const total = formatPrice(totals.total);
  return (
    <View>
      <View className="gap-2">
        <Row label="Subtotal:" value={formatPrice(totals.subtotal)} />
        <Row label="Delivery Fee:" value={formatPrice(totals.deliveryFee)} />
        <Row label="Discount:" value={formatPercent(totals.discountRate)} />
      </View>
      <View className="mt-4 flex-row items-center justify-between">
        <AppText weight="medium" tone="soft">
          Total:
        </AppText>
        <Amount value={total}>
          <AppText variant="heading" tone="accent-light">
            {total}
          </AppText>
        </Amount>
      </View>
    </View>
  );
}
