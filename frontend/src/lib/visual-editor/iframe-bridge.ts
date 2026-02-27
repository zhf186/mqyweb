/**
 * IframeBridge Class
 * iframe通信桥接类
 * 
 * Features:
 * - PostMessage communication between parent and iframe
 * - Type-safe message handling
 * - Event-based message routing
 * - Security validation (same-origin only)
 * 
 * Requirements: 2.1, 2.2
 */

import type { IframeBridgeMessage } from '@/components/admin/visual-editor/PreviewFrame'

type MessageHandler = (payload: any) => void

/**
 * IframeBridge manages communication between the visual editor and the iframe
 */
export class IframeBridge {
  private iframe: HTMLIFrameElement
  private messageHandlers: Map<string, MessageHandler> = new Map()
  private isReady: boolean = false
  private messageQueue: IframeBridgeMessage[] = []
  private boundHandleMessage: ((event: MessageEvent) => void) | null = null

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe
    this.setupMessageListener()
  }

  /**
   * Set up the global message listener
   */
  private setupMessageListener() {
    this.boundHandleMessage = (event: MessageEvent) => {
      // Security: Only accept messages from same origin
      if (event.origin !== window.location.origin) {
        return
      }

      // Validate message structure
      if (!event.data || typeof event.data !== 'object' || !event.data.type) {
        return
      }

      const message = event.data as IframeBridgeMessage

      // Special handling for iframe ready signal
      if (message.type === 'IFRAME_READY') {
        console.log('[IframeBridge] Received IFRAME_READY, marking bridge as ready')
        this.isReady = true
        this.flushMessageQueue()
        return
      }
      
      // Route message to registered handler
      const handler = this.messageHandlers.get(message.type)
      if (handler) {
        try {
          const payload = 'payload' in message ? message.payload : undefined
          handler(payload)
        } catch (error) {
          console.error(`[IframeBridge] Error handling message type "${message.type}":`, error)
        }
      }
    }

    window.addEventListener('message', this.boundHandleMessage)
  }

  /**
   * Register a handler for a specific message type
   */
  on(type: string, handler: MessageHandler): void {
    this.messageHandlers.set(type, handler)
  }

  /**
   * Unregister a handler for a specific message type
   */
  off(type: string): void {
    this.messageHandlers.delete(type)
  }

  /**
   * Send a message to the iframe
   */
  send(message: IframeBridgeMessage): void {
    if (!this.iframe.contentWindow) {
      console.warn('[IframeBridge] Cannot send message: iframe contentWindow not available')
      return
    }

    // If iframe is not ready, queue the message
    if (!this.isReady) {
      this.messageQueue.push(message)
      console.log(`[IframeBridge] Message queued (iframe not ready): ${message.type}, queue length: ${this.messageQueue.length}`)
      return
    }

    try {
      this.iframe.contentWindow.postMessage(message, window.location.origin)
      const payload = 'payload' in message ? message.payload : 'none'
      console.log(`[IframeBridge] Message sent: ${message.type}`, payload)
    } catch (error) {
      console.error('[IframeBridge] Failed to send message:', error)
    }
  }

  /**
   * Flush queued messages when iframe becomes ready
   */
  private flushMessageQueue(): void {
    if (this.messageQueue.length === 0) return

    console.log(`[IframeBridge] Flushing ${this.messageQueue.length} queued messages`)
    
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      if (message) {
        this.send(message)
      }
    }
  }

  /**
   * Initialize edit mode in the iframe
   */
  initEditMode(locale: string): void {
    this.send({
      type: 'INIT_EDIT_MODE',
      payload: { locale },
    })
  }

  /**
   * Exit edit mode in the iframe
   */
  exitEditMode(): void {
    this.send({
      type: 'EXIT_EDIT_MODE',
    })
  }

  /**
   * Update content in the iframe
   */
  updateContent(fieldKey: string, content: string, locale: string): void {
    this.send({
      type: 'UPDATE_CONTENT',
      payload: { fieldKey, content, locale },
    })
  }

  /**
   * Request editable elements from the iframe
   */
  requestEditableElements(): void {
    this.send({
      type: 'REQUEST_EDITABLE_ELEMENTS',
    })
  }

  /**
   * Check if the bridge is ready to send messages
   */
  isIframeReady(): boolean {
    return this.isReady
  }

  /**
   * Manually mark iframe as ready (for testing or special cases)
   */
  markAsReady(): void {
    this.isReady = true
    this.flushMessageQueue()
  }

  /**
   * Clear all message handlers
   */
  clearHandlers(): void {
    this.messageHandlers.clear()
  }

  /**
   * Get the number of queued messages
   */
  getQueueLength(): number {
    return this.messageQueue.length
  }

  /**
   * Destroy the bridge and clean up
   */
  destroy(): void {
    if (this.boundHandleMessage) {
      window.removeEventListener('message', this.boundHandleMessage)
      this.boundHandleMessage = null
    }
    this.messageHandlers.clear()
    this.messageQueue = []
    this.isReady = false
  }
}

/**
 * Create a new IframeBridge instance
 */
export function createIframeBridge(iframe: HTMLIFrameElement): IframeBridge {
  return new IframeBridge(iframe)
}
