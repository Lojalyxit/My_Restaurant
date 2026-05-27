// Reservations are now created directly via lib/api.ts → Django POST /reservations/
// This route is kept as a stub in case a server-side email hook is needed later.
import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ ok: true })
}
