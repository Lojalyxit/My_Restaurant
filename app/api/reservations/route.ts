import { NextResponse } from 'next/server'

const DJANGO = process.env.NEXT_PUBLIC_API_URL || 'http://35.172.107.240/api'

export async function POST(request: Request) {
  const body = await request.json()
  const res = await fetch(`${DJANGO}/reservations/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
