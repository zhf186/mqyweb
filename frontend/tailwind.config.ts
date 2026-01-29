import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 品牌色彩体系 - 「科技自然融合」审美方向
        brand: {
          // 主色：深森林绿 - 代表自然骑游、生态、可持续
          primary: {
            DEFAULT: '#0F4C3A',
            50: '#E8F5F0',
            100: '#D1EBE1',
            200: '#A3D7C3',
            300: '#75C3A5',
            400: '#47AF87',
            500: '#0F4C3A',
            600: '#0D4334',
            700: '#0B3A2D',
            800: '#093127',
            900: '#072820',
            950: '#051A15',
          },
          // 辅色：科技蓝 - 代表智能E-BIKE、创新、未来
          secondary: {
            DEFAULT: '#2A5FAD',
            50: '#EBF1F9',
            100: '#D7E3F3',
            200: '#AFC7E7',
            300: '#87ABDB',
            400: '#5F8FCF',
            500: '#2A5FAD',
            600: '#25559C',
            700: '#204B8A',
            800: '#1B4179',
            900: '#163767',
            950: '#0E2347',
          },
          // 点缀：奢华金 - 代表品质、高端、专属
          accent: {
            DEFAULT: '#D4AF37',
            50: '#FCF8E8',
            100: '#F9F1D1',
            200: '#F3E3A3',
            300: '#EDD575',
            400: '#E7C747',
            500: '#D4AF37',
            600: '#BF9E32',
            700: '#AA8D2C',
            800: '#957C27',
            900: '#806B21',
            950: '#5C4D18',
          },
          // 天空蓝 - 代表自由、开放、探索
          sky: {
            DEFAULT: '#87CEEB',
            light: '#B0E0F0',
            dark: '#5DADE2',
          },
          // 大地褐 - 代表在地、文化、真实
          earth: {
            DEFAULT: '#8B4513',
            light: '#A0522D',
            dark: '#654321',
          },
          // 活力橙 - 代表运动、激情、能量
          energy: {
            DEFAULT: '#FF7F50',
            light: '#FFA07A',
            dark: '#E9692C',
          },
        },
        // shadcn/ui 兼容色彩
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        // 中文标题：阿里汉仪智能黑体 - 体现智能科技感
        'zh-heading': [
          'Alibaba-PuHuiTi-Heavy',
          'ZCOOL-QingKe-HuangYou',
          'Source Han Sans SC',
          'Noto Sans SC',
          'sans-serif',
        ],
        // 中文正文：思源黑体 - 现代易读
        'zh-body': [
          'Noto Sans SC',
          'Source Han Sans SC',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
        // 中文装饰：站酷高端黑 - 独特个性
        'zh-display': [
          'ZCOOL-QingKe-HuangYou',
          'Alibaba-PuHuiTi-Heavy',
          'sans-serif',
        ],
        // 英文标题：Playfair Display - 优雅品质感
        'en-heading': [
          'Playfair Display',
          'Cormorant Garamond',
          'Georgia',
          'serif',
        ],
        // 英文正文：DM Sans - 现代独特
        'en-body': [
          'DM Sans',
          'Outfit',
          'Inter',
          'sans-serif',
        ],
        // 英文装饰：Montserrat - 强烈国际化
        'en-display': [
          'Montserrat',
          'Poppins',
          'sans-serif',
        ],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          from: { opacity: '0', transform: 'translateY(-30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          from: { transform: 'translateY(-20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'scale-up': {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(15, 76, 58, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(15, 76, 58, 0.6)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'count-up': {
          from: { '--num': '0' },
          to: { '--num': 'var(--target)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'text-reveal': {
          from: { clipPath: 'inset(0 100% 0 0)' },
          to: { clipPath: 'inset(0 0 0 0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.8s ease-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'fade-in-down': 'fade-in-down 0.8s ease-out',
        'fade-in-left': 'fade-in-left 0.8s ease-out',
        'fade-in-right': 'fade-in-right 0.8s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'slide-down': 'slide-down 0.6s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
        'scale-up': 'scale-up 0.4s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'text-reveal': 'text-reveal 1s ease-out forwards',
      },
      backgroundImage: {
        // 品牌渐变背景
        'gradient-brand': 'linear-gradient(135deg, #0F4C3A 0%, #2A5FAD 100%)',
        'gradient-brand-reverse': 'linear-gradient(135deg, #2A5FAD 0%, #0F4C3A 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(15, 76, 58, 0.9) 0%, rgba(42, 95, 173, 0.7) 100%)',
        'gradient-hero-dark': 'linear-gradient(180deg, rgba(15, 76, 58, 0.95) 0%, rgba(5, 26, 21, 0.98) 100%)',
        // 强调渐变：奢华金 → 活力橙
        'gradient-accent': 'linear-gradient(90deg, #D4AF37 0%, #FF7F50 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F9F1D1 50%, #D4AF37 100%)',
        // 玻璃拟态渐变
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-glass-dark': 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%)',
        // 径向渐变
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-radial-brand': 'radial-gradient(ellipse at center, #0F4C3A 0%, #072820 100%)',
        // 六边形图案（呼应骑行轮毂）
        'hexagon-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%230F4C3A' fill-opacity='0.05'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        // 点阵图案
        'dot-pattern': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230F4C3A' fill-opacity='0.03'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        // 对角线图案
        'diagonal-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230F4C3A' stroke-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        // 品牌阴影系统
        'brand-sm': '0 2px 8px rgba(15, 76, 58, 0.08)',
        'brand': '0 4px 16px rgba(15, 76, 58, 0.12)',
        'brand-lg': '0 8px 32px rgba(15, 76, 58, 0.16)',
        'brand-xl': '0 16px 48px rgba(15, 76, 58, 0.2)',
        // 金色光晕
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        'gold-glow-lg': '0 0 40px rgba(212, 175, 55, 0.4)',
        // 玻璃阴影
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        // 悬浮阴影
        'float': '0 20px 40px rgba(15, 76, 58, 0.15), 0 8px 16px rgba(15, 76, 58, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '192': '48rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.6' }],
        'base': ['1rem', { lineHeight: '1.7' }],
        'lg': ['1.125rem', { lineHeight: '1.7' }],
        'xl': ['1.25rem', { lineHeight: '1.7' }],
        '2xl': ['1.5rem', { lineHeight: '1.6' }],
        '3xl': ['1.875rem', { lineHeight: '1.5' }],
        '4xl': ['2.25rem', { lineHeight: '1.4' }],
        '5xl': ['3rem', { lineHeight: '1.3' }],
        '6xl': ['3.75rem', { lineHeight: '1.2' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'smooth-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'smooth-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'smooth-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
    },
    screens: {
      // 响应式断点
      'sm': '640px',
      'md': '768px',    // Tablet
      'lg': '1024px',   // Desktop
      'xl': '1440px',   // Large Desktop
      '2xl': '1536px',
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
