import { TextInput } from 'react-native';
import { useCSSVariable } from 'uniwind';

import { SearchIcon } from '@/components/icons';
import { SkeuoSurface } from '@/components/skeuo-surface';

/** Sunken search input that replaces the Discover title while searching. */

export type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
};

export function SearchField({ value, onChangeText, className }: SearchFieldProps) {
  const [fgMuted] = useCSSVariable(['--color-fg-muted']);

  return (
    <SkeuoSurface variant="field" className={`h-11 flex-row items-center gap-2.5 px-3.5 ${className ?? ''}`}>
      <SearchIcon size={16} color={String(fgMuted)} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        autoFocus
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        placeholder="Search bikes and brands"
        placeholderTextColorClassName="accent-fg-muted"
        accessibilityLabel="Search products"
        className="h-full min-w-0 flex-1 font-poppins text-body text-fg tracking-tight outline-none"
      />
    </SkeuoSurface>
  );
}
