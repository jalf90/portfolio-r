import { useLocale } from 'next-intl';
import LocalSwitcherSelect from './LocaleSwitcherSelect';
import { routing } from '@/i18n/routing';

export default function LocaleSwitcher() {
  const locale: string = useLocale();
  return (
    <div className="flex align-items-center gap-1">
      <LocalSwitcherSelect defaultValue={locale} label="Select a locale">
        {routing.locales.map((currentLang) => (
          <option key={currentLang} value={currentLang}>
            {currentLang}
          </option>
        ))}
      </LocalSwitcherSelect>
    </div>
  );
}
