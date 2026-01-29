export function GET() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0B0F14"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" font-size="34" font-weight="800" fill="#D4AF37">漫</text>
</svg>`

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
