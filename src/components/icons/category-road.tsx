import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './icon-props';
export function CategoryRoadIcon({ size = 30, color = 'white', ...props }: IconProps) {
  const width = (size * 30) / 30;
  const height = (size * 30) / 30;
  return (
    <Svg viewBox="0 0 30 30" fill="none" width={width} height={height} color={color} {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15ZM4.96778 21.5869L9.77337 13.0028H19.8867L24.7491 21.9983C26.1657 20.0284 27 17.6116 27 15C27 8.37258 21.6274 3 15 3C8.37258 3 3 8.37258 3 15C3 17.4325 3.7238 19.696 4.96778 21.5869Z"
        fill="currentColor"
      />
      <Path d="M14.6177 13.0029H15.4675L15.595 14.1927H14.4902L14.6177 13.0029Z" fill="black" />
      <Path d="M14.4477 15.6372H15.6375L15.765 16.912H14.2778L14.4477 15.6372Z" fill="black" />
      <Path d="M14.1078 19.1219H15.9775L16.19 21.4166H13.7679L14.1078 19.1219Z" fill="black" />
      <Path d="M13.7675 24.3909H16.3171L16.572 27.1954H13.47L13.7675 24.3909Z" fill="black" />
    </Svg>
  );
}
