import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { STATUS_BAR_HEIGHT, TAB_BAR, TOP_NAV_GAP } from '@/theme/layout';

/**
 * Screen-level spacing derived from the safe area, floored at the Figma device's values so
 * layouts look the same on iOS, Android and web.
 * - `top`: y of the top navigation row (Figma: 60).
 * - `bottom`: bottom safe area (Figma: 34, the home indicator).
 * - `tabBar`: full height of the floating tab bar; pad scroll content on tab screens by this.
 */
export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, TAB_BAR.homeIndicator);
  return {
    top: Math.max(insets.top, STATUS_BAR_HEIGHT) + TOP_NAV_GAP,
    bottom,
    tabBar: TAB_BAR.slant + TAB_BAR.row + bottom,
  };
}
