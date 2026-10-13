import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useCSSVariable } from 'uniwind';

import { AppText } from '@/components/app-text';
import { PressableScale } from '@/components/pressable-scale';
import type { Category } from '@/data/categories';
import { timings } from '@/theme/motion';

/**
 * One 50x50 category chip (Figma 1:47–1:64). Idle chips are dark raised tiles with a 60% glyph;
 * the selected chip crossfades to the accent gradient ("All", 1:47) and its glyph to full white.
 */

export type CategoryChipProps = {
  category: Category;
  selected: boolean;
  onSelect: () => void;
};

export function CategoryChip({ category, selected, onSelect }: CategoryChipProps) {
  const [fg, fgMuted] = useCSSVariable(['--color-fg', '--color-fg-muted']);
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.set(withTiming(selected ? 1 : 0, timings.skeuo));
  }, [progress, selected]);

  const accentStyle = useAnimatedStyle(() => ({ opacity: progress.get() }));
  const Icon = category.icon;

  return (
    <PressableScale
      accessibilityRole="tab"
      accessibilityLabel={category.label}
      accessibilityState={{ selected }}
      onPress={onSelect}
    >
      <View className="size-[50px] items-center justify-center rounded-control border border-t-white/20 border-l-white/20 border-r-black/20 border-b-black/20 bg-linear-to-b from-card-from to-card-to shadow-raised">
        <Animated.View
          style={accentStyle}
          className="absolute -inset-px rounded-control border border-t-white/30 border-l-white/30 border-r-black/30 border-b-black/30 bg-linear-to-br from-accent-from to-accent-to"
        />
        {Icon ? (
          <Icon color={String(selected ? fg : fgMuted)} />
        ) : (
          <AppText variant="caption" weight="medium" tone={selected ? 'default' : 'muted'} tracking="normal">
            {category.label}
          </AppText>
        )}
      </View>
    </PressableScale>
  );
}
