import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getServiceClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const { username, email, password } = await req.json()

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'All fields required.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const db = getServiceClient()

  // Check if email already exists
  const { data: existing } = await db
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Email already in use.' }, { status: 409 })
  }

  const password_hash = await bcrypt.hash(password, 12)

  const { error } = await db.from('users').insert({
    username,
    email: email.toLowerCase(),
    password_hash,
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
