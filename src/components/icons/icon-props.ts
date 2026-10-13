import type { ColorValue } from 'react-native';
import type { SvgProps } from 'react-native-svg';

export type IconProps = Omit<SvgProps, 'width' | 'height' | 'color'> & {
  /** Length of the icon's longest side in dp; defaults to its Figma size. */
  size?: number;
  /** Fill for `currentColor` paths. */
  color?: ColorValue;
};
