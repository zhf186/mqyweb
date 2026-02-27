/**
 * Type Definitions for Visual Editor
 * 可视化编辑器类型定义
 */

/**
 * Device size options for responsive preview
 */
export type DeviceSize = 'desktop' | 'tablet' | 'mobile'

/**
 * Locale options for language switching
 */
export type Locale = 'zh' | 'en'

/**
 * Editor mode
 */
export type EditorMode = 'preview' | 'edit'

/**
 * Editable element type
 */
export type EditableElementType = 'text' | 'image'

/**
 * Editable element interface
 */
export interface EditableElement {
  // Element identification
  id: string
  fieldKey: string
  
  // Element type
  type: EditableElementType
  
  // Position information
  rect: {
    top: number
    left: number
    width: number
    height: number
    x: number
    y: number
    bottom: number
    right: number
  }
  selector: string
  
  // Content information
  contentZh: string
  contentEn: string
  
  // Metadata
  label: string
  isRequired: boolean
  maxLength?: number
}

/**
 * Editor state interface
 */
export interface EditorState {
  // Mode state
  mode: EditorMode
  
  // Page information
  pageSlug: string
  pageName: string
  
  // Language and device
  locale: Locale
  deviceSize: DeviceSize
  
  // Editable elements
  editableElements: EditableElement[]
  hoveredElementId: string | null
  selectedElementId: string | null
  
  // Edit state
  isEditing: boolean
  editingElementId: string | null
  hasUnsavedChanges: boolean
}

/**
 * Message types for iframe communication
 */
export type IframeBridgeMessage =
  | { type: 'IFRAME_READY' }
  | { type: 'INIT_EDIT_MODE'; payload: { locale: string } }
  | { type: 'EXIT_EDIT_MODE' }
  | { type: 'CHANGE_LOCALE'; payload: { locale: string } }
  | { type: 'UPDATE_CONTENT'; payload: { fieldKey: string; content: string; locale: string } }
  | { type: 'UPDATE_IMAGE'; payload: { fieldKey: string; imagePath: string } }
  | { type: 'REQUEST_EDITABLE_ELEMENTS' }
  | { type: 'EDITABLE_ELEMENTS_RESPONSE'; payload: EditableElement[] }
  | { type: 'ELEMENT_CLICKED'; payload: { elementId: string } }
  | { type: 'ELEMENT_HOVERED'; payload: { elementId: string | null } }
  | { type: 'IMAGE_UPDATED_REFRESH_NEEDED'; payload: { fieldKey: string; imagePath: string } }

/**
 * Visual editor error types
 */
export enum VisualEditorError {
  IFRAME_LOAD_FAILED = 'IFRAME_LOAD_FAILED',
  ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND',
  SAVE_FAILED = 'SAVE_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
}
