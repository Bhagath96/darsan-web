import type { NAKSHATRAS, NOTICE_CATEGORIES, OFFERING_CATEGORIES } from '@/lib/constants'

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

/** One fixed ritual in a temple's day, e.g. 04:30 Usha Pooja. */
export interface ScheduleItem {
  /** 24-hour IST wall-clock time, HH:mm. */
  time: string
  name: Localized
}

export interface Temple {
  id: string
  name: Localized
  location: Localized
  deity: Localized
  image: string
  /** Opening hours as shown to devotees, e.g. "3:00 am – 1:30 pm · 4:30 pm – 9:15 pm". */
  timings: string
  about: Localized
  address: Localized
  contactPhone: string
  schedule: ScheduleItem[]
}

export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number]

/** A temple announcement: festival, timing change, closure or general information. */
export interface Notice {
  id: string
  /** null = applies to every temple. */
  templeId: string | null
  category: NoticeCategory
  /** Shown first and highlighted. */
  important: boolean
  title: Localized
  body: Localized
  publishedAt: IsoDateTime
  /** The day the notice is about, if any (festival day, closure day). */
  eventDate: IsoDate | null
}

export interface NoticeQuery {
  templeId?: string
  category?: NoticeCategory
  /** Return at most this many, newest first. */
  limit?: number
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
