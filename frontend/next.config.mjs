/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    // 优先使用 AVIF 格式（更小的文件大小），回退到 WebP
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.aliyuncs.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/brand_assets/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/brand_assets/**',
      },
    ],
    // 响应式图片尺寸 - 针对常见设备优化
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 启用图片优化
    unoptimized: process.env.NODE_ENV !== 'production',
    // 图片缓存时间（秒）- 1年
    minimumCacheTTL: 31536000,
    // 图片加载优化
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 性能优化
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
    // 启用 CSS 优化
    optimizeCss: true,
  },
  // 压缩配置
  compress: true,
  // 生产环境优化
  poweredByHeader: false,
  reactStrictMode: true,
  // 优化字体加载
  optimizeFonts: true,
  // 启用 SWC 压缩
  swcMinify: true,
  // 生产环境构建优化
  productionBrowserSourceMaps: false, // 禁用生产环境 source maps 以减小包大小
  // 编译器优化
  compiler: {
    // 移除 console.log (仅生产环境)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    // 启用 React 编译器优化
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  // Headers 配置 - 添加缓存控制
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/brand_assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
  // Keep type safety enabled during build.
  typescript: {
    ignoreBuildErrors: false,
  },
  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Docker 部署配置 - 启用 standalone 输出
  output: 'standalone',
}

export default nextConfig
