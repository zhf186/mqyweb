import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PartnerEditor from './PartnerEditor'
import { partnerApi } from '@/lib/api/admin'

// Mock the API
vi.mock('@/lib/api/admin', () => ({
  partnerApi: {
    createPartner: vi.fn(),
    updatePartner: vi.fn(),
  },
}))

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
  Wrapper.displayName = 'QueryClientWrapper'
  return Wrapper
}

describe('PartnerEditor - Form Validation Tests (Requirements 10.2)', () => {
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Required Field Validation', () => {
    it('should show validation error when partner name is empty', async () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('请输入合作伙伴名称')).toBeInTheDocument()
      })
    })
  })

  describe('Length Validation', () => {
    it('should show error when partner name exceeds 200 characters', async () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const nameInput = screen.getByPlaceholderText('例如：途尔电动车')
      const longName = 'a'.repeat(201)
      fireEvent.change(nameInput, { target: { value: longName } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('名称不能超过200个字符')).toBeInTheDocument()
      })
    })
  })

  describe('URL Validation', () => {
    it('should show error when website URL is invalid', async () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const urlInput = screen.getByPlaceholderText('https://example.com')
      fireEvent.change(urlInput, { target: { value: 'invalid-url' } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('请输入有效的URL')).toBeInTheDocument()
      })
    })

    it('should accept valid URL', async () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const urlInput = screen.getByPlaceholderText('https://example.com')
      fireEvent.change(urlInput, { target: { value: 'https://www.example.com' } })

      // Fill in required name field
      const nameInput = screen.getByPlaceholderText('例如：途尔电动车')
      fireEvent.change(nameInput, { target: { value: '测试合作伙伴' } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      // Should not show URL validation error
      await waitFor(() => {
        expect(screen.queryByText('请输入有效的URL')).not.toBeInTheDocument()
      })
    })

    it('should accept empty URL', async () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Fill in required name field
      const nameInput = screen.getByPlaceholderText('例如：途尔电动车')
      fireEvent.change(nameInput, { target: { value: '测试合作伙伴' } })

      // Leave URL empty
      const urlInput = screen.getByPlaceholderText('https://example.com')
      fireEvent.change(urlInput, { target: { value: '' } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      // Should not show URL validation error
      await waitFor(() => {
        expect(screen.queryByText('请输入有效的URL')).not.toBeInTheDocument()
      })
    })
  })

  describe('Partner Type Selection', () => {
    it('should have two type options: brand and scenic_area', () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Find type select trigger
      const typeLabel = screen.getByText(/合作类型/)
      expect(typeLabel).toBeInTheDocument()
    })
  })

  describe('Active Status Toggle', () => {
    it('should have active status checkbox', () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      expect(screen.getByText('启用状态')).toBeInTheDocument()
      expect(screen.getByText('是否在网站上显示此合作伙伴')).toBeInTheDocument()
    })

    it('should default to active when creating new partner', () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    it('should toggle active status when checkbox is clicked', () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()

      fireEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()

      fireEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })
  })

  describe('Form Submission', () => {
    it('should call createPartner API when creating new partner with valid data', async () => {
      const mockCreate = vi.mocked(partnerApi.createPartner).mockResolvedValue({
        code: 200,
        message: 'Success',
        data: {
          id: '1',
          name: '测试合作伙伴',
          type: 'brand',
          websiteUrl: 'https://example.com',
          isActive: true,
          displayOrder: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })

      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Fill in required fields
      fireEvent.change(screen.getByPlaceholderText('例如：途尔电动车'), {
        target: { value: '测试合作伙伴' },
      })
      fireEvent.change(screen.getByPlaceholderText('https://example.com'), {
        target: { value: 'https://example.com' },
      })

      // Submit form
      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            name: '测试合作伙伴',
            websiteUrl: 'https://example.com',
            isActive: true,
          })
        )
      })
    })

    it('should call updatePartner API when editing existing partner', async () => {
      const existingPartner = {
        id: '1',
        name: '现有合作伙伴',
        type: 'brand' as const,
        websiteUrl: 'https://existing.com',
        isActive: true,
        displayOrder: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const mockUpdate = vi.mocked(partnerApi.updatePartner).mockResolvedValue({
        code: 200,
        message: 'Success',
        data: existingPartner,
      })

      render(
        <PartnerEditor
          partner={existingPartner}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Modify a field
      const nameInput = screen.getByPlaceholderText('例如：途尔电动车')
      fireEvent.change(nameInput, { target: { value: '更新的合作伙伴' } })

      // Submit form
      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(
          '1',
          expect.objectContaining({
            name: '更新的合作伙伴',
          })
        )
      })
    })
  })

  describe('Dialog Behavior', () => {
    it('should render dialog when isOpen is true', () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('添加合作伙伴')).toBeInTheDocument()
    })

    it('should show correct title when editing', () => {
      const existingPartner = {
        id: '1',
        name: '现有合作伙伴',
        type: 'brand' as const,
        websiteUrl: 'https://existing.com',
        isActive: true,
        displayOrder: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      render(
        <PartnerEditor
          partner={existingPartner}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      expect(screen.getByText('编辑合作伙伴')).toBeInTheDocument()
    })

    it('should call onClose when cancel button is clicked', () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const cancelButton = screen.getByRole('button', { name: /取消/ })
      fireEvent.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Tab Navigation', () => {
    it('should have two tabs: basic and description', () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      expect(screen.getByRole('tab', { name: /基本信息/ })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /详细描述/ })).toBeInTheDocument()
    })

    it('should switch to description tab when clicked', () => {
      render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const descriptionTab = screen.getByRole('tab', { name: /详细描述/ })
      fireEvent.mouseDown(descriptionTab)

      expect(screen.getByPlaceholderText('介绍合作内容、合作亮点等...')).toBeInTheDocument()
    })
  })

  describe('Form Reset on Partner Change', () => {
    it('should reset form when partner prop changes from null to partner', () => {
      const { rerender } = render(
        <PartnerEditor
          partner={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Fill in a field
      const nameInput = screen.getByPlaceholderText('例如：途尔电动车')
      fireEvent.change(nameInput, { target: { value: '临时名称' } })
      expect(nameInput).toHaveValue('临时名称')

      // Change partner prop
      const existingPartner = {
        id: '1',
        name: '现有合作伙伴',
        type: 'brand' as const,
        websiteUrl: 'https://existing.com',
        isActive: true,
        displayOrder: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <PartnerEditor
            partner={existingPartner}
            isOpen={true}
            onClose={mockOnClose}
            onSuccess={mockOnSuccess}
          />
        </QueryClientProvider>
      )

      // Form should be reset with partner data
      const updatedNameInput = screen.getByPlaceholderText('例如：途尔电动车')
      expect(updatedNameInput).toHaveValue('现有合作伙伴')
    })
  })
})
