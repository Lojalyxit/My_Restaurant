import { NextResponse } from 'next/server'

export async function POST() {
  // No Django endpoint for newsletter — returns success without DB persistence
  return NextResponse.json({ success: true })
}
