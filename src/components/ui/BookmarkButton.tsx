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
      className={`btn-secondary min-w-[160px] ${bookmarked ? 'bg-accent text-background border-accent' : ''}`}
    >
      <svg
        width="16" height="16" viewBox="0 0 24 24"
        fill={bookmarked ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
      <span>
        {bookmarked ? 'In Library' : 'Add to Library'}
      </span>
    </button>
  )
}
