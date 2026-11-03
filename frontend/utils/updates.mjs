// トップの「最新の更新」と「新着」に出す項目を集める。
// 音楽・ショップ・イラスト・小説から、それぞれいちばん新しい1件を取り、新しい順に並べる。
// 日付は日本時間で比べる（'YYYY-MM-DD' だけの日付は、その日の 0 時として扱う）。

const toTime = value => {
  if (typeof value !== 'string' || !value) return Number.NaN
  return Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00+09:00` : value)
}

// 表示用の日付「2026.11.02」（日本時間）。
export const dayOf = value => {
  const time = toTime(value)
  if (!Number.isFinite(time)) return ''
  return new Date(time + 9 * 3600 * 1000).toISOString().slice(0, 10).replaceAll('-', '.')
}

// BOOTH の表記「¥ 1,000~」を「¥1,000〜」に。0円は「無料」。
export const formatPrice = (value, locale = 'ja') => {
  const compact = String(value ?? '').replace(/^¥\s*/, '¥').replace(/~$/, '〜')
  return compact === '¥0' ? (locale === 'ja' ? '無料' : 'Free') : compact
}

const newest = (list, dateOf) => list
  .filter(entry => Number.isFinite(toTime(dateOf(entry))))
  .reduce((best, entry) => !best || toTime(dateOf(entry)) > toTime(dateOf(best)) ? entry : best, null)

// 同じ日時のときの並び。
const order = ['shop', 'music', 'art', 'novel']

// novels: [{ slug, title, update: { date, number, title } | undefined }]
export function buildUpdates({ releases = [], goods = [], illustrations = [], novels = [] } = {}, locale = 'ja') {
  const ja = locale === 'ja'
  const updates = []
  const release = newest(releases, entry => entry.releaseDate)
  if (release) updates.push({
    kind: 'music', id: String(release.id), date: release.releaseDate,
    title: ja ? release.title : (release.titleEn || release.title),
    note: ja ? `${release.trackCount}曲` : `${release.trackCount} tracks`,
    image: release.artwork, href: `${release.linkcoreUrl}?lang=${locale}`, external: true
  })
  const item = newest(goods, entry => entry.publishedAt)
  if (item) updates.push({
    kind: 'shop', id: String(item.id), date: item.publishedAt,
    title: item.name, note: formatPrice(item.price, locale),
    image: item.image, href: item.url, external: true
  })
  const work = newest(illustrations, entry => entry.postedAt)
  if (work) updates.push({
    kind: 'art', id: String(work.id), date: work.postedAt,
    title: work.title, note: '',
    image: work.image, href: work.pixivUrl, external: true
  })
  const novel = newest(novels.filter(entry => entry.update), entry => entry.update.date)
  if (novel) updates.push({
    kind: 'novel', id: novel.slug, date: novel.update.date,
    title: novel.title, note: novel.update.title,
    image: null, href: `/novels/${novel.slug}/${novel.update.number}`, external: false
  })
  return updates.sort((a, b) => toTime(b.date) - toTime(a.date) || order.indexOf(a.kind) - order.indexOf(b.kind))
}
