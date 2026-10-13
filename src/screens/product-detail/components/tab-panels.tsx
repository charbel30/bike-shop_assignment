import { type ReactNode, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { SCREEN_GUTTER } from '@/theme/layout';
import { timings } from '@/theme/motion';

/**
 * Two tab panels side by side that slide and crossfade together (MOTION: "skeuomorphic buttons
 * have a smooth transition"), timed with the segmented control. Both stay mounted so switching
 * back is instant and the live forecast isn't refetched.
 */

/** Space between the panels while sliding, so the outgoing one fully leaves the gutter. */
const PANEL_GAP = SCREEN_GUTTER * 2;

export type TabPanelsProps = {
  /** 0 shows `first`, 1 shows `second`. */
  index: 0 | 1;
  first: ReactNode;
  second: ReactNode;
};

export function TabPanels({ index, first, second }: TabPanelsProps) {
  const { width } = useWindowDimensions();
  const panelWidth = width - SCREEN_GUTTER * 2;
  const progress = useSharedValue<number>(index);

  useEffect(() => {
    progress.set(withTiming(index, timings.skeuo));
  }, [index, progress]);

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -progress.get() * (panelWidth + PANEL_GAP) }],
  }));

  return (
    <Animated.View style={[rowStyle, { width: panelWidth * 2 + PANEL_GAP, gap: PANEL_GAP }]} className="flex-row items-start">
      <Panel slot={0} index={index} progress={progress} width={panelWidth}>
        {first}
      </Panel>
      <Panel slot={1} index={index} progress={progress} width={panelWidth}>
        {second}
      </Panel>
    </Animated.View>
  );
}

type PanelProps = {
  slot: 0 | 1;
  index: 0 | 1;
  progress: SharedValue<number>;
  width: number;
  children: ReactNode;
};

/** Fully opaque when it's the current panel, fading out as the row slides away from it. */
function Panel({ slot, index, progress, width, children }: PanelProps) {
  const active = slot === index;
  const style = useAnimatedStyle(() => ({ opacity: 1 - Math.abs(progress.get() - slot) }));

  return (
    <Animated.View
      style={[style, { width }]}
      pointerEvents={active ? 'auto' : 'none'}
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}
    >
      {children}
    </Animated.View>
  );
}
