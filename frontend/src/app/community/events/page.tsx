'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function CommunityEventsPage() {
  return (
    <div>
      <Header transparent />
      <main className="bg-black text-white min-h-screen pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-4xl font-bold mb-8">社群活动</h1>
          <p className="text-white/70">活动页面正在建设中...</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
