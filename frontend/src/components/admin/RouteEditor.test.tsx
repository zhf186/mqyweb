import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RouteEditor from './RouteEditor'
import { routeApi } from '@/lib/api/admin'

// Mock the API
vi.mock('@/lib/api/admin', () => ({
  routeApi: {
    createRoute: vi.fn(),
    updateRoute: vi.fn(),
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

describe('RouteEditor - Form Validation Tests (Requirements 8.2)', () => {
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Required Field Validation', () => {
    it('should show validation error when Chinese name is empty', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Find and click submit button
      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText('请输入中文名称')).toBeInTheDocument()
      })
    })

    it('should show validation error when English name is empty', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('请输入英文名称')).toBeInTheDocument()
      })
    })

    it('should show validation error when slug is empty', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('请输入URL标识')).toBeInTheDocument()
      })
    })
  })

  describe('Length Validation', () => {
    it('should show error when Chinese name exceeds 200 characters', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const nameInput = screen.getByPlaceholderText('例如：西湖环湖骑行')
      const longName = 'a'.repeat(201)
      fireEvent.change(nameInput, { target: { value: longName } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('名称不能超过200个字符')).toBeInTheDocument()
      })
    })

    it('should show error when English name exceeds 200 characters', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const nameInput = screen.getByPlaceholderText(/West Lake Cycling Tour/)
      const longName = 'a'.repeat(201)
      fireEvent.change(nameInput, { target: { value: longName } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('名称不能超过200个字符')).toBeInTheDocument()
      })
    })

    it('should show error when slug exceeds 100 characters', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const slugInput = screen.getByPlaceholderText('west-lake-cycling')
      const longSlug = 'a'.repeat(101)
      fireEvent.change(slugInput, { target: { value: longSlug } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('URL标识不能超过100个字符')).toBeInTheDocument()
      })
    })

    it('should show error when short description exceeds 500 characters', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Switch to description tab
      const descriptionTab = screen.getByRole('tab', { name: /详细描述/ })
      fireEvent.mouseDown(descriptionTab)

      const shortDescInput = document.querySelector('textarea[name="shortDescZh"]') as HTMLTextAreaElement | null
      expect(shortDescInput).toBeInTheDocument()
      const longDesc = 'a'.repeat(501)
      fireEvent.change(shortDescInput!, { target: { value: longDesc } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('简短描述不能超过500个字符')).toBeInTheDocument()
      })
    })
  })

  describe('Numeric Field Validation', () => {
    it('should show error when distance is negative', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const distanceInput = screen.getByLabelText(/距离 \(km\)/)
      fireEvent.change(distanceInput, { target: { value: '-10' } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('距离必须大于0')).toBeInTheDocument()
      })
    })

    it('should show error when duration is negative', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const durationInput = screen.getByLabelText(/时长 \(小时\)/)
      fireEvent.change(durationInput, { target: { value: '-30' } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('时长必须大于0')).toBeInTheDocument()
      })
    })

    it('should show error when price is negative', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const priceInput = screen.getByLabelText(/价格 \(¥\)/)
      fireEvent.change(priceInput, { target: { value: '-100' } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('价格必须大于0')).toBeInTheDocument()
      })
    })
  })

  describe('Character Counter Display', () => {
    it('should display character count for short description', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Switch to description tab
      const descriptionTab = screen.getByRole('tab', { name: /详细描述/ })
      fireEvent.mouseDown(descriptionTab)

      const shortDescInput = document.querySelector('textarea[name="shortDescZh"]') as HTMLTextAreaElement | null
      expect(shortDescInput).toBeInTheDocument()
      fireEvent.change(shortDescInput!, { target: { value: 'Test description' } })

      await waitFor(() => {
        expect(screen.getByText(/16 \/ 500/)).toBeInTheDocument()
      })
    })

    it('should update character count as user types', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const descriptionTab = screen.getByRole('tab', { name: /详细描述/ })
      fireEvent.mouseDown(descriptionTab)

      const shortDescInput = document.querySelector('textarea[name="shortDescZh"]') as HTMLTextAreaElement | null
      expect(shortDescInput).toBeInTheDocument()
      
      // Type first text
      fireEvent.change(shortDescInput!, { target: { value: 'Hello' } })
      await waitFor(() => {
        expect(screen.getByText(/5 \/ 500/)).toBeInTheDocument()
      })

      // Type more text
      fireEvent.change(shortDescInput!, { target: { value: 'Hello World' } })
      await waitFor(() => {
        expect(screen.getByText(/11 \/ 500/)).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should call createRoute API when creating new route with valid data', async () => {
      const mockCreate = vi.mocked(routeApi.createRoute).mockResolvedValue({
        code: 200,
        message: 'Success',
        data: {
          id: '1',
          nameZh: '测试路线',
          nameEn: 'Test Route',
          slug: 'test-route',
          distance: 10,
          difficulty: 'medium',
          duration: 60,
          price: 100,
          status: 'draft',
          isFeatured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })

      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Fill in required fields
      fireEvent.change(screen.getByPlaceholderText('例如：西湖环湖骑行'), {
        target: { value: '测试路线' },
      })
      fireEvent.change(screen.getByPlaceholderText(/West Lake Cycling Tour/), {
        target: { value: 'Test Route' },
      })
      fireEvent.change(screen.getByPlaceholderText('west-lake-cycling'), {
        target: { value: 'test-route' },
      })
      fireEvent.change(screen.getByLabelText(/距离 \(km\)/), {
        target: { value: '10' },
      })
      fireEvent.change(screen.getByLabelText(/时长 \(小时\)/), {
        target: { value: '60' },
      })
      fireEvent.change(screen.getByLabelText(/价格 \(¥\)/), {
        target: { value: '100' },
      })

      // Submit form
      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            nameZh: '测试路线',
            nameEn: 'Test Route',
            slug: 'test-route',
            distance: 10,
            duration: 60,
            price: 100,
          })
        )
      })
    })

    it('should call updateRoute API when editing existing route', async () => {
      const existingRoute = {
        id: '1',
        nameZh: '现有路线',
        nameEn: 'Existing Route',
        slug: 'existing-route',
        distance: 15,
        difficulty: 'easy' as const,
        duration: 90,
        price: 150,
        status: 'published' as const,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const mockUpdate = vi.mocked(routeApi.updateRoute).mockResolvedValue({
        code: 200,
        message: 'Success',
        data: existingRoute,
      })

      render(
        <RouteEditor
          route={existingRoute}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Modify a field
      const nameInput = screen.getByPlaceholderText('例如：西湖环湖骑行')
      fireEvent.change(nameInput, { target: { value: '更新的路线' } })

      // Submit form
      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(
          '1',
          expect.objectContaining({
            nameZh: '更新的路线',
          })
        )
      })
    })
  })

  describe('Dialog Behavior', () => {
    it('should render dialog when isOpen is true', () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('创建路线')).toBeInTheDocument()
    })

    it('should show correct title when editing', () => {
      const existingRoute = {
        id: '1',
        nameZh: '现有路线',
        nameEn: 'Existing Route',
        slug: 'existing-route',
        distance: 15,
        difficulty: 'easy' as const,
        duration: 90,
        price: 150,
        status: 'published' as const,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      render(
        <RouteEditor
          route={existingRoute}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      expect(screen.getByText('编辑路线')).toBeInTheDocument()
    })

    it('should call onClose when cancel button is clicked', () => {
      render(
        <RouteEditor
          route={null}
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
    it('should have three tabs: basic, description, settings', () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      expect(screen.getByRole('tab', { name: /基本信息/ })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /详细描述/ })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /设置/ })).toBeInTheDocument()
    })

    it('should switch to description tab when clicked', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const descriptionTab = screen.getByRole('tab', { name: /详细描述/ })
      fireEvent.mouseDown(descriptionTab)

      expect(document.querySelector('textarea[name="shortDescZh"]')).toBeInTheDocument()
    })

    it('should switch to settings tab when clicked', async () => {
      render(
        <RouteEditor
          route={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const settingsTab = screen.getByRole('tab', { name: /设置/ })
      fireEvent.mouseDown(settingsTab)

      expect(await screen.findByRole('checkbox')).toBeInTheDocument()
    })
  })
})
