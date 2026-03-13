import Link from 'next/link'

export default function InfoPage() {
  return (
    <div className="max-w-[680px] mx-auto px-8 py-16">

      <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-ink-400 mb-4">About</p>
      <h1 className="font-syne font-black text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.02em] text-onyx mb-8">
        Mangyx
      </h1>

      <p className="font-cormorant text-[1.15rem] text-ink-700 leading-[1.7] mb-6">
        Mangyx is a minimal, editorial manga reading experience built for readers who care about
        typography, clarity, and speed. No ads. No clutter. Just manga.
      </p>
      <p className="font-cormorant text-[1.15rem] text-ink-700 leading-[1.7] mb-12">
        Content is sourced from MangaDex and Mangapill via public APIs.
        Mangyx does not host any content — it is purely a reader interface.
      </p>

      <div className="border-t border-ink-200 pt-10 mb-10">
        <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-ink-400 mb-6">Features</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            ['Dual Source', 'MangaDex + Mangapill'],
            ['DJ Mode', 'Doujinshi reader mode'],
            ['Reader', 'Clean page-by-page reading'],
            ['Bookmarks', 'Save your progress'],
            ['PWA', 'Install on your device'],
            ['No Ads', 'Always free to read'],
          ].map(([title, desc]) => (
            <div key={title} className="border border-ink-100 p-4">
              <p className="font-syne text-[0.82rem] font-semibold text-onyx mb-1">{title}</p>
              <p className="font-cormorant text-[0.95rem] text-ink-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-ink-200 pt-10 mb-10">
        <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-ink-400 mb-6">Support</p>
        <p className="font-cormorant text-[1.1rem] text-ink-700 leading-[1.65] mb-6">
          Mangyx is a passion project. If you enjoy using it, consider supporting its development
          to keep the servers running and new features coming.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center no-underline inline-block"
          >
            ☕ Buy me a coffee
          </a>
          <a
            href="https://ko-fi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary justify-center no-underline"
          >
            Support on Ko-fi
          </a>
        </div>
      </div>

      <div className="border-t border-ink-200 pt-10">
        <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-ink-400 mb-4">Stack</p>
        <p className="font-cormorant text-[1rem] text-ink-500 leading-relaxed">
          Next.js 14 · TypeScript · Tailwind CSS · Supabase · NextAuth · MangaDex API · Consumet API
        </p>
        <p className="font-mono text-[0.6rem] text-ink-300 mt-6 tracking-[0.1em]">MANGYX v1.0 — 2026</p>
      </div>

    </div>
  )
}
