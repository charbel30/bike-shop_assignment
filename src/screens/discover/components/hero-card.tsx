import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';
import Svg, { ClipPath, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useCSSVariable } from 'uniwind';

import { AppText } from '@/components/app-text';
import { PressableScale } from '@/components/pressable-scale';
import { getProduct } from '@/data/products';

import { FrostedBackdrop } from './frosted-backdrop';
import { useSvgId } from './use-svg-id';

/**
 * "Top Card" (Figma 1:139): the 30%-off electric bike promo. The card's bottom edge rises
 * towards the right (vector 1:140); everything scales with the card width.
 */

const WIDTH = 350;
const HEIGHT = 240;
// Figma path 1:140, moved to the origin (the export pads it by 60/80 for the shadow).
const PATH =
  'M0 20C0 8.9543 8.9543 0 20 0H330C341.046 0 350 8.9543 350 20V182.156C350 192.323 342.372 200.872 332.271 202.026L22.2709 237.455C10.4029 238.811 0 229.529 0 217.584V20Z';
/** Lowest point of the right edge, where the slanted bottom starts. */
const RIGHT_BOTTOM = 202;
/** Lowest point of the left edge. */
const LEFT_BOTTOM = 237;
/** The bottom edge rises this much from left to right. */
const SKEW = LEFT_BOTTOM - RIGHT_BOTTOM;
const FEATURED_ID = 'volta-e1';
const PRESSED_SCALE = 0.97;

export function HeroCard({ width }: { width: number }) {
  const [from, to] = useCSSVariable(['--color-card-from', '--color-card-to']);
  const fillId = useSvgId('hero-fill');
  const strokeId = useSvgId('hero-stroke');
  const clipId = useSvgId('hero-clip');
  const product = getProduct(FEATURED_ID);
  const scale = width / WIDTH;

  if (!product) return null;

  return (
    <View style={{ width, height: HEIGHT * scale }}>
      <PressableScale
        pressedScale={PRESSED_SCALE}
        accessibilityLabel={`${product.name}, 30% off`}
        onPress={() => router.push(`/product/${product.id}`)}
        className="flex-1"
      >
        <View
          pointerEvents="none"
          className="absolute inset-x-0 top-0 rounded-card shadow-hero"
          style={{ height: RIGHT_BOTTOM * scale }}
        />
        <FrostedBackdrop width={width} height={LEFT_BOTTOM * scale} skew={SKEW * scale} radius={20 * scale} />
        <Svg width={width} height={HEIGHT * scale} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: 'absolute' }}>
          <Defs>
            <LinearGradient id={fillId} x1={186} y1={64} x2={204} y2={212} gradientUnits="userSpaceOnUse">
              <Stop stopColor={String(from)} />
              <Stop offset={1} stopColor={String(to)} />
            </LinearGradient>
            <LinearGradient id={strokeId} x1={39} y1={9} x2={171} y2={197} gradientUnits="userSpaceOnUse">
              <Stop stopColor="white" stopOpacity={0.2} />
              <Stop offset={1} stopColor="black" stopOpacity={0.2} />
            </LinearGradient>
            <ClipPath id={clipId}>
              <Path d={PATH} />
            </ClipPath>
          </Defs>
          <Path d={PATH} fill={`url(#${fillId})`} fillOpacity={0.6} />
          <Path d={PATH} fill="none" stroke={`url(#${strokeId})`} strokeWidth={2} clipPath={`url(#${clipId})`} />
        </Svg>
        <Image
          source={product.image}
          contentFit="contain"
          accessibilityIgnoresInvertColors
          style={{ position: 'absolute', left: 17 * scale, top: 30 * scale, width: 317 * scale, height: 153 * scale }}
        />
        <AppText
          variant="display"
          tone="muted"
          tracking="normal"
          className="absolute left-4"
          style={{ top: 177 * scale }}
        >
          30% Off
        </AppText>
      </PressableScale>
    </View>
  );
}
