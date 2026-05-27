import { NextResponse } from 'next/server'

const DJANGO = process.env.NEXT_PUBLIC_API_URL || 'http://35.172.107.240/api'

export async function GET() {
  const res = await fetch(`${DJANGO}/menu/`, { cache: 'no-store' })
  if (!res.ok) return NextResponse.json({ error: 'Django error' }, { status: res.status })
  const data = await res.json()
  return NextResponse.json(data)
}
