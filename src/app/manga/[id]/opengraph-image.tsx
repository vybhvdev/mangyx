import { ImageResponse } from 'next/og'
import { getMangaById, getCoverUrl, getTitle } from '@/lib/mangadex'

export const runtime = 'edge'
export const alt = 'Manga Cover'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const manga = await getMangaById(params.id).catch(() => null)
  if (!manga) return new ImageResponse(<div>Mangyx</div>)

  const title = getTitle(manga)
  const cover = getCoverUrl(manga, '512')
  const status = manga.attributes?.status ?? ''
  const year = manga.attributes?.year ?? ''

  return new ImageResponse(
    <div
      style={{
        width: '1200px', height: '630px',
        background: '#111010',
        display: 'flex', alignItems: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      {cover && (
        <img
          src={cover}
          style={{ width: '420px', height: '630px', objectFit: 'cover', flexShrink: 0 }}
        />
      )}
      <div style={{ flex: 1, padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
        <div style={{ fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', color: '#8f8270', marginBottom: '16px' }}>
          MANGYX · {status.toUpperCase()} {year && `· ${year}`}
        </div>
        <div style={{ fontSize: title.length > 20 ? '48px' : '64px', fontWeight: 900, color: '#f5f2ec', lineHeight: 1, marginBottom: '24px' }}>
          {title}
        </div>
        <div style={{ fontSize: '18px', color: '#756a5a', letterSpacing: '2px' }}>
          READ FREE ON MANGYX
        </div>
      </div>
    </div>,
    { ...size }
  )
}
