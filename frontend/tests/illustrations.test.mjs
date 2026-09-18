import test from 'node:test'
import assert from 'node:assert/strict'
import { parseWorks } from '../scripts/sync-illustrations.mjs'

const item = (id, postedAt, extra = {}) => ({
  id, title: `work ${id}`, userId: '3007111', xRestrict: 0,
  url: `https://i.pximg.net/img/${id}.jpg`, createDate: postedAt,
  width: 1000, height: 1200, pageCount: 1, tags: ['original'], ...extra
})

test('sorts public Pixiv works newest first', () => {
  const all = { error: false, body: { illusts: { '100': null, '300': null, '200': null } } }
  const detail = { error: false, body: { works: {
    '100': item('100', '2024-01-01T00:00:00+09:00'),
    '200': item('200', '2025-01-01T00:00:00+09:00'),
    '300': item('300', '2026-01-01T00:00:00+09:00')
  } } }
  assert.deepEqual(parseWorks(all, detail).map(work => work.id), ['300', '200', '100'])
})

test('rejects restricted, foreign or malformed work data', () => {
  const all = { error: false, body: { illusts: { '300': null } } }
  assert.throws(() => parseWorks(all, { error: false, body: { works: { '300': item('300', '2026-01-01T00:00:00+09:00', { xRestrict: 1 }) } } }))
  assert.throws(() => parseWorks(all, { error: false, body: { works: { '300': item('300', '2026-01-01T00:00:00+09:00', { userId: 'other' }) } } }))
  assert.throws(() => parseWorks({ error: false, body: { illusts: {} } }, { error: false, body: { works: {} } }))
})
