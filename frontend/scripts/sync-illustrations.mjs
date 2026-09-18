import { readFile, writeFile, mkdir, rename } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

export const userId = '3007111'
export const profileUrl = `https://www.pixiv.net/users/${userId}`
const root = fileURLToPath(new URL('../', import.meta.url))
const headers = { 'user-agent': 'Mozilla/5.0 (compatible; nekonoha.github.io updater)', referer: profileUrl }

async function request(url) {
  let lastError
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(20000) })
      if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).hostname}`)
      return response
    } catch (error) {
      lastError = error
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }
  throw lastError
}

export function parseWorks(allData, detailData, limit = 6) {
  if (allData?.error || detailData?.error) throw new Error('Pixiv returned an error.')
  const ids = Object.keys(allData?.body?.illusts || {}).sort((a, b) => Number(b) - Number(a)).slice(0, limit)
  const works = detailData?.body?.works
  if (!ids.length || !works) throw new Error('Pixiv work data was empty or changed format.')
  return ids.map(id => {
    const item = works[id]
    if (!item || item.userId !== userId || item.xRestrict !== 0 || !item.title ||
        !/^https:\/\/i\.pximg\.net\//.test(item.url) || !/^\d{4}-\d{2}-\d{2}T/.test(item.createDate)) {
      throw new Error(`Invalid or restricted Pixiv work: ${id}`)
    }
    return {
      id,
      title: item.title,
      postedAt: item.createDate,
      width: Number(item.width),
      height: Number(item.height),
      pageCount: Number(item.pageCount) || 1,
      tags: Array.isArray(item.tags) ? item.tags.slice(0, 5) : [],
      pixivUrl: `https://www.pixiv.net/artworks/${id}`,
      imageSource: item.url
    }
  }).sort((a, b) => b.postedAt.localeCompare(a.postedAt) || Number(b.id) - Number(a.id))
}

export async function syncIllustrations() {
  const catalogPath = path.join(root, 'data/illustrations.json')
  const all = await (await request(`https://www.pixiv.net/ajax/user/${userId}/profile/all?lang=ja`)).json()
  const ids = Object.keys(all?.body?.illusts || {}).sort((a, b) => Number(b) - Number(a)).slice(0, 6)
  if (!ids.length) throw new Error('No public Pixiv illustrations found.')
  const query = ids.map(id => `ids%5B%5D=${id}`).join('&')
  const detail = await (await request(`https://www.pixiv.net/ajax/user/${userId}/profile/illusts?${query}&work_category=illustManga&is_first_page=1&lang=ja`)).json()
  const illustrations = parseWorks(all, detail)
  const imageDir = path.join(root, 'public/images/illustrations')
  await mkdir(imageDir, { recursive: true })

  for (const work of illustrations) {
    const response = await request(work.imageSource)
    const mime = response.headers.get('content-type')?.split(';')[0]
    const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[mime]
    if (!extension) throw new Error(`Unsupported Pixiv image type for ${work.id}.`)
    const bytes = Buffer.from(await response.arrayBuffer())
    if (bytes.length < 1000 || bytes.length > 15000000) throw new Error(`Invalid Pixiv image size for ${work.id}.`)
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12)
    const filename = `${work.id}-${hash}.${extension}`
    await writeFile(path.join(imageDir, filename), bytes)
    work.image = `/images/illustrations/${filename}`
    delete work.imageSource
  }

  const catalog = { source: profileUrl, checkedAt: new Date().toISOString(), illustrations }
  await writeFile(catalogPath + '.tmp', JSON.stringify(catalog, null, 2) + '\n')
  await rename(catalogPath + '.tmp', catalogPath)
  console.log(`Synced ${illustrations.length} Pixiv works. Latest: ${illustrations[0].title}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  syncIllustrations().catch(error => { console.error(error.message); process.exitCode = 1 })
}
