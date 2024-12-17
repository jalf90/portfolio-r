'use client';

import config from '@/app/config';
import Autocomplete from '@/components/Autocomplete';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { FaCloud, FaCloudSun, FaCloudShowersHeavy } from 'react-icons/fa';
import { BsCloudSnowFill } from 'react-icons/bs';
import styles from './page.module.scss';
import { Daily } from './model';

interface Coordinate {
  lat: number;
  lon: number;
}

type IconKey = '02d' | '03d' | '04d' | '10d' | '13d';

const ICON_TYPES: Record<IconKey, React.ReactNode> = {
  '02d': <FaCloudSun size={30} />,
  '03d': <FaCloudSun size={30} />,
  '04d': <FaCloud size={30} />,
  '10d': <FaCloudShowersHeavy size={30} />,
  '13d': <BsCloudSnowFill size={30} />,
};

interface Forecast {
  current: Daily;
  daily: Daily[];
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
}

interface CityDetails {
  name: string;
  local_names: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export default function WeatherPage() {
  const [coordinates, setCoordinates] = useState<Coordinate | null>(null);
  const [countrySelected, setCountrySelected] = useState<string>('');

  const handleSelectedItem = (item: CityDetails) => {
    setCoordinates({ lat: item.lat, lon: item.lon });
    setCountrySelected(`${item.name}, ${item.state}`);
  };

  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetch(
        `${config.weather_api.BASE_URL}/${config.weather_api.ONE_CALL}?lat=${coordinates?.lat}&lon=${coordinates?.lon}&exclude=minutely,hourly,alerts&&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      ).then((res) => res.json()),
    queryKey: ['weather'],
    enabled: !!coordinates,
  });

  if (isLoading) return <span>Is Loading...</span>;

  const getWeatherIcon = (icon: IconKey) => {
    return ICON_TYPES[icon];
  };

  return (
    <div className="p-2">
      <Autocomplete
        url={`${config.weather_api.BASE_URL}/${config.weather_api.GEO}?limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=`}
        selectedItem={handleSelectedItem}
      />
      <h3 className="mt-2">{countrySelected}</h3>
      <div className={styles.content}>
        {data?.daily.map((item: Daily) => (
          <div key={item.dt} className="flex flex-column p-2">
            {getWeatherIcon(item.weather[0].icon as IconKey)}
            <label>{item.weather[0].description}</label>
            <p>
              Max: <span className="danger">{item.temp.max}&#176;</span>
            </p>
            <p>
              Min: <span className="info">{item.temp.min}&#176;</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
