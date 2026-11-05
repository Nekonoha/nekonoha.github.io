// 針の筵：データは /api（ローカルでは serve.mjs、公開時は build.mjs が書き出した JSON）から読む。
// 画面はハッシュ（#/…）で切り替える。言語は日本語と英語。

const $ = (selector, root = document) => root.querySelector(selector)
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]))
const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`
const reduced = matchMedia('(prefers-reduced-motion: reduce)')
const finePointer = matchMedia('(hover: hover) and (pointer: fine)')
const store = {
  get (key, fallback = null) { try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value) } catch { return fallback } },
  set (key, value) { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* 保存できなくても動く */ } }
}

/* ---------------------------------------------------------------------------
   言語：<html lang> を正とする（index.html の最初のスクリプトが決める）
--------------------------------------------------------------------------- */
const lang = () => document.documentElement.lang === 'en' ? 'en' : 'ja'
const L = (ja, en) => lang() === 'en' ? en : ja
// { ja, en } の形の文から、いまの言語のほうを取り出す
const tx = value => value && typeof value === 'object' ? (value[lang()] ?? value.ja ?? '') : (value ?? '')
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`
// 英語表示のとき、日本語のままの中身（作品名など）には lang="ja" を付ける（改行位置と読み上げのため）
const jaText = /[\u3040-\u30ff\u3400-\u9fff]/
const jaAttr = text => lang() === 'en' && jaText.test(String(text ?? '')) ? ' lang="ja"' : ''
// BOOTH の商品名：「日本語名 / English name」のように英語名が付いていれば、英語表示ではそちらを出す
const goodsName = item => {
  if (lang() !== 'en') return item.name
  const latin = String(item.name).split(/\s+[/／]\s+/).filter(part => !jaText.test(part) && /[a-z]/i.test(part))
  return latin.length ? latin.join(' / ') : item.name
}
// BOOTH のカテゴリ名（英語表示用）
const boothCategories = {
  '3Dキャラクター': '3D Characters', '3D衣装': '3D Clothing', '3D装飾品': '3D Accessories', '3D小道具': '3D Props',
  '3Dテクスチャ': '3D Textures', '3Dツール・システム': '3D Tools & Systems', '3Dモーション・アニメーション': '3D Motions',
  '3D環境・ワールド': '3D Worlds', 'イラスト': 'Illustrations', 'イラスト集・写真集': 'Art Books', '音楽': 'Music',
  'ゲーム': 'Games', 'ソフトウェア': 'Software', 'グッズ': 'Goods', 'アクセサリー': 'Accessories', 'ファッション': 'Fashion',
  '漫画・同人誌': 'Comics', '小説・その他書籍': 'Books'
}
const category = value => lang() === 'en' ? (boothCategories[value] ?? value) : value

/* ---------------------------------------------------------------------------
   日付・価格・並べ方
--------------------------------------------------------------------------- */
const toTime = value => typeof value === 'string' && value ? Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00+09:00` : value) : NaN
const day = value => {
  const time = toTime(value)
  return Number.isFinite(time) ? new Date(time + 9 * 3600e3).toISOString().slice(0, 10).replaceAll('-', '.') : ''
}
const price = value => {
  const compact = String(value ?? '').replace(/^¥\s*/, '¥').replace(/~$/, '〜')
  return compact === '¥0' ? L('無料', 'Free') : compact
}
const tracks = n => L(`${n}曲`, plural(n, 'track', 'tracks'))
const releaseTitle = item => L(item.title, item.titleEn || item.title)
const otherTitle = item => { const other = L(item.titleEn, item.title); return other && other !== releaseTitle(item) ? other : '' }
const hueOf = text => [...String(text)].reduce((sum, ch) => (sum * 31 + ch.codePointAt(0)) % 360, 7)
const kinds = {
  shop: { ja: 'ショップ', en: 'Shop', icon: 'bag', actionJa: 'BOOTHで見る', actionEn: 'View on BOOTH' },
  music: { ja: '音楽', en: 'Music', icon: 'music', actionJa: '配信で聴く', actionEn: 'Listen' },
  art: { ja: 'イラスト', en: 'Illustration', icon: 'brush', actionJa: 'pixivで見る', actionEn: 'View on pixiv' },
  novel: { ja: '小説', en: 'Novel', icon: 'book', actionJa: '読む', actionEn: 'Read' }
}
const kindLabel = kind => L(kinds[kind].ja, kinds[kind].en)
const kindAction = kind => L(kinds[kind].actionJa, kinds[kind].actionEn)

// トップのセクション。下の移動ボタン（dock）・左の目次（rail）・探す、で共通
const SECTIONS = [
  { id: 'shop', ja: 'ショップ', en: 'Shop', icon: 'bag', has: data => data.goods.length > 0 },
  { id: 'music', ja: '音楽', en: 'Music', icon: 'music' },
  { id: 'games', ja: 'ゲーム', en: 'Games', icon: 'game' },
  { id: 'art', ja: 'イラスト', en: 'Art', icon: 'brush' },
  { id: 'novels', ja: '小説', en: 'Novels', icon: 'book', has: data => data.novels.length > 0 },
  { id: 'about', ja: 'プロフィール', en: 'About', icon: 'user', railOnly: true }
]
const sectionsFor = data => SECTIONS.filter(sec => !sec.has || sec.has(data))
const isSection = id => SECTIONS.some(sec => sec.id === id)

// 音楽・ショップ・イラスト・小説から、それぞれの最新を1件ずつ、新しい順に
function latestUpdates (data) {
  const newest = (list, dateOf) => list.filter(item => Number.isFinite(toTime(dateOf(item))))
    .reduce((best, item) => !best || toTime(dateOf(item)) > toTime(dateOf(best)) ? item : best, null)
  const list = []
  const release = newest(data.releases, item => item.releaseDate)
  if (release) list.push({ kind: 'music', date: release.releaseDate, title: releaseTitle(release), note: tracks(release.trackCount), image: release.artwork, href: `${release.linkcoreUrl}?lang=${lang()}`, external: true })
  const good = newest(data.goods, item => item.publishedAt)
  if (good) list.push({ kind: 'shop', date: good.publishedAt, title: goodsName(good), note: price(good.price), image: good.image, href: good.url, external: true })
  const work = newest(data.illustrations, item => item.postedAt)
  if (work) list.push({ kind: 'art', date: work.postedAt, title: work.title, note: '', image: work.image, href: work.pixivUrl, external: true })
  const novel = newest(data.novels.filter(item => item.update), item => item.update.date)
  if (novel) list.push({ kind: 'novel', date: novel.update.date, title: novel.title, note: novel.update.title, image: null, hue: hueOf(novel.slug), href: `#/novel/${novel.slug}/${novel.update.number}`, external: false })
  const order = ['shop', 'music', 'art', 'novel']
  return list.sort((a, b) => toTime(b.date) - toTime(a.date) || order.indexOf(a.kind) - order.indexOf(b.kind))
}
const linkAttrs = item => item.external ? `href="${esc(item.href)}" target="_blank" rel="noopener noreferrer"` : `href="${esc(item.href)}"`

/* ---------------------------------------------------------------------------
   作品の色をページににじませる
--------------------------------------------------------------------------- */
const colorCache = new Map()
async function colorOf (src) {
  if (colorCache.has(src)) return colorCache.get(src)
  const promise = (async () => {
    const image = new Image()
    image.src = src
    await image.decode()
    const size = 28
    const canvas = Object.assign(document.createElement('canvas'), { width: size, height: size })
    const context = canvas.getContext('2d', { willReadFrequently: true })
    context.drawImage(image, 0, 0, size, size)
    const pixels = context.getImageData(0, 0, size, size).data
    // 鮮やかな色を色相ごとに集め、いちばん多い色相を選ぶ。ほぼ無彩色なら暗い灰色。
    const buckets = Array.from({ length: 12 }, () => ({ w: 0, r: 0, g: 0, b: 0 }))
    const all = { r: 0, g: 0, b: 0, n: 0 }
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = [pixels[i] / 255, pixels[i + 1] / 255, pixels[i + 2] / 255]
      all.r += r; all.g += g; all.b += b; all.n++
      const max = Math.max(r, g, b); const min = Math.min(r, g, b); const chroma = max - min
      if (max < .12 || chroma < .12) continue
      let hue = max === r ? ((g - b) / chroma) % 6 : max === g ? (b - r) / chroma + 2 : (r - g) / chroma + 4
      hue = (hue * 60 + 360) % 360
      const weight = chroma * max
      const bucket = buckets[Math.floor(hue / 30)]
      bucket.w += weight; bucket.r += r * weight; bucket.g += g * weight; bucket.b += b * weight
    }
    // 暗い絵でも、差し色が少しあればそれを拾う（黒地に赤い線のジャケットなど）。まったくなければ全体の平均の色。
    const best = buckets.reduce((a, b) => b.w > a.w ? b : a)
    if (best.w >= .3) return normalize(best.r / best.w, best.g / best.w, best.b / best.w)
    return normalize(all.r / all.n, all.g / all.n, all.b / all.n, .14)
  })().catch(() => 'rgb(70 72 84)')
  colorCache.set(src, promise)
  return promise
}
// 明るさと鮮やかさをそろえて、背景にも文字の差し色にも使える色にする
function normalize (r, g, b, minSaturation = .38) {
  const max = Math.max(r, g, b); const min = Math.min(r, g, b)
  let h = 0; const l = (max + min) / 2; const d = max - min
  let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  h = Math.round((h * 60 + 360) % 360)
  s = Math.min(.8, Math.max(minSaturation, s))
  return `hsl(${h} ${Math.round(s * 100)}% ${Math.round(Math.min(.56, Math.max(.44, l)) * 100)}%)`
}
let ambientToken = 0
async function setAmbient (source) {
  const token = ++ambientToken
  const color = typeof source === 'number' ? `hsl(${source} 55% 46%)` : await colorOf(source)
  if (token === ambientToken) document.documentElement.style.setProperty('--amb', color)
}

/* ---------------------------------------------------------------------------
   ちょっとした知らせ
--------------------------------------------------------------------------- */
let toastTimer
function toast (text, action) {
  const box = $('.toast')
  box.innerHTML = `<span>${esc(text)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ''}`
  if (action) box.querySelector('button').onclick = () => { box.classList.remove('on'); action.run() }
  box.classList.add('on')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => box.classList.remove('on'), 4800)
}

/* ---------------------------------------------------------------------------
   画面：トップ
--------------------------------------------------------------------------- */
const state = { data: null, homeScroll: 0, shelfIndex: 0, shared: null, cleanups: [] }
const onCleanup = fn => state.cleanups.push(fn)
const count = (n, ja, one, many) => L(`${n}${ja}`, plural(n, one, many))

