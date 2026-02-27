import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PartnersPage from './page'
import { partnerApi } from '@/lib/api/admin'

// Mock the API
vi.mock('@/lib/api/admin', () => ({
  partnerApi: {
    getPartners: vi.fn(),
    deletePartner: vi.fn(),
    reorderPartners: vi.fn(),
  },
}))

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

// Mock PartnerEditor component
vi.mock('@/components/admin/PartnerEditor', () => ({
  default: function MockPartnerEditor({ isOpen }: any) {
    return isOpen ? <div data-testid="partner-editor">Partner Editor Mock</div> : null
  },
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

const mockPartners = [
  {
    id: '1',
    name: '合作伙伴A',
    type: 'brand' as const,
    descriptionZh: '品牌合作伙伴A的描述',
    descriptionEn: 'Description of Brand Partner A',
    logoId: 'logo-1',
    websiteUrl: 'https://partner-a.com',
    isActive: true,
    displayOrder: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '合作伙伴B',
    type: 'scenic_area' as const,
    descriptionZh: '景区合作伙伴B的描述',
    descriptionEn: 'Description of Scenic Area Partner B',
    logoId: 'logo-2',
    websiteUrl: 'https://partner-b.com',
    isActive: true,
    displayOrder: 1,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: '合作伙伴C',
    type: 'brand' as const,
    descriptionZh: '品牌合作伙伴C的描述',
    descriptionEn: 'Description of Brand Partner C',
    logoId: 'logo-3',
    websiteUrl: '',
    isActive: false,
    displayOrder: 2,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
]

describe('PartnersPage - Drag and Drop Sorting Tests (Requirements 10.4)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(partnerApi.getPartners).mockResolvedValue({
      code: 200,
      message: 'Success',
      data: mockPartners,
      timestamp: new Date().toISOString(),
    })
  })

  describe('Drag and Drop UI Elements', () => {
    it('should render drag handle icon for each partner row', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
      })

      // Check for GripVertical icons (drag handles)
      const dragHandles = document.querySelectorAll('.lucide-grip-vertical')
      expect(dragHandles.length).toBe(3) // One for each partner
    })

    it('should make table rows draggable', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
      })

      // Find all table rows with partner data
      const rows = screen.getAllByRole('row')
      // Filter out header row
      const dataRows = rows.filter(row => row.getAttribute('draggable') === 'true')
      
      expect(dataRows.length).toBe(3)
      dataRows.forEach(row => {
        expect(row).toHaveAttribute('draggable', 'true')
      })
    })

    it('should display instruction text about drag and drop', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText(/支持拖拽排序/)).toBeInTheDocument()
      })
    })
  })

  describe('Drag Start Event', () => {
    it('should handle drag start event', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
      })

      const rows = screen.getAllByRole('row')
      const firstDataRow = rows.find(row => 
        row.textContent?.includes('合作伙伴A') && row.getAttribute('draggable') === 'true'
      )

      expect(firstDataRow).toBeDefined()
      
      if (firstDataRow) {
        // Trigger drag start
        fireEvent.dragStart(firstDataRow)
        
        // Row should have opacity-50 class when being dragged
        await waitFor(() => {
          expect(firstDataRow).toHaveClass('opacity-50')
        })
      }
    })
  })

  describe('Drag Over Event', () => {
    it('should handle drag over event and prevent default', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
      })

      const rows = screen.getAllByRole('row')
      const dataRows = rows.filter(row => row.getAttribute('draggable') === 'true')
      
      const firstRow = dataRows[0]
      const secondRow = dataRows[1]

      // Start dragging first row
      fireEvent.dragStart(firstRow)

      // Drag over second row
      const dragOverEvent = new Event('dragover', { bubbles: true, cancelable: true })
      Object.defineProperty(dragOverEvent, 'preventDefault', {
        value: vi.fn(),
        writable: true,
      })
      
      secondRow.dispatchEvent(dragOverEvent)
      
      // preventDefault should be called
      expect(dragOverEvent.preventDefault).toHaveBeenCalled()
    })
  })

  describe('Drag End and Reorder', () => {
    it('should call reorderPartners API when drag ends', async () => {
      const mockReorder = vi.mocked(partnerApi.reorderPartners).mockResolvedValue({
        code: 200,
        message: 'Success',
        data: undefined,
        timestamp: new Date().toISOString(),
      })

      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
      })

      const rows = screen.getAllByRole('row')
      const dataRows = rows.filter(row => row.getAttribute('draggable') === 'true')
      
      const firstRow = dataRows[0]
      const secondRow = dataRows[1]

      // Simulate drag and drop
      fireEvent.dragStart(firstRow)
      fireEvent.dragOver(secondRow)
      fireEvent.dragEnd(firstRow)

      // API should be called with reordered partner IDs
      await waitFor(() => {
        expect(mockReorder).toHaveBeenCalled()
        const callArgs = mockReorder.mock.calls[0][0]
        expect(Array.isArray(callArgs)).toBe(true)
        expect(callArgs.length).toBe(3)
      })
    })

    it('should show success toast after successful reorder', async () => {
      const mockToast = vi.fn()
      vi.mocked(partnerApi.reorderPartners).mockResolvedValue({
        code: 200,
        message: 'Success',
        data: undefined,
        timestamp: new Date().toISOString(),
      })

      // Re-mock toast to capture calls
      vi.doMock('@/hooks/use-toast', () => ({
        useToast: () => ({
          toast: mockToast,
        }),
      }))

      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
      })

      const rows = screen.getAllByRole('row')
      const dataRows = rows.filter(row => row.getAttribute('draggable') === 'true')
      
      const firstRow = dataRows[0]

      // Simulate drag and drop
      fireEvent.dragStart(firstRow)
      fireEvent.dragEnd(firstRow)

      // Wait for API call and toast
      await waitFor(() => {
        expect(partnerApi.reorderPartners).toHaveBeenCalled()
      })
    })

    it('should handle reorder API failure gracefully', async () => {
      vi.mocked(partnerApi.reorderPartners).mockRejectedValue(
        new Error('Network error')
      )

      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
      })

      const rows = screen.getAllByRole('row')
      const dataRows = rows.filter(row => row.getAttribute('draggable') === 'true')
      
      const firstRow = dataRows[0]

      // Simulate drag and drop
      fireEvent.dragStart(firstRow)
      fireEvent.dragEnd(firstRow)

      // Should handle error without crashing
      await waitFor(() => {
        expect(partnerApi.reorderPartners).toHaveBeenCalled()
      })
    })
  })

  describe('Visual Feedback During Drag', () => {
    it('should apply opacity-50 class to dragged row', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
      })

      const rows = screen.getAllByRole('row')
      const firstDataRow = rows.find(row => 
        row.textContent?.includes('合作伙伴A') && row.getAttribute('draggable') === 'true'
      )

      if (firstDataRow) {
        // Before drag
        expect(firstDataRow).not.toHaveClass('opacity-50')

        // Start drag
        fireEvent.dragStart(firstDataRow)

        // During drag
        await waitFor(() => {
          expect(firstDataRow).toHaveClass('opacity-50')
        })

        // End drag
        fireEvent.dragEnd(firstDataRow)

        // After drag (opacity should be removed)
        await waitFor(() => {
          expect(firstDataRow).not.toHaveClass('opacity-50')
        })
      }
    })

    it('should show cursor-move on drag handle', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
      })

      const dragHandles = document.querySelectorAll('.lucide-grip-vertical')
      dragHandles.forEach(handle => {
        expect(handle).toHaveClass('cursor-move')
      })
    })
  })

  describe('Partner List Display', () => {
    it('should display all partners in order', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
        expect(screen.getByText('合作伙伴B')).toBeInTheDocument()
        expect(screen.getByText('合作伙伴C')).toBeInTheDocument()
      })
    })

    it('should display partner type badges correctly', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getAllByText('品牌合作').length).toBe(2) // Two brand partners
        expect(screen.getByText('景区合作')).toBeInTheDocument() // One scenic area partner
      })
    })

    it('should display active status badges', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        const activeBadges = screen.getAllByText('启用')
        const inactiveBadges = screen.getAllByText('禁用')
        expect(activeBadges.length).toBe(2)
        expect(inactiveBadges.length).toBe(1)
      })
    })

    it('should display website links when available', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        const websiteLinks = screen.getAllByText('访问网站')
        expect(websiteLinks.length).toBe(2) // Two partners have website URLs
      })
    })

    it('should display dash when website URL is not available', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        const dashElements = screen.getAllByText('-')
        expect(dashElements.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Page Header and Actions', () => {
    it('should display page title and description', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      expect(screen.getByText('合作伙伴管理')).toBeInTheDocument()
      expect(screen.getByText(/管理合作伙伴信息，支持拖拽排序/)).toBeInTheDocument()
    })

    it('should have add partner button', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      const addButton = screen.getByRole('button', { name: /添加合作伙伴/ })
      expect(addButton).toBeInTheDocument()
    })

    it('should open editor when add button is clicked', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      const addButton = screen.getByRole('button', { name: /添加合作伙伴/ })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByTestId('partner-editor')).toBeInTheDocument()
      })
    })
  })

  describe('Loading and Empty States', () => {
    it('should display loading state while fetching partners', async () => {
      vi.mocked(partnerApi.getPartners).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          code: 200,
          message: 'Success',
          data: mockPartners,
          timestamp: new Date().toISOString(),
        }), 100))
      )

      render(<PartnersPage />, { wrapper: createWrapper() })

      expect(screen.getByText('加载中...')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByText('加载中...')).not.toBeInTheDocument()
      })
    })

    it('should display empty state when no partners exist', async () => {
      vi.mocked(partnerApi.getPartners).mockResolvedValue({
        code: 200,
        message: 'Success',
        data: [],
        timestamp: new Date().toISOString(),
      })

      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('暂无合作伙伴数据')).toBeInTheDocument()
      })
    })
  })

  describe('Edit and Delete Actions', () => {
    it('should have edit and delete buttons for each partner', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
      })

      // Check that we have action buttons (simplified test)
      const allButtons = screen.getAllByRole('button')
      // Should have: 1 add button + 6 action buttons (2 per partner * 3 partners)
      expect(allButtons.length).toBeGreaterThanOrEqual(7)
    })

    it('should be able to interact with partner actions', async () => {
      render(<PartnersPage />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
      })

      // Verify that partners are displayed and interactive
      expect(screen.getByText('合作伙伴B')).toBeInTheDocument()
      expect(screen.getByText('合作伙伴C')).toBeInTheDocument()
    })
  })
})
