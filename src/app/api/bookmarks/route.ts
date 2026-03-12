import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getServiceClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { mangaId, mangaTitle, coverUrl, mangaStatus } = await req.json()
  const db = getServiceClient()

  const { error } = await db.from('bookmarks').upsert({
    user_id: userId,
    manga_id: mangaId,
    manga_title: mangaTitle,
    cover_url: coverUrl,
    status: mangaStatus,
  }, { onConflict: 'user_id,manga_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { mangaId } = await req.json()
  const db = getServiceClient()

  const { error } = await db.from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('manga_id', mangaId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