function homeView (data) {
  const updates = latestUpdates(data)
  const [featured, ...others] = updates
  const hero = `
    <section class="hero wrap" data-sec="top" data-amb="${featured ? esc(featured.image ?? featured.hue) : ''}">
      <div>
        <h1 class="hero-title" aria-label="${L('針の筵', 'Hari no Mushiro')}">${[...'針の筵'].map((ch, i) => `<span style="--i:${i}" aria-hidden="true">${ch}</span>`).join('')}</h1>
        ${lang() === 'en' ? '<p class="hero-romaji">Hari no Mushiro</p>' : ''}
        <button class="hero-find" type="button" data-action="search">${icon('search')}<span>${L('作品を探す', 'Search works')}</span><kbd>Ctrl K</kbd></button>
      </div>
      ${featured ? `
      <div class="feature">
        <a class="feature-art ${featured.image ? '' : 'text-art'}" data-tilt ${linkAttrs(featured)} aria-label="${esc(featured.title)}（${kindAction(featured.kind)}）">${featured.image ? `<img src="${esc(featured.image)}" alt="" width="800" height="800" fetchpriority="high">` : `${icon(kinds[featured.kind].icon)}<strong>${esc(featured.title)}</strong><span>${esc(featured.note)}</span>`}</a>
        <div class="feature-info">
          <div>
            <p><span class="meta">${L('最新の更新', 'Latest update')}</span><span class="tag">${icon(kinds[featured.kind].icon)}${kindLabel(featured.kind)}</span><time class="meta" datetime="${esc(featured.date)}">${day(featured.date)}</time></p>
            <h2${jaAttr(featured.kind === 'novel' ? featured.note : featured.title)}>${esc(featured.kind === 'novel' ? featured.note : featured.title)}</h2>
          </div>
          <a class="btn btn-hi" ${linkAttrs(featured)}>${kindAction(featured.kind)}${featured.external ? `<span class="ext">${icon('ext')}</span>` : icon('arrow')}</a>
        </div>
      </div>` : ''}
    </section>`
  const news = others.length ? `
    <section class="sec wrap" id="news" data-sec="news" style="padding-top:0">
      <h2 class="sr">${L('ほかの新着', 'More updates')}</h2>
      <ul class="news">${others.map(item => `
        <li><a ${linkAttrs(item)}>
          <span class="news-thumb">${item.image ? `<img src="${esc(item.image)}" alt="" loading="lazy">` : icon(kinds[item.kind].icon)}</span>
          <span class="news-body"><span><span class="tag">${icon(kinds[item.kind].icon)}${kindLabel(item.kind)}</span><time class="meta">${day(item.date)}</time></span><strong${jaAttr(item.title)}>${esc(item.title)}</strong>${item.note ? `<small${jaAttr(item.note)}>${esc(item.note)}</small>` : ''}</span>
          ${item.external ? icon('ext') : icon('arrow')}
        </a></li>`).join('')}
      </ul>
    </section>` : ''

  const [lead, ...moreGoods] = data.goods
  const shop = lead ? `
    <section class="sec wrap" id="shop" data-sec="shop" data-amb="${esc(lead.image)}">
      <header class="sec-head"><h2>${L('ショップ', 'Shop')}</h2><span class="meta">${count(data.goods.length, '点', 'item', 'items')}</span><a class="link" href="https://tanfantazma.booth.pm/" target="_blank" rel="noopener noreferrer">BOOTH<span class="ext">${icon('ext')}</span></a></header>
      <a class="spot" href="${esc(lead.url)}" target="_blank" rel="noopener noreferrer">
        <span class="spot-art"><img src="${esc(lead.image)}" alt="" loading="lazy">${lead.endOfSale || lead.soldOut ? `<span class="spot-state">${lead.endOfSale ? L('販売終了', 'No longer sold') : L('売り切れ', 'Sold out')}</span>` : ''}</span>
        <span class="spot-body">
          <span><span class="tag">${icon('bag')}${esc(category(lead.category) || 'BOOTH')}</span></span>
          <h3${jaAttr(goodsName(lead))}>${esc(goodsName(lead))}</h3>
          <span class="spot-price">${price(lead.price)}</span>
          <span class="btn btn-hi">${L('BOOTHで見る', 'View on BOOTH')}<span class="ext">${icon('ext')}</span></span>
        </span>
      </a>
      ${moreGoods.length ? `<ul class="goods-more">${moreGoods.map(item => `<li><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><img src="${esc(item.image)}" alt="" loading="lazy"><strong${jaAttr(goodsName(item))}>${esc(goodsName(item))}</strong><span class="meta">${price(item.price)}</span></a></li>`).join('')}</ul>` : ''}
    </section>` : ''

  const music = `
    <section class="sec" id="music" data-sec="music" data-amb="${esc(data.releases[0]?.artwork ?? '')}">
      <header class="sec-head wrap"><h2>${L('音楽', 'Music')}</h2><span class="meta">${count(data.releases.length, '作品', 'release', 'releases')}</span><a class="link" href="https://www.tunecore.co.jp/artists/nekonoha?lang=${lang()}" target="_blank" rel="noopener noreferrer">TuneCore<span class="ext">${icon('ext')}</span></a></header>
      <div class="shelf" tabindex="0" aria-label="${L('リリースの棚。左右キーで選べます', 'Release shelf. Use the arrow keys to browse')}">
        <div class="shelf-track">${data.releases.map((item, i) => `<button class="disc" type="button" data-index="${i}" aria-label="${esc(releaseTitle(item))}"><img src="${esc(item.artwork)}" alt="" width="800" height="800" ${i > 2 ? 'loading="lazy"' : ''} draggable="false"></button>`).join('')}</div>
      </div>
      <div class="shelf-ctrl"><button class="icon-btn press" type="button" data-shelf="-1" aria-label="${L('前のリリース', 'Previous release')}">${icon('left')}</button><span class="meta shelf-count"></span><button class="icon-btn press" type="button" data-shelf="1" aria-label="${L('次のリリース', 'Next release')}">${icon('right')}</button></div>
      <div class="release wrap" aria-live="polite"></div>
    </section>`

  const games = `
    <section class="sec wrap" id="games" data-sec="games" data-amb="${esc(data.games[0]?.cover ?? '')}">
      <header class="sec-head"><h2>${L('ゲーム', 'Games')}</h2><span class="meta">${L('ゆめにっき二次創作', 'Yume Nikki fan games')}</span></header>
      <div class="games">${data.games.map(game => `
        <a class="game-tile" href="#/game/${esc(game.slug)}" data-vt="game-${esc(game.slug)}">
          <span class="game-shot" data-vt-target>${game.screenshots.map(src => `<img src="${esc(src)}" alt="" loading="lazy" class="${src === game.cover ? 'on' : ''}">`).join('')}</span>
          <span class="game-tile-body"><span><h3>${esc(game.title)}</h3><p>${L('遊び方・スクリーンショット・ダウンロード', 'How to play · Screenshots · Download')}</p></span><span class="go">${icon('arrow')}</span></span>
        </a>`).join('')}
      </div>
    </section>`

  const art = `
    <section class="sec wrap" id="art" data-sec="art" data-amb="${esc(data.illustrations[0]?.image ?? '')}">
      <header class="sec-head"><h2>${L('イラスト', 'Illustration')}</h2><span class="meta">${L('pixivの新着', 'Latest on pixiv')}</span><a class="link" href="https://pixiv.me/tanfantazma" target="_blank" rel="noopener noreferrer">pixiv<span class="ext">${icon('ext')}</span></a></header>
      <ul class="art">${data.illustrations.map(item => `
        <li><a href="${esc(item.pixivUrl)}" target="_blank" rel="noopener noreferrer">
          <span class="art-img"><img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" width="250" height="250"></span>
          <span class="art-cap"><strong${jaAttr(item.title)}>${esc(item.title)}</strong><time class="meta">${day(item.postedAt)}</time></span>
        </a></li>`).join('')}
      </ul>
    </section>`

  const novels = data.novels.length ? `
    <section class="sec wrap" id="novels" data-sec="novels" data-amb="${hueOf(data.novels[0].slug)}">
      <header class="sec-head"><h2>${L('小説', 'Novels')}</h2><span class="meta">${count(data.novels.length, '作品', 'novel', 'novels')}${lang() === 'en' ? ' · in Japanese' : ''}</span></header>
      <ul class="books">${data.novels.map(novel => `
        <li><a class="book" href="#/novel/${esc(novel.slug)}" data-vt="novel-${esc(novel.slug)}">
          ${coverHtml(novel)}
          <span class="book-meta"><span class="meta">${L(`全${novel.episodes.length}話`, plural(novel.episodes.length, 'episode', 'episodes'))}</span>${novel.update ? `<span class="meta">${L(`${day(novel.update.date)} 更新`, `Updated ${day(novel.update.date)}`)}</span>` : ''}</span>
        </a></li>`).join('')}
      </ul>
    </section>` : ''

  const profile = data.about
  const about = `
    <section class="sec wrap" id="about" data-sec="about" data-amb="${esc(profile.avatar)}">
      <header class="sec-head"><h2>${L('プロフィール', 'About')}</h2></header>
      <div class="about">
        <img src="${esc(profile.avatar)}" alt="${L('ネコノハのアイコン', 'Nekonoha avatar')}" loading="lazy" width="200" height="200">
        <div>
          <h3>${esc(tx(profile.name))}</h3>
          <p>${esc(tx(profile.bio))}</p>
          <dl>${profile.facts.map(fact => `<dt>${esc(tx(fact.label))}</dt><dd>${fact.url ? `<a class="link" href="${esc(fact.url.includes('tunecore') ? `${fact.url}?lang=${lang()}` : fact.url)}" target="_blank" rel="noopener noreferrer">${esc(tx(fact.value))}<span class="ext">${icon('ext')}</span></a>` : esc(tx(fact.value))}</dd>`).join('')}</dl>
        </div>
      </div>
      <ul class="links">${data.links.map(link => `<li><a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer"><span class="ico">${icon(link.icon)}</span><span><strong>${esc(link.name)}</strong><small>${esc(tx(link.note))}</small></span><span class="ext">${icon('ext')}</span></a></li>`).join('')}</ul>
      <footer class="foot"><span class="logo">針の筵</span><span>© Nekonoha</span></footer>
    </section>`

  return hero + news + shop + music + games + art + novels + about
}

function coverHtml (novel) {
  return `<span class="cover" lang="ja" style="--h:${hueOf(novel.slug)}" data-vt-target>${icon('book')}<span><strong>${esc(novel.title)}</strong></span></span>`
}

function mountHome (root, data) {
  // 傾くカード（マウスのときだけ）
  const card = $('[data-tilt]', root)
  if (card && finePointer.matches && !reduced.matches) {
    const move = event => {
      const rect = card.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5
      card.classList.add('tilting')
      card.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`); card.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`)
    }
    const leave = () => { card.classList.remove('tilting'); card.style.removeProperty('--rx'); card.style.removeProperty('--ry') }
    card.addEventListener('pointermove', move); card.addEventListener('pointerleave', leave)
  }
  mountShelf(root, data)
  // ゲームのタイル：マウスを乗せている間だけ、スクリーンショットを順に見せる
  for (const tile of $$('.game-tile', root)) {
    let timer
    const shots = $$('img', tile)
    tile.addEventListener('pointerenter', () => {
      if (reduced.matches || shots.length < 2) return
      let i = shots.findIndex(img => img.classList.contains('on'))
      timer = setInterval(() => { shots[i].classList.remove('on'); i = (i + 1) % shots.length; shots[i].classList.add('on') }, 900)
    })
    tile.addEventListener('pointerleave', () => clearInterval(timer))
    onCleanup(() => clearInterval(timer))
  }
  // 見ているセクション（画面の上から4割の線を越えた、いちばん下のセクション）に合わせて、目次と背景の色を変える
  spy.sections = $$('[data-sec]', root)
  spy.data = data
  onCleanup(() => { spy.sections = [] })
}
const spy = { sections: [], data: null }
function spyHome () {
  if (!spy.sections.length) return
  const line = innerHeight * .4
  let current = spy.sections[0]
  for (const section of spy.sections) if (section.getBoundingClientRect().top <= line) current = section
  const sec = current.dataset.sec
  if (sec === currentSec) return
  markDock(sec)
  if (sec === 'music') setAmbient(spy.data.releases[state.shelfIndex]?.artwork)
  else if (current.dataset.amb) setAmbient(/^\d+$/.test(current.dataset.amb) ? Number(current.dataset.amb) : current.dataset.amb)
}

/* 音楽の棚：横にスワイプ・ドラッグ・左右キーで選ぶ */
function mountShelf (root, data) {
  const shelf = $('.shelf', root)
  if (!shelf) return
  const discs = $$('.disc', shelf)
  const detail = $('.release', root)
  const counter = $('.shelf-count', root)
  let active = -1
  const center = i => discs[i].offsetLeft + discs[i].offsetWidth / 2 - shelf.clientWidth / 2
  const go = (i, behavior = 'smooth') => shelf.scrollTo({ left: center(Math.max(0, Math.min(discs.length - 1, i))), behavior: reduced.matches ? 'auto' : behavior })
  const select = i => {
    if (i === active) return
    active = i
    state.shelfIndex = i
    discs.forEach((disc, n) => { disc.classList.toggle('on', n === i); disc.setAttribute('aria-current', n === i ? 'true' : 'false') })
    const item = data.releases[i]
    counter.textContent = `${i + 1} / ${discs.length}`
    detail.innerHTML = `
      <time class="meta" datetime="${esc(item.releaseDate)}">${day(item.releaseDate)}　${tracks(item.trackCount)}</time>
      <h3${jaAttr(releaseTitle(item))}>${esc(releaseTitle(item))}</h3>
      ${otherTitle(item) ? `<p class="en"${jaAttr(otherTitle(item))}>${esc(otherTitle(item))}</p>` : ''}
      <div class="release-actions">
        ${item.spotifyId ? `<button class="btn btn-hi" type="button" data-action="preview" aria-expanded="false">${icon('play')}${L('試聴する', 'Preview')}</button>` : ''}
        <a class="btn" href="${esc(item.linkcoreUrl)}?lang=${lang()}" target="_blank" rel="noopener noreferrer">${L('配信で聴く', 'Listen')}<span class="ext">${icon('ext')}</span></a>
      </div>`
    if (document.querySelector('[data-sec="music"]') === currentSection()) setAmbient(item.artwork)
  }
  let frame = 0
  const nearest = () => {
    frame = 0
    const middle = shelf.scrollLeft + shelf.clientWidth / 2
    let best = 0
    discs.forEach((disc, i) => { if (Math.abs(disc.offsetLeft + disc.offsetWidth / 2 - middle) < Math.abs(discs[best].offsetLeft + discs[best].offsetWidth / 2 - middle)) best = i })
    select(best)
  }
  shelf.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(nearest) }, { passive: true })
  shelf.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(active + 1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(active - 1) }
  })
  $$('[data-shelf]', root).forEach(button => button.addEventListener('click', () => go(active + Number(button.dataset.shelf))))
  // マウスでつかんで動かす（タッチは標準のスクロールに任せる）
  let drag = null
  shelf.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag = { x: event.clientX, left: shelf.scrollLeft, moved: false }
    shelf.setPointerCapture(event.pointerId)
  })
  shelf.addEventListener('pointermove', event => {
    if (!drag) return
    const dx = event.clientX - drag.x
    if (Math.abs(dx) > 4) { drag.moved = true; shelf.classList.add('dragging') }
    if (drag.moved) shelf.scrollLeft = drag.left - dx
  })
  const end = () => {
    if (!drag) return
    const moved = drag.moved
    drag = null
    shelf.classList.remove('dragging')
    if (moved) { nearest(); go(active); shelf.dataset.justDragged = '1'; setTimeout(() => delete shelf.dataset.justDragged, 60) }
  }
  shelf.addEventListener('pointerup', end)
  shelf.addEventListener('pointercancel', end)
  discs.forEach((disc, i) => disc.addEventListener('click', () => { if (!shelf.dataset.justDragged) go(i) }))
  detail.addEventListener('click', event => {
    const button = event.target.closest('[data-action="preview"]')
    if (!button) return
    const open = $('.player', detail)
    if (open) { open.remove(); button.setAttribute('aria-expanded', 'false'); button.innerHTML = `${icon('play')}${L('試聴する', 'Preview')}`; return }
    const item = data.releases[active]
    detail.insertAdjacentHTML('beforeend', `<div class="player"><iframe title="${esc(releaseTitle(item))}（Spotify）" src="https://open.spotify.com/embed/album/${esc(item.spotifyId)}?utm_source=generator&amp;locale=${lang()}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div>`)
    button.setAttribute('aria-expanded', 'true')
    button.innerHTML = `${icon('close')}${L('閉じる', 'Close')}`
  })
  requestAnimationFrame(() => { go(state.shelfIndex, 'auto'); nearest() })
}

