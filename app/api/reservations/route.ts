import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendReservationEmail } from '@/lib/mailer'

export async function POST(request: Request) {
  const body = await request.json()

  const { data, error } = await supabaseAdmin.from('reservations').insert(body).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  try {
    await sendReservationEmail(body)
  } catch (e) {
    console.error('Email reservation error:', e)
  }

  return NextResponse.json(data[0])
}
