'use client'

/**
 * Visual Editor Page
 * 可视化编辑器页面
 * 
 * Features:
 * - Load page preview in iframe
 * - Enable visual editing mode
 * - Edit content directly on the page
 * - Real-time preview updates
 */

import { VisualEditor } from '@/components/admin/visual-editor/VisualEditor'

interface VisualEditorPageProps {
  params: {
    pageSlug: string
  }
}

export default function VisualEditorPage({ params }: VisualEditorPageProps) {
  return <VisualEditor pageSlug={params.pageSlug} />
}
