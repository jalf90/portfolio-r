'use client';

import useDebounce from '@/hooks/useDebounce';
import { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslations } from 'use-intl';
import styles from './Autocomplete.module.scss';
import useOutsideAlerter from '@/hooks/useClickOutsideListener';

interface Geo_Details {
  country: string;
  lat: number;
  lon: number;
  name: string;
  state: string;
}

interface AutocompleteProps {
  url: string;
  value?: string;
  selectedItem: (item: Geo_Details) => void;
}

export default function Autocomplete(props: AutocompleteProps) {
  const citySearchRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuElementRef = useRef<HTMLUListElement | null>(null);
  const [inputSearchText, setInputSearchText] = useState(props.value ?? '');
  const t = useTranslations('common');

  const searchText = useDebounce(inputSearchText, 500);

  useOutsideAlerter(containerRef, menuElementRef);

  const { data, isLoading } = useQuery({
    queryFn: () => fetch(`${props.url}${searchText}`).then((res) => res.json()),
    queryKey: ['search', searchText],
    enabled: searchText.length > 3,
  });

  const handleSelectedItem = (item: Geo_Details) => {
    props.selectedItem(item);

    // reset input
    setInputSearchText('');
    menuElementRef.current?.classList.add('hidden');
  };

  return (
    <div ref={containerRef} className="flex flex-column w-2">
      <label>{t('search')}</label>
      <input
        ref={citySearchRef}
        type="text"
        placeholder="e.g. city"
        value={inputSearchText}
        onChange={(event) => setInputSearchText(event.target.value)}
      />
      {data && !isLoading && (
        <ul className={styles.menu} ref={menuElementRef}>
          {data.map((item: Geo_Details, index: number) => (
            <li key={index} onClick={() => handleSelectedItem(item)}>
              {item.name}, {item.state}, {item.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
