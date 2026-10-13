import LottieView from 'lottie-react-native';

/** Accent disc + checkmark draw (assets/lottie/checkout-success.json, 1.1s at 60fps), played once. */

const source = require('@/assets/lottie/checkout-success.json');

export function SuccessAnimation({ size }: { size: number }) {
  return <LottieView source={source} autoPlay loop={false} style={{ width: size, height: size }} />;
}
