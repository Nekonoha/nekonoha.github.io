import test from 'node:test'
import assert from 'node:assert/strict'
import { parseReleases } from '../scripts/sync-releases.mjs'

const item = (id, date, overrides = {}) => ({
  id, releaseDate: date, nameJa: `作品 ${id}`, nameEn: `Release ${id}`,
  linkcore: { url: `https://linkco.re/album${id}` },
  image: { large: { url: 'https://tcj-image-production.s3-ap-northeast-1.amazonaws.com/cover.png?expires=1' } },
  songNum: 5, type: 'album', ...overrides
})
const html = (releases, artistPagePath = 'nekonoha') => `<html><script id="__NEXT_DATA__" type="application/json">${JSON.stringify({ props: { pageProps: { artist: { artistPagePath, releases } } } })}</script></html>`

test('sorts newest first, deduplicates and excludes future releases in JST', () => {
  const releases = parseReleases(html([item(1, '2026-08-06'), item(4, '2026-09-17'), item(2, '2026-09-14'), item(2, '2026-09-14'), item(3, '2026-09-14')]), '2026-09-16')
  assert.deepEqual(releases.map(r => r.id), ['3', '2', '1'])
  assert.equal(releases[0].title, '作品 3')
})
test('keeps the original title if an English title is missing', () => {
  assert.equal(parseReleases(html([item(1, '2026-08-06', { nameEn: '' })]))[0].titleEn, '作品 1')
})
test('fails closed on a changed page, wrong artist or empty feed', () => {
  for (const page of ['<html>Maintenance</html>', html([]), html([item(1, '2026-08-06')], 'someone-else')]) assert.throws(() => parseReleases(page))
})
test('rejects partial records, invalid dates and unsafe URLs', () => {
  for (const change of [{ nameJa: '' }, { releaseDate: '2026-02-30' }, { linkcore: { url: 'javascript:alert(1)' } }, { image: { large: { url: 'https://example.com/cover.png' } } }]) {
    assert.throws(() => parseReleases(html([item(1, '2026-08-06', change)])))
  }
})
