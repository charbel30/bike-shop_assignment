import { View } from 'react-native';

import { AppText } from '@/components/app-text';

/** Description tab content (1:195): product name over the muted body copy. */

export function DescriptionPanel({ name, description }: { name: string; description: string }) {
  return (
    <View className="gap-2">
      <AppText variant="heading">{name}</AppText>
      <AppText tone="muted">{description}</AppText>
    </View>
  );
}
