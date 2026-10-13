import { Pressable } from 'react-native';

import { HeartGradientIcon, HeartIcon } from '@/components/icons';
import { useCart } from '@/store/cart';

/** Card heart (Figma "heart / 24 / Outline"): accent gradient when favourited, white outline otherwise. */
export function FavouriteButton({ productId, productName }: { productId: string; productName: string }) {
  const favourite = useCart((state) => state.favourites.has(productId));
  const toggleFavourite = useCart((state) => state.toggleFavourite);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={favourite ? `Remove ${productName} from favourites` : `Add ${productName} to favourites`}
      accessibilityState={{ selected: favourite }}
      hitSlop={10}
      onPress={() => toggleFavourite(productId)}
      className="size-6 items-center justify-center"
    >
      {favourite ? <HeartGradientIcon /> : <HeartIcon />}
    </Pressable>
  );
}
