// 新デザインを、GitHub Pages にそのまま置ける静的なファイルに書き出す。依存なし。
//   node redesign/build.mjs              → redesign/dist/
//   node redesign/build.mjs <出力先>
// Actions では、毎日の取り込み（TuneCore・pixiv・BOOTH）のあとにこれを動かして公開する（.github/workflows/deploy.yml）。
//
// 書き出すもの
//   index.html・style.css・app.js   … public/ の中身（CSS と JS には更新のたびに変わる ?v= を付ける）
//   api/site.json                    … 作品の一覧
//   api/novels/<作品>/<話>.json      … 各話の本文（カクヨム記法を HTML にしたもの）
//   images/                          … frontend/public/images をそのまま
//   trial/・unrequited/・novels/… … いまのサイトの URL から、新しいページへ移る案内
//   404.html・sitemap.xml・robots.txt
import { mkdir, rm, writeFile, readFile, cp } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { siteData, episodeData, here, publicDir, imagesDir } from './site-data.mjs'

const SITE_URL = 'https://nekonoha.github.io'
const out = path.resolve(process.argv[2] ?? path.join(here, 'dist'))

const write = async (relative, body) => {
  const file = path.join(out, relative)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, body)
}
const esc = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]))
const hashOf = text => createHash('sha256').update(text).digest('hex').slice(0, 10)

// いまのサイトの URL に来た人を、新しいページへ移す小さなページ。JS がなくても meta refresh で移る。
const redirectPage = to => `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>針の筵</title>
<link rel="canonical" href="${esc(SITE_URL + to)}">
<meta http-equiv="refresh" content="0; url=${esc(to)}">
<script>location.replace(${JSON.stringify(to)})</script>
</head>
<body><p><a href="${esc(to)}">針の筵へ / Go to Hari no Mushiro</a></p></body>
</html>
`

// どの URL にも当たらなかったとき。いまのサイトの URL の形なら新しいページへ、それ以外は案内を出す。
const notFoundPage = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>見つかりません — 針の筵</title>
<script>
  (function () {
    var p = location.pathname.replace(/\\/+$/, '').replace(/\\.html$/, ''); var m
    var to = null
    if ((m = p.match(/^\\/novels\\/([\\w-]+)\\/(\\d+)$/))) to = '/#/novel/' + m[1] + '/' + m[2]
    else if ((m = p.match(/^\\/novels\\/([\\w-]+)$/))) to = '/#/novel/' + m[1]
    else if (p === '/novels') to = '/#/novels'
    else if (p === '/trial' || p === '/unrequited') to = '/#/game' + p
    else if (p === '/about') to = '/#/about'
    else if (p === '/works' || p === '/index') to = '/#/'
    if (to) location.replace(to)
  })()
</script>
<style>
  body { display: grid; place-items: center; min-height: 100vh; margin: 0; color: #f3f1ec; background: #0a0a0d; font-family: system-ui, sans-serif; text-align: center; }
  a { color: inherit; }
</style>
</head>
<body>
<main><h1>見つかりません / Not found</h1><p><a href="/">針の筵のトップへ / Go to the top page</a></p></main>
</body>
</html>
`

async function build () {
  await rm(out, { recursive: true, force: true })
  await mkdir(out, { recursive: true })

  // ページ本体。CSS と JS は中身が変わったら URL も変わるようにして、古いものが残らないようにする。
  const style = await readFile(path.join(publicDir, 'style.css'), 'utf8')
  const app = await readFile(path.join(publicDir, 'app.js'), 'utf8')
  let html = await readFile(path.join(publicDir, 'index.html'), 'utf8')
  for (const [name, body] of [['style.css', style], ['app.js', app]]) {
    const before = html
    html = html.replace(`"/${name}"`, `"/${name}?v=${hashOf(body)}"`)
    if (html === before) throw new Error(`index.html に /${name} の読み込みが見つかりません`)
  }
  await write('index.html', html)
  await write('style.css', style)
  await write('app.js', app)
  await cp(imagesDir, path.join(out, 'images'), { recursive: true })

  // データ
  const data = await siteData()
  await write('api/site.json', JSON.stringify(data))
  let episodes = 0
  for (const novel of data.novels) {
    for (const item of novel.episodes) {
      const episode = await episodeData(novel.slug, item.number)
      if (!episode) throw new Error(`小説 ${novel.slug} の ${item.number} 話を読めませんでした`)
      await write(`api/novels/${novel.slug}/${item.number}.json`, JSON.stringify(episode))
      episodes++
    }
  }

  // いまのサイトの URL（/trial、/novels/maigo/12 など）から移る案内
  const redirects = new Map([
    ['works', '/#/'], ['about', '/#/about'], ['novels', '/#/novels'],
    ...data.games.map(game => [game.slug, `/#/game/${game.slug}`])
  ])
  for (const novel of data.novels) {
    redirects.set(`novels/${novel.slug}`, `/#/novel/${novel.slug}`)
    for (const item of novel.episodes) redirects.set(`novels/${novel.slug}/${item.number}`, `/#/novel/${novel.slug}/${item.number}`)
  }
  for (const [from, to] of redirects) await write(`${from}/index.html`, redirectPage(to))
  await write('404.html', notFoundPage)
  await write('.nojekyll', '')
  await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
  await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}/</loc><priority>1.0</priority></url>\n</urlset>\n`)

  console.log(`書き出し先: ${out}`)
  console.log(`音楽 ${data.releases.length}・ショップ ${data.goods.length}・イラスト ${data.illustrations.length}・ゲーム ${data.games.length}・小説 ${data.novels.length}作品（${episodes}話）・移動の案内 ${redirects.size}件`)
}

build().catch(error => {
  console.error(error)
  process.exit(1)
})
