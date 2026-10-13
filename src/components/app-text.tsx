import { Text, type TextProps } from 'react-native';

/** Poppins text on the Figma type ramp; pick size by role, colour by tone. */

const variants = {
  display: 'text-display', // 26 — "30% Off"
  price: 'text-price', // 24 — detail price
  title: 'text-title', // 20 — screen titles
  heading: 'text-heading', // 17 — section headings, cart total
  body: 'text-body', // 15 — body copy, buttons, labels
  caption: 'text-caption', // 13 — card meta, list prices
  micro: 'text-micro', // 11
} as const;

const defaultWeight: Record<TextVariant, TextWeight> = {
  display: 'bold',
  price: 'regular',
  title: 'bold',
  heading: 'bold',
  body: 'regular',
  caption: 'regular',
  micro: 'bold',
};

// React Native can't synthesise weights for custom fonts, so each weight is its own family.
const weights = {
  regular: 'font-poppins',
  medium: 'font-poppins-medium',
  semibold: 'font-poppins-semibold',
  bold: 'font-poppins-bold',
} as const;

const tones = {
  default: 'text-fg',
  soft: 'text-fg-soft',
  muted: 'text-fg-muted',
  accent: 'text-accent',
  'accent-light': 'text-accent-light',
} as const;

const trackings = {
  tight: 'tracking-tight', // -0.3, the Figma default
  snug: 'tracking-snug', // -0.08, coupon / checkout
  normal: 'tracking-normal', // 0, "Choose Your Bike", "30% Off"
  wide: 'tracking-wide', // +0.35, segmented control labels
} as const;

export type TextVariant = keyof typeof variants;
export type TextWeight = keyof typeof weights;
export type TextTone = keyof typeof tones;
export type TextTracking = keyof typeof trackings;

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  /** Defaults to the weight Figma uses most for the variant. */
  weight?: TextWeight;
  tone?: TextTone;
  tracking?: TextTracking;
  /** Layout classes (margins, alignment, flex). Use the props above for type and colour. */
  className?: string;
};

export function AppText({
  variant = 'body',
  weight,
  tone = 'default',
  tracking = 'tight',
  className,
  ...props
}: AppTextProps) {
  return (
    <Text
      className={`${variants[variant]} ${weights[weight ?? defaultWeight[variant]]} ${tones[tone]} ${trackings[tracking]} ${className ?? ''}`}
      {...props}
    />
  );
}
