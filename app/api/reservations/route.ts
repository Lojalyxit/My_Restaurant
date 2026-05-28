import { NextResponse } from 'next/server'
import { sendReservationEmail } from '@/lib/mailer'

const DJANGO = process.env.NEXT_PUBLIC_API_URL || 'http://35.172.107.240/api'

export async function POST(request: Request) {
  const body = await request.json()
  const res = await fetch(`${DJANGO}/reservations/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()

  if (res.ok) {
    sendReservationEmail(body)
      .then(() => console.log('[EMAIL] Réservation envoyée à', process.env.MANAGER_EMAIL))
      .catch((err) => console.error('[EMAIL ERROR] Réservation:', err?.message ?? err))
  }

  return NextResponse.json(data, { status: res.status })
}
