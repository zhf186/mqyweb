// 线路相关类型
export interface Route {
  id: string
  title: string
  titleEn?: string
  subtitle?: string
  description: string
  descriptionEn?: string
  images: string[]
  price: number
  duration: string
  difficulty: 'easy' | 'medium' | 'hard'
  highlights: string[]
  highlightsEn?: string[]
  categoryId: string
  maxParticipants: number
  isActive: boolean
  createdAt: string
}

export interface RouteCategory {
  id: string
  name: string
  nameEn?: string
  slug: string
  description?: string
}

export interface RouteSchedule {
  id: string
  routeId: string
  scheduleDate: string
  availableSpots: number
}

// 订单相关类型
export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'confirmed' 
  | 'completed' 
  | 'cancelled' 
  | 'refunded'

export interface Order {
  id: string
  orderNo: string
  userId: string
  routeId: string
  scheduleId: string
  participants: number
  totalPrice: number
  status: OrderStatus
  paymentMethod?: string
  paymentTime?: string
  contactName: string
  contactPhone: string
  remark?: string
  createdAt: string
}

// 内容管理类型
export type ContentType = 'banner' | 'news' | 'activity'

export interface Content {
  id: string
  type: ContentType
  title: string
  titleEn?: string
  content?: string
  contentEn?: string
  images: string[]
  isActive: boolean
  sortOrder: number
  createdAt: string
}

// 积分记录类型
export interface PointsRecord {
  id: string
  userId: string
  amount: number
  type: 'earn' | 'spend'
  source: string
  description: string
  createdAt: string
}

// API 响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 表单类型
export interface BookingFormData {
  routeId: string
  scheduleId: string
  participants: number
  contactName: string
  contactPhone: string
  remark?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  type: 'general' | 'partnership' | 'franchise'
}
