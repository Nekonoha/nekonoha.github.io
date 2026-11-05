// 新デザインをローカルで見るための、依存なしの小さなサーバー。
//   node redesign/serve.mjs        → http://localhost:5180
// いまのサイトのデータ（frontend/data・frontend/public/images・frontend/content/novels）を、開くたびに読み直す。
// 公開用のファイルを書き出すのは build.mjs。
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { siteData, episodeData, publicDir, imagesDir } from './site-data.mjs'

const port = Number(process.env.PORT) || 5180

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon'
}

const send = (res, status, body, type = 'text/plain; charset=utf-8') => {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' })
  res.end(body)
}

// root の外を指すパス（../ など）は受け付けない。
const inside = (root, relative) => {
  const file = path.resolve(root, '.' + path.posix.normalize('/' + relative))
  return file === root || file.startsWith(root + path.sep) ? file : null
}

async function serveFile (res, file) {
  try {
    const info = await stat(file)
    if (info.isDirectory()) return serveFile(res, path.join(file, 'index.html'))
    send(res, 200, await readFile(file), types[path.extname(file).toLowerCase()] ?? 'application/octet-stream')
  } catch {
    send(res, 404, 'Not found')
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    const pathname = decodeURIComponent(url.pathname)
    if (pathname === '/api/site.json') return send(res, 200, JSON.stringify(await siteData()), types['.json'])
    const episode = /^\/api\/novels\/([\w-]+)\/(\d+)\.json$/.exec(pathname)
    if (episode) {
      const data = await episodeData(episode[1], Number(episode[2]))
      return data ? send(res, 200, JSON.stringify(data), types['.json']) : send(res, 404, '{}', types['.json'])
    }
    if (pathname.startsWith('/images/')) {
      const file = inside(imagesDir, pathname.slice('/images/'.length))
      return file ? serveFile(res, file) : send(res, 403, 'Forbidden')
    }
    const file = inside(publicDir, pathname === '/' ? 'index.html' : pathname.slice(1))
    return file ? serveFile(res, file) : send(res, 403, 'Forbidden')
  } catch (error) {
    console.error(error)
    send(res, 500, 'Server error')
  }
})

// 前に起動したサーバーが動いたままだと、同じ番号では起動できない。そのときは分かるように知らせる。
server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`ポート ${port} はすでに使われています。前に起動したサーバーが別のウィンドウで動いていないか確かめてください。`)
    console.error('止め方（PowerShell）: Get-NetTCPConnection -LocalPort ' + port + ' -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess }')
    console.error(`別の番号で起動する場合: $env:PORT=${port + 10}; node redesign/serve.mjs`)
    process.exit(1)
  }
  throw error
})

server.listen(port, () => {
  console.log(`新デザイン: http://localhost:${port}`)
  console.log('止めるときは Ctrl+C')
})
