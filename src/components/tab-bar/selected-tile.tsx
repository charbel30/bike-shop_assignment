import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useCSSVariable } from 'uniwind';

/** The tilted accent-gradient tile marking the selected tab ("Selected Button", 1:172). */

export const TILE_SIZE = 60;

// Figma path for "Rectangle 481" (assets/svg/shapes/tab-selected-tile.svg), a rounded
// parallelogram whose right side sits 8dp higher than its left.
const FILL =
  'M30 28.0035C30 23.2367 33.3646 19.1325 38.0388 18.1977L78.0388 10.1977C84.2268 8.96007 90 13.693 90 20.0035V47.6074C90 52.3742 86.6354 56.4783 81.9612 57.4132L41.9612 65.4132C35.7732 66.6508 30 61.9178 30 55.6074V28.0035Z';
const STROKE =
  'M78.1367 10.6882C84.0152 9.51253 89.5 14.0087 89.5 20.0037V47.6072C89.5 52.1356 86.3037 56.0344 81.8633 56.9226L41.8633 64.9226C35.9848 66.0983 30.5 61.6021 30.5 55.6072V28.0037C30.5 23.4753 33.6963 19.5764 38.1367 18.6882L78.1367 10.6882Z';

export function SelectedTile({ children }: { children: ReactNode }) {
  const [from, to] = useCSSVariable(['--color-accent-from', '--color-accent-to']);

  return (
    <View className="size-[60px] items-center justify-center">
      {/* Box shadows are clipped under their own box, so cast the shadow from a rect that lies
          wholly inside the parallelogram (y 18–57 of the shape) instead of the 60x60 bounds. */}
      <View className="absolute inset-x-0 top-[10px] h-[39px] rounded-control bg-accent-to shadow-tab-tile" />
      {/* Crop the export's shadow padding so the shape's centre is the tile's centre. */}
      <Svg width={TILE_SIZE} height={TILE_SIZE} viewBox="30 7.8 60 60" style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="tile-fill" x1={33} y1={7.8} x2={74.8} y2={88.8} gradientUnits="userSpaceOnUse">
            <Stop stopColor={String(from)} />
            <Stop offset={1} stopColor={String(to)} />
          </LinearGradient>
          {/* Figma: white → black stroke @ 60% with overlay blend (light top-left, dark bottom-right). */}
          <LinearGradient id="tile-stroke" x1={30} y1={7.8} x2={64} y2={80} gradientUnits="userSpaceOnUse">
            <Stop stopColor="white" stopOpacity={0.35} />
            <Stop offset={1} stopColor="black" stopOpacity={0.35} />
          </LinearGradient>
        </Defs>
        <Path d={FILL} fill="url(#tile-fill)" />
        <Path d={STROKE} fill="none" stroke="url(#tile-stroke)" />
      </Svg>
      {children}
    </View>
  );
}
