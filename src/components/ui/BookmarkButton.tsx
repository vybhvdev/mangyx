'use client'

import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Props {
  mangaId: string
  mangaTitle: string
  coverUrl: string
  mangaStatus: string
  initialBookmarked?: boolean
}

export function BookmarkButton({ mangaId, mangaTitle, coverUrl, mangaStatus, initialBookmarked = false }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [pending, startTransition] = useTransition()

  function toggle() {
    if (!session) { router.push('/auth/signin'); return }

    setBookmarked(!bookmarked)
    startTransition(async () => {
      await fetch('/api/bookmarks', {
        method: bookmarked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mangaId, mangaTitle, coverUrl, mangaStatus }),
      })
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`btn-secondary transition-all ${bookmarked ? 'bg-onyx text-paper border-onyx' : ''}`}
    >
      <svg
        width="14" height="14" viewBox="0 0 24 24"
        fill={bookmarked ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="2"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  )
}
