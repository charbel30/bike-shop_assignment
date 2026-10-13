import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { AppText } from '@/components/app-text';
import { PressableScale } from '@/components/pressable-scale';
import type { Product } from '@/data/products';
import { formatPrice } from '@/utils/format-price';

import { CARD_DESIGN_WIDTH, CardShape } from './card-shape';
import { FavouriteButton } from './favourite-button';
import { useSvgId } from './use-svg-id';

/**
 * Discover product card (Figma "Items 1/3/4", 1:69–1:95): skewed background, photo, heart and
 * the category / name / price stack anchored to the bottom-left. Art scales with the card
 * width; text stays at its Figma size.
 */

const PRESSED_SCALE = 0.96;
/**
 * Photo box inside the 165-wide card. Photos sit on its bottom edge, where bikes get their
 * contact shadow (Figma 1:81 bike ~121x89 from y 38; 1:105 helmet ~124x130 from y 9).
 */
const IMAGE = { top: 20, inset: 16, height: 108 } as const;

export type ProductCardProps = {
  product: Product;
  width: number;
  /** Card height in the card's 165-wide design units. */
  designHeight: number;
};

export function ProductCard({ product, width, designHeight }: ProductCardProps) {
  const scale = width / CARD_DESIGN_WIDTH;
  const imageWidth = (CARD_DESIGN_WIDTH - IMAGE.inset * 2) * scale;
  const imageHeight = IMAGE.height * scale;

  return (
    <View style={{ width, height: designHeight * scale }}>
      <PressableScale
        pressedScale={PRESSED_SCALE}
        accessibilityLabel={`${product.name}, ${product.categoryLabel}, ${formatPrice(product.price)}`}
        onPress={() => router.push(`/product/${product.id}`)}
        className="flex-1"
      >
        <CardShape width={width} designHeight={designHeight} />
        <View
          pointerEvents="none"
          className="absolute"
          style={{ left: IMAGE.inset * scale, top: IMAGE.top * scale, width: imageWidth, height: imageHeight }}
        >
          {/* Bikes stand on a soft contact shadow (Figma "Shadow" 1:71); helmets float. */}
          {product.category !== 'accessory' ? <GroundShadow width={imageWidth} top={imageHeight - 3} /> : null}
          <Image
            source={product.image}
            contentFit="contain"
            contentPosition="bottom"
            style={{ flex: 1 }}
            accessibilityIgnoresInvertColors
          />
        </View>
        <View pointerEvents="none" className="absolute bottom-[22px] left-4 right-4">
          <AppText variant="caption" weight="medium" tone="muted" numberOfLines={1}>
            {product.categoryLabel}
          </AppText>
          <AppText weight="bold" numberOfLines={1}>
            {product.name}
          </AppText>
          <AppText variant="caption" weight="medium" tone="muted">
            {formatPrice(product.price, { spaced: true })}
          </AppText>
        </View>
        <View className="absolute right-4" style={{ top: 20 * scale }}>
          <FavouriteButton productId={product.id} productName={product.name} />
        </View>
      </PressableScale>
    </View>
  );
}

function GroundShadow({ width, top }: { width: number; top: number }) {
  const id = useSvgId('ground-shadow');
  const height = 10;

  return (
    <Svg width={width} height={height} style={{ position: 'absolute', top: top - height / 2 }}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop stopColor="black" stopOpacity={0.35} />
          <Stop offset={1} stopColor="black" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill={`url(#${id})`} />
    </Svg>
  );
}