/* ---------------------------------------------------------------------------
   画面：ゲーム
   題名は横幅いっぱいに。その下に大きな画面写真と、遊ぶための情報（ダウンロード）を並べる。
--------------------------------------------------------------------------- */
function gameView (game) {
  // その言語の版があれば、それをいちばん目立つボタンにする
  const primary = Math.max(0, game.downloads.findIndex(item => item.lang === lang()))
  const downloads = [game.downloads[primary], ...game.downloads.filter((_, i) => i !== primary)]
  const shots = game.screenshots.length
  const cols = shots <= 4 ? shots : shots % 3 === 0 ? 3 : 4
  return `
    <div class="page-bg" style="background-image:url('${esc(game.background)}')"></div>
    <article class="page wrap">
      <a class="back" href="#/" data-back>${icon('back')}${L('トップへ', 'Home')}</a>
      <header class="game-head">
        <h1 class="page-title">${esc(game.title)}</h1>
        <p class="game-lead">${esc(tx(game.description))}</p>
      </header>
      <div class="game-hero">
        <span class="game-shot" data-vt-target><img src="${esc(game.cover)}" alt="${esc(L(`${game.title}のゲーム画面`, `${game.title} screenshot`))}"></span>
        <aside class="game-card">
          <div class="dl">
            <h2 class="card-title">${icon('download')}${L('ダウンロード', 'Download')}</h2>
            ${downloads.map((item, i) => `<a class="btn dl-btn ${i ? '' : 'btn-hi'}" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><span class="dl-main"><strong>${esc(item.label)}</strong><small>${esc(tx(item.note))}</small></span><span class="ext">${icon('ext')}</span></a>`).join('')}
            <p class="meta">${L('axfc.net（外部のアップローダー）が開きます。', 'Opens axfc.net, an external file host.')}</p>
          </div>
          <ul class="facts">${game.facts.map(fact => `<li><small>${esc(tx(fact.label))}</small><strong>${esc(fact.value)}</strong></li>`).join('')}</ul>
          <div>
            <h2 class="card-title">${icon('game')}${L('遊び方', 'How to play')}</h2>
            <ul class="plain-list">${game.howToPlay.map(line => `<li>${esc(tx(line))}</li>`).join('')}</ul>
          </div>
        </aside>
      </div>
      <section class="sec">
        <h2 class="sub-head">${L('スクリーンショット', 'Screenshots')}</h2>
        <ul class="gallery" style="--cols:${cols}">${game.screenshots.map((src, i) => `<li><button type="button" data-lightbox="${i}" aria-label="${L(`スクリーンショット ${i + 1} を大きく見る`, `View screenshot ${i + 1}`)}"><img src="${esc(src)}" alt="" loading="lazy"></button></li>`).join('')}</ul>
      </section>
      <section class="sec">
        <h2 class="sub-head">${L('操作方法', 'Controls')}</h2>
        <dl class="controls">${game.controls.map(([action, keys]) => `<div><dt>${esc(tx(action))}</dt><dd>${esc(tx(keys))}</dd></div>`).join('')}</dl>
      </section>
    </article>`
}

function mountGame (root, game) {
  setAmbient(game.cover)
  markDock('games')
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-lightbox]')
    if (button) openLightbox(game.screenshots, Number(button.dataset.lightbox))
  })
}

/* 画像を大きく見る（左右キー・スワイプで前後） */
const lightbox = { images: [], index: 0 }
function openLightbox (images, index) {
  const dialog = $('.lightbox')
  lightbox.images = images
  showLightbox(index)
  dialog.showModal()
}
function showLightbox (index) {
  const dialog = $('.lightbox')
  lightbox.index = (index + lightbox.images.length) % lightbox.images.length
  $('img', dialog).src = lightbox.images[lightbox.index]
  $('.lb-count', dialog).textContent = `${lightbox.index + 1} / ${lightbox.images.length}`
}

/* ---------------------------------------------------------------------------
   画面：小説の目次（本文は日本語のみ。まわりの案内は言語に合わせる）
--------------------------------------------------------------------------- */
function groupChapters (novel) {
  const marks = novel.chapters.filter(item => Number.isFinite(item.from) && item.title).sort((a, b) => a.from - b.from)
  const groups = []
  novel.episodes.forEach((episode, index) => {
    let title = null
    for (const mark of marks) { if (mark.from <= episode.number) title = mark.title; else break }
    const last = groups[groups.length - 1]
    if (last && last.title === title) last.items.push({ episode, index })
    else groups.push({ title, items: [{ episode, index }] })
  })
  return groups
}

function novelView (novel) {
  const last = store.get(`rd-novel-last:${novel.slug}`)
  const lastEpisode = novel.episodes.find(item => item.number === last)
  const groups = groupChapters(novel)
  const openIndex = Math.max(0, groups.findIndex(group => group.items.some(item => item.episode.number === last)))
  const total = novel.episodes.length
  return `
    <article class="page wrap">
      <a class="back" href="#/" data-back>${icon('back')}${L('トップへ', 'Home')}</a>
      <div class="novel-head">
        <a href="#/novel/${esc(novel.slug)}/${novel.episodes[0].number}" data-vt="novel-${esc(novel.slug)}" aria-label="${L('1話から読む', 'Read from episode 1')}">${coverHtml(novel)}</a>
        <div>
          <h1 class="page-title" lang="ja">${esc(novel.title)}</h1>
          <p class="meta" style="margin-top:12px">${L(`全${total}話`, plural(total, 'episode', 'episodes'))}${novel.update ? `　${L(`${day(novel.update.date)} 更新`, `Updated ${day(novel.update.date)}`)}` : ''}${lang() === 'en' ? '　Written in Japanese' : ''}</p>
          ${novel.description ? `<p class="novel-desc" lang="ja">${esc(novel.description)}</p>` : ''}
          <div class="novel-actions">
            ${lastEpisode ? `<a class="btn btn-hi" href="#/novel/${esc(novel.slug)}/${lastEpisode.number}">${icon('book')}${L('続きから', 'Continue')}（<span lang="ja">${esc(lastEpisode.title)}</span>）</a>` : ''}
            <a class="btn ${lastEpisode ? '' : 'btn-hi'}" href="#/novel/${esc(novel.slug)}/${novel.episodes[0].number}">${L('最初から読む', 'Start reading')}</a>
            ${total > 1 ? `<form class="jump" data-jump><label for="jump-input">${L('話数', 'Episode')}</label><input id="jump-input" type="text" inputmode="numeric" autocomplete="off" placeholder="1" enterkeyhint="go"><span>/ ${total}</span><button class="btn btn-hi" type="submit">${L('移動', 'Go')}</button></form>` : ''}
          </div>
        </div>
      </div>
      <div class="chapters">${groups.map((group, g) => `
        <details class="chapter" ${g === openIndex || groups.length === 1 ? 'open' : ''}>
          <summary>${group.title ? `<span lang="ja">${esc(group.title)}</span>` : L('目次', 'Contents')}<span class="meta">${L(`${group.items[0].index + 1}〜${group.items[group.items.length - 1].index + 1}話`, `Ep. ${group.items[0].index + 1}–${group.items[group.items.length - 1].index + 1}`)}</span></summary>
          <ol>${group.items.map(({ episode, index }) => `<li><a href="#/novel/${esc(novel.slug)}/${episode.number}"><span class="meta">${index + 1}</span><span lang="ja">${esc(episode.title)}</span>${episode.number === last ? `<span class="here">${L('前回ここまで', 'Last read')}</span>` : ''}</a></li>`).join('')}</ol>
        </details>`).join('')}
      </div>
    </article>`
}

