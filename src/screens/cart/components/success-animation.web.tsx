import Svg, { Defs, LinearGradient, Circle, Path, Stop } from 'react-native-svg';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useCSSVariable } from 'uniwind';

/**
 * Web stand-in for the Lottie success animation: lottie-react-native's web build needs
 * @lottiefiles/dotlottie-react, which this Expo Go project doesn't ship. Same disc + check,
 * shown with a Reanimated zoom instead of the stroke draw.
 */
export function SuccessAnimation({ size }: { size: number }) {
  const [from, to] = useCSSVariable(['--color-accent-from', '--color-accent-to']);
  return (
    <Animated.View entering={ZoomIn.springify()} style={{ width: size, height: size }}>
      <Svg viewBox="0 0 120 120" width={size} height={size}>
        <Defs>
          <LinearGradient id="success-disc" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={String(from)} />
            <Stop offset="1" stopColor={String(to)} />
          </LinearGradient>
        </Defs>
        <Circle cx={60} cy={60} r={42} fill="url(#success-disc)" />
        <Path
          d="M41 61 L54 74 L80 47"
          stroke="white"
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
}
