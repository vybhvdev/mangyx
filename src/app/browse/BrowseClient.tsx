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
    <div className="mb-12 space-y-8 animate-fade-up">
      {/* Search */}
      <form onSubmit={submitSearch} className="relative max-w-xl group">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors"
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, artist, or tag…"
          className="w-full bg-surface border border-border pl-12 pr-24 py-4 rounded-2xl
                     text-foreground outline-none transition-all duration-300
                     focus:border-accent/50 focus:bg-background placeholder:text-text-muted"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-accent text-white px-6 rounded-xl
                     font-bold text-xs uppercase tracking-widest hover:bg-accent-hover transition-all"
        >
          Search
        </button>
      </form>

      {/* Genre chips */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 flex-wrap">
        <button
          onClick={() => setTag('')}
          className={`px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap
            ${!activeTag ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'bg-surface border-border text-text-muted hover:border-accent hover:text-accent'}`}
        >
          All Genres
        </button>
        {featuredTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setTag(tag.id)}
            className={`px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap
              ${activeTag === tag.id ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'bg-surface border-border text-text-muted hover:border-accent hover:text-accent'}`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  )
}
