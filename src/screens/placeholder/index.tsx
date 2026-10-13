import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { ScreenBackground } from '@/components/screen-background';
import { useScreenInsets } from '@/hooks/use-screen-insets';

/** "Coming soon" body shared by the tabs the design doesn't cover (Map, Profile, Docs). */

export type PlaceholderScreenProps = {
  title: string;
  description: string;
  /** Glyph shown in the accent tile. */
  icon: ReactNode;
};

export function PlaceholderScreen({ title, description, icon }: PlaceholderScreenProps) {
  const insets = useScreenInsets();

  return (
    <ScreenBackground>
      <View className="px-5" style={{ paddingTop: insets.top }}>
        <View className="h-11 justify-center">
          <AppText variant="title">{title}</AppText>
        </View>
      </View>
      <View className="flex-1 items-center justify-center px-10" style={{ paddingBottom: insets.tabBar }}>
        <View className="size-[72px] items-center justify-center rounded-card border border-t-white/30 border-l-white/30 border-r-black/30 border-b-black/30 bg-linear-to-br from-accent-from to-accent-to shadow-raised">
          {icon}
        </View>
        <AppText variant="heading" className="mt-8 text-center">
          Coming soon
        </AppText>
        <AppText tone="muted" className="mt-2 text-center">
          {description}
        </AppText>
      </View>
    </ScreenBackground>
  );
}
