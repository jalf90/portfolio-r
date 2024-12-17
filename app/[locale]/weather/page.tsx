'use client';

import config from '@/app/config';
import Autocomplete from '@/components/Autocomplete';

export default function WeatherPage() {
  const handleSelectedItem = (item: any) => {
    console.log(item);
  };
  return (
    <div className="p-2">
      <form>
        <Autocomplete
          url={`${config.weather_api.BASE_URL}/${config.weather_api.GEO}?limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=`}
          selectedItem={handleSelectedItem}
        />
      </form>
    </div>
  );
}
