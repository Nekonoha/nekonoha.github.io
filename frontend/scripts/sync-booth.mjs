import { readFile, writeFile, mkdir, rename } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

// BOOTH のショップ「みかん箱」の公開中の商品を取り込む。API キーは不要。
export const shopHost = 'tanfantazma.booth.pm'
export const shopUrl = `https://${shopHost}/`
const root = fileURLToPath(new URL('../', import.meta.url))
const headers = { 'user-agent': 'Mozilla/5.0 (compatible; nekonoha.github.io updater)', 'accept-language': 'ja' }

async function request(url, accept = 'text/html') {
  let lastError
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { headers: { ...headers, accept }, signal: AbortSignal.timeout(20000) })
      if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).hostname}`)
      return response
    } catch (error) {
      lastError = error
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }
  throw lastError
}

const decodeEntities = text => text.replace(/&(#x[0-9a-f]+|#\d+|quot|amp|lt|gt|apos);/gi, (_, code) => {
  const named = { quot: '"', amp: '&', lt: '<', gt: '>', apos: "'" }[code.toLowerCase()]
  if (named) return named
  return String.fromCodePoint(code[1] === 'x' || code[1] === 'X' ? Number.parseInt(code.slice(2), 16) : Number.parseInt(code.slice(1), 10))
})

// ショップの商品一覧ページ（/items）の HTML から、商品カードに埋め込まれたデータを取り出す。
// 公開中・一般向けの商品だけを、新しい順（BOOTH の並び）に limit 件まで返す。
export function parseShopItems(html, limit = 6) {
  if (typeof html !== 'string' || !html.includes(shopHost) || !/<meta property="og:title" content="[^"]* - BOOTH"/.test(html)) {
    throw new Error('BOOTH shop page was not recognised.')
  }
  const cards = [...html.matchAll(/<li\b[^>]*\bclass="[^"]*\bjs-mount-point-shop-item-card\b[^"]*"[^>]*\bdata-item="([^"]*)"/g)]
  const items = []
  for (const [, raw] of cards) {
    let item
    try { item = JSON.parse(decodeEntities(raw)) } catch { throw new Error('BOOTH item data could not be read.') }
    if (item.is_adult || item.is_placeholder) continue
    const id = String(item.id ?? '')
    const thumbnail = Array.isArray(item.thumbnail_image_urls) ? item.thumbnail_image_urls[0] : ''
    let host = ''
    try { host = new URL(item.shop?.url ?? '').hostname } catch { /* 下で弾く */ }
    if (!/^\d+$/.test(id) || host !== shopHost || typeof item.name !== 'string' || !item.name.trim() ||
        typeof item.price !== 'string' || !/^https:\/\/booth\.pximg\.net\//.test(thumbnail ?? '')) {
      throw new Error(`Invalid BOOTH item data: ${id || '(no id)'}`)
    }
    items.push({
      id,
      name: item.name.trim(),
      price: item.price.trim(),
      category: item.category?.name?.ja ?? '',
      soldOut: Boolean(item.is_sold_out),
      endOfSale: Boolean(item.is_end_of_sale),
      url: `https://${shopHost}/items/${id}`,
      imageSource: thumbnail
    })
    if (items.length >= limit) break
  }
  return items
}

// 商品ページのデータ（https://booth.pm/ja/items/<id>.json）から公開日時を取り出す。トップの「新着」の並びに使う。
export function pickPublishedAt(detail, id) {
  const value = detail?.published_at
  if (String(detail?.id) !== String(id) || typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(value) || Number.isNaN(Date.parse(value))) {
    throw new Error(`BOOTH item ${id} has no valid published date.`)
  }
  return value
}

// 一覧の画像は 300px の正方形。表示用には、同じ画像の 620px 版を優先して使う。
export const largerImage = url => url.replace(/\/c\/300x300_a2_g5\//, '/c/620x620/')

async function download(url) {
  const response = await request(url, 'image/*')
  const mime = response.headers.get('content-type')?.split(';')[0]
  const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[mime]
  if (!extension) throw new Error(`Unsupported BOOTH image type: ${mime}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length < 500 || bytes.length > 10000000) throw new Error('Invalid BOOTH image size.')
  return { bytes, extension }
}

export async function syncBooth() {
  const catalogPath = path.join(root, 'data/booth.json')
  const previous = JSON.parse(await readFile(catalogPath, 'utf8').catch(() => '{"items":[]}'))
  const html = await (await request(`${shopUrl}items`)).text()
  const items = parseShopItems(html)
  // 前回は商品があったのに急に0件になったときは、ページの形が変わった可能性が高いので更新しない。
  if (!items.length && previous.items?.length) throw new Error('BOOTH returned no items although some were listed before.')

  // 公開日時は商品ごとに取りに行く。取れなかったときは前回の値を使い、それもなければ空にする（新着には出ない）。
  const knownDates = new Map((previous.items ?? []).map(entry => [entry.id, entry.publishedAt ?? null]))
  for (const item of items) {
    try {
      const detail = await (await request(`https://booth.pm/ja/items/${item.id}.json`, 'application/json')).json()
      item.publishedAt = pickPublishedAt(detail, item.id)
    } catch (error) {
      item.publishedAt = knownDates.get(item.id) ?? null
      console.warn(`${error.message} Using ${item.publishedAt ?? 'no date'}.`)
    }
  }

  const imageDir = path.join(root, 'public/images/booth')
  await mkdir(imageDir, { recursive: true })
  for (const item of items) {
    let image
    try { image = await download(largerImage(item.imageSource)) } catch { image = await download(item.imageSource) }
    const hash = createHash('sha256').update(image.bytes).digest('hex').slice(0, 12)
    const filename = `${item.id}-${hash}.${image.extension}`
    await writeFile(path.join(imageDir, filename), image.bytes)
    item.image = `/images/booth/${filename}`
    delete item.imageSource
  }

  const catalog = { source: shopUrl, checkedAt: new Date().toISOString(), items }
  await writeFile(catalogPath + '.tmp', JSON.stringify(catalog, null, 2) + '\n')
  await rename(catalogPath + '.tmp', catalogPath)
  console.log(items.length ? `Synced ${items.length} BOOTH items. Latest: ${items[0].name}` : 'BOOTH shop has no public items.')
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  syncBooth().catch(error => { console.error(error.message); process.exitCode = 1 })
}
