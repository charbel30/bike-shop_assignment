import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { IconButton } from '@/components/icon-button';
import { SearchIcon } from '@/components/icons';
import { timings } from '@/theme/motion';

import { SearchField } from './search-field';

/**
 * Top navigation (Figma 1:42): title + accent search button. While searching, the title
 * crossfades into a search field in the same 44dp row, so nothing below moves.
 */

export type DiscoverHeaderProps = {
  searching: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onToggleSearch: () => void;
};

const fade = timings.fade.duration;

export function DiscoverHeader({ searching, query, onQueryChange, onToggleSearch }: DiscoverHeaderProps) {
  return (
    <View className="h-11 flex-row items-center gap-4">
      <View className="h-11 flex-1">
        {searching ? (
          <Animated.View key="field" className="absolute inset-0 justify-center" entering={FadeIn.duration(fade)} exiting={FadeOut.duration(fade)}>
            <SearchField value={query} onChangeText={onQueryChange} />
          </Animated.View>
        ) : (
          <Animated.View key="title" className="absolute inset-0 justify-center" entering={FadeIn.duration(fade)} exiting={FadeOut.duration(fade)}>
            <AppText variant="title" tracking="normal" accessibilityRole="header">
              Choose Your Bike
            </AppText>
          </Animated.View>
        )}
      </View>
      <IconButton
        accessibilityLabel={searching ? 'Close search' : 'Search'}
        accessibilityState={{ expanded: searching }}
        onPress={onToggleSearch}
      >
        <SearchIcon />
      </IconButton>
    </View>
  );
}
