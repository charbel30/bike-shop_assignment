import { View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import type { Product } from '@/data/products';
import { timings } from '@/theme/motion';

import { CARD_DESIGN_WIDTH } from './card-shape';
import { ProductCard } from './product-card';

/**
 * Two-column staggered product grid (Figma "Items" 1:67). Products alternate left/right; the
 * left column starts lower and the card heights alternate per column, matching the mockup's
 * rhythm. All offsets are in card design units, so the grid scales with the column width.
 */

/** Figma card heights per column, cycled down the column. */
const LEFT_HEIGHTS = [237, 219] as const;
const RIGHT_HEIGHTS = [215, 242] as const;
/** The left column starts this much lower than the right one (y 467 vs 442). */
const LEFT_OFFSET = 25;
/** Vertical gap between cards in a column. */
const ROW_GAP = 4;

export type ProductGridProps = {
  products: readonly Product[];
  columnWidth: number;
  className?: string;
};

export function ProductGrid({ products, columnWidth, className }: ProductGridProps) {
  const scale = columnWidth / CARD_DESIGN_WIDTH;

  if (products.length === 0) {
    return (
      <View className={`items-center py-16 ${className ?? ''}`}>
        <AppText tone="muted">No bikes match your search.</AppText>
      </View>
    );
  }

  const left = products.filter((_, index) => index % 2 === 0);
  const right = products.filter((_, index) => index % 2 === 1);

  return (
    <View className={`flex-row justify-between ${className ?? ''}`}>
      <Column products={left} heights={LEFT_HEIGHTS} width={columnWidth} scale={scale} offset={LEFT_OFFSET} />
      <Column products={right} heights={RIGHT_HEIGHTS} width={columnWidth} scale={scale} offset={0} />
    </View>
  );
}

type ColumnProps = {
  products: readonly Product[];
  heights: readonly number[];
  width: number;
  scale: number;
  offset: number;
};

function Column({ products, heights, width, scale, offset }: ColumnProps) {
  return (
    <View style={{ width, paddingTop: offset * scale, gap: ROW_GAP * scale }}>
      {products.map((product, index) => (
        <Animated.View
          key={product.id}
          entering={FadeIn.duration(timings.skeuo.duration)}
          layout={LinearTransition.duration(timings.skeuo.duration)}
        >
          <ProductCard product={product} width={width} designHeight={heights[index % heights.length]} />
        </Animated.View>
      ))}
    </View>
  );
}
