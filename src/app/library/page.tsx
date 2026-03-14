import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getServiceClient } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default async function LibraryPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/library')

  const db = getServiceClient()

  const [{ data: bookmarks }, { data: progressRows }] = await Promise.all([
    db.from('bookmarks').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
    db.from('reading_progress').select('manga_id, chapter_num, chapter_id').eq('user_id', session.user.id),
  ])

  const items = bookmarks ?? []

  const progressMap = Object.fromEntries(
    (progressRows ?? []).map((r) => [r.manga_id, { chapterNum: r.chapter_num, chapterId: r.chapter_id }])
  )

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12 pb-16 animate-fade-up">
      <h1 className="font-syne font-black text-[2.5rem] tracking-[-0.02em] mb-1">Library</h1>
      <p className="label-mono mb-10">{items.length} bookmark{items.length !== 1 ? 's' : ''}</p>

      {items.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-ink-200">
          <p className="font-cormorant text-[1.1rem] text-ink-500 mb-6">
            Your library is empty. Browse and bookmark manga to see them here.
          </p>
          <Link href="/browse" className="btn-primary">Browse Manga</Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {items.map((bm) => {
            const progress = progressMap[bm.manga_id]
            return (
              <div key={bm.id} className="group relative">
                <Link href={`/manga/${bm.manga_id}`} className="no-underline block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-ink-200">
                    {bm.cover_url && (
                      <Image
                        src={bm.cover_url}
                        alt={bm.manga_title}
                        fill
                        className="object-cover transition-transform duration-400 group-hover:scale-[1.04]"
                        sizes="200px"
                      />
                    )}
                    {bm.status && (
                      <span className="absolute top-1.5 left-1.5 bg-paper/90 font-mono text-[9px] tracking-[0.15em] uppercase text-ink-700 px-1.5 py-0.5">
                        {bm.status}
                      </span>
                    )}
                  </div>
                  <p className="card-title group-hover:text-ink-600">{bm.manga_title}</p>
                </Link>
                {progress && (
                  <a
                    href={`/reader/${progress.chapterId}?manga=${bm.manga_id}`}
                    className="absolute bottom-6 left-0 right-0 bg-onyx/90 font-mono text-[9px] tracking-[0.12em] uppercase text-paper px-1.5 py-1 text-center hover:bg-onyx transition-colors no-underline"
                  >
                    Ch. {progress.chapterNum} →
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
