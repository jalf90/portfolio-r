export interface Daily {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: Temperature;
  feels_like: number | FeelsLike[];
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: Weather[];
  clouds: number;
  pop: number;
  snow: number;
  uvi: number;
}

interface Temperature {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

interface FeelsLike {
  day: number;
  eve: number;
  morn: number;
  night: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}
