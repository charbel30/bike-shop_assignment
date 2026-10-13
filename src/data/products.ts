import type { ImageSourcePropType } from 'react-native';

import type { ProductCategory } from '@/data/categories';

/** Local product catalog. The first three items are the ones drawn in the Figma file. */

export type Product = {
  /** URL-safe id, used in /product/[id]. */
  id: string;
  /** Display name as written in Figma, e.g. "PEUGEOT - LR01". */
  name: string;
  brand: string;
  category: ProductCategory;
  /** Card subtitle, e.g. "Road Bike". */
  categoryLabel: string;
  /** USD. */
  price: number;
  /** Primary image (transparent PNG), used on cards and in the cart. */
  image: ImageSourcePropType;
  /** Detail-screen carousel. Figma shows three dots but supplies one photo per product. */
  images: readonly ImageSourcePropType[];
  description: string;
};

const images = {
  peugeot: require('@/assets/images/products/peugeot-lr01.png'),
  pilot: require('@/assets/images/products/pilot-chromoly-520.png'),
  helmet: require('@/assets/images/products/smith-trade-helmet.png'),
  electric: require('@/assets/images/products/electric-bike.png'),
} satisfies Record<string, ImageSourcePropType>;

// Order matters: Discover lays products out left/right alternately, so this order
// reproduces the mockup's first screen (LR01 + SMITH on top, PILOT second on the right).
export const products: readonly Product[] = [
  {
    id: 'peugeot-lr01',
    name: 'PEUGEOT - LR01',
    brand: 'PEUGEOT',
    category: 'road',
    categoryLabel: 'Road Bike',
    price: 1999.99,
    image: images.peugeot,
    images: [images.peugeot, images.peugeot, images.peugeot],
    // Verbatim from the Detail frame (1:197).
    description:
      "The LR01 uses the same design as the most iconic bikes from PEUGEOT Cycles' 130-year history and combines it with agile, dynamic performance that's perfectly suited to navigating today's cities. As well as a lugged steel frame and iconic PEUGEOT black-and-white chequer design, this city bike also features a 16-speed Shimano Claris drivetrain.",
  },
  {
    id: 'smith-trade',
    name: 'SMITH - Trade',
    brand: 'SMITH',
    category: 'accessory',
    categoryLabel: 'Road Helmet',
    price: 120,
    image: images.helmet,
    images: [images.helmet, images.helmet, images.helmet],
    description:
      'A lightweight road helmet with MIPS rotational-impact protection, 18 vents for all-day airflow and a dial-fit system that adjusts with one hand. Koroyd panels absorb more energy on impact without adding bulk.',
  },
  {
    id: 'peugeot-lr02',
    name: 'PEUGEOT - LR02',
    brand: 'PEUGEOT',
    category: 'road',
    categoryLabel: 'Road Bike',
    price: 2299.99,
    image: images.peugeot,
    images: [images.peugeot],
    description:
      'The LR02 keeps the lugged steel frame and chequer details of the LR01 and adds a 22-speed Shimano 105 groupset and lighter wheels for riders who want to go further and faster.',
  },
  {
    id: 'pilot-chromoly-520',
    name: 'PILOT - CHROMOLY 520',
    brand: 'PILOT',
    category: 'mountain',
    categoryLabel: 'Mountain Bike',
    // The cart (1:265) says $3,999.99 and its subtotal only adds up with that price;
    // the Discover card's "$ 1,999.99" is treated as a copy-paste slip.
    price: 3999.99,
    image: images.pilot,
    images: [images.pilot, images.pilot, images.pilot],
    description:
      'A chromoly steel hardtail built for long days on rough trails. The 520 pairs a forgiving, lively frame with a 120 mm air fork, hydraulic disc brakes and a 1x12 drivetrain, so it climbs efficiently and stays composed when the singletrack turns technical.',
  },
  {
    id: 'volta-e1',
    name: 'VOLTA - E1',
    brand: 'VOLTA',
    category: 'electric',
    categoryLabel: 'Electric Bike',
    price: 2899.99,
    image: images.electric,
    images: [images.electric, images.electric, images.electric],
    description:
      'A sleek carbon e-bike with a hub motor hidden in the rear wheel and a battery integrated into the down tube. Up to 80 km of assistance, a belt drive that never needs oiling and integrated lights make it an effortless daily commuter.',
  },
  {
    id: 'pilot-trail-640',
    name: 'PILOT - TRAIL 640',
    brand: 'PILOT',
    category: 'mountain',
    categoryLabel: 'Mountain Bike',
    price: 2499.99,
    image: images.pilot,
    images: [images.pilot],
    description:
      'A trail-ready hardtail with progressive geometry, a dropper post and wide tubeless-ready rims. Stable at speed, playful in the turns.',
  },
  {
    id: 'smith-forefront',
    name: 'SMITH - Forefront',
    brand: 'SMITH',
    category: 'accessory',
    categoryLabel: 'MTB Helmet',
    price: 180,
    image: images.helmet,
    images: [images.helmet],
    description:
      'Extended coverage for trail riding, with MIPS, Koroyd and an adjustable visor that leaves room for goggles.',
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
