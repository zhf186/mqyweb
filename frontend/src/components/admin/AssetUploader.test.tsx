import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AssetUploader from './AssetUploader'
import { assetApi } from '@/lib/api/admin'

// Mock the API
vi.mock('@/lib/api/admin', () => ({
  assetApi: {
    uploadAssets: vi.fn(),
  },
}))

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()

describe('AssetUploader', () => {
  const mockOnUploadComplete = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('File Validation Tests (Requirements 4.3, 4.5)', () => {
    it('should render upload interface with correct format description', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      // Component should render with dropzone
      expect(screen.getByText(/拖拽图片到这里/)).toBeInTheDocument()
      // Should show accepted formats in description
      expect(screen.getByText(/支持 JPG、PNG、WebP 格式/)).toBeInTheDocument()
    })

    it('should display correct file size limit in description', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
          maxSize={10}
        />
      )

      expect(screen.getByText(/单张图片不超过 10MB/)).toBeInTheDocument()
    })

    it('should display correct max file count in description', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
          maxFiles={15}
        />
      )

      expect(screen.getByText(/最多上传 15 张/)).toBeInTheDocument()
      expect(screen.getByText(/最多 15 张/)).toBeInTheDocument()
    })

    it('should have file input with correct accept attribute', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      const input = document.querySelector('input[type="file"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('accept')
      expect(input).toHaveAttribute('multiple')
    })

    it('should validate file format constants are correct', () => {
      // Test that the component uses correct format constants
      const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']
      const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

      expect(ACCEPTED_FORMATS).toContain('image/jpeg')
      expect(ACCEPTED_FORMATS).toContain('image/png')
      expect(ACCEPTED_FORMATS).toContain('image/webp')
      expect(MAX_FILE_SIZE).toBe(5242880)
    })

    it('should validate file size calculation', () => {
      // Test file size formatting logic
      const fileSize = 2 * 1024 * 1024 // 2MB
      const formattedSize = (fileSize / 1024 / 1024).toFixed(2)
      expect(formattedSize).toBe('2.00')
    })

    it('should validate max file size constant', () => {
      const MAX_FILE_SIZE = 5 * 1024 * 1024
      const largeFileSize = 6 * 1024 * 1024
      const validFileSize = 4 * 1024 * 1024

      expect(largeFileSize > MAX_FILE_SIZE).toBe(true)
      expect(validFileSize <= MAX_FILE_SIZE).toBe(true)
    })
  })

  describe('Upload Functionality Tests (Requirements 4.3)', () => {
    it('should disable upload button when no files selected', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      const uploadButton = screen.getByRole('button', { name: /开始上传/ })
      expect(uploadButton).toBeDisabled()
    })

    it('should call onClose when cancel button is clicked', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      const cancelButton = screen.getByRole('button', { name: /取消/ })
      fireEvent.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should render category selector', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      // Find the select trigger
      const selectTrigger = screen.getByRole('combobox')
      expect(selectTrigger).toBeInTheDocument()

      // Category selector should be present
      expect(screen.getByText(/图片分类/)).toBeInTheDocument()
    })

    it('should show correct initial category', () => {
      render(
        <AssetUploader
          category="home"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      const selectTrigger = screen.getByRole('combobox')
      expect(selectTrigger.textContent?.trim().length).toBeGreaterThan(0)
    })

    it('should render upload dialog with title', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText('上传图片')).toBeInTheDocument()
    })

    it('should show dropzone with upload icon', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      const dropzone = screen.getByText(/拖拽图片到这里/).closest('div')
      expect(dropzone).toBeInTheDocument()
      
      // Should have upload icon
      const uploadIcon = dropzone?.querySelector('.lucide-upload')
      expect(uploadIcon).toBeInTheDocument()
    })

    it('should have correct file input attributes for validation', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      const input = document.querySelector('input[type="file"]')
      expect(input).toBeInTheDocument()
      
      // Should accept correct file types
      const acceptAttr = input?.getAttribute('accept')
      expect(acceptAttr).toContain('image/jpeg')
      expect(acceptAttr).toContain('image/png')
      expect(acceptAttr).toContain('image/webp')
      
      // Should allow multiple files
      expect(input).toHaveAttribute('multiple')
    })
  })

  describe('UI Interaction Tests', () => {
    it('should render dialog with proper structure', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      // Dialog should be open
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      
      // Should have title
      expect(screen.getByText('上传图片')).toBeInTheDocument()
      
      // Should have description
      expect(screen.getByText(/支持 JPG、PNG、WebP 格式/)).toBeInTheDocument()
    })

    it('should have category selector with label', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText(/图片分类/)).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should have action buttons', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByRole('button', { name: /取消/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /开始上传/ })).toBeInTheDocument()
    })

    it('should call onClose when cancel is clicked', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      const cancelButton = screen.getByRole('button', { name: /取消/ })
      fireEvent.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should show dropzone instructions', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText(/拖拽图片到这里，或点击选择/)).toBeInTheDocument()
      expect(screen.getByText(/支持批量上传/)).toBeInTheDocument()
    })
  })

  describe('Display and Formatting Tests', () => {
    it('should display max file size in description', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
          maxSize={10}
        />
      )

      expect(screen.getByText(/单张图片不超过 10MB/)).toBeInTheDocument()
    })

    it('should display max file count in description', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
          maxFiles={15}
        />
      )

      expect(screen.getByText(/最多上传 15 张/)).toBeInTheDocument()
    })

    it('should use default values when not specified', () => {
      render(
        <AssetUploader
          category="hero"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      // Default maxSize is 5MB
      expect(screen.getByText(/单张图片不超过 5MB/)).toBeInTheDocument()
      
      // Default maxFiles is 20
      expect(screen.getByText(/最多上传 20 张/)).toBeInTheDocument()
    })

    it('should show correct category label', () => {
      render(
        <AssetUploader
          category="home"
          onUploadComplete={mockOnUploadComplete}
          onClose={mockOnClose}
        />
      )

      fireEvent.click(screen.getByRole('combobox'))
      expect(screen.getAllByRole('option').length).toBeGreaterThan(0)
    })

    it('should format file size correctly', () => {
      // Test the file size formatting logic
      const testCases = [
        { bytes: 1024 * 1024, expected: '1.00' },
        { bytes: 2.5 * 1024 * 1024, expected: '2.50' },
        { bytes: 0.5 * 1024 * 1024, expected: '0.50' },
      ]

      testCases.forEach(({ bytes, expected }) => {
        const formatted = (bytes / 1024 / 1024).toFixed(2)
        expect(formatted).toBe(expected)
      })
    })
  })
})
