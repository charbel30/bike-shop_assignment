import { View } from 'react-native';
import Svg, { ClipPath, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useCSSVariable } from 'uniwind';

import { FrostedBackdrop } from './frosted-backdrop';
import { useSvgId } from './use-svg-id';

/**
 * Skewed product-card background (Figma 1:84 / 1:117, "Rectangle 166/167"): a rounded
 * parallelogram whose right edge sits 23 units higher than its left. Drawn in a 165-wide
 * design space and scaled to the column width, so 375/390/440 keep the same proportions.
 */

/** Figma card width; every height and offset below is in these units. */
export const CARD_DESIGN_WIDTH = 165;
/** How much higher the right edge sits than the left. */
export const CARD_SKEW = 23;

/** Figma path 1:84 with its straight sides stretched to `height`. */
function cardPath(height: number) {
  const h = height;
  return (
    'M0 42.733C0 33.0673 6.91248 24.7847 16.4223 23.0556L141.422 0.328359' +
    'C153.699 -1.90379 165 7.52768 165 20.0058' +
    `V${h - 43.65}C165 ${h - 33.984} 158.088 ${h - 25.702} 148.578 ${h - 23.973}` +
    `L23.5777 ${h - 1.245}C11.3009 ${h + 0.987} 0 ${h - 8.445} 0 ${h - 20.923}V42.733Z`
  );
}

export type CardShapeProps = {
  /** Rendered width in dp. */
  width: number;
  /** Card height in design units (165-wide space). */
  designHeight: number;
};

export function CardShape({ width, designHeight }: CardShapeProps) {
  const [from, to] = useCSSVariable(['--color-card-from', '--color-card-to']);
  const fillId = useSvgId('card-fill');
  const strokeId = useSvgId('card-stroke');
  const clipId = useSvgId('card-clip');
  const scale = width / CARD_DESIGN_WIDTH;
  const d = cardPath(designHeight);

  return (
    <View pointerEvents="none" className="absolute inset-0">
      {/* Box shadows are clipped under their own box, so cast the card shadow from a rect that
          lies inside the parallelogram rather than from the skewed bounds. */}
      <View
        className="absolute inset-x-0 rounded-card shadow-card"
        style={{ top: CARD_SKEW * scale, bottom: CARD_SKEW * scale }}
      />
      <FrostedBackdrop width={width} height={designHeight * scale} skew={CARD_SKEW * scale} radius={20 * scale} />
      <Svg
        width={width}
        height={designHeight * scale}
        viewBox={`0 0 ${CARD_DESIGN_WIDTH} ${designHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <LinearGradient id={fillId} x1={0.28} y1={0.22} x2={0.54} y2={0.72}>
            <Stop stopColor={String(from)} />
            <Stop offset={1} stopColor={String(to)} />
          </LinearGradient>
          {/* Figma: white → black inner stroke at 20%, lit from the top-left. */}
          <LinearGradient id={strokeId} x1={0.1} y1={0} x2={0.85} y2={0.22}>
            <Stop stopColor="white" stopOpacity={0.25} />
            <Stop offset={1} stopColor="black" stopOpacity={0.2} />
          </LinearGradient>
          <ClipPath id={clipId}>
            <Path d={d} />
          </ClipPath>
        </Defs>
        <Path d={d} fill={`url(#${fillId})`} fillOpacity={0.45} />
        {/* 2-unit stroke clipped to the shape = Figma's 1px inside stroke. */}
        <Path d={d} fill="none" stroke={`url(#${strokeId})`} strokeWidth={2} clipPath={`url(#${clipId})`} />
      </Svg>
    </View>
  );
}
