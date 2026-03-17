'use client'
import { useEffect, useRef } from 'react'

export function ReaderBannerAd() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const s1 = document.createElement('script')
    s1.innerHTML = `atOptions = {'key':'639382cab495612217075772b6044704','format':'iframe','height':250,'width':300,'params':{}};`
    const s2 = document.createElement('script')
    s2.src = 'https://www.highperformanceformat.com/639382cab495612217075772b6044704/invoke.js'
    ref.current.appendChild(s1)
    ref.current.appendChild(s2)
  }, [])

  return (
    <div className="flex justify-center py-4 bg-[#0d0d0d]">
      <div ref={ref} style={{ width: 300, height: 250 }} />
    </div>
  )
}
