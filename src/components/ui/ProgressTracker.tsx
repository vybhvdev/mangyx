'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Props {
  mangaId: string
  chapterId: string
  chapterNum: string
  mangaTitle: string
  coverUrl: string
  source: string
}

export function ProgressTracker({ mangaId, chapterId, chapterNum, mangaTitle, coverUrl, source }: Props) {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user) return

    // Save progress after 3 seconds of reading
    const timer = setTimeout(() => {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mangaId, chapterId, chapterNum, mangaTitle, coverUrl, source }),
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [chapterId, session])

  return null
}
