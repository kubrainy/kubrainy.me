interface ContributionDay {
  date: string
  count: number
  level: number
}

const USER = 'kubrainy'
const WEEKS = 17

/**
 * GitHub profilindeki katkı takviminin son 17 haftası (yaklaşık 4 ay).
 * Token gerektirmeyen, profil sayfasının kullandığı HTML'den okunur ve
 * 6 saat önbellekte tutulur. Biçim değişir de okunamazsa 502 döner,
 * bileşen de bu durumda kendini gizler.
 */
export default defineCachedEventHandler(async () => {
  const html = await $fetch<string>(`https://github.com/users/${USER}/contributions`, {
    responseType: 'text',
    headers: { 'user-agent': 'kubrainy.me' },
  })

  // Her günün katkı sayısı, o güne bağlı tooltip metnindedir: "3 contributions on ..."
  const counts = new Map<string, number>()
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\sfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g))
    counts.set(id!, Number(/^\d+/.exec(text!.trim())?.[0] ?? 0))

  const days: ContributionDay[] = []
  for (const [, attrs] of html.matchAll(/<td\b([^>]*)>/g)) {
    const date = /\sdata-date="([^"]+)"/.exec(attrs!)?.[1]
    if (!date)
      continue
    const id = /\sid="([^"]+)"/.exec(attrs!)?.[1] ?? ''
    const level = Number(/\sdata-level="(\d)"/.exec(attrs!)?.[1] ?? 0)
    days.push({ date, level, count: counts.get(id) ?? 0 })
  }

  if (!days.length)
    throw createError({ statusCode: 502, statusMessage: 'GitHub katkı verisi okunamadı' })

  days.sort((a, b) => a.date.localeCompare(b.date))

  // Son günün haftasının Pazar gününden 16 hafta geriye git.
  const last = new Date(`${days.at(-1)!.date}T00:00:00Z`)
  const start = new Date(last)
  start.setUTCDate(start.getUTCDate() - last.getUTCDay() - (WEEKS - 1) * 7)
  const recent = days.filter(day => day.date >= start.toISOString().slice(0, 10))

  const weeks: ContributionDay[][] = []
  for (let i = 0; i < recent.length; i += 7)
    weeks.push(recent.slice(i, i + 7))

  return {
    user: USER,
    total: recent.reduce((sum, day) => sum + day.count, 0),
    weeks,
  }
}, {
  name: 'github-contributions',
  maxAge: 60 * 60 * 6,
  swr: true,
})
