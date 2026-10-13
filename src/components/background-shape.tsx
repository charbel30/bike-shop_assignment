import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useCSSVariable } from 'uniwind';

import { useDesignScale } from '@/hooks/use-design-scale';

/**
 * The diagonal accent-gradient shape behind Discover and Product Detail ("Rectangle 474/475",
 * 1:40 / 1:179), scaled with the window width so it keeps its Figma proportions.
 */

// Figma path, 413.5 x 720.5 (assets/svg/shapes/background-diagonal.svg).
const PATH = 'M262.682 167.616L342.237 0L413.787 59.5413V721L0 705.489L262.682 167.616Z';
const WIDTH = 414;
const HEIGHT = 721;

/** Top-left offset of the shape inside each 390-wide frame. */
const placements = {
  discover: { left: -20, top: 149 },
  detail: { left: 8, top: -80 },
} as const;

export type BackgroundShapePlacement = keyof typeof placements;

export function BackgroundShape({ placement }: { placement: BackgroundShapePlacement }) {
  const scale = useDesignScale();
  const [from, to] = useCSSVariable(['--color-accent-alt-from', '--color-accent-alt-to']);
  const { left, top } = placements[placement];

  return (
    <Svg
      pointerEvents="none"
      width={WIDTH * scale}
      height={HEIGHT * scale}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: 'absolute', left: left * scale, top: top * scale }}
    >
      <Defs>
        <LinearGradient
          id="background-shape"
          x1={188.631}
          y1={0.5}
          x2={392.772}
          y2={721}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={String(from)} />
          <Stop offset={1} stopColor={String(to)} />
        </LinearGradient>
      </Defs>
      <Path d={PATH} fill="url(#background-shape)" />
    </Svg>
  );
}
