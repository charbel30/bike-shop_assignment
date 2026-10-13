import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect } from 'react';
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useCSSVariable } from 'uniwind';

import { SelectedTile, TILE_SIZE } from '@/components/tab-bar/selected-tile';
import { TabBarBackground } from '@/components/tab-bar/tab-bar-background';
import { useScreenInsets } from '@/hooks/use-screen-insets';
import { TAB_BAR } from '@/theme/layout';
import { springs, timings } from '@/theme/motion';

/**
 * Floating tab bar from Figma 1:146. Screens render underneath it (pad scroll content with
 * `useScreenInsets().tabBar`). A screen hides it with `tabBarStyle: { display: 'none' }`.
 * Each route supplies its glyph through the standard `tabBarIcon` option.
 */

/** The tile never comes closer than this to the screen edge (Figma: x = 17 on the first tab). */
const TILE_EDGE_INSET = 17;
const ICON_BOX = 28;

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const { tabBar: height } = useScreenInsets();
  const [iconIdle] = useCSSVariable(['--color-fg-muted']);

  const itemWidth = width / state.routes.length;
  const tileX = Math.min(
    Math.max(itemWidth * (state.index + 0.5) - TILE_SIZE / 2, TILE_EDGE_INSET),
    width - TILE_EDGE_INSET - TILE_SIZE,
  );

  const focused = state.routes[state.index];
  const focusedOptions = descriptors[focused.key].options;
  // tabBarStyle is typed as animatable; we only read its static `display`.
  const hidden =
    StyleSheet.flatten(focusedOptions.tabBarStyle as StyleProp<ViewStyle>)?.display === 'none';

  const x = useSharedValue(tileX);
  // Slide out past the tile's shadow so nothing peeks above the screen edge.
  const offscreen = height + 40;
  const y = useSharedValue(hidden ? offscreen : 0);

  useEffect(() => {
    x.set(withSpring(tileX, springs.tab));
  }, [tileX, x]);

  useEffect(() => {
    y.set(withTiming(hidden ? offscreen : 0, timings.bar));
  }, [hidden, offscreen, y]);

  const barStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));
  const tileStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <Animated.View
      pointerEvents={hidden ? 'none' : 'box-none'}
      style={[{ height }, barStyle]}
      className="absolute inset-x-0 bottom-0"
    >
      <TabBarBackground width={width} height={height} />

      <View accessibilityRole="tablist" className="flex-row" style={{ marginTop: TAB_BAR.slant, height: TAB_BAR.row }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = index === state.index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? options.title}
              onPress={onPress}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              className="flex-1 items-center pt-[5px]"
            >
              {/* The focused glyph lives in the tile; keep the slot so the row doesn't shift. */}
              <View className={`items-center justify-center ${isFocused ? 'opacity-0' : ''}`} style={{ height: ICON_BOX }}>
                {options.tabBarIcon?.({ focused: false, color: String(iconIdle), size: ICON_BOX })}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Animated.View pointerEvents="none" style={tileStyle} className="absolute left-0 top-0">
        <SelectedTile>
          <Animated.View key={focused.key} entering={FadeIn.duration(timings.fade.duration)}>
            {focusedOptions.tabBarIcon?.({ focused: true, color: 'white', size: ICON_BOX })}
          </Animated.View>
        </SelectedTile>
      </Animated.View>
    </Animated.View>
  );
}