function mountNovel (root, novel) {
  setAmbient(hueOf(novel.slug))
  markDock('novels')
  const form = $('[data-jump]', root)
  form?.addEventListener('submit', event => {
    event.preventDefault()
    const input = $('input', form)
    const value = Number.parseInt(input.value.normalize('NFKC').replace(/[^\d]/g, ''), 10)
    const total = novel.episodes.length
    if (!Number.isInteger(value) || value < 1 || value > total) { toast(L(`1〜${total} の数字を入れてください`, `Enter a number from 1 to ${total}`)); input.focus(); return }
    navigate(`#/novel/${novel.slug}/${novel.episodes[value - 1].number}`)
  })
}

/* ---------------------------------------------------------------------------
   画面：小説を読む
--------------------------------------------------------------------------- */
const episodeCache = new Map()
async function loadEpisode (slug, number) {
  const key = `${slug}/${number}`
  if (!episodeCache.has(key)) episodeCache.set(key, fetch(`/api/novels/${encodeURIComponent(slug)}/${number}.json`).then(res => res.ok ? res.json() : null).catch(() => null))
  const episode = await episodeCache.get(key)
  if (!episode) episodeCache.delete(key)
  return episode
}

// 読書の設定。mode は 0 = スクロール（はじめの設定）、1 = ページ。tone は紙の色。
// v は設定の形の版。前の版で保存した mode は意味が違うので使わない。
const readerSettings = () => {
  const saved = store.get('rd-reader', {})
  if (saved.v !== 2) { delete saved.mode; saved.v = 2 }
  return Object.assign({ size: 1, lead: 1, font: 0, mode: 0, tone: 0 }, saved)
}
const TONES = ['auto', 'white', 'cream', 'night']

function readerView (novel, position, episode) {
  const settings = readerSettings()
  const paged = settings.mode === 1
  const prev = novel.episodes[position - 1]; const next = novel.episodes[position + 1]
  const link = item => `#/novel/${esc(novel.slug)}/${item.number}`
  const minutes = Math.max(1, Math.round(episode.length / 500))
  const seg = (set, labels) => `<div class="seg" data-set="${set}">${labels.map((label, i) => `<button type="button" data-value="${i}">${label}</button>`).join('')}</div>`
  return `
    <div class="progress"></div>
    <article class="reader tone-${TONES[settings.tone] ?? 'auto'}" data-mode="${paged ? 'page' : 'scroll'}" lang="ja">
      <div class="book">
        <div class="viewport">
          <div class="flow">
            <header class="reader-head">
              <p class="reader-top">${icon('book')}<a href="#/novel/${esc(novel.slug)}">${esc(novel.title)}</a></p>
              <h1>${esc(episode.title)}</h1>
              <p class="meta" lang="${lang()}">${position + 1} / ${novel.episodes.length}　${L(`約${minutes}分`, `About ${minutes} min`)}</p>
            </header>
            <div class="reader-body">${episode.html}</div>
            <nav class="reader-pager" aria-label="${L('前後の話', 'Episodes')}" lang="${lang()}">
              ${prev ? `<a class="prev" href="${link(prev)}" data-turn="-1"><small>${L('← 前の話', '← Previous')}</small><strong lang="ja">${esc(prev.title)}</strong></a>` : ''}
              ${next ? `<a class="next" href="${link(next)}" data-turn="1"><small>${L('次の話 →', 'Next →')}</small><strong lang="ja">${esc(next.title)}</strong></a>` : `<a class="next" href="#/novel/${esc(novel.slug)}"><small>${L('最新話まで読みました', 'You are all caught up')}</small><strong>${L('目次へ', 'Contents')}</strong></a>`}
            </nav>
          </div>
        </div>
        ${next ? `<a class="dogear" href="${link(next)}" data-turn="1" title="${L('めくって次の話へ', 'Turn to the next episode')}" aria-label="${L('紙をめくって次の話へ', 'Turn the page to the next episode')}"></a>` : ''}
      </div>
    </article>
    <nav class="reader-bar" aria-label="${L('読書メニュー', 'Reading menu')}">
      <a class="${prev ? '' : 'off'}" href="${prev ? link(prev) : '#'}" ${prev ? 'data-turn="-1"' : ''} aria-label="${L('前の話', 'Previous episode')}">${icon('left')}</a>
      <a href="#/novel/${esc(novel.slug)}" aria-label="${L('目次', 'Contents')}">${icon('list')}</a>
      <span class="pos" aria-live="polite">${position + 1}/${novel.episodes.length}</span>
      <button type="button" data-action="reader-settings" aria-expanded="false" aria-label="${L('読み方の設定', 'Reading settings')}">${icon('type')}</button>
      <a class="${next ? '' : 'off'}" href="${next ? link(next) : '#'}" ${next ? 'data-turn="1"' : ''} aria-label="${L('次の話', 'Next episode')}">${icon('right')}</a>
    </nav>
    <div class="settings" hidden>
      <div class="set-row"><span>${L('めくり方', 'Layout')}</span>${seg('mode', L(['スクロール', 'ページ'], ['Scroll', 'Pages']))}</div>
      <div class="set-row"><span>${L('紙', 'Paper')}</span>${seg('tone', L(['自動', '白', '生成り', '夜'], ['Auto', 'White', 'Cream', 'Night']))}</div>
      <div class="set-row"><span>${L('文字の大きさ', 'Text size')}</span>${seg('size', L(['小', '中', '大', '特大'], ['S', 'M', 'L', 'XL']))}</div>
      <div class="set-row"><span>${L('行間', 'Line spacing')}</span>${seg('lead', L(['狭い', '標準', '広い'], ['Tight', 'Normal', 'Wide']))}</div>
      <div class="set-row"><span>${L('書体', 'Typeface')}</span>${seg('font', L(['ゴシック', '明朝'], ['Sans', 'Serif']))}</div>
    </div>`
}

function mountReader (root, novel, position, { resume = true, quiet = false, startAt = null } = {}) {
  setAmbient(hueOf(novel.slug))
  markDock('novels')
  const episode = novel.episodes[position]
  const ctx = {
    root, novel, position, episode, resume, quiet, startAt,
    prev: novel.episodes[position - 1], next: novel.episodes[position + 1],
    reader: $('.reader', root), body: $('.reader-body', root), progress: $('.progress', root),
    bar: $('.reader-bar', root), panel: $('.settings', root),
    key: `rd-novel-pos:${novel.slug}:${episode.number}`,
    settings: readerSettings(),
    relayout: () => {}
  }
  store.set(`rd-novel-last:${novel.slug}`, episode.number)
  // 文字・紙の設定
  const sizes = ['.98rem', '1.06rem', '1.2rem', '1.36rem']; const leads = [1.8, 2.05, 2.35]
  const apply = () => {
    const { settings, reader } = ctx
    reader.style.setProperty('--size', sizes[settings.size]); reader.style.setProperty('--lead', leads[settings.lead])
    ctx.body.classList.toggle('mincho', settings.font === 1)
    reader.className = `reader tone-${TONES[settings.tone] ?? 'auto'}`
    $$('.seg', root).forEach(seg => $$('button', seg).forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.value) === settings[seg.dataset.set]))))
    store.set('rd-reader', settings)
  }
  apply()
  const toggle = $('[data-action="reader-settings"]', root)
  toggle.addEventListener('click', () => { ctx.panel.hidden = !ctx.panel.hidden; toggle.setAttribute('aria-expanded', String(!ctx.panel.hidden)) })
  ctx.panel.addEventListener('click', event => {
    const button = event.target.closest('.seg button')
    if (!button) return
    const set = button.closest('.seg').dataset.set
    const value = Number(button.dataset.value)
    if (ctx.settings[set] === value) return
    ctx.settings[set] = value
    apply()
    // めくり方を変えたときは、読んでいた位置を保ったまま作り直す
    if (set === 'mode') { ctx.save?.(); render({ quiet: true }); return }
    ctx.relayout()
  })
  if (ctx.settings.mode === 1) mountPaged(ctx)
  else mountScrolled(ctx)
}

