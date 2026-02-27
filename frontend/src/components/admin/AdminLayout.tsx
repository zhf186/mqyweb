'use client'

/**
 * Admin Layout Component
 * 后台管理系统主布局
 * 
 * Features:
 * - Sidebar navigation
 * - Top bar with user info and actions
 * - Content area
 * - Responsive design
 */

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content - Responsive padding and spacing */}
        <main className="py-4 px-4 sm:py-6 sm:px-6 lg:px-8 mt-16 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  )
}
