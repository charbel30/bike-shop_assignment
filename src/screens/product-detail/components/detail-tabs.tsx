import { View } from 'react-native';

import { SkeuoButton } from '@/components/skeuo-button';

/** Description / Specification segmented control (1:182). */

export type DetailTab = 'description' | 'specification';

const TABS: readonly { id: DetailTab; label: string }[] = [
  { id: 'description', label: 'Description' },
  { id: 'specification', label: 'Specification' },
];

export type DetailTabsProps = {
  value: DetailTab;
  onChange: (tab: DetailTab) => void;
};

export function DetailTabs({ value, onChange }: DetailTabsProps) {
  return (
    <View accessibilityRole="tablist" className="flex-row justify-center gap-[30px]">
      {TABS.map((tab) => (
        <SkeuoButton
          key={tab.id}
          label={tab.label}
          selected={tab.id === value}
          onPress={() => onChange(tab.id)}
        />
      ))}
    </View>
  );
}
