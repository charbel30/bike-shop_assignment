import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Stop } from 'react-native-svg';
import { useCSSVariable } from 'uniwind';

import type { WeatherKind } from '../ride-conditions';

/** Line-art weather glyphs: white cloud outlines with accent-gradient sun, rain and bolts. */

const CLOUD = 'M9.5 22h13.25a4.75 4.75 0 0 0 .55-9.47A6.75 6.75 0 0 0 10.2 13.9 4.1 4.1 0 0 0 9.5 22z';
const ACCENT = 'url(#weather-accent)';

export function WeatherIcon({ kind, size = 28 }: { kind: WeatherKind; size?: number }) {
  const [from, to, fg] = useCSSVariable(['--color-accent-from', '--color-accent-to', '--color-fg']);
  const stroke = String(fg);
  const cloud = (dy = 0) => (
    <Path
      d={CLOUD}
      transform={`translate(0 ${dy})`}
      stroke={stroke}
      strokeWidth={1.8}
      strokeLinejoin="round"
      fill={stroke}
      fillOpacity={0.08}
    />
  );

  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        {/* User-space units: straight strokes have a zero-width bounding box. */}
        <LinearGradient id="weather-accent" x1={4} y1={4} x2={28} y2={28} gradientUnits="userSpaceOnUse">
          <Stop stopColor={String(from)} />
          <Stop offset={1} stopColor={String(to)} />
        </LinearGradient>
      </Defs>

      {kind === 'clear-day' ? (
        <G stroke={ACCENT} strokeWidth={2} strokeLinecap="round">
          <Circle cx={16} cy={16} r={5.5} fill={ACCENT} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <Line key={angle} x1={16} y1={4} x2={16} y2={7} transform={`rotate(${angle} 16 16)`} />
          ))}
        </G>
      ) : null}

      {kind === 'clear-night' ? (
        <Path d="M20.5 5.5a10 10 0 1 0 6 14.6A8 8 0 0 1 20.5 5.5z" fill={ACCENT} />
      ) : null}

      {kind === 'partly-cloudy' ? (
        <>
          <G stroke={ACCENT} strokeWidth={1.8} strokeLinecap="round">
            <Circle cx={11} cy={11} r={4} fill={ACCENT} />
            <Line x1={11} y1={3.5} x2={11} y2={5} />
            <Line x1={3.5} y1={11} x2={5} y2={11} />
            <Line x1={5.7} y1={5.7} x2={6.8} y2={6.8} />
            <Line x1={16.3} y1={5.7} x2={15.2} y2={6.8} />
          </G>
          {cloud(3)}
        </>
      ) : null}

      {kind === 'cloudy' ? cloud(2) : null}

      {kind === 'fog' ? (
        <G stroke={stroke} strokeWidth={1.8} strokeLinecap="round">
          <Line x1={6} y1={11} x2={26} y2={11} />
          <Line x1={9} y1={16} x2={23} y2={16} strokeOpacity={0.7} />
          <Line x1={6} y1={21} x2={26} y2={21} strokeOpacity={0.45} />
        </G>
      ) : null}

      {kind === 'drizzle' || kind === 'rain' || kind === 'snow' || kind === 'storm' ? cloud(-3) : null}

      {kind === 'drizzle' ? (
        <G fill={ACCENT}>
          <Circle cx={12} cy={24} r={1.2} />
          <Circle cx={17} cy={26} r={1.2} />
          <Circle cx={22} cy={24} r={1.2} />
        </G>
      ) : null}

      {kind === 'rain' ? (
        <G stroke={ACCENT} strokeWidth={1.8} strokeLinecap="round">
          <Line x1={12} y1={22} x2={10.5} y2={27} />
          <Line x1={17} y1={22} x2={15.5} y2={27} />
          <Line x1={22} y1={22} x2={20.5} y2={27} />
        </G>
      ) : null}

      {kind === 'snow' ? (
        <G fill={ACCENT}>
          <Circle cx={11} cy={24} r={1.5} />
          <Circle cx={16.5} cy={27} r={1.5} />
          <Circle cx={22} cy={24} r={1.5} />
        </G>
      ) : null}

      {kind === 'storm' ? <Path d="M17.5 20 12.5 26h4l-1.5 5 5.5-7h-4l1.5-4z" fill={ACCENT} /> : null}
    </Svg>
  );
}
