export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'entrees' | 'signatures' | 'grillades' | 'accompagnements' | 'desserts' | 'boissons'
  image_url: string
  is_signature: boolean
  is_available: boolean
  created_at: string
}

export interface OrderItem {
  menu_item_id: string
  menu_item_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
}