/* スクロールで読む：長い1枚の紙。下に読み進め、前後の話へは紙をめくって移る（スワイプ・← →・リンク・右下の折り返し） */
function mountScrolled (ctx) {
  const { root, novel, prev, next, body, reader, bar, panel, progress, key } = ctx
  const topBar = $('.bar')
  const toggle = $('[data-action="reader-settings"]', root)
  let lastY = scrollY; let frame = 0; let saveTimer
  const hide = away => { bar.classList.toggle('away', away); topBar.classList.toggle('away', away); if (away) { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false') } }
  const save = () => { const max = document.documentElement.scrollHeight - innerHeight; store.set(key, max > 0 ? scrollY / max : 0) }
  ctx.save = save
  const onScroll = () => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      const max = document.documentElement.scrollHeight - innerHeight
      progress.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max) : 1)
      if (scrollY < 80 || max - scrollY < 120) hide(false)
      else if (scrollY - lastY > 10) hide(true)
      else if (lastY - scrollY > 10) hide(false)
      if (Math.abs(scrollY - lastY) > 10) lastY = scrollY
      clearTimeout(saveTimer)
      saveTimer = setTimeout(save, 300)
    })
  }
  addEventListener('scroll', onScroll, { passive: true })
  onCleanup(() => { removeEventListener('scroll', onScroll); topBar.classList.remove('away'); clearTimeout(saveTimer) })
  body.addEventListener('click', () => { if (!getSelection().toString()) hide(!bar.classList.contains('away')) })
  // スワイプ：左へなぞると、いまの紙が指についてきて、下から次の話の紙が見えてくる。離すと次の話へ。
  // 右へなぞると、前の話の紙が左から指についてくる。
  const hashOf = item => `#/novel/${novel.slug}/${item.number}`
  const ready = { next: null, prev: null }
  if (next) loadEpisode(novel.slug, next.number).then(item => { ready.next = item })
  if (prev) loadEpisode(novel.slug, prev.number).then(item => { ready.prev = item })
  let touch = null
  const hint = document.createElement('div')
  reader.addEventListener('touchstart', event => {
    const point = event.touches[0]
    touch = event.touches.length === 1 && !turning && point.clientX > 24 && point.clientX < innerWidth - 24 ? { x: point.clientX, y: point.clientY, axis: '', time: performance.now() } : null
  }, { passive: true })
  reader.addEventListener('touchmove', event => {
    if (!touch) return
    const dx = event.touches[0].clientX - touch.x; const dy = event.touches[0].clientY - touch.y
    if (!touch.axis) {
      if (Math.abs(dy) > 10 && Math.abs(dy) >= Math.abs(dx)) { touch = null; return }
      if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.6 && !getSelection().toString()) touch.axis = 'x'; else return
    }
    const dir = dx < 0 ? 1 : -1
    if (touch.dir && touch.dir !== dir && touch.drag) { touch.drag.cancel(); touch.drag = null }
    touch.dir = dir
    const target = dir > 0 ? next : prev
    const episode = dir > 0 ? ready.next : ready.prev
    const speed = Math.abs(dx) / Math.max(1, performance.now() - touch.time)
    touch.target = target
    touch.armed = Boolean(target) && (Math.abs(dx) > 80 || speed > .6)
    if (target && episode && !reduced.matches) {
      touch.drag ??= sheetDrag(dir, reader, novel, ctx.position + dir, episode)
      touch.drag.move(dx)
    }
    showEdgeHint(hint, dir > 0, target, touch.armed)
  }, { passive: true })
  const endTouch = event => {
    const current = touch
    touch = null
    hint.remove()
    if (!current) return
    if (event.type === 'touchend' && current.armed && current.target) { turnEpisode(current.dir, hashOf(current.target), current.drag ?? null); return }
    current.drag?.cancel()
  }
  reader.addEventListener('touchend', endTouch)
  reader.addEventListener('touchcancel', endTouch)
  onCleanup(() => hint.remove())
  const onKey = event => {
    if (event.target.closest('input, textarea, dialog[open]') || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'ArrowRight' && next) turnEpisode(1, hashOf(next))
    if (event.key === 'ArrowLeft' && prev) turnEpisode(-1, hashOf(prev))
  }
  addEventListener('keydown', onKey)
  onCleanup(() => removeEventListener('keydown', onKey))
  // 前回の位置から
  const ratio = store.get(key)
  // めくり方を切り替えたとき（quiet）は、最後のあたりにいても同じ位置へ戻す
  if (ctx.resume && typeof ratio === 'number' && (ctx.quiet ? ratio > 0 : ratio > .03 && ratio < .97)) {
    requestAnimationFrame(() => {
      scrollTo(0, ratio * (document.documentElement.scrollHeight - innerHeight))
      if (!ctx.quiet) toast(L('前回の続きから表示しています', 'Resumed where you left off'), { label: L('最初から', 'From the top'), run: () => scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' }) })
    })
  }
  onScroll()
}

/* 紙を重ねて前後の話へ（スクロールで読むとき）
   次へ：いまの紙を左へ引き抜くと、その下に次の話の紙がある。
   前へ：前の話の紙が左から滑ってきて、いまの紙の上に重なる。
   重ねる紙は、その話をいちばん上から開いたときと同じ形で作るので、引き抜き終わって本物に入れ替えても見た目が変わらない。 */
function sheetLayer (reader, novel, position, episode, kind) {
  const layer = document.createElement('div')
  layer.className = `sheet-layer ${kind}`
  layer.setAttribute('aria-hidden', 'true')
  layer.inert = true
  // スクロールバーの幅を除いた、本物のページと同じ幅にする
  layer.style.width = `${document.documentElement.clientWidth}px`
  const box = document.createElement('div')
  box.innerHTML = readerView(novel, position, episode)
  const copy = $('.reader', box)
  copy.className = reader.className
  copy.setAttribute('style', reader.getAttribute('style') ?? '')
  $('.reader-body', copy).classList.toggle('mincho', $('.reader-body', reader).classList.contains('mincho'))
  layer.append(copy)
  return layer
}
function sheetDrag (dir, reader, novel, position, episode) {
  const layer = sheetLayer(reader, novel, position, episode, dir > 0 ? 'under' : 'over')
  // 次の話の紙はいまの紙の下に、前の話の紙は上に（読書バーよりは下）
  if (dir > 0) document.body.insertBefore(layer, $('#view')); else $('#view').append(layer)
  const moving = dir > 0 ? $('.book', reader) : $('.book', layer)
  const rect = moving.getBoundingClientRect()
  const distance = rect.right + 48
  // 見えている部分の真ん中を中心に、少しだけ傾ける
  const middle = (Math.max(rect.top, 0) + Math.min(rect.bottom, innerHeight)) / 2
  moving.style.transformOrigin = `${rect.width / 2}px ${middle - rect.top}px`
  moving.classList.add('lifting')
  const at = x => `translateX(${x.toFixed(1)}px) rotate(${(x / distance * 3.2).toFixed(3)}deg)`
  const rest = dir > 0 ? 0 : -distance
  let x = rest
  const set = value => { x = value; moving.style.transform = at(x) }
  const glide = (to, ms, easing) => {
    const animation = moving.animate([{ transform: at(x) }, { transform: at(to) }], { duration: ms, easing, fill: 'forwards' })
    return animation.finished.then(() => { set(to); animation.cancel() })
  }
  set(rest)
  return {
    layer,
    // 指の動き（dx）に合わせる。次へは左へ、前へは左から右へ。
    move (dx) { set(dir > 0 ? Math.min(0, dx) : Math.min(0, -distance + Math.max(0, dx))) },
    finish () {
      const to = dir > 0 ? -distance : 0
      return glide(to, 180 + 420 * Math.abs(to - x) / distance, 'cubic-bezier(.35,.1,.25,1)')
    },
    cancel () {
      glide(rest, 260, 'cubic-bezier(.2,.8,.2,1)').then(() => {
        layer.remove()
        if (dir > 0) { moving.classList.remove('lifting'); moving.style.transform = ''; moving.style.transformOrigin = '' }
      })
    }
  }
}
let turning = false
async function turnEpisode (dir, hash, drag = null) {
  if (turning) return
  const reader = $('.reader[data-mode="scroll"]')
  if (!reader || reduced.matches) { drag?.cancel(); navigate(hash); return }
  turning = true
  try {
    const route = parseRoute(hash)
    const novel = state.data.novels.find(item => item.slug === route.slug)
    const position = novel ? novel.episodes.findIndex(item => item.number === route.number) : -1
    const episode = position >= 0 ? await loadEpisode(novel.slug, route.number) : null
    if (!episode) { drag?.cancel(); navigate(hash); return }
    const sheet = drag ?? sheetDrag(dir, reader, novel, position, episode)
    await sheet.finish()
    // 引き抜き終わったら、本物の次の話（いちばん上から）に入れ替える
    history.pushState(null, '', hash)
    state.cameFromHome = false
    await render({ episode, keepScroll: 0 })
    sheet.layer.remove()
    $('#view').focus({ preventScroll: true })
  } finally {
    turning = false
  }
}

function showEdgeHint (hint, goingNext, target, armed) {
  hint.className = `swipe-hint ${goingNext ? 'next' : 'prev'} ${armed ? 'armed' : ''}`
  hint.textContent = target ? `${goingNext ? L('次の話へ →', 'Next episode →') : L('← 前の話へ', '← Previous episode')}　${target.title}` : (goingNext ? L('最新話です', 'Latest episode') : L('最初の話です', 'First episode'))
  if (!hint.isConnected) document.body.append(hint)
}

/* ---------------------------------------------------------------------------
   ページで読む：本のように1ページずつ（広い画面は見開き）。
   本文は CSS の段組で紙の大きさに区切り、段を横にずらしてページを送る。
   めくるときは、いまのページの写しを紙として重ね、背（とじ側）を軸に回す。
--------------------------------------------------------------------------- */
function mountPaged (ctx) {
  const { novel, reader, progress, key, bar } = ctx
  const doc = document.documentElement
  $('.bar').classList.remove('away')
  doc.classList.add('paged')
  onCleanup(() => doc.classList.remove('paged'))
  const book = $('.book', reader)
  const viewport = $('.viewport', book)
  const flow = $('.flow', viewport)
  book.insertAdjacentHTML('afterbegin', '<div class="sheet paper side-l"><span class="folio"></span></div><div class="sheet paper side-r"><span class="folio"></span></div><div class="cast" aria-hidden="true"></div>')
  const sheetL = $('.side-l', book); const sheetR = $('.side-r', book); const cast = $('.cast', book)
  const pos = $('.pos', bar)
  let geo = { spread: false, pageW: 0, pageH: 0, step: 1 }
  let page = 0; let total = 1; let turn = null; let saveTimer

  // 紙の大きさを決め、段組にしてページ数を数える
  const layout = () => {
    const vw = innerWidth; const vh = innerHeight
    const top = Math.max(0, $('.bar').getBoundingClientRect().bottom) + 14
    const bottom = vh - bar.getBoundingClientRect().top + 14
    const availW = vw - (vw < 600 ? 24 : 72); const availH = Math.max(300, vh - top - bottom)
    const fontPx = Number.parseFloat(getComputedStyle(ctx.body).fontSize) || 17
    const spread = availW >= 920 && availH >= 460
    let pageW = spread ? Math.min(availW / 2, fontPx * 36 + 120) : Math.min(availW, fontPx * 38 + 80)
    let pageH = availH
    if (spread) { pageH = Math.min(availH, pageW * 1.42); pageW = Math.min(pageW, pageH * .9) } else if (vw >= 600) pageH = Math.min(availH, pageW * 1.5)
    pageW = Math.floor(pageW); pageH = Math.floor(pageH)
    const pad = Math.round(Math.min(56, Math.max(20, pageW * .085)))
    const padTop = Math.round(pad * .9); const padBottom = pad + 18
    geo = { spread, pageW, pageH, step: spread ? 2 : 1, pad }
    book.dataset.spread = String(spread)
    const vars = { '--page-w': pageW, '--page-h': pageH, '--book-w': spread ? pageW * 2 : pageW, '--pad': pad, '--pad-top': padTop, '--pad-bottom': padBottom, '--col-w': pageW - pad * 2, '--book-top': Math.round(top + (availH - pageH) / 2) }
    for (const [name, value] of Object.entries(vars)) book.style.setProperty(name, `${value}px`)
    // 最後の要素がどの段に入ったかで、ページ数を出す
    flow.style.transform = 'none'
    const left = flow.getBoundingClientRect().left
    const last = flow.lastElementChild.getBoundingClientRect()
    total = Math.max(1, Math.floor((last.right - left - 1) / pageW) + 1)
  }
  const align = p => {
    const max = geo.spread ? Math.max(0, total - 1 - ((total - 1) % 2)) : total - 1
    p = Math.max(0, Math.min(max, p))
    return geo.spread ? p - (p % 2) : p
  }
  const lastPage = () => align(total - 1)
  // 端の紙の重なり（読んだ分と残りの分）
  const edges = (count, side) => {
    const list = []
    for (let i = 1; i <= count; i++) list.push(`${side * i * 1.6}px ${i * .8}px 0 0 ${i % 2 ? 'var(--paper-edge)' : 'var(--paper)'}`)
    list.push('0 26px 50px -26px rgb(0 0 0 / .55)', '0 2px 6px rgb(0 0 0 / .12)')
    return list.join(', ')
  }
  const setPage = p => {
    page = align(p)
    flow.style.transform = `translateX(${-page * geo.pageW}px)`
    $('.folio', sheetL).textContent = page + 1
    $('.folio', sheetR).textContent = geo.spread && page + 1 < total ? page + 2 : ''
    const read = Math.min(5, Math.ceil(page / 6)); const left = Math.min(5, Math.ceil((total - page - geo.step) / 6))
    if (geo.spread) { sheetL.style.boxShadow = edges(read, -1); sheetR.style.boxShadow = edges(left, 1) } else sheetL.style.boxShadow = edges(left, 1)
    progress.style.setProperty('--p', total > geo.step ? Math.min(1, (page + geo.step) / total) : 1)
    pos.textContent = `${page + 1}${geo.spread && page + 1 < total ? `–${page + 2}` : ''} / ${total}`
    pos.setAttribute('aria-label', L(`${total}ページ中 ${page + 1}ページ目`, `Page ${page + 1} of ${total}`))
    clearTimeout(saveTimer)
    saveTimer = setTimeout(save, 250)
  }
  const save = () => store.set(key, total > 1 ? page / (total - 1) : 0)
  ctx.save = save
  onCleanup(() => clearTimeout(saveTimer))
  const relayout = () => {
    const ratio = total > 1 ? page / (total - 1) : 0
    turn?.jump()
    layout()
    setPage(Math.round(ratio * (total - 1)))
  }
  ctx.relayout = relayout

  // --- めくり ---------------------------------------------------------------
  // ページ i を写した紙（重ねる用）
  const face = (i, side) => {
    const el = document.createElement('div')
    el.className = `face paper side-${side}`
    if (i >= 0 && i < total) {
      const copy = flow.cloneNode(true)
      copy.setAttribute('aria-hidden', 'true')
      copy.inert = true
      copy.style.transform = `translateX(${-i * geo.pageW}px)`
      el.append(copy)
      el.insertAdjacentHTML('beforeend', `<span class="folio">${i + 1}</span>`)
    }
    el.insertAdjacentHTML('beforeend', '<span class="shade"></span>')
    return el
  }
  const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
  const easeOut = k => 1 - Math.pow(1 - k, 3)
  // dir: 1 = 次へ、-1 = 前へ。t（0〜1）でめくり具合を決める。
  function makeTurn (dir) {
    const from = page; const to = align(page + dir * geo.step)
    const layers = []
    const leaf = document.createElement('div')
    leaf.className = 'leaf'
    let front; let back; let angleAt
    if (geo.spread) {
      // 見開き：右の紙が背を軸に左へ（前へは逆）。紙の裏が次の見開きの左ページ。
      if (dir > 0) {
        front = face(from + 1, 'r'); back = face(to, 'l')
        const keep = face(from, 'l'); keep.classList.add('cover'); layers.push(keep)
        angleAt = t => -180 * t
      } else {
        front = face(to + 1, 'r'); back = face(from, 'l')
        const keep = face(from + 1, 'r'); keep.classList.add('cover', 'at-r'); layers.push(keep)
        angleAt = t => -180 * (1 - t)
      }
      leaf.classList.add('at-r')
    } else {
      // 1ページ：左端（とじ側）を軸に、紙が向こうへめくれていく
      if (dir > 0) { front = face(from, 'l'); angleAt = t => -112 * t } else { front = face(to, 'l'); angleAt = t => -112 * (1 - t) }
      back = face(-1, 'l')
    }
    back.classList.add('back')
    leaf.append(front, back)
    for (const layer of layers) book.append(layer)
    book.append(leaf)
    // 見開きと1ページの「次へ」は、下の本体を先に新しいページにしておく
    if (geo.spread || dir > 0) setPage(to)
    const frontShade = $('.shade', front); const backShade = $('.shade', back)
    let raf = 0
    const api = {
      t: 0,
      set (t) {
        api.t = t
        const angle = angleAt(t)
        const lift = Math.sin(Math.abs(angle) * Math.PI / 180)
        leaf.style.transform = `rotateY(${angle}deg)`
        frontShade.style.opacity = (lift * .55).toFixed(3)
        backShade.style.opacity = (lift * .4).toFixed(3)
        cast.style.opacity = (lift * (geo.spread ? .5 : .8)).toFixed(3)
        if (!geo.spread) leaf.style.opacity = dir > 0 ? (t > .72 ? Math.max(0, 1 - (t - .72) / .28) : 1) : (t < .28 ? t / .28 : 1)
      },
      run (target, ms, curve = ease, done) {
        cancelAnimationFrame(raf)
        const start = performance.now(); const begin = api.t
        const step = now => {
          const k = Math.min(1, (now - start) / ms)
          api.set(begin + (target - begin) * curve(k))
          if (k < 1) raf = requestAnimationFrame(step); else done()
        }
        raf = requestAnimationFrame(step)
      },
      end (completed) {
        cancelAnimationFrame(raf)
        leaf.remove(); layers.forEach(layer => layer.remove())
        cast.style.opacity = '0'
        if (completed && !geo.spread && dir < 0) setPage(to)
        if (!completed) setPage(from)
        if (turn === api) turn = null
      },
      finish (ms = 560, curve = ease) { api.run(1, ms * (1 - api.t) + 80, curve, () => api.end(true)) },
      cancel () { api.run(0, 260 * api.t + 60, easeOut, () => api.end(false)) },
      jump () { api.end(true) }
    }
    api.set(0)
    return api
  }
  const go = dir => {
    turn?.jump()
    const target = page + dir * geo.step
    if (target < 0) { if (ctx.prev) navigate(`#/novel/${novel.slug}/${ctx.prev.number}`, { startAt: 'end' }); else toast(L('最初のページです', 'This is the first page')); return }
    if (target >= total) { if (ctx.next) navigate(`#/novel/${novel.slug}/${ctx.next.number}`); else toast(L('最新話まで読みました', 'You are all caught up')); return }
    if (reduced.matches) { setPage(target); return }
    turn = makeTurn(dir)
    turn.finish()
  }

  // --- 操作 ---------------------------------------------------------------
  // キー：→・スペース・PageDown で次、← ・PageUp で前。Home と End で最初と最後。
  const onKey = event => {
    if (event.target.closest('input, textarea, dialog[open], .settings') || event.altKey || event.ctrlKey || event.metaKey) return
    const onButton = event.target.closest('a, button')
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey && !onButton)) { event.preventDefault(); go(1) }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey && !onButton)) { event.preventDefault(); go(-1) }
    if (event.key === 'Home') { event.preventDefault(); turn?.jump(); setPage(0) }
    if (event.key === 'End') { event.preventDefault(); turn?.jump(); setPage(lastPage()) }
  }
  addEventListener('keydown', onKey)
  onCleanup(() => removeEventListener('keydown', onKey))
  // ホイール：少しまとめて回したら1回めくる
  let wheel = 0; let wheelLock = 0
  const onWheel = event => {
    if (event.target.closest('.settings, dialog')) return
    event.preventDefault()
    if (performance.now() < wheelLock) return
    wheel += Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX
    if (Math.abs(wheel) > 50) { go(wheel > 0 ? 1 : -1); wheel = 0; wheelLock = performance.now() + 420 }
  }
  addEventListener('wheel', onWheel, { passive: false })
  onCleanup(() => removeEventListener('wheel', onWheel))
  // クリック・タップ：見開きは左右の紙、1ページは左右の端のあたり
  let suppressClick = 0
  book.addEventListener('click', event => {
    if (performance.now() < suppressClick || event.target.closest('a, button') || getSelection().toString()) return
    const rect = book.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width
    if (geo.spread) go(x < .5 ? -1 : 1)
    else if (x < .3) go(-1)
    else if (x > .62) go(1)
  })
  // 指でめくる：紙が指についてくる
  let touch = null
  const hint = document.createElement('div')
  onCleanup(() => hint.remove())
  book.addEventListener('touchstart', event => {
    touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY, time: performance.now(), dir: 0, turn: null } : null
  }, { passive: true })
  book.addEventListener('touchmove', event => {
    if (!touch) return
    const dx = event.touches[0].clientX - touch.x; const dy = event.touches[0].clientY - touch.y
    if (!touch.dir) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return
      touch.dir = dx < 0 ? 1 : -1
      turn?.jump()
      const target = page + touch.dir * geo.step
      if (target >= 0 && target < total && !reduced.matches) { touch.turn = makeTurn(touch.dir); turn = touch.turn }
      else touch.edge = touch.dir > 0 ? ctx.next ?? null : ctx.prev ?? null
    }
    event.preventDefault()
    const amount = Math.min(1, Math.max(0, (touch.dir > 0 ? -dx : dx) / (geo.spread ? geo.pageW * 1.3 : geo.pageW * .8)))
    if (touch.turn) touch.turn.set(amount)
    else { touch.armed = Boolean(touch.edge) && amount > .3; showEdgeHint(hint, touch.dir > 0, touch.edge, touch.armed) }
  }, { passive: false })
  const endTouch = () => {
    if (!touch) return
    const { turn: current, dir, armed, edge } = touch
    if (dir) suppressClick = performance.now() + 450
    if (current) {
      const speed = (current.t * geo.pageW) / Math.max(1, performance.now() - touch.time)
      if (current.t > .32 || (speed > .45 && current.t > .06)) current.finish(420, easeOut); else current.cancel()
    } else if (dir) {
      hint.remove()
      if (armed && edge) navigate(`#/novel/${novel.slug}/${edge.number}`, dir < 0 ? { startAt: 'end' } : {})
    }
    touch = null
  }
  book.addEventListener('touchend', endTouch)
  book.addEventListener('touchcancel', endTouch)
  // Tab で隠れたページのリンクに来たら、そのページを開く
  flow.addEventListener('focusin', event => {
    const left = viewport.getBoundingClientRect().left
    const rect = event.target.getBoundingClientRect()
    const offset = Math.floor((rect.left - left + page * geo.pageW) / geo.pageW)
    if (offset !== page && offset !== page + 1) { viewport.scrollLeft = 0; setPage(offset) }
  })
  viewport.addEventListener('scroll', () => { viewport.scrollLeft = 0 })

  // --- はじめの表示 ---------------------------------------------------------
  let resizeTimer
  const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(relayout, 120) }
  addEventListener('resize', onResize)
  onCleanup(() => { removeEventListener('resize', onResize); clearTimeout(resizeTimer); turn?.jump() })
  layout()
  const ratio = store.get(key)
  if (ctx.startAt === 'end') setPage(lastPage())
  else if (ctx.resume && typeof ratio === 'number' && ratio > 0) {
    setPage(Math.round(ratio * (total - 1)))
    if (!ctx.quiet && page > 0 && page < lastPage()) toast(L('前回の続きから表示しています', 'Resumed where you left off'), { label: L('最初から', 'From the top'), run: () => { turn?.jump(); setPage(0) } })
  } else setPage(0)
  // 文字の読み込みが終わったら、ページを数え直す
  document.fonts?.ready.then(() => { if (book.isConnected) relayout() })
}

