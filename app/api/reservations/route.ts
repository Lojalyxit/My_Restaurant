import { NextResponse } from 'next/server'
import { createReservation } from '@/lib/api'
import { sendReservationEmail } from '@/lib/mailer'

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const data = await createReservation({
      nom: body.name,
      email: body.email,
      telephone: body.phone,
      date_reservation: body.date,
      heure: body.time,
      nombre_personnes: body.guests,
      message: body.message || '',
    })

    try {
      await sendReservationEmail(body)
    } catch (e) {
      console.error('Email reservation error:', e)
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
