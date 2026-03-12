import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url) return new NextResponse('Missing url', { status: 400 })

  const referer = url.includes('mangadex.org') || url.includes('uploads.mangadex')
    ? 'https://mangadex.org'
    : url.includes('mangahere')
    ? 'https://mangahere.cc'
    : url.includes('mangapill') || url.includes('readdetectiveconan')
    ? 'https://mangapill.com'
    : 'https://mangapill.com'

  try {
    const res = await fetch(url, {
      headers: {
        'Referer': referer,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })
    if (!res.ok) return new NextResponse('Failed', { status: res.status })

    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') ?? 'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return new NextResponse('Error', { status: 500 })
  }
}
