/**
 * Pure helpers for the "Ride conditions in Montreal" card: WMO weather codes, compass points and
 * a 0-100 ride score with a short verdict. No React, no I/O, so they're trivial to test.
 */

export type WeatherKind =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'storm';

export type WeatherDescription = { label: string; kind: WeatherKind };

/** WMO weather interpretation codes (https://open-meteo.com/en/docs#weather_variable_documentation). */
export function describeWeather(code: number, isDay = true): WeatherDescription {
  if (code === 0) return { label: 'Clear', kind: isDay ? 'clear-day' : 'clear-night' };
  if (code === 1) return { label: 'Mostly clear', kind: isDay ? 'clear-day' : 'clear-night' };
  if (code === 2) return { label: 'Partly cloudy', kind: 'partly-cloudy' };
  if (code === 3) return { label: 'Overcast', kind: 'cloudy' };
  if (code === 45 || code === 48) return { label: 'Fog', kind: 'fog' };
  if (code >= 51 && code <= 57) return { label: 'Drizzle', kind: 'drizzle' };
  if (code === 61 || code === 80) return { label: 'Light rain', kind: 'rain' };
  if (code === 63 || code === 81) return { label: 'Rain', kind: 'rain' };
  if (code === 65 || code === 82) return { label: 'Heavy rain', kind: 'rain' };
  if (code === 66 || code === 67) return { label: 'Freezing rain', kind: 'rain' };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { label: 'Snow', kind: 'snow' };
  if (code >= 95) return { label: 'Thunderstorm', kind: 'storm' };
  return { label: 'Cloudy', kind: 'cloudy' };
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

/** 35° → "NE". */
export function toCompassPoint(degrees: number) {
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % COMPASS.length;
  return COMPASS[index];
}

export type RideInputs = {
  /** °C */
  temperature: number;
  /** km/h */
  windSpeed: number;
  /** 0-100 */
  precipitationProbability: number;
  weatherCode: number;
};

export type RideVerdict = {
  /** 0-100, higher is better. */
  score: number;
  /** "Great ride day", "Good to ride", "Rideable", "Skip the ride". */
  headline: string;
  /** Short tip for the biggest factor, e.g. "pack a shell". */
  advice: string;
};

/** Comfortable cycling range in °C; every degree outside it costs points. */
const IDEAL_TEMP = { min: 15, max: 25 } as const;
/** Wind below this (km/h) doesn't bother a city rider. */
const CALM_WIND = 15;

/** Codes that make riding unsafe: freezing drizzle/rain, snow, thunderstorms. */
function isHazardous(code: number) {
  return code === 56 || code === 57 || code === 66 || code === 67 || (code >= 71 && code <= 77) || code >= 85;
}

export function getRideVerdict({
  temperature,
  windSpeed,
  precipitationProbability,
  weatherCode,
}: RideInputs): RideVerdict {
  const penalties = {
    cold: Math.max(0, IDEAL_TEMP.min - temperature) * 3,
    heat: Math.max(0, temperature - IDEAL_TEMP.max) * 3,
    wind: Math.max(0, windSpeed - CALM_WIND) * 1.5,
    rain: precipitationProbability * 0.5,
    hazard: isHazardous(weatherCode) ? 40 : 0,
  };
  const total = Object.values(penalties).reduce((sum, value) => sum + value, 0);
  const score = Math.round(Math.min(100, Math.max(0, 100 - total)));

  const [worst, worstPenalty] = (Object.entries(penalties) as [keyof typeof penalties, number][]).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
  );
  const advice =
    worstPenalty < 10
      ? 'enjoy it'
      : { cold: 'layer up', heat: 'bring water', wind: 'mind the wind', rain: 'pack a shell', hazard: 'stay safe' }[
          worst
        ];

  const headline =
    score >= 80 ? 'Great ride day' : score >= 60 ? 'Good to ride' : score >= 40 ? 'Rideable' : 'Skip the ride';

  return { score, headline, advice };
}
