import { useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import { ScreenBackground } from '@/components/screen-background';
import type { CategoryFilter } from '@/data/categories';
import { products } from '@/data/products';
import { useScreenInsets } from '@/hooks/use-screen-insets';
import { SCREEN_GUTTER } from '@/theme/layout';

import { CategoryChips } from './components/category-chips';
import { DiscoverHeader } from './components/discover-header';
import { HeroCard } from './components/hero-card';
import { ProductGrid } from './components/product-grid';

/** Discover (Figma 1:38): header, promo card, category chips and the staggered product grid. */

/** Horizontal gap between the two grid columns (x 185 → 205). */
const COLUMN_GAP = 20;

export function DiscoverScreen() {
  const insets = useScreenInsets();
  const { width } = useWindowDimensions();
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  const contentWidth = width - SCREEN_GUTTER * 2;
  const columnWidth = (contentWidth - COLUMN_GAP) / 2;
  const needle = query.trim().toLowerCase();
  const visible = products.filter(
    (product) =>
      (category === 'all' || product.category === category) &&
      (needle === '' || `${product.name} ${product.brand}`.toLowerCase().includes(needle)),
  );

  const toggleSearch = () => {
    setSearching((open) => !open);
    setQuery('');
  };

  return (
    <ScreenBackground shape="discover">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="px-5"
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.tabBar + 20 }}
      >
        <DiscoverHeader
          searching={searching}
          query={query}
          onQueryChange={setQuery}
          onToggleSearch={toggleSearch}
        />
        {/* Figma: header ends at y 104, card starts at 136. */}
        <View className="mt-8">
          <HeroCard width={contentWidth} />
        </View>
        {/* The chip row tucks 8dp under the card's slanted bottom and the grid 16dp under the chips. */}
        <CategoryChips selected={category} onSelect={setCategory} className="-mt-2" />
        <ProductGrid products={visible} columnWidth={columnWidth} className="-mt-4" />
      </ScrollView>
    </ScreenBackground>
  );
}
