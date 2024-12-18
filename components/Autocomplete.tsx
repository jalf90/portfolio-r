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
  const [activeIndex, setActiveIndex] = useState(-1);
  const t = useTranslations('common');

  const searchText = useDebounce(inputSearchText, 500);

  useOutsideAlerter(containerRef, menuElementRef);

  const { data } = useQuery({
    queryFn: () => fetch(`${props.url}${searchText}`).then((res) => res.json()),
    queryKey: ['search', searchText],
    enabled: searchText.length > 3,
  });

  const handleSelectedItem = (item: T) => {
    props.selectedItem(item);

    // reset input
    setInputSearchText('');
    hideDropdown();
  };

  const hideDropdown = () => {
    menuElementRef.current?.classList.add('hidden');
  };

  // Dynamically get the property to display
  const getDisplayValue = (item: Record<string, string>) => {
    return props.displayKeys.reduce(
      (acc, value) => (acc.length ? (item[value] !== undefined ? `${acc}, ${item[value]}` : acc) : item[value]),
      ''
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex((prevIndex) => Math.min(prevIndex + 1, data.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < data.length) {
        handleSelectedItem(data[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      hideDropdown();
    }
  };

  const renderMenuItems = (data: T[]) => {
    if (data) {
      return data.map((item, index) => (
        <li key={index} className={index === activeIndex ? styles.active : ''} onClick={() => handleSelectedItem(item)}>
          {getDisplayValue(item as Record<string, string>)}
        </li>
      ));
    }
    return <li className={styles.noAction}>No data found!</li>;
  };

  return (
    <div ref={containerRef} className="flex flex-column w-2 relative">
      <small>{t('search')}</small>
      <input
        ref={citySearchRef}
        type="text"
        placeholder="e.g. city"
        value={inputSearchText}
        onKeyDown={handleKeyDown}
        onChange={(event) => setInputSearchText(event.target.value)}
      />
      {data && (
        <ul className={styles.menu} ref={menuElementRef}>
          {renderMenuItems(data)}
        </ul>
      )}
    </div>
  );
}
