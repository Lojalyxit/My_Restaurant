import type {
  MenuItem,
  CreateOrderInput,
  Order,
  CreateReservationInput,
  Reservation,
} from '@/types/api'

export type {
  MenuItem,
  CreateOrderInput,
  Order,
  CreateReservationInput,
  Reservation,
}

// Browser calls go to Next.js proxy routes (/api/*) to avoid CORS in dev.
// In production, nginx routes /api/* directly to Django before reaching Next.js.
const PROXY = '/api'

export async function getMenu(): Promise<MenuItem[]> {
  const res = await fetch(`${PROXY}/menu`)
  if (!res.ok) throw new Error('Impossible de charger le menu')
  const data: MenuItem[] = await res.json()
  return data.filter((i) => i.is_available)
}

export async function getMenuByCategory(category: string): Promise<MenuItem[]> {
  const items = await getMenu()
  return items.filter((i) => i.category === category)
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const res = await fetch(`${PROXY}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(JSON.stringify(err))
  }
  return res.json()
}

export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  const res = await fetch(`${PROXY}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(JSON.stringify(err))
  }
  return res.json()
}
