import { NextResponse } from 'next/server'
import { sendOrderEmail } from '@/lib/mailer'

const DJANGO = process.env.NEXT_PUBLIC_API_URL || 'http://35.172.107.240/api'

export async function POST(request: Request) {
  const body = await request.json()
  const res = await fetch(`${DJANGO}/orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()

  if (res.ok) {
    sendOrderEmail({ ...body, order_number: data.order_number ?? data.id ?? 'N/A' })
      .then(() => console.log('[EMAIL] Commande envoyée à', process.env.MANAGER_EMAIL))
      .catch((err) => console.error('[EMAIL ERROR] Commande:', err?.message ?? err))
  }

  return NextResponse.json(data, { status: res.status })
}
