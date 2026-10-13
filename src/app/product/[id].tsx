import { useLocalSearchParams } from 'expo-router';

import { ProductDetailScreen } from '@/screens/product-detail';

export default function ProductRoute() {
  // `?tab=specification` opens the Specification tab (deep links, screenshots).
  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();
  return <ProductDetailScreen id={id} initialTab={tab === 'specification' ? 'specification' : 'description'} />;
}
