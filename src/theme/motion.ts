import { Easing, type WithSpringConfig, type WithTimingConfig } from 'react-native-reanimated';

/**
 * Motion tokens (Figma MOTION section 1:391). Every animation in the app should pick from here
 * so press feedback, tab movement and state changes share one feel.
 */

/** "Accent coloured buttons shrink on press": 160x44 → 130x35.8 in frames 2:73 / 2:87. */
export const PRESS_SCALE = 130 / 160;

export const springs = {
  /** Press-in / press-out feedback: fast, no visible overshoot. */
  press: { damping: 20, stiffness: 420, mass: 0.6 },
  /** Selected tab tile sliding between tabs: a touch of overshoot so it feels physical. */
  tab: { damping: 16, stiffness: 180, mass: 0.8 },
} satisfies Record<string, WithSpringConfig>;

export const timings = {
  /** "Skeuomorphic buttons have a smooth transition": raised ↔ pressed crossfade. */
  skeuo: { duration: 260, easing: Easing.bezier(0.4, 0, 0.2, 1) },
  /** Small fades (icons, labels). */
  fade: { duration: 180, easing: Easing.out(Easing.quad) },
  /** Tab bar hiding / showing. */
  bar: { duration: 280, easing: Easing.bezier(0.4, 0, 0.2, 1) },
} satisfies Record<string, WithTimingConfig>;