/* ---------------------------------------------------------------------------
   セクションの移動：下の移動ボタン（スマホ・タブレット）と左の目次（マウスのPC）
--------------------------------------------------------------------------- */
let currentSec = null
const currentSection = () => document.querySelector(`[data-sec="${currentSec}"]`)
function markDock (sec) {
  currentSec = sec
  const dock = $('.dock'); const pill = $('.dock-pill', dock)
  let hit = null
  $$('a', dock).forEach(link => { const on = link.dataset.goto === sec; link.setAttribute('aria-current', String(on)); if (on) hit = link })
  if (hit && hit.offsetWidth) {
    pill.style.width = `${hit.offsetWidth}px`
    pill.style.translate = `${hit.offsetLeft}px 0`
    pill.style.top = `${hit.offsetTop}px`
    pill.style.opacity = '1'
  } else pill.style.opacity = '0'
  let railHit = null
  $$('.rail a').forEach(link => { const on = link.dataset.goto === sec; link.setAttribute('aria-current', String(on)); if (on) railHit = link })
  const railPill = $('.rail-pill')
  if (railPill) {
    if (railHit) { railPill.style.translate = `0 ${railHit.offsetTop}px`; railPill.style.opacity = '1' } else railPill.style.opacity = '0'
  }
  scheduleScrollUi()
}

