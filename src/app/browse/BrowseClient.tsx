'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const FEATURED_GENRES = ['Action', 'Romance', 'Comedy', 'Fantasy', 'Horror', 'Sci-Fi', 'Slice of Life', 'Sports', 'Drama', 'Mystery']

interface Tag {
  id: string
  name: string
}

interface Props {
  tags: Tag[]
}

export function BrowseClient({ tags }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const activeTag = searchParams.get('tag') ?? ''

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (activeTag) params.set('tag', activeTag)
    router.push(`/browse?${params}`)
  }

  function setTag(tagId: string) {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (tagId) params.set('tag', tagId)
    router.push(`/browse?${params}`)
  }

  const featuredTags = tags.filter((t) => FEATURED_GENRES.includes(t.name))

  return (
    <div className="mb-12 space-y-10 animate-fade-up">
      {/* Search */}
      <form onSubmit={submitSearch} className="relative max-w-2xl group">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="SEARCH BY TITLE OR AUTHOR"
          className="w-full bg-surface border-b border-border px-0 py-5
                     text-foreground outline-none transition-all duration-300
                     focus:border-accent placeholder:text-text-muted/50 font-syne font-bold text-xs uppercase tracking-[0.2em]"
        />
        <button
          type="submit"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </form>

      {/* Genre chips */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 flex-wrap">
        <button
          onClick={() => setTag('')}
          className={`px-6 py-3 text-[9px] font-bold uppercase tracking-[0.2em] border transition-all whitespace-nowrap
            ${!activeTag ? 'bg-accent text-background border-accent' : 'bg-transparent border-border text-text-muted hover:border-accent hover:text-accent'}`}
        >
          Catalog
        </button>
        {featuredTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setTag(tag.id)}
            className={`px-6 py-3 text-[9px] font-bold uppercase tracking-[0.2em] border transition-all whitespace-nowrap
              ${activeTag === tag.id ? 'bg-accent text-background border-accent' : 'bg-transparent border-border text-text-muted hover:border-accent hover:text-accent'}`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  )
}
