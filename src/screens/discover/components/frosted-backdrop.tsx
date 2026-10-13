import { BlurView } from 'expo-blur';
import { View } from 'react-native';

/**
 * Backdrop blur for the skewed cards (Figma "background blur" on 1:117 / 1:140). A BlurView
 * can only be clipped to a rounded rect, so the rect is skewed vertically into the card's
 * parallelogram: vertical sides, top and bottom edges rising by `skew` towards the right.
 * The SVG fill then sits on top at Figma's 60% so the background diagonal glows through
 * softly instead of cutting a hard line across the card.
 * Android without a BlurTargetView falls back to the translucent tint only.
 */

export type FrostedBackdropProps = {
  width: number;
  height: number;
  /** How much higher the right edge sits than the left, in dp. */
  skew: number;
  radius: number;
};

export function FrostedBackdrop({ width, height, skew, radius }: FrostedBackdropProps) {
  const angle = Math.atan2(skew, width);

  return (
    <View
      pointerEvents="none"
      className="absolute left-0 overflow-hidden"
      style={{
        top: skew / 2,
        width,
        height: height - skew,
        borderRadius: radius,
        transform: [{ skewY: `${-angle}rad` }],
      }}
    >
      <BlurView tint="systemUltraThinMaterialDark" intensity={100} style={{ flex: 1 }} />
    </View>
  );
}
