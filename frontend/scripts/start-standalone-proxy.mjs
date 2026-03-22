import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const standaloneServer = path.join(projectRoot, '.next', 'standalone', 'server.js')
const standaloneStaticDir = path.join(projectRoot, '.next', 'standalone', '.next', 'static')
const publicDir = path.join(projectRoot, 'public')

const publicPort = Number.parseInt(process.env.PORT || '3000', 10)
const internalPort = Number.parseInt(process.env.INTERNAL_PORT || '3001', 10)

if (!fs.existsSync(standaloneServer)) {
  throw new Error(`Standalone server not found: ${standaloneServer}`)
}

const child = spawn(process.execPath, [standaloneServer], {
  cwd: path.dirname(standaloneServer),
  env: {
    ...process.env,
    PORT: String(internalPort),
    HOSTNAME: '127.0.0.1',
  },
  stdio: 'inherit',
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.css':
      return 'text/css; charset=UTF-8'
    case '.js':
      return 'application/javascript; charset=UTF-8'
    case '.json':
      return 'application/json; charset=UTF-8'
    case '.svg':
      return 'image/svg+xml'
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.webp':
      return 'image/webp'
    case '.woff2':
      return 'font/woff2'
    case '.ico':
      return 'image/x-icon'
    default:
      return 'application/octet-stream'
  }
}

function tryServeStatic(req, res) {
  if (!req.url) {
    return false
  }

  const requestPath = decodeURIComponent(req.url.split('?')[0])
  let filePath = null

  if (requestPath.startsWith('/_next/static/')) {
    filePath = path.join(standaloneStaticDir, requestPath.replace('/_next/static/', ''))
  } else if (requestPath.startsWith('/brand_assets/')) {
    filePath = path.join(publicDir, requestPath.replace(/^\//, ''))
  } else if (requestPath === '/favicon.ico') {
    filePath = path.join(publicDir, 'favicon.ico')
  }

  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return false
  }

  res.writeHead(200, {
    'Content-Type': getContentType(filePath),
    'Cache-Control': requestPath.startsWith('/_next/static/') ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
  })
  fs.createReadStream(filePath).pipe(res)
  return true
}

const server = http.createServer((req, res) => {
  if (tryServeStatic(req, res)) {
    return
  }

  const proxyRequest = http.request(
    {
      hostname: '127.0.0.1',
      port: internalPort,
      method: req.method,
      path: req.url,
      headers: req.headers,
    },
    (proxyResponse) => {
      res.writeHead(proxyResponse.statusCode || 500, proxyResponse.headers)
      proxyResponse.pipe(res)
    }
  )

  proxyRequest.on('error', (error) => {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=UTF-8' })
    res.end(`Frontend proxy error: ${error.message}`)
  })

  req.pipe(proxyRequest)
})

server.listen(publicPort, '0.0.0.0', () => {
  console.log(`Frontend proxy listening on http://localhost:${publicPort}`)
  console.log(`Forwarding app requests to standalone server on http://127.0.0.1:${internalPort}`)
})

const shutdown = () => {
  child.kill()
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
