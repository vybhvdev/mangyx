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
    <div className="mb-8">
      {/* Search */}
      <form onSubmit={submitSearch} className="flex max-w-[480px] mb-5">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title…"
          className="flex-1 border border-ink-300 px-4 py-3.5 font-cormorant text-base outline-none
                     bg-paper text-ink-950 transition-colors focus:border-onyx placeholder:text-ink-400"
        />
        <button
          type="submit"
          className="bg-onyx text-paper border-none px-6 cursor-pointer hover:bg-ink-900 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </form>

      {/* Genre chips */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setTag('')}
          className={`font-mono text-[0.65rem] tracking-[0.12em] uppercase border px-3.5 py-1.5 cursor-pointer transition-all
            ${!activeTag ? 'bg-onyx text-paper border-onyx' : 'border-ink-200 text-ink-500 bg-transparent hover:bg-ink-100'}`}
        >
          All
        </button>
        {featuredTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setTag(tag.id)}
            className={`font-mono text-[0.65rem] tracking-[0.12em] uppercase border px-3.5 py-1.5 cursor-pointer transition-all
              ${activeTag === tag.id ? 'bg-onyx text-paper border-onyx' : 'border-ink-200 text-ink-500 bg-transparent hover:bg-ink-100'}`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  )
}
