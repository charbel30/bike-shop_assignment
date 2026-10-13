import { View } from 'react-native';

import { categories, type CategoryFilter } from '@/data/categories';

import { CategoryChip } from './category-chip';

/**
 * Category row (Figma 1:46). Each chip sits 10dp higher than the one to its left, so the row
 * climbs along the background diagonal.
 */

/** Vertical step between neighbouring chips. */
const STAGGER = 10;

export type CategoryChipsProps = {
  selected: CategoryFilter;
  onSelect: (id: CategoryFilter) => void;
  className?: string;
};

export function CategoryChips({ selected, onSelect, className }: CategoryChipsProps) {
  const last = categories.length - 1;

  return (
    <View accessibilityRole="tablist" className={`flex-row justify-between px-2.5 ${className ?? ''}`}>
      {categories.map((category, index) => (
        <View key={category.id} style={{ marginTop: (last - index) * STAGGER }}>
          <CategoryChip
            category={category}
            selected={selected === category.id}
            onSelect={() => onSelect(category.id)}
          />
        </View>
      ))}
    </View>
  );
}
