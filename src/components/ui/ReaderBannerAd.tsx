'use client'
import { useEffect, useRef } from 'react'

export function ReaderBannerAd() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // JuicyAds
    const s1 = document.createElement('script')
    s1.src = 'https://poweredby.jads.co/js/jads.js'
    s1.async = true
    s1.setAttribute('data-cfasync', 'false')

    const ins = document.createElement('ins')
    ins.id = '1113304'
    ins.setAttribute('data-width', '300')
    ins.setAttribute('data-height', '250')

    const s2 = document.createElement('script')
    s2.async = true
    s2.setAttribute('data-cfasync', 'false')
    s2.innerHTML = `(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1113304});`

    ref.current.appendChild(s1)
    ref.current.appendChild(ins)
    ref.current.appendChild(s2)
  }, [])

  return (
    <div className="flex justify-center py-4 bg-[#0d0d0d]">
      <div ref={ref} style={{ width: 300, height: 250 }} />
    </div>
  )
}
