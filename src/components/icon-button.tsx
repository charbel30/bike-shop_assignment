import type { ReactNode } from 'react';
import { View } from 'react-native';

import { PressableScale, type PressableScaleProps } from '@/components/pressable-scale';

/** 44x44 accent-gradient square holding an icon (search, back, checkout chevron). */

export type IconButtonProps = Omit<PressableScaleProps, 'children'> & {
  /** Required: icon-only buttons need a spoken name. */
  accessibilityLabel: string;
  children: ReactNode;
  /** Drop the raised shadow (e.g. when the button sits inside a skeuomorphic well). */
  flat?: boolean;
};

export function IconButton({ children, flat = false, className, ...props }: IconButtonProps) {
  return (
    <PressableScale className={className} {...props}>
      <View
        className={`size-11 items-center justify-center rounded-control border border-t-white/30 border-l-white/30 border-r-black/30 border-b-black/30 bg-linear-to-br from-accent-from to-accent-to ${flat ? '' : 'shadow-raised'}`}
      >
        {children}
      </View>
    </PressableScale>
  );
}
