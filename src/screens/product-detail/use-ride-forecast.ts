import { useCallback, useEffect, useState } from 'react';

/** Current conditions and the next hours in Montreal from Open-Meteo (free, no API key). */

const FORECAST_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=45.5017&longitude=-73.5673' +
  '&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,precipitation_probability,weather_code,is_day' +
  '&hourly=temperature_2m,precipitation_probability,weather_code' +
  '&forecast_hours=6&timezone=America%2FToronto';

/** The subset of the Open-Meteo response we request (units: °C, km/h, %, WMO code). */
type OpenMeteoResponse = {
  current: {
    /** Local ISO time without offset, e.g. "2026-10-13T09:00". */
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    precipitation_probability: number;
    weather_code: number;
    /** 1 by day, 0 at night. */
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
};

export type ForecastHour = {
  /** "09:00", local to Montreal. */
  time: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
};

export type RideForecast = {
  time: string;
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  windDirection: number;
  precipitationProbability: number;
  weatherCode: number;
  isDay: boolean;
  hours: ForecastHour[];
};

export type RideForecastState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; forecast: RideForecast };

/** "2026-10-13T09:00" → "09:00". The API already returns Montreal local time. */
const toClock = (isoLocal: string) => isoLocal.slice(11, 16);

function toForecast({ current, hourly }: OpenMeteoResponse): RideForecast {
  return {
    time: toClock(current.time),
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    precipitationProbability: current.precipitation_probability,
    weatherCode: current.weather_code,
    isDay: current.is_day === 1,
    hours: hourly.time.map((time, index) => ({
      time: toClock(time),
      temperature: hourly.temperature_2m[index],
      precipitationProbability: hourly.precipitation_probability[index],
      weatherCode: hourly.weather_code[index],
    })),
  };
}

/** Fetches on mount; `refetch` retries. In-flight requests are aborted on unmount / refetch. */
export function useRideForecast() {
  const [state, setState] = useState<RideForecastState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch(FORECAST_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Open-Meteo responded ${response.status}`);
        return response.json() as Promise<OpenMeteoResponse>;
      })
      .then((data) => setState({ status: 'success', forecast: toForecast(data) }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', error: error instanceof Error ? error : new Error(String(error)) });
      });

    return () => controller.abort();
  }, [attempt]);

  const refetch = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((value) => value + 1);
  }, []);

  return { state, refetch };
}
