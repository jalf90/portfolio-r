'use client';

import { Locale, usePathname, useRouter } from '@/i18n/routing';
import { ChangeEvent, ReactNode } from 'react';

interface Props {
  defaultValue: string;
  label: string;
  children: ReactNode;
}

export default function LocalSwitcherSelect({ defaultValue, label, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function handleSelectChange(selectedOption: ChangeEvent<HTMLSelectElement>) {
    router.replace({ pathname }, { locale: selectedOption.target.value as Locale });
  }

  return (
    <>
      {label}
      <select defaultValue={defaultValue} onChange={handleSelectChange}>
        {children}
      </select>
    </>
  );
}
