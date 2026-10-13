import { useWindowDimensions } from 'react-native';

import { DESIGN_WIDTH } from '@/theme/layout';

/**
 * Ratio between the window width and the 390dp Figma frame. Multiply Figma sizes by it for
 * elements that should scale with the screen (hero art, background shape, card widths).
 * Type and spacing stay fixed.
 */
export function useDesignScale() {
  const { width } = useWindowDimensions();
  return width / DESIGN_WIDTH;
}
