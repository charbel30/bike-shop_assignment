import { View } from 'react-native';

import { AppText, type AppTextProps } from '@/components/app-text';
import { PressableScale, type PressableScaleProps } from '@/components/pressable-scale';

/** Accent-gradient call-to-action ("Add to Cart", "Apply"); shrinks on press. */

export type GradientButtonProps = Omit<PressableScaleProps, 'children'> & {
  label: string;
  /** Overrides for the label; defaults to Figma's "Add to Cart" style (15 medium). */
  labelProps?: Omit<AppTextProps, 'children'>;
  /** Sizing / positioning; defaults to the 160x44 "Add to Cart" button. */
  className?: string;
};

export function GradientButton({
  label,
  labelProps,
  className = 'h-11 w-40',
  ...props
}: GradientButtonProps) {
  return (
    <PressableScale accessibilityLabel={label} className={className} {...props}>
      <View className="flex-1 items-center justify-center rounded-control border border-t-white/30 border-l-white/30 border-r-black/30 border-b-black/30 bg-linear-to-br from-accent-from to-accent-to shadow-button">
        <AppText weight="medium" {...labelProps}>
          {label}
        </AppText>
      </View>
    </PressableScale>
  );
}
