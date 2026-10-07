export interface Localized {
  tr: string
  en: string
}

/** İki dilli bir alanın (`{ tr, en }`) aktif dildeki değerini verir. */
export function useLocalized() {
  const { locale } = useI18n()
  return (value?: Localized) => value ? (value[locale.value] ?? value.tr) : ''
}
