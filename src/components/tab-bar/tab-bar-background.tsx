import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useCSSVariable } from 'uniwind';

import { TAB_BAR } from '@/theme/layout';

/**
 * Tab bar body ("Rectangle 24", 1:147): a vertical gradient whose top edge rises 20dp from left
 * to right. Figma rounds the bottom corners to the device mask (r=50); the device clips those
 * anyway, so the shape stays square to look right on square-cornered screens too.
 */
export function TabBarBackground({ width, height }: { width: number; height: number }) {
  const [from, to] = useCSSVariable(['--color-tab-bar-from', '--color-tab-bar-to']);

  return (
    <Svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }}>
      <Defs>
        {/* Figma's gradient runs from 5dp above to ~17dp below the 103.5dp shape. */}
        <LinearGradient
          id="tab-bar-fill"
          x1={0}
          y1={-5}
          x2={0}
          y2={height * (121 / 103.5)}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={String(from)} />
          <Stop offset={1} stopColor={String(to)} />
        </LinearGradient>
      </Defs>
      <Path d={`M0 ${TAB_BAR.slant}L${width} 0V${height}H0Z`} fill="url(#tab-bar-fill)" />
      {/* 2dp inside stroke, white @ 20% with overlay blend → a faint highlight on the top edge. */}
      <Path
        d={`M0 ${TAB_BAR.slant + 0.5}L${width} 0.5`}
        stroke="white"
        strokeOpacity={0.12}
        strokeWidth={1}
      />
    </Svg>
  );
}
