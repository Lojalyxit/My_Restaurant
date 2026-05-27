export type MenuCategory =
  | 'plats'
  | 'entrees'
  | 'grillades'
  | 'accompagnements'
  | 'desserts'
  | 'boissons'

export interface MenuItem {
  id: number
  category: MenuCategory
  name: string
  description: string
  price: string        // Django decimal → string e.g. "25.00"
  image: string        // Full URL e.g. "http://35.172.107.240/media/menu/..."
  is_signature: boolean
  is_available: boolean
  display_order: number
  created_at: string
}

export interface OrderItem {
  menu_item: number    // Django integer FK
  item_name: string
  item_price: string   // "25.00"
  quantity: number
}

export interface CreateOrderInput {
  customer_name: string
  customer_phone: string
  customer_email?: string
  delivery_address: string
  delivery_neighborhood?: string
  delivery_instructions?: string
  subtotal: string
  delivery_fee: string
  total: string
  items: OrderItem[]
}

export interface Order extends CreateOrderInput {
  id: number
  created_at: string
}

export interface CreateReservationInput {
  nom: string
  email: string
  telephone: string
  date_reservation: string   // "2026-06-15"
  heure: string              // "19:30:00" — seconds required by Django
  nombre_personnes: number
  message?: string
}

export interface Reservation extends CreateReservationInput {
  id: number
  created_at: string
}
