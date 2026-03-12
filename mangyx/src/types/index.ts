// ── MangaDex types ────────────────────────────────

export interface MangaTitle {
  en?: string
  ja?: string
  'ja-ro'?: string
  [lang: string]: string | undefined
}

export interface MangaAttributes {
  title: MangaTitle
  description: Record<string, string>
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled'
  year: number | null
  originalLanguage: string
  tags: MangaTag[]
  contentRating: string
  lastChapter: string | null
  lastVolume: string | null
}

export interface MangaTag {
  id: string
  type: 'tag'
  attributes: {
    name: { en: string }
    group: string
  }
}

export interface CoverArtAttributes {
  fileName: string
  volume: string | null
}

export interface ScanlationGroupAttributes {
  name: string
}

export interface Relationship {
  id: string
  type: string
  attributes?: CoverArtAttributes & ScanlationGroupAttributes & Record<string, unknown>
}

export interface Manga {
  id: string
  type: 'manga'
  attributes: MangaAttributes
  relationships: Relationship[]
}

export interface ChapterAttributes {
  chapter: string | null
  title: string | null
  volume: string | null
  translatedLanguage: string
  publishAt: string
  createdAt: string
  pages: number
  externalUrl: string | null
}

export interface Chapter {
  id: string
  type: 'chapter'
  attributes: ChapterAttributes
  relationships: Relationship[]
}

export interface MangaDexListResponse<T> {
  result: 'ok' | 'error'
  data: T[]
  limit: number
  offset: number
  total: number
}

export interface AtHomeResponse {
  result: 'ok'
  baseUrl: string
  chapter: {
    hash: string
    data: string[]
    dataSaver: string[]
  }
}

// ── App types ────────────────────────────────────

export interface BookmarkRow {
  id: string
  user_id: string
  manga_id: string
  manga_title: string
  cover_url: string | null
  status: string | null
  created_at: string
}

export interface ReadProgressRow {
  id: string
  user_id: string
  manga_id: string
  chapter_id: string
  chapter_num: string
  updated_at: string
}
