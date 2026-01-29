import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

// 英文正文字体 - 优化加载
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

// 英文标题字体 - 优化加载
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  fallback: ['serif'],
})

export const metadata: Metadata = {
  title: {
    default: '漫骑游 - 高端跨界骑游生活平台',
    template: '%s | 漫骑游',
  },
  description: '漫骑游是集成德国血统E-BIKE和高端骑行旅游线路为核心的高端跨界骑游生活平台。有深度的线路、有智趣的社群、有品质的好物、有境界的异业、有风景的生活馆。',
  keywords: ['骑游', 'E-BIKE租赁', '深度骑行线路', '宁波骑行', '电助力自行车', '骑行旅游'],
  authors: [{ name: '漫骑游' }],
  creator: '漫骑游',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: 'en_US',
    siteName: '漫骑游',
    title: '漫骑游 - 高端跨界骑游生活平台',
    description: '有深度的线路、有智趣的社群、有品质的好物、有境界的异业、有风景的生活馆',
  },
  robots: {
    index: true,
    follow: true,
  },
  // 性能优化 - 添加资源提示
  other: {
    'theme-color': '#000000',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        {/* DNS 预解析 - 加速外部资源加载 */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* 预连接关键域名 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 视口优化 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
      </head>
      <body className={`${dmSans.variable} ${playfairDisplay.variable} font-zh-body antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
