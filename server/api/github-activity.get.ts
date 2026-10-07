interface ContributionDay {
  date: string
  count: number
  level: number
}

interface Language {
  /** GitHub'daki dil adı; geri kalanların toplamı için "other". */
  name: string
  /** 0 ile 1 arasında pay. */
  share: number
}

const USER = 'kubrainy'
const WEEKS = 17

// Flutter projelerinin platform klasörlerinde kendiliğinden oluşan iskelet kod
// (Windows, Linux, iOS) ile derleme dosyaları dil dağılımını bozmasın.
const IGNORED_LANGUAGES = new Set(['C', 'C++', 'CMake', 'Swift', 'Objective-C', 'Ruby', 'Makefile', 'Batchfile', 'Shell', 'PowerShell', 'Dockerfile'])

function githubApi<T>(path: string) {
  const { githubToken } = useRuntimeConfig()
  return $fetch<T>(`https://api.github.com${path}`, {
    headers: {
      'accept': 'application/vnd.github+json',
      'user-agent': 'kubrainy.me',
      ...(githubToken ? { authorization: `Bearer ${githubToken}` } : {}),
    },
  })
}

/**
 * Profildeki katkı takviminin son 17 haftası (yaklaşık 4 ay). Token
 * gerektirmeyen, profil sayfasının kullandığı HTML'den okunur.
 */
async function contributions() {
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
    total: recent.reduce((sum, day) => sum + day.count, 0),
    weeks,
  }
}

/** Herkese açık, fork olmayan depolardaki kodun dillere göre payı: ilk 4 dil ve geri kalanı. */
async function languages(): Promise<Language[]> {
  const repos = await githubApi<{ name: string, fork: boolean }[]>(`/users/${USER}/repos?per_page=100&type=owner`)
  const perRepo = await Promise.all(repos
    .filter(repo => !repo.fork)
    .map(repo => githubApi<Record<string, number>>(`/repos/${USER}/${repo.name}/languages`)))

  const bytes = new Map<string, number>()
  for (const [name, size] of perRepo.flatMap(Object.entries)) {
    if (!IGNORED_LANGUAGES.has(name))
      bytes.set(name, (bytes.get(name) ?? 0) + size)
  }

  const total = [...bytes.values()].reduce((sum, size) => sum + size, 0)
  if (!total)
    return []
  const sorted = [...bytes].sort((a, b) => b[1] - a[1])
  const rest = sorted.slice(4).reduce((sum, [, size]) => sum + size, 0)
  return [
    ...sorted.slice(0, 4).map(([name, size]) => ({ name, share: size / total })),
    ...(rest ? [{ name: 'other', share: rest / total }] : []),
  ]
}

/** Bu ay (Türkiye saatiyle) herkese açık depolara atılan commit sayısı. */
async function monthCommits() {
  const month = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' }).slice(0, 7)
  const query = encodeURIComponent(`author:${USER} author-date:>=${month}-01`)
  const { total_count } = await githubApi<{ total_count: number }>(`/search/commits?q=${query}&per_page=1`)
  return total_count
}

/**
 * GitHub kısmının verisi, 6 saat önbellekte tutulur. Katkı takvimi
 * okunamazsa 502 döner ve bileşen kendini gizler; dil ya da commit verisi
 * alınamazsa o parça boş gelir, takvim yine görünür.
 */
export default defineCachedEventHandler(async () => {
  const [calendar, langs, commits] = await Promise.allSettled([contributions(), languages(), monthCommits()])
  if (calendar.status === 'rejected')
    throw calendar.reason

  return {
    user: USER,
    ...calendar.value,
    languages: langs.status === 'fulfilled' ? langs.value : [],
    monthCommits: commits.status === 'fulfilled' ? commits.value : null,
  }
}, {
  name: 'github-activity',
  maxAge: 60 * 60 * 6,
  swr: true,
})