// 見出しがバーのすぐ下に来るように移動する。画像や文字の読み込みで位置がずれたら、着いたあとに合わせ直す。
let stopJump = () => {}
function jumpTo (id, smooth) {
  stopJump()
  const section = document.getElementById(id)
  if (!section) return
  const target = $('.sec-head', section) ?? section
  const goal = () => {
    const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
    const max = document.documentElement.scrollHeight - innerHeight
    return Math.round(Math.min(max, Math.max(0, target.getBoundingClientRect().top + scrollY - margin)))
  }
  const behavior = smooth && !reduced.matches ? 'smooth' : 'auto'
  scrollTo({ top: goal(), behavior })
  // 途中で自分でスクロールしたら、合わせ直しはしない
  const cancelOn = ['wheel', 'touchstart', 'keydown']
  let timer = 0; let tries = 0
  const stop = () => { clearTimeout(timer); cancelOn.forEach(type => removeEventListener(type, stop)); removeEventListener('scrollend', onEnd); stopJump = () => {} }
  const settle = () => {
    const want = goal()
    if (Math.abs(want - scrollY) > 2 && tries++ < 4) { scrollTo({ top: want, behavior: 'auto' }); timer = setTimeout(settle, 160) } else stop()
  }
  const onEnd = () => { clearTimeout(timer); timer = setTimeout(settle, 80) }
  cancelOn.forEach(type => addEventListener(type, stop, { passive: true }))
  if (behavior === 'smooth') { addEventListener('scrollend', onEnd); timer = setTimeout(settle, 1400) } else timer = setTimeout(settle, 120)
  stopJump = stop
}

// いちばん上へのボタンと、目次の進み具合
let scrollFrame = 0
function updateScrollUi () {
  scrollFrame = 0
  const route = document.body.dataset.route
  if (route === 'home') spyHome()
  const max = document.documentElement.scrollHeight - innerHeight
  const top = $('.to-top')
  const on = route !== 'reader' && scrollY > innerHeight * .8
  top.style.setProperty('--p', max > 0 ? Math.min(1, Math.max(0, scrollY / max)).toFixed(4) : '0')
  if (top.classList.contains('on') !== on) {
    top.classList.toggle('on', on)
    top.tabIndex = on ? 0 : -1
    top.setAttribute('aria-hidden', String(!on))
  }
  // 目次の札の下の細い線：トップではそのセクションの、ほかのページではページ全体の進み具合
  const rail = $('.rail'); const railLink = $('.rail a[aria-current="true"]')
  let p = 0
  if (railLink && route === 'home') {
    const section = document.getElementById(railLink.dataset.goto)
    if (section) {
      const rect = section.getBoundingClientRect()
      p = max - scrollY < 4 ? 1 : Math.min(1, Math.max(0, (innerHeight * .5 - rect.top) / rect.height))
    }
  } else if (railLink) p = max > 0 ? Math.min(1, scrollY / max) : 1
  rail.style.setProperty('--p', p.toFixed(3))
}
function scheduleScrollUi () { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollUi) }

/* ---------------------------------------------------------------------------
   言語に合わせて、画面の外枠（バー・目次・探す・画像の拡大）の文字を入れる
--------------------------------------------------------------------------- */
const chrome = {
  skip: ['本文へ移動', 'Skip to content'], search: ['探す', 'Search'],
  pick: ['選ぶ', 'Select'], open: ['開く', 'Open'], close: ['閉じる', 'Close']
}
function applyChrome () {
  const data = state.data
  $$('[data-t]').forEach(el => { el.textContent = L(...chrome[el.dataset.t]) })
  $('.logo').setAttribute('aria-label', L('針の筵 トップへ', 'Hari no Mushiro — home'))
  $('.search-btn').setAttribute('aria-label', L('作品を探す（Ctrl+K）', 'Search works (Ctrl+K)'))
  const langButton = $('.lang-btn')
  langButton.textContent = L('EN', 'JA')
  langButton.lang = L('en', 'ja')
  langButton.setAttribute('aria-label', L('Switch to English', '日本語に切り替える'))
  $('[data-action="theme"]').setAttribute('aria-label', L('明るさを切り替える', 'Switch light and dark'))
  $('.palette').setAttribute('aria-label', L('作品を探す', 'Search works'))
  $('.palette input').placeholder = L('曲名、商品、ゲーム、話のタイトル…', 'Songs, items, games, episode titles…')
  $('.lightbox').setAttribute('aria-label', L('スクリーンショット', 'Screenshot'))
  $('.lb-close').setAttribute('aria-label', L('閉じる', 'Close'))
  $('.lb-prev').setAttribute('aria-label', L('前の画像', 'Previous image'))
  $('.lb-next').setAttribute('aria-label', L('次の画像', 'Next image'))
  $('.to-top').setAttribute('aria-label', L('いちばん上へ', 'Back to top'))
  const sections = sectionsFor(data)
  const dock = $('.dock')
  dock.setAttribute('aria-label', L('セクション', 'Sections'))
  $$('a', dock).forEach(link => link.remove())
  dock.insertAdjacentHTML('beforeend', sections.filter(sec => !sec.railOnly).map(sec => `<a href="#/${sec.id}" data-goto="${sec.id}">${icon(sec.icon)}<span>${L(sec.ja, sec.en)}</span></a>`).join(''))
  const rail = $('.rail')
  rail.setAttribute('aria-label', L('セクション', 'Sections'))
  rail.innerHTML = `<span class="rail-pill" aria-hidden="true"><i></i></span><ol>${sections.map((sec, i) => `<li><a href="#/${sec.id}" data-goto="${sec.id}" style="--n:${i}">${icon(sec.icon)}<span class="rail-label">${L(sec.ja, sec.en)}</span></a></li>`).join('')}</ol>`
  markDock(currentSec)
}

// 言語を切り替えると文の長さが変わるので、位置は数字ではなく「画面の上にあった要素」で覚えて戻す。
// 画面の作りは日本語と英語で同じなので、#view からの並び順でその要素を探し直せる。
function captureAnchor () {
  const view = $('#view')
  const line = Math.max(0, $('.bar').getBoundingClientRect().bottom) + 12
  let el = document.elementFromPoint(innerWidth / 2, line)
  while (el && el !== view && (!view.contains(el) || getComputedStyle(el).display === 'inline')) el = el.parentElement
  if (!el || el === view) return null
  const path = []
  for (let node = el; node !== view; node = node.parentElement) path.unshift([...node.parentElement.children].indexOf(node))
  const rect = el.getBoundingClientRect()
  return { path, line, frac: rect.height ? (line - rect.top) / rect.height : 0 }
}
function restoreAnchor (anchor) {
  let el = $('#view')
  for (const index of anchor.path) { el = el?.children[index]; if (!el) return }
  const rect = el.getBoundingClientRect()
  scrollTo(0, scrollY + rect.top + anchor.frac * rect.height - anchor.line)
}

function setLang (next) {
  if (next === lang()) return
  store.set('rd-lang', next)
  // URL の ?lang= は最初の1回だけ使う。切り替えたあとは、保存した設定のほうを優先する。
  const url = new URL(location.href)
  if (url.searchParams.has('lang')) { url.searchParams.delete('lang'); history.replaceState(history.state, '', url) }
  const y = scrollY
  const anchor = document.body.dataset.route === 'reader' ? null : captureAnchor()
  const update = async () => {
    document.documentElement.lang = next
    applyChrome()
    buildIndex(state.data)
    await render({ keepScroll: y, quiet: true })
    if (anchor) { restoreAnchor(anchor); requestAnimationFrame(() => restoreAnchor(anchor)) }
  }
  if (document.startViewTransition && !reduced.matches) document.startViewTransition(update)
  else update()
}

/* ---------------------------------------------------------------------------
   探す（Ctrl+K）
--------------------------------------------------------------------------- */
let searchIndex = []
function buildIndex (data) {
  const go = (hash, sec) => () => navigate(hash, { section: sec })
  const open = url => () => window.open(url, '_blank', 'noopener')
  const items = [
    ...sectionsFor(data).map(sec => ({ type: 'section', title: L(sec.ja, sec.en), sub: L('このページの中へ移動', 'Jump to section'), icon: sec.icon, also: `${sec.ja} ${sec.en}`, run: go('#/', sec.id) })),
    ...data.goods.map(item => ({ type: 'shop', title: goodsName(item), also: item.name, sub: `${kindLabel('shop')}　${price(item.price)}`, thumb: item.image, icon: 'bag', run: open(item.url) })),
    ...data.releases.map((item, i) => ({ type: 'music', title: releaseTitle(item), sub: `${kindLabel('music')}　${day(item.releaseDate)}　${otherTitle(item)}`, thumb: item.artwork, icon: 'music', also: `${item.title} ${item.titleEn ?? ''}`, run: () => { state.shelfIndex = i; navigate('#/', { section: 'music', shelf: i }) } })),
    ...data.games.map(game => ({ type: 'game', title: game.title, sub: `${L('ゲーム', 'Game')}　${L('ゆめにっき二次創作', 'Yume Nikki fan game')}`, thumb: game.cover, icon: 'game', run: go(`#/game/${game.slug}`) })),
    ...data.illustrations.map(item => ({ type: 'art', title: item.title, sub: `${kindLabel('art')}　${day(item.postedAt)}`, thumb: item.image, icon: 'brush', run: open(item.pixivUrl) })),
    ...data.novels.map(novel => ({ type: 'novel', title: novel.title, sub: `${kindLabel('novel')}　${L(`全${novel.episodes.length}話`, plural(novel.episodes.length, 'episode', 'episodes'))}`, icon: 'book', run: go(`#/novel/${novel.slug}`) })),
    ...data.novels.flatMap(novel => novel.episodes.map((episode, i) => ({ type: 'episode', title: episode.title, sub: `${novel.title}　${L(`${i + 1}話目`, `Episode ${i + 1}`)}`, icon: 'book', also: `${i + 1}話`, run: go(`#/novel/${novel.slug}/${episode.number}`) }))),
    ...data.links.map(link => ({ type: 'link', title: link.name, sub: `${L('リンク', 'Link')}　${tx(link.note)}`, icon: link.icon, also: `${tx(link.note)}`, run: open(link.url) }))
  ]
  searchIndex = items.map(item => ({ ...item, hay: `${item.title} ${item.sub} ${item.also ?? ''}`.normalize('NFKC').toLowerCase() }))
}

let results = []; let selected = 0
function searchFor (query) {
  const terms = query.normalize('NFKC').toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return searchIndex.filter(item => ['section', 'shop', 'novel'].includes(item.type) || (item.type === 'music' && item.thumb === state.data.releases[0]?.artwork))
  const title = item => item.title.normalize('NFKC').toLowerCase()
  return searchIndex.filter(item => terms.every(term => item.hay.includes(term)))
    .map(item => ({ item, score: (title(item).startsWith(terms[0]) ? 0 : title(item).includes(terms[0]) ? 1 : 2) + (item.type === 'episode' ? .5 : 0) }))
    .sort((a, b) => a.score - b.score).slice(0, 60).map(entry => entry.item)
}
function renderResults () {
  const list = $('.palette-list')
  if (!results.length) { list.innerHTML = `<li class="empty">${L('見つかりませんでした。別の言葉で探してください。', 'Nothing found. Try another word.')}</li>`; return }
  list.innerHTML = results.map((item, i) => `<li role="option" id="opt-${i}" aria-selected="${i === selected}" data-i="${i}"><span class="p-thumb">${item.thumb ? `<img src="${esc(item.thumb)}" alt="" loading="lazy">` : icon(item.icon)}</span><span class="p-text"><strong${jaAttr(item.title)}>${esc(item.title)}</strong><small>${esc(item.sub)}</small></span></li>`).join('')
  $('.palette input').setAttribute('aria-activedescendant', `opt-${selected}`)
  $(`#opt-${selected}`)?.scrollIntoView({ block: 'nearest' })
}
function openPalette () {
  const dialog = $('.palette'); const input = $('input', dialog)
  input.value = ''
  results = searchFor(''); selected = 0
  renderResults()
  dialog.showModal()
  input.focus()
}
function runResult (i) {
  const item = results[i]
  if (!item) return
  $('.palette').close()
  item.run()
}

