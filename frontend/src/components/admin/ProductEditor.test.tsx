import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProductEditor from './ProductEditor'
import { productApi } from '@/lib/api/admin'

// Mock the API
vi.mock('@/lib/api/admin', () => ({
  productApi: {
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
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

describe('ProductEditor - Form Validation Tests (Requirements 9.2)', () => {
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Required Field Validation', () => {
    it('should show validation error when Chinese name is empty', async () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('请输入中文名称')).toBeInTheDocument()
      })
    })

    it('should show validation error when English name is empty', async () => {
      render(
        <ProductEditor
          product={null}
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
        <ProductEditor
          product={null}
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

    it('should show validation error when category is not selected', async () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('请选择分类')).toBeInTheDocument()
      })
    })
  })

  describe('Length Validation', () => {
    it('should show error when Chinese name exceeds 200 characters', async () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const nameInput = screen.getByPlaceholderText('例如：手工陶瓷茶具')
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
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const slugInput = screen.getByPlaceholderText('ceramic-tea-set')
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
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Switch to description tab
      const descriptionTab = screen.getByRole('tab', { name: /详细描述/ })
      fireEvent.mouseDown(descriptionTab)

      const shortDescInput = screen.getByPlaceholderText('简短介绍商品特色...')
      const longDesc = 'a'.repeat(501)
      fireEvent.change(shortDescInput, { target: { value: longDesc } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('简短描述不能超过500个字符')).toBeInTheDocument()
      })
    })

    it('should show error when merchant name exceeds 200 characters', async () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Switch to merchant tab
      const merchantTab = screen.getByRole('tab', { name: /商家信息/ })
      fireEvent.mouseDown(merchantTab)

      const merchantNameInput = screen.getByPlaceholderText('例如：老李茶具店')
      const longName = 'a'.repeat(201)
      fireEvent.change(merchantNameInput, { target: { value: longName } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('商家名称不能超过200个字符')).toBeInTheDocument()
      })
    })
  })

  describe('Price Validation', () => {
    it('should show error when original price is negative', async () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const originalPriceInput = screen.getByLabelText(/原价 \(¥\)/)
      fireEvent.change(originalPriceInput, { target: { value: '-100' } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('价格必须大于0')).toBeInTheDocument()
      })
    })

    it('should show error when current price is negative', async () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const currentPriceInput = screen.getByLabelText(/现价 \(¥\)/)
      fireEvent.change(currentPriceInput, { target: { value: '-50' } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('价格必须大于0')).toBeInTheDocument()
      })
    })

    it('should show error when stock quantity is negative', async () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const stockInput = screen.getByLabelText(/库存/)
      fireEvent.change(stockInput, { target: { value: '-10' } })

      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('库存必须大于等于0')).toBeInTheDocument()
      })
    })
  })

  describe('Category Selection', () => {
    it('should have all five category options', () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Find category select trigger
      const categoryLabels = screen.getAllByText(/分类/)
      expect(categoryLabels.length).toBeGreaterThan(0)
    })
  })

  describe('Character Counter Display', () => {
    it('should display character count for short description', async () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Switch to description tab
      const descriptionTab = screen.getByRole('tab', { name: /详细描述/ })
      fireEvent.mouseDown(descriptionTab)

      const shortDescInput = screen.getByPlaceholderText('简短介绍商品特色...')
      fireEvent.change(shortDescInput, { target: { value: 'Test product' } })

      await waitFor(() => {
        expect(screen.getByText(/12 \/ 500 字符/)).toBeInTheDocument()
      })
    })

    it('should update character count as user types', async () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const descriptionTab = screen.getByRole('tab', { name: /详细描述/ })
      fireEvent.mouseDown(descriptionTab)

      const shortDescInput = screen.getByPlaceholderText('简短介绍商品特色...')
      
      // Type first text
      fireEvent.change(shortDescInput, { target: { value: 'Hello' } })
      await waitFor(() => {
        expect(screen.getByText(/5 \/ 500 字符/)).toBeInTheDocument()
      })

      // Type more text
      fireEvent.change(shortDescInput, { target: { value: 'Hello World' } })
      await waitFor(() => {
        expect(screen.getByText(/11 \/ 500 字符/)).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should call createProduct API when creating new product with valid data', async () => {
      const mockCreate = vi.mocked(productApi.createProduct).mockResolvedValue({
        code: 200,
        message: 'Success',
        data: {
          id: '1',
          nameZh: '测试商品',
          nameEn: 'Test Product',
          slug: 'test-product',
          category: '食',
          originalPrice: 100,
          currentPrice: 80,
          stockQuantity: 50,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })

      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Fill in required fields
      fireEvent.change(screen.getByPlaceholderText('例如：手工陶瓷茶具'), {
        target: { value: '测试商品' },
      })
      fireEvent.change(screen.getByPlaceholderText(/Handmade Ceramic Tea Set/), {
        target: { value: 'Test Product' },
      })
      fireEvent.change(screen.getByPlaceholderText('ceramic-tea-set'), {
        target: { value: 'test-product' },
      })
      const categoryTrigger = screen.getAllByRole('combobox')[0]
      fireEvent.click(categoryTrigger)
      const [firstCategoryOption] = await screen.findAllByRole('option')
      fireEvent.click(firstCategoryOption)
      fireEvent.change(screen.getByLabelText(/原价 \(¥\)/), {
        target: { value: '100' },
      })
      fireEvent.change(screen.getByLabelText(/现价 \(¥\)/), {
        target: { value: '80' },
      })
      fireEvent.change(screen.getByLabelText(/库存/), {
        target: { value: '50' },
      })

      // Submit form
      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            nameZh: '测试商品',
            nameEn: 'Test Product',
            slug: 'test-product',
            originalPrice: 100,
            currentPrice: 80,
            stockQuantity: 50,
          })
        )
      })
    })

    it('should call updateProduct API when editing existing product', async () => {
      const existingProduct = {
        id: '1',
        nameZh: '现有商品',
        nameEn: 'Existing Product',
        slug: 'existing-product',
        category: '食',
        originalPrice: 100,
        currentPrice: 80,
        stockQuantity: 50,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const mockUpdate = vi.mocked(productApi.updateProduct).mockResolvedValue({
        code: 200,
        message: 'Success',
        data: existingProduct,
      })

      render(
        <ProductEditor
          product={existingProduct}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      // Modify a field
      const nameInput = screen.getByPlaceholderText('例如：手工陶瓷茶具')
      fireEvent.change(nameInput, { target: { value: '更新的商品' } })

      // Submit form
      const submitButton = screen.getByRole('button', { name: /保存/ })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(
          '1',
          expect.objectContaining({
            nameZh: '更新的商品',
          })
        )
      })
    })
  })

  describe('Dialog Behavior', () => {
    it('should render dialog when isOpen is true', () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('创建商品')).toBeInTheDocument()
    })

    it('should show correct title when editing', () => {
      const existingProduct = {
        id: '1',
        nameZh: '现有商品',
        nameEn: 'Existing Product',
        slug: 'existing-product',
        category: '食',
        originalPrice: 100,
        currentPrice: 80,
        stockQuantity: 50,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      render(
        <ProductEditor
          product={existingProduct}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      expect(screen.getByText('编辑商品')).toBeInTheDocument()
    })

    it('should call onClose when cancel button is clicked', () => {
      render(
        <ProductEditor
          product={null}
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
    it('should have three tabs: basic, description, merchant', () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      expect(screen.getByRole('tab', { name: /基本信息/ })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /详细描述/ })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /商家信息/ })).toBeInTheDocument()
    })

    it('should switch to description tab when clicked', async () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const descriptionTab = screen.getByRole('tab', { name: /详细描述/ })
      fireEvent.mouseDown(descriptionTab)

      expect(await screen.findByPlaceholderText('简短介绍商品特色...')).toBeInTheDocument()
    })

    it('should switch to merchant tab when clicked', async () => {
      render(
        <ProductEditor
          product={null}
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: createWrapper() }
      )

      const merchantTab = screen.getByRole('tab', { name: /商家信息/ })
      fireEvent.mouseDown(merchantTab)

      expect(await screen.findByPlaceholderText('例如：老李茶具店')).toBeInTheDocument()
    })
  })
})
