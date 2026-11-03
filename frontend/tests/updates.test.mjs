import test from 'node:test'
import assert from 'node:assert/strict'
import { buildUpdates, dayOf, formatPrice } from '../utils/updates.mjs'

const releases = [
  { id: '2', title: '新しい曲', titleEn: 'New', releaseDate: '2026-10-01', trackCount: 5, artwork: '/a2.png', linkcoreUrl: 'https://linkco.re/2' },
  { id: '1', title: '古い曲', titleEn: 'Old', releaseDate: '2026-09-14', trackCount: 3, artwork: '/a1.png', linkcoreUrl: 'https://linkco.re/1' }
]
const goods = [{ id: '9', name: '3Dモデル', price: '¥ 3,500', publishedAt: '2026-11-02T20:14:09.000+09:00', image: '/b.jpg', url: 'https://tanfantazma.booth.pm/items/9' }]
const illustrations = [{ id: '7', title: 'namo', postedAt: '2026-08-16T22:40:06+09:00', image: '/i.jpg', pixivUrl: 'https://www.pixiv.net/artworks/7' }]
const novels = [
  { slug: 'maigo', title: '迷子の調査員', update: { date: '2026-10-31T23:26:31+09:00', number: 223, title: '第二百二十三話' } },
  { slug: 'guide', title: '使い方', update: undefined }
]

test('ジャンルごとの最新1件を、新しい順に並べる', () => {
  const updates = buildUpdates({ releases, goods, illustrations, novels })
  assert.deepEqual(updates.map(update => update.kind), ['shop', 'novel', 'music', 'art'])
  assert.equal(updates[0].note, '¥3,500')
  assert.equal(updates[1].href, '/novels/maigo/223')
  assert.equal(updates[1].external, false)
  assert.equal(updates[2].title, '新しい曲')
  assert.equal(updates[2].href, 'https://linkco.re/2?lang=ja')
})
test('英語表示では英語のタイトルを使う', () => {
  const music = buildUpdates({ releases }, 'en')[0]
  assert.equal(music.title, 'New')
  assert.equal(music.note, '5 tracks')
})
test('日付のないものは載せない', () => {
  const updates = buildUpdates({ goods: [{ ...goods[0], publishedAt: null }], novels: [{ slug: 'x', title: 'x' }] })
  assert.deepEqual(updates, [])
})
test('日付だけの配信日は、日本時間のその日の0時として比べる', () => {
  const updates = buildUpdates({
    releases: [{ ...releases[0], releaseDate: '2026-11-02' }],
    goods: [{ ...goods[0], publishedAt: '2026-11-01T23:59:00+09:00' }]
  })
  assert.deepEqual(updates.map(update => update.kind), ['music', 'shop'])
})
test('表示用の日付と価格', () => {
  assert.equal(dayOf('2026-11-02T20:14:09.000+09:00'), '2026.11.02')
  assert.equal(dayOf('2026-10-31T23:26:31+09:00'), '2026.10.31')
  assert.equal(dayOf('2026-10-01'), '2026.10.01')
  assert.equal(formatPrice('¥ 1,000~'), '¥1,000〜')
  assert.equal(formatPrice('¥ 0'), '無料')
  assert.equal(formatPrice('¥ 0', 'en'), 'Free')
})