/* ---------------------------------------------------------------------------
   画面の切り替え
   #/                       トップ
   #/shop・#/music…        トップの、そのセクション
   #/game/<作品>            ゲーム
   #/novel/<作品>           小説の目次
   #/novel/<作品>/<話>      小説を読む
--------------------------------------------------------------------------- */
function parseRoute (hash = location.hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(part => { try { return decodeURIComponent(part) } catch { return part } })
  if (!parts.length) return { name: 'home' }
  if (parts.length === 1 && isSection(parts[0])) return { name: 'home', section: parts[0] }
  if (parts[0] === 'game' && parts[1]) return { name: 'game', slug: parts[1] }
  if (parts[0] === 'novel' && parts[1] && parts[2]) return { name: 'reader', slug: parts[1], number: Number(parts[2]) }
  if (parts[0] === 'novel' && parts[1]) return { name: 'novel', slug: parts[1] }
  return { name: 'missing' }
}

let currentRoute = null
async function render (options = {}) {
  const data = state.data
  const route = parseRoute()
  const view = $('#view')
  if (currentRoute?.name === 'home') state.homeScroll = scrollY
  stopJump()
  state.cleanups.splice(0).forEach(fn => fn())
  let html; let mount = () => {}
  if (route.name === 'home') {
    html = homeView(data)
    mount = root => mountHome(root, data)
  } else if (route.name === 'game' && data.games.some(game => game.slug === route.slug)) {
    const game = data.games.find(item => item.slug === route.slug)
    html = gameView(game); mount = root => mountGame(root, game)
  } else if (route.name === 'novel' && data.novels.some(novel => novel.slug === route.slug)) {
    const novel = data.novels.find(item => item.slug === route.slug)
    html = novelView(novel); mount = root => mountNovel(root, novel)
  } else if (route.name === 'reader') {
    const novel = data.novels.find(item => item.slug === route.slug)
    const position = novel ? novel.episodes.findIndex(item => item.number === route.number) : -1
    const episode = position >= 0 ? await options.episode ?? await loadEpisode(novel.slug, route.number) : null
    if (episode) { html = readerView(novel, position, episode); mount = root => mountReader(root, novel, position, { resume: options.keepScroll === undefined || Boolean(options.quiet), quiet: Boolean(options.quiet) || options.keepScroll !== undefined, startAt: options.startAt }) }
  }
  if (!html) {
    html = `<div class="wrap notfound"><h1 class="page-title">${L('見つかりません', 'Not found')}</h1><p class="meta">${L('ページが移動したか、URL がちがうようです。', 'The page may have moved, or the address is wrong.')}</p><a class="btn btn-hi" href="#/">${L('トップへ', 'Home')}</a></div>`
    markDock(null)
  }
  view.innerHTML = html
  document.body.dataset.route = route.name
  document.title = route.name === 'home' ? L('針の筵 — ネコノハ', 'Hari no Mushiro — Nekonoha') : `${$('h1', view)?.textContent ?? ''} — ${L('針の筵', 'Hari no Mushiro')}`
  // 同じ作品の画像を、前後の画面でつなぐ
  if (state.shared) {
    const target = $(`[data-vt="${state.shared}"] [data-vt-target], [data-vt="${state.shared}"][data-vt-target]`, view) ?? (route.name !== 'home' ? $('[data-vt-target]', view) : null)
    if (target) target.style.viewTransitionName = 'shared'
  }
  const section = options.section ?? route.section
  if (options.keepScroll !== undefined) scrollTo(0, options.keepScroll)
  else if (route.name === 'home' && section) jumpTo(section, false)
  else if (route.name === 'home') scrollTo(0, options.restore ? state.homeScroll : 0)
  else scrollTo(0, 0)
  if (route.name === 'home' && options.shelf !== undefined) state.shelfIndex = options.shelf
  mount(view)
  // #/about のような入口から来たときは、URL をトップに戻しておく（戻るボタンで同じ場所に戻らないように）
  if (route.section) history.replaceState(history.state, '', '#/')
  if (route.name !== 'home' && options.keepScroll === undefined) { view.focus({ preventScroll: true }); if (route.name !== 'reader') $('.bar').classList.remove('away') }
  currentRoute = route
  scheduleScrollUi()
}

// 画面を切り替える。対応していれば View Transitions で、つながりのある動きにする。
async function navigate (hash, options = {}) {
  const route = parseRoute(hash)
  const from = parseRoute()
  // トップの中の移動は、作り直さずにスクロールだけ
  if (route.name === 'home' && from.name === 'home' && options.section) {
    jumpTo(options.section, true)
    if (options.shelf !== undefined) { state.shelfIndex = options.shelf; $(`.disc[data-index="${options.shelf}"]`)?.click() }
    return
  }
  // 読書画面は、本文を先に読み込んでから切り替える（途中の空白を見せない）
  if (route.name === 'reader') {
    const novel = state.data.novels.find(item => item.slug === route.slug)
    if (novel) options.episode = await loadEpisode(novel.slug, route.number)
  }
  const update = async () => {
    if (hash !== location.hash) history.pushState(null, '', hash)
    await render({ ...options, restore: options.restore ?? (route.name === 'home' && from.name !== 'home' && !options.section) })
  }
  if (!document.startViewTransition || reduced.matches) { await update(); state.shared = null; return }
  const transition = document.startViewTransition(update)
  transition.finished.finally(() => {
    $$('[style*="view-transition-name"]').forEach(el => { el.style.viewTransitionName = '' })
    state.shared = null
  })
}

/* ---------------------------------------------------------------------------
   はじめに
--------------------------------------------------------------------------- */
async function start () {
  // URL の ?lang=en / ?lang=ja で来たときは、その言語を覚えておく（index.html ですでに当ててある）
  const asked = new URLSearchParams(location.search).get('lang')
  if (asked === 'en' || asked === 'ja') store.set('rd-lang', asked)
  $('#view').innerHTML = `<div class="loading">${L('読み込んでいます…', 'Loading…')}</div>`
  try {
    const res = await fetch('/api/site.json', { cache: 'no-cache' })
    if (!res.ok) throw new Error(res.statusText)
    state.data = await res.json()
  } catch {
    $('#view').innerHTML = `<div class="loading">${L('データを読み込めませんでした。少し待ってから開き直してください。', 'Could not load the site data. Please reload in a moment.')}</div>`
    return
  }
  applyChrome()
  buildIndex(state.data)
  await render()

  // ページ内のリンク：同じ作品の画像があれば、つないで切り替える
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]')
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
    const goto = link.dataset.goto
    if (goto) { event.preventDefault(); navigate('#/', { section: goto }); return }
    if (link.dataset.turn) { event.preventDefault(); turnEpisode(Number(link.dataset.turn), link.getAttribute('href')); return }
    const href = link.getAttribute('href')
    if (href === '#' || !href.startsWith('#/')) return
    event.preventDefault()
    if (link.hasAttribute('data-back') && history.length > 1 && state.cameFromHome) { history.back(); return }
    const shared = link.closest('[data-vt]')
    if (shared) {
      state.shared = shared.dataset.vt
      const source = shared.matches('[data-vt-target]') ? shared : $('[data-vt-target]', shared)
      if (source) source.style.viewTransitionName = 'shared'
    } else {
      const routeTo = parseRoute(href); const routeFrom = parseRoute()
      // 下の階層からトップへ戻るときは、元のタイルに戻っていく
      if (routeTo.name === 'home' && (routeFrom.name === 'game' || routeFrom.name === 'novel')) {
        state.shared = `${routeFrom.name}-${routeFrom.slug}`
        const source = $('[data-vt-target]', $('#view'))
        if (source) source.style.viewTransitionName = 'shared'
      }
    }
    state.cameFromHome = parseRoute().name === 'home'
    navigate(href)
  })
  addEventListener('popstate', () => {
    const route = parseRoute()
    const update = () => render({ restore: route.name === 'home' })
    if (document.startViewTransition && !reduced.matches) document.startViewTransition(update)
    else update()
  })
  document.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action
    if (action === 'search') openPalette()
    if (action === 'lang') setLang(lang() === 'ja' ? 'en' : 'ja')
    if (action === 'theme') {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
      const apply = () => { document.documentElement.dataset.theme = next; try { localStorage.setItem('rd-theme', next) } catch {} }
      if (document.startViewTransition && !reduced.matches) document.startViewTransition(apply)
      else apply()
    }
    if (action === 'top') {
      stopJump()
      scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' })
      $('#view').focus({ preventScroll: true })
    }
    if (action === 'lb-close') $('.lightbox').close()
    if (action === 'lb-prev') showLightbox(lightbox.index - 1)
    if (action === 'lb-next') showLightbox(lightbox.index + 1)
  })
  // キーボード：Ctrl+K と / で探す
  addEventListener('keydown', event => {
    const typing = event.target.closest?.('input, textarea, [contenteditable]')
    if ((event.key === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !typing)) {
      event.preventDefault()
      if (!$('.palette').open) openPalette()
    }
    if ($('.lightbox').open) {
      if (event.key === 'ArrowRight') showLightbox(lightbox.index + 1)
      if (event.key === 'ArrowLeft') showLightbox(lightbox.index - 1)
    }
  })
  const palette = $('.palette'); const input = $('input', palette)
  input.addEventListener('input', () => { results = searchFor(input.value); selected = 0; renderResults() })
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); selected = Math.min(results.length - 1, selected + 1); renderResults() }
    if (event.key === 'ArrowUp') { event.preventDefault(); selected = Math.max(0, selected - 1); renderResults() }
    if (event.key === 'Enter') { event.preventDefault(); runResult(selected) }
  })
  $('.palette-list').addEventListener('click', event => { const li = event.target.closest('[data-i]'); if (li) runResult(Number(li.dataset.i)) })
  $('.palette-list').addEventListener('pointermove', event => { const li = event.target.closest('[data-i]'); if (li && Number(li.dataset.i) !== selected) { selected = Number(li.dataset.i); $$('.palette-list li').forEach((el, i) => el.setAttribute('aria-selected', String(i === selected))) } })
  palette.addEventListener('click', event => { if (event.target === palette) palette.close() })
  // 画像を大きく見る：スワイプと、外側を押して閉じる
  const box = $('.lightbox'); let startX = null
  box.addEventListener('click', event => { if (event.target === box) box.close() })
  box.addEventListener('touchstart', event => { startX = event.touches[0].clientX }, { passive: true })
  box.addEventListener('touchend', event => {
    if (startX === null) return
    const dx = event.changedTouches[0].clientX - startX
    if (Math.abs(dx) > 50) showLightbox(lightbox.index + (dx < 0 ? 1 : -1))
    startX = null
  })
  addEventListener('scroll', scheduleScrollUi, { passive: true })
  addEventListener('resize', () => { markDock(currentSec); scheduleScrollUi() })
}

start()
