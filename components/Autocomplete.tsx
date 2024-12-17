'use client';

import useDebounce from '@/hooks/useDebounce';
import { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslations } from 'use-intl';
import styles from './Autocomplete.module.scss';
import useOutsideAlerter from '@/hooks/useClickOutsideListener';

interface AutocompleteProps<T> {
  url: string;
  value?: string;
  displayKeys: string[];
  selectedItem: (item: T) => void;
}

export default function Autocomplete<T>(props: AutocompleteProps<T>) {
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

  const handleSelectedItem = (item: T) => {
    props.selectedItem(item);

    // reset input
    setInputSearchText('');
    menuElementRef.current?.classList.add('hidden');
  };

  // Dynamically get the property to display
  const getDisplayValue = (item: Record<string, any>) => {
    return props.displayKeys.reduce(
      (acc, value) => (acc.length ? (item[value] !== undefined ? `${acc}, ${item[value]}` : acc) : item[value]),
      ''
    );
  };

  return (
    <div ref={containerRef} className="flex flex-column w-2 relative">
      <small>{t('search')}</small>
      <input
        ref={citySearchRef}
        type="text"
        placeholder="e.g. city"
        value={inputSearchText}
        onChange={(event) => setInputSearchText(event.target.value)}
      />
      {data && (
        <ul className={styles.menu} ref={menuElementRef}>
          {data.length ? (
            data.map((item: T, index: number) => (
              <li key={index} onClick={() => handleSelectedItem(item)}>
                {getDisplayValue(item as Record<string, any>)}
              </li>
            ))
          ) : (
            <li className={styles.noAction}>No data found!</li>
          )}
        </ul>
      )}
    </div>
  );
}
