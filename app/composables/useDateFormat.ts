/**
 * Tarihleri aktif dile göre biçimlendirir. Sunucu ve tarayıcının saat dilimi
 * farklı olabileceği için hepsi UTC'ye göre hesaplanır; aksi hâlde '2026-10-06'
 * bazı saat dilimlerinde bir önceki güne kayar.
 */
export function useDateFormat() {
  const { locale } = useI18n()
  const tag = computed(() => locale.value === 'en' ? 'en-US' : 'tr-TR')

  /** '2026-10-06' → '6 Ekim 2026' */
  function day(value: string) {
    return new Date(value).toLocaleDateString(tag.value, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
  }

  /** '2025-09' → 'Eyl 2025', '2026' → '2026' */
  function month(value: string) {
    const [year, month] = value.split('-').map(Number)
    if (!month)
      return String(year)
    return new Date(Date.UTC(year!, month - 1, 1)).toLocaleDateString(tag.value, { year: 'numeric', month: 'short', timeZone: 'UTC' })
  }

  return { day, month }
}
