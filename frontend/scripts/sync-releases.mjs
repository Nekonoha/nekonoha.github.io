import { readFile, writeFile, mkdir, rename } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

export const source = 'https://www.tunecore.co.jp/artists/nekonoha?lang=ja'
const root = fileURLToPath(new URL('../', import.meta.url))

export function parseReleases(html, today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' })) {
  const match = html.match(/<script\b[^>]*\bid=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i)
  if (!match) throw new Error('TuneCore page data not found; keeping the previous catalog.')
  const artist = JSON.parse(match[1]).props?.pageProps?.artist
  if (artist?.artistPagePath !== 'nekonoha' || !Array.isArray(artist.releases) || !artist.releases.length) {
    throw new Error('Unexpected artist or empty catalog; keeping the previous catalog.')
  }
  const releases = new Map()
  for (const item of artist.releases) {
    const date = item.releaseDate
    const url = item.linkcore?.url
    const image = item.image?.large?.url || item.image?.medium?.url
    if (!Number.isSafeInteger(item.id) || !item.nameJa || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        new Date(date + 'T00:00:00Z').toISOString().slice(0, 10) !== date ||
        !/^https:\/\/linkco\.re\/[A-Za-z0-9]+$/.test(url) || !image) {
      throw new Error('Incomplete release data; keeping the previous catalog.')
    }
    const imageUrl = new URL(image)
    if (imageUrl.protocol !== 'https:' || imageUrl.hostname !== 'tcj-image-production.s3-ap-northeast-1.amazonaws.com') {
      throw new Error('Unexpected artwork host.')
    }
    if (date > today) continue
    releases.set(item.id, {
      id: String(item.id), title: item.nameJa, titleEn: item.nameEn || item.nameJa,
      releaseDate: date, linkcoreUrl: url, type: item.type || 'release',
      trackCount: Number(item.songNum) || 0, artworkSource: image
    })
  }
  if (!releases.size) throw new Error('No published releases found.')
  return [...releases.values()].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate) || Number(b.id) - Number(a.id))
}

async function request(url, options = {}) {
  let lastError
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) })
      if (!response.ok && !(options.redirect === 'manual' && response.status >= 300 && response.status < 400)) {
        throw new Error(`HTTP ${response.status} from ${new URL(url).hostname}`)
      }
      return response
    } catch (error) {
      lastError = error
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }
  throw lastError
}

export async function syncReleases() {
  const catalogPath = path.join(root, 'data/releases.json')
  let previous = { releases: [] }
  try { previous = JSON.parse(await readFile(catalogPath, 'utf8')) } catch (error) { if (error.code !== 'ENOENT') throw error }
  const releases = parseReleases(await (await request(source)).text())
  const artworkDir = path.join(root, 'public/images/releases')
  await mkdir(artworkDir, { recursive: true })
  for (const release of releases) {
    const response = await request(release.artworkSource)
    const mime = response.headers.get('content-type')?.split(';')[0]
    const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[mime]
    if (!extension) throw new Error('Artwork response is not a supported image.')
    const bytes = Buffer.from(await response.arrayBuffer())
    if (bytes.length < 100 || bytes.length > 10000000) throw new Error('Invalid artwork size.')
    // Content-addressed files keep the previous catalog intact if a later fetch fails.
    const { createHash } = await import('node:crypto')
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12)
    const filename = `${release.id}-${hash}.${extension}`
    await writeFile(path.join(artworkDir, filename), bytes)
    release.artwork = `/images/releases/${filename}`
    delete release.artworkSource
    try {
      const redirect = await request(`https://www.tunecore.co.jp/to/spotify/${release.id}`, { redirect: 'manual' })
      const match = redirect.headers.get('location')?.match(/^https:\/\/open\.spotify\.com\/album\/([A-Za-z0-9]{22})(?:\?|$)/)
      if (match) release.spotifyId = match[1]
    } catch {
      console.warn(`Spotify unavailable for ${release.id}; LinkCore remains available.`)
      const cached = previous.releases.find(item => item.id === release.id)
      if (cached?.spotifyId) release.spotifyId = cached.spotifyId
    }
  }
  const catalog = { source, checkedAt: new Date().toISOString(), releases }
  await writeFile(catalogPath + '.tmp', JSON.stringify(catalog, null, 2) + '\n')
  await rename(catalogPath + '.tmp', catalogPath)
  console.log(`Synced ${releases.length} releases. Latest: ${releases[0].title} (${releases[0].releaseDate})`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  syncReleases().catch(error => { console.error(error.message); process.exitCode = 1 })
}
