'use client'

/**
 * EditableElement Component
 * 可编辑元素覆盖层
 * 
 * Renders a highlight overlay for a single editable element,
 * positioned relative to the iframe content.
 */

import { Type, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditableElement as EditableElementType } from '@/lib/visual-editor/types'

interface EditableElementProps {
  element: EditableElementType
  isHovered: boolean
  isSelected: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
  iframeOffset?: { top: number; left: number }
}

export function EditableElement({
  element,
  isHovered,
  isSelected,
  onHover,
  onLeave,
  onClick,
  iframeOffset = { top: 0, left: 0 },
}: EditableElementProps) {
  const { rect, label, type } = element

  // Calculate position accounting for iframe offset
  const top = rect.top + iframeOffset.top
  const left = rect.left + iframeOffset.left

  // Skip rendering if element is off-screen or has zero dimensions
  if (rect.width <= 0 || rect.height <= 0) return null

  const borderColor = isSelected
    ? 'border-blue-500'
    : isHovered
    ? 'border-blue-400'
    : 'border-blue-300/50'

  const bgColor = isSelected
    ? 'bg-blue-500/10'
    : isHovered
    ? 'bg-blue-400/5'
    : 'bg-transparent'

  const showLabel = isHovered || isSelected
  const Icon = type === 'text' ? Type : ImageIcon

  return (
    <div
      className="absolute pointer-events-auto cursor-pointer transition-all duration-150"
      style={{
        top,
        left,
        width: rect.width,
        height: rect.height,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      role="button"
      tabIndex={0}
      aria-label={`编辑 ${label}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Border highlight - always show a subtle border so elements are discoverable */}
      <div
        className={cn(
          'absolute inset-0 border-2 rounded-sm transition-colors duration-150',
          borderColor,
          bgColor
        )}
      />
      
      {/* Label tooltip */}
      {showLabel && (
        <div 
          className={cn(
            'absolute left-0 px-2 py-1 rounded text-white text-xs font-medium',
            'flex items-center gap-1.5 shadow-lg whitespace-nowrap z-50',
            isSelected ? 'bg-blue-600' : 'bg-blue-500'
          )}
          style={{
            // Position label above element, or below if too close to top
            ...(top > 32
              ? { bottom: '100%', marginBottom: '4px' }
              : { top: '100%', marginTop: '4px' }),
            maxWidth: '280px',
          }}
        >
          <Icon className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{label}</span>
          <span className="text-blue-200 text-[10px] ml-1">
            {type === 'text' ? '文字' : '图片'}
          </span>
        </div>
      )}

      {/* Corner indicator for selected state */}
      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white shadow" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white shadow" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white shadow" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white shadow" />
        </>
      )}
    </div>
  )
}
