import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { GradientButton } from '@/components/gradient-button';
import { BicycleIcon } from '@/components/icons';
import { ScreenBackground } from '@/components/screen-background';
import { useScreenInsets } from '@/hooks/use-screen-insets';

import { DetailHeader, goBack } from './detail-header';

/** Shown for an unknown /product/:id instead of an empty page. */

export function ProductNotFound() {
  const insets = useScreenInsets();

  return (
    <ScreenBackground>
      <View style={{ paddingTop: insets.top }}>
        <DetailHeader title="Not found" />
      </View>
      <View className="flex-1 items-center justify-center px-10" style={{ paddingBottom: insets.bottom }}>
        <View className="size-[72px] items-center justify-center rounded-card border border-t-white/30 border-l-white/30 border-r-black/30 border-b-black/30 bg-linear-to-br from-accent-from to-accent-to shadow-raised">
          <BicycleIcon size={36} />
        </View>
        <AppText variant="heading" className="mt-8 text-center">
          This bike has ridden off
        </AppText>
        <AppText tone="muted" className="mt-2 text-center">
          We couldn&apos;t find that product. It may have sold out or the link is out of date.
        </AppText>
        <GradientButton label="Back to shop" onPress={goBack} className="mt-8 h-11 w-40" />
      </View>
    </ScreenBackground>
  );
}
