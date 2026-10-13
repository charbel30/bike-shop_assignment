import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './icon-props';
export function ChevronRightIcon({ size = 16, color = 'white', ...props }: IconProps) {
  const width = (size * 9) / 16;
  const height = (size * 16) / 16;
  return (
    <Svg viewBox="0 0 9 16" fill="none" width={width} height={height} color={color} {...props}>
      <Path
        d="M9 7.81881C8.99119 7.51028 8.87659 7.24584 8.63859 7.00784L1.78061 0.299706C1.57786 0.105779 1.33986 0 1.04897 0C0.458374 0 0 0.458374 0 1.04897C0 1.33105 0.114594 1.59549 0.317336 1.79824L6.48776 7.81881L0.317336 13.8394C0.114594 14.0421 0 14.2977 0 14.5886C0 15.1792 0.458374 15.6376 1.04897 15.6376C1.33105 15.6376 1.57786 15.5318 1.78061 15.3379L8.63859 8.62096C8.88541 8.39177 9 8.12733 9 7.81881Z"
        fill="currentColor"
      />
    </Svg>
  );
}
