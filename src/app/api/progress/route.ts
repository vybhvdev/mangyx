import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json([], { status: 200 })

  const { data } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', (session.user as any).id)
    .order('updated_at', { ascending: false })
    .limit(20)

  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    console.log('Progress POST body:', body)
    console.log('User ID:', (session.user as any).id)

    const { mangaId, chapterId, chapterNum, mangaTitle, coverUrl, source } = body

    const { data, error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: (session.user as any).id,
        manga_id: mangaId,
        chapter_id: chapterId,
        chapter_num: chapterNum,
        manga_title: mangaTitle,
        cover_url: coverUrl ?? '',
        source: source ?? 'mangadex',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,manga_id' })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', JSON.stringify(error))
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Caught error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
