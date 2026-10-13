import type { ComponentType } from 'react';

import {
  CategoryAccessoryIcon,
  CategoryElectricIcon,
  CategoryMountainIcon,
  CategoryRoadIcon,
  type IconProps,
} from '@/components/icons';

/** Discover's category chips (Figma 1:46), in order. "All" is a text chip, the rest are icons. */

export type ProductCategory = 'electric' | 'road' | 'mountain' | 'accessory';
export type CategoryFilter = 'all' | ProductCategory;

export type Category = {
  id: CategoryFilter;
  label: string;
  /** null for "All", which renders its label instead of a glyph. */
  icon: ComponentType<IconProps> | null;
};

export const categories: readonly Category[] = [
  { id: 'all', label: 'All', icon: null },
  { id: 'electric', label: 'Electric', icon: CategoryElectricIcon },
  { id: 'road', label: 'Road', icon: CategoryRoadIcon },
  { id: 'mountain', label: 'Mountain', icon: CategoryMountainIcon },
  { id: 'accessory', label: 'Accessories', icon: CategoryAccessoryIcon },
];
