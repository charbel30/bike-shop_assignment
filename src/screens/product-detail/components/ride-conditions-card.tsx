import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { PressableScale } from '@/components/pressable-scale';
import { SkeuoSurface } from '@/components/skeuo-surface';
import { timings } from '@/theme/motion';

import { describeWeather, getRideVerdict, toCompassPoint } from '../ride-conditions';
import type { RideForecast, RideForecastState } from '../use-ride-forecast';
import { RideConditionsSkeleton } from './ride-conditions-skeleton';
import { WeatherIcon } from './weather-icon';

/**
 * [FREE DATA] slot of the Specification tab (1:576, 335x218): live riding conditions in Montreal
 * from Open-Meteo, with a ride score, three stat tiles and the next hours.
 */

export type RideConditionsCardProps = {
  state: RideForecastState;
  onRetry: () => void;
};

export function RideConditionsCard({ state, onRetry }: RideConditionsCardProps) {
  return (
    <View className="min-h-[218px]">
      {state.status === 'loading' ? <RideConditionsSkeleton /> : null}
      {state.status === 'error' ? <ErrorState onRetry={onRetry} /> : null}
      {state.status === 'success' ? (
        <Animated.View entering={FadeIn.duration(timings.skeuo.duration)}>
          <Conditions forecast={state.forecast} />
        </Animated.View>
      ) : null}
    </View>
  );
}

const degrees = (value: number) => `${Math.round(value)}°`;

function Conditions({ forecast }: { forecast: RideForecast }) {
  const weather = describeWeather(forecast.weatherCode, forecast.isDay);
  const verdict = getRideVerdict(forecast);

  return (
    <View className="gap-2.5">
      <View className="flex-row items-center justify-between">
        <AppText variant="micro" tone="muted" tracking="wide">
          RIDE CONDITIONS IN MONTREAL
        </AppText>
        <AppText variant="micro" weight="regular" tone="muted">
          {forecast.time} · Open-Meteo
        </AppText>
      </View>

      <View className="flex-row items-center gap-3">
        <SkeuoSurface variant="raised" className="size-12 items-center justify-center">
          <WeatherIcon kind={weather.kind} />
        </SkeuoSurface>
        <View className="flex-1">
          <AppText variant="heading" numberOfLines={1}>
            {weather.label}, {degrees(forecast.temperature)}C
          </AppText>
          <AppText variant="caption" weight="medium" tone="accent-light" numberOfLines={1}>
            {verdict.headline} · {verdict.advice}
          </AppText>
        </View>
        <View
          accessibilityLabel={`Ride score ${verdict.score} out of 100`}
          className="size-12 items-center justify-center rounded-control border border-t-white/30 border-l-white/30 border-r-black/30 border-b-black/30 bg-linear-to-br from-accent-from to-accent-to"
        >
          <AppText variant="heading" className="-mb-1">
            {verdict.score}
          </AppText>
          <AppText variant="micro" weight="medium" tone="soft" tracking="normal">
            score
          </AppText>
        </View>
      </View>

      <View className="mt-0.5 flex-row gap-3">
        <StatTile
          label="Wind"
          value={`${Math.round(forecast.windSpeed)}`}
          unit={`km/h ${toCompassPoint(forecast.windDirection)}`}
        />
        <StatTile label="Rain chance" value={`${Math.round(forecast.precipitationProbability)}`} unit="%" />
        <StatTile label="Feels like" value={degrees(forecast.feelsLike)} unit="C" />
      </View>

      <SkeuoSurface variant="stepper" className="mt-0.5 flex-row py-1.5">
        {forecast.hours.map((hour, index) => (
          <View key={hour.time} className="flex-1 items-center">
            <AppText variant="micro" weight="regular" tone="muted">
              {index === 0 ? 'Now' : hour.time}
            </AppText>
            <AppText variant="caption" weight="semibold">
              {degrees(hour.temperature)}
            </AppText>
            <AppText variant="micro" weight="medium" tone="accent">
              {Math.round(hour.precipitationProbability)}%
            </AppText>
          </View>
        ))}
      </SkeuoSurface>
    </View>
  );
}

function StatTile({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <SkeuoSurface variant="raised" className="h-14 flex-1 justify-center px-3">
      <AppText variant="micro" weight="regular" tone="muted" numberOfLines={1}>
        {label}
      </AppText>
      <AppText variant="body" weight="bold" numberOfLines={1}>
        {value}
        <AppText variant="micro" weight="medium" tone="muted">
          {' '}
          {unit}
        </AppText>
      </AppText>
    </SkeuoSurface>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="min-h-[218px] items-center justify-center gap-1 px-6">
      <WeatherIcon kind="cloudy" size={36} />
      <AppText variant="heading" className="mt-2 text-center">
        Couldn&apos;t reach the weather
      </AppText>
      <AppText variant="caption" tone="muted" className="text-center">
        Montreal&apos;s ride conditions are taking a break. Check your connection and try again.
      </AppText>
      <PressableScale accessibilityLabel="Retry loading ride conditions" onPress={onRetry} className="mt-3">
        <SkeuoSurface variant="raised" className="h-10 justify-center px-6">
          <AppText weight="bold" tone="accent" tracking="wide">
            Retry
          </AppText>
        </SkeuoSurface>
      </PressableScale>
    </View>
  );
}
