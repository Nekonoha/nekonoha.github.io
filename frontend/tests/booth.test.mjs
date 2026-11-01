import test from 'node:test'
import assert from 'node:assert/strict'
import { parseShopItems, largerImage } from '../scripts/sync-booth.mjs'

// BOOTH のショップページと同じ形（商品データを HTML エスケープして data-item 属性に入れる）。
const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const item = (id, extra = {}) => ({
  category: { name: { en: 'Music', ja: '音楽一般' }, url: 'https://booth.pm/ja/browse/x' },
  event: null, id, is_adult: false, is_end_of_sale: false, is_placeholder: false, is_sold_out: false,
  name: `作品 ${id} "<特典>" & 説明`, price: '¥ 1,000~',
  shop: { name: 'みかん箱', url: 'https://tanfantazma.booth.pm/', verified: false },
  thumbnail_image_urls: [`https://booth.pximg.net/c/300x300_a2_g5/uuid/i/${id}/img_base_resized.jpg`],
  url: `https://booth.pm/ja/items/${id}`, shop_item_url: `https://tanfantazma.booth.pm/items/${id}`, ...extra
})
const page = (items, title = 'みかん箱 - BOOTH') => `<html><head><meta property="og:title" content="${title}"><link rel="canonical" href="https://tanfantazma.booth.pm/items"></head><body><ul>${
  items.map(value => `<li class="js-mount-point-shop-item-card contents" data-ga-from="shops_items_index" data-item="${escape(JSON.stringify(value))}"></li>`).join('')
}</ul></body></html>`

test('BOOTH の商品を一覧の順に取り出す', () => {
  const items = parseShopItems(page([item(300), item(200, { is_sold_out: true }), item(100, { price: '¥ 0' })]))
  assert.deepEqual(items.map(entry => entry.id), ['300', '200', '100'])
  assert.equal(items[0].name, '作品 300 "<特典>" & 説明')
  assert.equal(items[0].url, 'https://tanfantazma.booth.pm/items/300')
  assert.equal(items[0].category, '音楽一般')
  assert.equal(items[1].soldOut, true)
  assert.equal(items[2].price, '¥ 0')
})
test('成人向けと準備中の商品は載せない', () => {
  const items = parseShopItems(page([item(3, { is_adult: true }), item(2, { is_placeholder: true }), item(1)]))
  assert.deepEqual(items.map(entry => entry.id), ['1'])
})
test('件数の上限を守る', () => {
  assert.equal(parseShopItems(page([1, 2, 3, 4, 5, 6, 7, 8].map(id => item(id)))).length, 6)
})
test('商品が0件のショップは空の一覧になる', () => {
  assert.deepEqual(parseShopItems(page([])), [])
})
test('別のショップの商品や、こわれたデータ・別のページは受け付けない', () => {
  assert.throws(() => parseShopItems(page([item(1, { shop: { url: 'https://other.booth.pm/' } })])))
  assert.throws(() => parseShopItems(page([item(1, { thumbnail_image_urls: ['https://example.com/a.jpg'] })])))
  assert.throws(() => parseShopItems(page([item(1, { name: '' })])))
  assert.throws(() => parseShopItems('<html>maintenance</html>'))
  assert.throws(() => parseShopItems(page([item(1)]).replace(/tanfantazma\.booth\.pm/g, 'other.booth.pm')))
})
test('表示用に大きい画像の URL を作る', () => {
  assert.equal(largerImage('https://booth.pximg.net/c/300x300_a2_g5/u/i/1/a.jpg'), 'https://booth.pximg.net/c/620x620/u/i/1/a.jpg')
})
