import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './icon-props';
export function PersonIcon({ size = 16, color = 'white', ...props }: IconProps) {
  const width = (size * 15) / 16;
  const height = (size * 16) / 16;
  return (
    <Svg viewBox="0 0 15 16" fill="none" width={width} height={height} color={color} {...props}>
      <Path
        d="M7.48673 7.76991C9.41593 7.76991 11.0531 6.0531 11.0531 3.83186C11.0531 1.66372 9.40708 0 7.48673 0C5.55752 0 3.90265 1.69027 3.9115 3.84956C3.9115 6.0531 5.54867 7.76991 7.48673 7.76991ZM1.9646 16H12.9912C14.4513 16 14.9558 15.5575 14.9558 14.7434C14.9558 12.469 12.0708 9.33628 7.47788 9.33628C2.89381 9.33628 0 12.469 0 14.7434C0 15.5575 0.504425 16 1.9646 16Z"
        fill="currentColor"
      />
    </Svg>
  );
}
