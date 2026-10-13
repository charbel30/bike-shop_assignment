import { View, type ViewProps } from 'react-native';

/** Skeuomorphic container: raised (outer light/dark shadow pair) or one of the sunken wells. */

const variants = {
  /** Raised chip, e.g. selected segment (1:184). */
  raised: 'bg-surface-raised shadow-skeuo',
  /** Pressed chip, e.g. unselected segment (1:186). */
  pressed: 'bg-surface inset-shadow-skeuo',
  /** Deep well, e.g. checkout slide track (1:230). */
  well: 'bg-bg inset-shadow-well',
  /** Shallow well, e.g. quantity stepper (1:248). */
  stepper: 'bg-bg inset-shadow-stepper',
  /** Text field well, e.g. coupon input (1:214). */
  field: 'bg-bg inset-shadow-field',
} as const;

const radii = {
  raised: 'rounded-control',
  pressed: 'rounded-control',
  well: 'rounded-control',
  stepper: 'rounded-field',
  field: 'rounded-field',
} as const;

export type SkeuoVariant = keyof typeof variants;

export type SkeuoSurfaceProps = ViewProps & {
  variant?: SkeuoVariant;
  className?: string;
};

export function SkeuoSurface({ variant = 'raised', className, ...props }: SkeuoSurfaceProps) {
  return <View className={`${radii[variant]} ${variants[variant]} ${className ?? ''}`} {...props} />;
}
