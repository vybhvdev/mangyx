'use client'
import { useEffect, useRef } from 'react'

export function ReaderBannerAd() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const s1 = document.createElement('script')
    s1.innerHTML = `atOptions = {'key':'639382cab495612217075772b6044704','format':'iframe','height':250,'width':300,'params':{}};`
    const s2 = document.createElement('script')
    s2.src = 'https://www.highperformanceformat.com/639382cab495612217075772b6044704/invoke.js'
    s2.async = true
    document.body.appendChild(s1)
    document.body.appendChild(s2)

    return () => {
      document.body.removeChild(s1)
      if (document.body.contains(s2)) document.body.removeChild(s2)
    }
  }, [])

  return (
    <div ref={ref} className="flex justify-center py-4 bg-[#0d0d0d] min-h-[266px]" />
  )
}
