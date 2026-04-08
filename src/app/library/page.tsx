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
      <div className="mb-12">
        <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
          Personal Collection
        </span>
        <h1 className="font-syne font-black text-4xl md:text-6xl text-white mb-4 tracking-tight">Your Library</h1>
        <p className="text-text-muted text-sm md:text-base">{items.length} bookmark{items.length !== 1 ? 's' : ''} saved to your account.</p>
      </div>

      {items.length === 0 ? (
        <div className="py-24 text-center bg-surface/30 rounded-3xl border border-dashed border-white/5">
          <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center text-accent mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          </div>
          <p className="text-foreground font-bold text-lg mb-2">Library is empty</p>
          <p className="text-text-muted text-sm max-w-xs mx-auto mb-8">Browse our collection and bookmark your favorite series to keep track of them here.</p>
          <Link href="/browse" className="btn-primary">Browse All Manga</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
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
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="200px"
                      />
                    )}
                    {bm.status && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-bold uppercase tracking-wider text-white border border-white/10">
                        {bm.status}
                      </span>
                    )}
                    
                    {/* Progress Overlay */}
                    {progress && (
                      <div className="absolute bottom-0 inset-x-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-accent text-white py-2 rounded-lg text-center shadow-xl">
                          <p className="text-[10px] font-black uppercase tracking-widest">Resume ch. {progress.chapterNum}</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="mt-3 font-semibold text-sm line-clamp-2 text-foreground group-hover:text-accent transition-colors duration-200">
                    {bm.manga_title}
                  </h3>
                </Link>
                {progress && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent opacity-50" style={{ width: '100%' }} />
                    </div>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Ch. {progress.chapterNum}</span>
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
