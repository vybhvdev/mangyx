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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 pb-20 animate-fade-up">
      <div className="mb-16">
        <span className="inline-block mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">Personal Archive</span>
        <h1 className="font-syne font-black text-4xl md:text-7xl text-foreground tracking-tight uppercase">Your Library</h1>
        <p className="font-cormorant text-xl text-text-muted italic mt-2">{items.length} titles saved to your collection.</p>
      </div>

      {items.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-border">
          <p className="text-foreground font-syne font-bold text-lg uppercase tracking-tight mb-8">Your collection is empty</p>
          <Link href="/browse" className="btn-primary">Explore Catalog</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {items.map((bm) => {
            const progress = progressMap[bm.manga_id]
            return (
              <div key={bm.id} className="group flex flex-col animate-fade-up">
                <Link href={`/manga/${bm.manga_id}`} className="block">
                  <div className="card-3-4">
                    {bm.cover_url && (
                      <Image
                        src={bm.cover_url}
                        alt={bm.manga_title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="200px"
                      />
                    )}
                    {bm.status && (
                      <span className="absolute top-0 left-0 bg-accent text-background text-[8px] font-bold uppercase tracking-widest px-2 py-1">
                        {bm.status}
                      </span>
                    )}
                    
                    {progress && (
                      <div className="absolute bottom-0 inset-x-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-accent text-background py-2 text-center shadow-2xl">
                          <p className="text-[9px] font-black uppercase tracking-widest">Resume ch. {progress.chapterNum}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 font-syne font-bold text-xs uppercase tracking-tight leading-tight line-clamp-2 text-foreground group-hover:text-accent transition-colors duration-200">
                    {bm.manga_title}
                  </h3>
                </Link>
                {progress && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-px bg-border relative">
                      <div className="absolute top-0 left-0 h-full bg-accent" style={{ width: '100%' }} />
                    </div>
                    <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Ch. {progress.chapterNum}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
