'use client';

import config from '@/app/config';
import Autocomplete from '@/components/Autocomplete';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { FaCloud, FaCloudSun, FaCloudShowersHeavy } from 'react-icons/fa';
import { BsCloudSnowFill } from 'react-icons/bs';
import styles from './page.module.scss';
import { Daily } from './model';
import { formatDay } from '@/utils/format';
import { useTranslations } from 'next-intl';

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
  const [citySelected, setCitySelected] = useState<string>('');

  useEffect(() => {
    const cityDetails: CityDetails | null = sessionStorage.getItem('cityInfo')
      ? JSON.parse(sessionStorage.getItem('cityInfo')!)
      : null;

    console.log(cityDetails);
    setCityState(cityDetails);

    return () => sessionStorage.removeItem('cityInfo');
  }, []);

  const setCityState = (item: CityDetails | null) => {
    if (!item) return;
    setCoordinates({ lat: item.lat, lon: item.lon });
    const cityStateAndCountry = item.state
      ? `${item.name}, ${item.state}, ${item.country}`
      : `${item.name}, ${item.country}`;
    setCitySelected(cityStateAndCountry);
  };

  const handleSelectedItem = (item: CityDetails) => {
    setCityState(item);
    sessionStorage.setItem('cityInfo', JSON.stringify(item));
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

  return (
    <div className="p-2">
      <Autocomplete<CityDetails>
        url={`${config.weather_api.BASE_URL}/${config.weather_api.GEO}?limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=`}
        displayKeys={['name', 'state', 'country']}
        selectedItem={handleSelectedItem}
      />
      <h3 className="mt-2">{citySelected}</h3>
      <div className={styles.content}>
        {data?.daily.map((item: Daily) => (
          <WeatherCard key={item.dt} item={item} />
        ))}
      </div>
    </div>
  );
}

function WeatherCard({ item }: { item: Daily }) {
  const t = useTranslations('common');

  const getWeatherIcon = (icon: IconKey) => {
    return ICON_TYPES[icon];
  };

  return (
    <div className="flex p-2">
      <div className="flex flex-column">
        <h5>{formatDay(item.dt, t('calendarFormat'))}</h5>
        {getWeatherIcon(item.weather[0].icon as IconKey)}
        <small>{item.weather[0].description}</small>
      </div>
      <div className="flex flex-column">
        <p>
          Max: <span className="danger">{item.temp.max.toFixed(0)}&#176;</span>
        </p>
        <p>
          Min: <span className="info">{item.temp.min.toFixed(0)}&#176;</span>
        </p>
      </div>
    </div>
  );
}
