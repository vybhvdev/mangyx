'use client'
import { useEffect, useState } from 'react'

export function GeoAds() {
  const [country, setCountry] = useState<string | null>(null)

  useEffect(() => {
    // Use a free geo API to detect country
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => setCountry(data.country_code))
      .catch(() => setCountry('OTHER'))
  }, [])

  useEffect(() => {
    if (!country) return

    const isHighValue = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'NL'].includes(country)

    if (isHighValue) {
      // High CPM countries — load all aggressive ads
      const scripts = [
        'https://pl28912884.effectivegatecpm.com/bf/d9/c1/bfd9c169e62016f4b496225e23f16aaf.js',
        'https://pl28914249.effectivegatecpm.com/e2/8b/6e/e28b6e81f29739c8f9ce99292c0b2098.js',
        'https://pl28914271.effectivegatecpm.com/3003c884cc43544d3f829cbf311fad84/invoke.js',
      ]
      scripts.forEach((src) => {
        const s = document.createElement('script')
        s.src = src
        s.async = true
        document.body.appendChild(s)
      })
    } else {
      // Low CPM countries (India etc) — only load 1 lighter ad
      const s = document.createElement('script')
      s.src = 'https://pl28914249.effectivegatecpm.com/e2/8b/6e/e28b6e81f29739c8f9ce99292c0b2098.js'
      s.async = true
      document.body.appendChild(s)
    }
  }, [country])

  return null
}
