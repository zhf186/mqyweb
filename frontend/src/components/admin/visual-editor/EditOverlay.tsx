'use client'

/**
 * EditOverlay Component
 * 编辑覆盖层组件
 * 
 * Renders a transparent overlay on top of the iframe with highlighted editable elements.
 * Positions are calculated relative to the iframe container, accounting for scroll offset.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import type { EditableElement as EditableElementType } from '@/lib/visual-editor/types'
import { EditableElement } from './EditableElement'

interface EditOverlayProps {
  editableElements: EditableElementType[]
  hoveredElementId: string | null
  selectedElementId: string | null
  onElementHover: (id: string | null) => void
  onElementClick: (id: string) => void
  isVisible?: boolean
  iframeRef?: React.RefObject<HTMLIFrameElement>
}

export function EditOverlay({
  editableElements,
  hoveredElementId,
  selectedElementId,
  onElementHover,
  onElementClick,
  isVisible = true,
  iframeRef,
}: EditOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [iframeOffset, setIframeOffset] = useState({ top: 0, left: 0 })

  // Calculate iframe offset relative to the overlay container
  const updateIframeOffset = useCallback(() => {
    if (iframeRef?.current && overlayRef.current) {
      const iframeRect = iframeRef.current.getBoundingClientRect()
      const overlayRect = overlayRef.current.getBoundingClientRect()
      setIframeOffset({
        top: iframeRect.top - overlayRect.top,
        left: iframeRect.left - overlayRect.left,
      })
    }
  }, [iframeRef])

  useEffect(() => {
    updateIframeOffset()
    window.addEventListener('resize', updateIframeOffset)
    return () => window.removeEventListener('resize', updateIframeOffset)
  }, [updateIframeOffset])

  if (!isVisible) return null

  if (editableElements.length === 0) {
    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="bg-blue-500/10 border-2 border-blue-500 border-dashed rounded-lg px-6 py-4">
          <p className="text-blue-700 text-sm font-medium">
            未检测到可编辑元素
          </p>
          <p className="text-blue-600 text-xs mt-1">
            请确保页面已加载完成
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={overlayRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      role="region"
      aria-label="编辑覆盖层"
    >
      {editableElements.map((element) => (
        <EditableElement
          key={element.id}
          element={element}
          isHovered={element.id === hoveredElementId}
          isSelected={element.id === selectedElementId}
          onHover={() => onElementHover(element.id)}
          onLeave={() => onElementHover(null)}
          onClick={() => onElementClick(element.id)}
          iframeOffset={iframeOffset}
        />
      ))}
    </div>
  )
}
