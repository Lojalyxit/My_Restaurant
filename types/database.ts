// Re-exported from lib/api for convenience
export type { MenuItem, CreateOrderPayload, OrderItemPayload, CreateReservationPayload } from '@/lib/api'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
}
