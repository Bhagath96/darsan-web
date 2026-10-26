import type { NAKSHATRAS, OFFERING_CATEGORIES } from '@/lib/constants'

export type UserRole = 'DEVOTEE' | 'STAFF' | 'ADMIN'
export type Language = 'en' | 'ml'

/** A logged-in user as the app sees it (never includes the password). */
export interface AuthUser {
  id: string
  username: string
  name: string
  phone: string
  role: UserRole
  /** Staff are tied to one temple; devotees and admins are not. */
  templeId: string | null
}

export interface LoginRequest {
  username: string
  password: string
}

export interface Session {
  token: string
  user: AuthUser
}

/** Text stored in both interface languages. */
export interface Localized {
  en: string
  ml: string
}

export type Nakshatra = (typeof NAKSHATRAS)[number]['id']
export type OfferingCategory = (typeof OFFERING_CATEGORIES)[number]

/** Calendar date in IST, formatted YYYY-MM-DD. */
export type IsoDate = string
/** Instant in time, ISO 8601 UTC string. */
export type IsoDateTime = string

export interface Temple {
  id: string
  name: Localized
  location: Localized
  deity: Localized
  image: string
  timings: string
}

export interface Offering {
  id: string
  templeId: string
  name: Localized
  description: Localized
  /** Whole rupees. */
  price: number
  isActive: boolean
  category: OfferingCategory
  image: string
}

export interface CartItem {
  offeringId: string
  templeId: string
  name: Localized
  unitPrice: number
  quantity: number
}

/** Details the devotee enters once per order. */
export interface DevoteeDetails {
  devoteeName: string
  phone: string
  star: Nakshatra
  offeringDate: IsoDate
}

export type OrderStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface OrderLine {
  offeringId: string
  offeringName: Localized
  quantity: number
  unitPrice: number
}

export interface Order extends DevoteeDetails {
  id: string
  orderNumber: string
  templeId: string
  /** Account that placed the order; null for counter orders made before login existed. */
  userId: string | null
  items: OrderLine[]
  totalAmount: number
  status: OrderStatus
  createdAt: IsoDateTime
}

export interface CreateOrderRequest extends DevoteeDetails {
  templeId: string
  items: Array<{ offeringId: string; quantity: number }>
  /** Same key on a retry returns the original order instead of creating a new one. */
  idempotencyKey: string
}

export interface OrderQuery {
  status?: OrderStatus
  date?: IsoDate
  phone?: string
  templeId?: string
  page: number
  pageSize: number
}

export interface Paged<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface DarshanSlot {
  id: string
  templeId: string
  date: IsoDate
  startsAt: IsoDateTime
  endsAt: IsoDateTime
  totalCapacity: number
  remainingTickets: number
  isBlocked: boolean
}

export type BookingStatus = 'BOOKED' | 'CANCELLED'

export interface Booking {
  id: string
  bookingRef: string
  templeId: string
  slotId: string
  userId: string | null
  date: IsoDate
  startsAt: IsoDateTime
  devoteeName: string
  phone: string
  ticketCount: number
  status: BookingStatus
  createdAt: IsoDateTime
}

export interface CreateBookingRequest {
  slotId: string
  devoteeName: string
  phone: string
  ticketCount: number
  idempotencyKey: string
}

/** Standard shape for any piece of server data held in the store. */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'
