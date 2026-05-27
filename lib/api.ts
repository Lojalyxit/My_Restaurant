const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://35.172.107.240/api'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  is_signature: boolean
  is_available: boolean
}

export interface OrderItemPayload {
  menu_item: string
  item_name: string
  item_price: string
  quantity: number
}

export interface CreateOrderPayload {
  customer_name: string
  customer_phone: string
  customer_email?: string
  delivery_address: string
  delivery_neighborhood?: string
  delivery_instructions?: string
  subtotal: string
  delivery_fee: string
  total: string
  items: OrderItemPayload[]
}

export interface CreateReservationPayload {
  nom: string
  email: string
  telephone: string
  date_reservation: string
  heure: string
  nombre_personnes: number
  message?: string
}

export async function getMenu(): Promise<MenuItem[]> {
  const res = await fetch(`${API_URL}/menu/`)
  if (!res.ok) throw new Error('Failed to fetch menu')
  const data = await res.json()
  return data.map((item: Record<string, unknown>) => ({
    ...item,
    id: String(item.id),
    price: typeof item.price === 'string' ? parseFloat(item.price as string) : item.price,
    // Django returns "image", we normalize to "image_url"
    image_url: (item.image_url as string) || (item.image as string) || '',
  })) as MenuItem[]
}

export async function createOrder(payload: CreateOrderPayload): Promise<unknown> {
  const res = await fetch(`${API_URL}/orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(JSON.stringify(err))
  }
  return res.json()
}

export async function createReservation(payload: CreateReservationPayload): Promise<unknown> {
  const res = await fetch(`${API_URL}/reservations/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(JSON.stringify(err))
  }
  return res.json()
}
