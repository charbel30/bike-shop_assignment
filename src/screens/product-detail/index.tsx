import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ScreenBackground } from '@/components/screen-background';
import { getProduct } from '@/data/products';
import { useScreenInsets } from '@/hooks/use-screen-insets';
import { useCart } from '@/store/cart';

import { BuyBar, useBuyBarHeight } from './components/buy-bar';
import { DescriptionPanel } from './components/description-panel';
import { DetailHeader } from './components/detail-header';
import { type DetailTab, DetailTabs } from './components/detail-tabs';
import { ImageCarousel } from './components/image-carousel';
import { ProductNotFound } from './components/product-not-found';
import { RideConditionsCard } from './components/ride-conditions-card';
import { TabPanels } from './components/tab-panels';
import { useRideForecast } from './use-ride-forecast';

export type { DetailTab } from './components/detail-tabs';

/**
 * Product Detail (frames 1:176 / 1:557): photo carousel over the diagonal background, then a
 * bottom sheet with Description / Specification tabs, and the "Buy Now" bar pinned below.
 */

/** Vertical rhythm from the Figma frame (y: nav 60 → photo 131 → sheet 394). */
const PHOTO_TOP_GAP = 27;
const SHEET_TOP_GAP = 41;
/** Sheet content: tabs 32dp from the top edge, panel text 29dp below the tabs. */
const TABS_TOP = 32;
const PANEL_TOP = 29;

export type ProductDetailScreenProps = {
  id: string;
  initialTab?: DetailTab;
};

export function ProductDetailScreen({ id, initialTab = 'description' }: ProductDetailScreenProps) {
  const product = getProduct(id);
  const insets = useScreenInsets();
  const barHeight = useBuyBarHeight();
  const add = useCart((state) => state.add);
  const [tab, setTab] = useState<DetailTab>(initialTab);
  const forecast = useRideForecast();

  if (!product) return <ProductNotFound />;

  return (
    <ScreenBackground shape="detail">
      <View style={{ paddingTop: insets.top }}>
        <DetailHeader title={product.name} />
      </View>
      <View style={{ marginTop: PHOTO_TOP_GAP }}>
        <ImageCarousel images={product.images} accessibilityLabel={product.name} />
      </View>

      <View
        className="flex-1 rounded-t-sheet border-t-2 border-t-white/20 bg-linear-to-br from-card-from to-card-to shadow-sheet"
        style={{ marginTop: SHEET_TOP_GAP, paddingTop: TABS_TOP }}
      >
        <DetailTabs value={tab} onChange={setTab} />
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5"
          contentContainerStyle={{ paddingTop: PANEL_TOP, paddingBottom: barHeight + 24 }}
          showsVerticalScrollIndicator={false}
        >
          <TabPanels
            index={tab === 'description' ? 0 : 1}
            first={<DescriptionPanel name={product.name} description={product.description} />}
            second={<RideConditionsCard state={forecast.state} onRetry={forecast.refetch} />}
          />
        </ScrollView>
      </View>

      <BuyBar price={product.price} onAddToCart={() => add(product.id)} />
    </ScreenBackground>
  );
}
