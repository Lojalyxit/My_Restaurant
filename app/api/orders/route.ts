import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/api'
import { sendOrderEmail } from '@/lib/mailer'

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const data = await createOrder({
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email,
      delivery_address: body.delivery_address,
      delivery_neighborhood: body.delivery_district,
      delivery_instructions: body.delivery_instructions || '',
      subtotal: Number(body.subtotal).toFixed(2),
      delivery_fee: Number(body.delivery_fee).toFixed(2),
      total: Number(body.total).toFixed(2),
      items: body.items.map((i: { menu_item_id: string; menu_item_name: string; unit_price: number; quantity: number }) => ({
        menu_item: i.menu_item_id,
        item_name: i.menu_item_name,
        item_price: Number(i.unit_price).toFixed(2),
        quantity: i.quantity,
      })),
    })

    try {
      await sendOrderEmail(body)
    } catch (e) {
      console.error('Email order error:', e)
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
