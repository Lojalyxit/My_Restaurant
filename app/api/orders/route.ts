import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendOrderEmail } from '@/lib/mailer'

export async function POST(request: Request) {
  const body = await request.json()

  const { data, error } = await supabaseAdmin.from('orders').insert(body).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  try {
    await sendOrderEmail(body)
  } catch (e) {
    console.error('Email order error:', e)
  }

  return NextResponse.json(data[0])
}
