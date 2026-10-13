import Animated, { FadeIn } from 'react-native-reanimated';
import { View } from 'react-native';
import { useCSSVariable } from 'uniwind';

import { AppText } from '@/components/app-text';
import { MinusIcon, PlusIcon } from '@/components/icons';
import { PressableScale } from '@/components/pressable-scale';
import { SkeuoSurface } from '@/components/skeuo-surface';
import { timings } from '@/theme/motion';

/** Quantity well (1:248): dark "−" key, the count, accent "+" key. */

type QtyStepperProps = {
  qty: number;
  /** Product name, used to give each key a spoken label. */
  label: string;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function QtyStepper({ qty, label, onIncrement, onDecrement }: QtyStepperProps) {
  const [muted] = useCSSVariable(['--color-fg-muted']);
  const atMinimum = qty <= 1;

  return (
    <SkeuoSurface variant="stepper" className="h-[30px] flex-row items-center gap-2.5 px-[3px]">
      <PressableScale
        accessibilityLabel={`Decrease ${label} quantity`}
        accessibilityState={{ disabled: atMinimum }}
        disabled={atMinimum}
        hitSlop={8}
        onPress={onDecrement}
      >
        <View className="size-6 items-center justify-center rounded-stepper border-[0.5px] border-t-white/20 border-l-white/20 border-r-black/20 border-b-black/20 bg-card-from">
          <MinusIcon size={16} color={String(muted)} />
        </View>
      </PressableScale>
      {/* Re-keyed on change so the new count fades in. */}
      <Animated.View key={qty} entering={FadeIn.duration(timings.fade.duration)}>
        <AppText
          variant="caption"
          weight="semibold"
          tone="muted"
          className="min-w-[5px] text-center"
          accessibilityLabel={`Quantity ${qty}`}
        >
          {qty}
        </AppText>
      </Animated.View>
      <PressableScale accessibilityLabel={`Increase ${label} quantity`} hitSlop={8} onPress={onIncrement}>
        <View className="size-6 items-center justify-center rounded-stepper border-[0.5px] border-t-white/30 border-l-white/30 border-r-black/30 border-b-black/30 bg-linear-to-br from-accent-from to-accent-to">
          <PlusIcon size={16} />
        </View>
      </PressableScale>
    </SkeuoSurface>
  );
}
