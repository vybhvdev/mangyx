export default function InfoPage() {
  const features = [
    { title: 'High Performance', desc: 'Fast browsing with smart caching and minimal footprint.' },
    { title: 'Privacy Focused', desc: 'No tracking, no invasive ads, and complete library privacy.' },
    { title: 'Cross Device', desc: 'Sync your bookmarks and progress across all your devices.' },
    { title: 'Modern Reader', desc: 'Immersive reading experience with tap and swipe navigation.' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 animate-fade-up">
      <div className="mb-12">
        <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
          Documentation
        </span>
        <h1 className="font-syne font-black text-4xl md:text-7xl text-white mb-8 tracking-tight">
          About Mangyx
        </h1>
        <p className="text-lg md:text-xl text-text-muted leading-relaxed">
          Mangyx is a high-performance, mobile-first manga platform designed for speed, comfort, and discovery. 
          Built with the modern reader in mind, it provides a seamless experience across all your devices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {features.map(({ title, desc }) => (
          <div key={title} className="p-6 bg-surface/30 rounded-2xl border border-white/5">
            <h3 className="font-syne font-bold text-lg text-white mb-2 tracking-tight">{title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <section className="mb-16 py-12 border-y border-white/5">
        <h2 className="font-syne font-extrabold text-2xl text-white mb-6 tracking-tight">Support the Project</h2>
        <p className="text-text-muted leading-relaxed mb-8">
          Mangyx is an open-source project maintained by independent developers. If you enjoy using the platform, 
          consider supporting us to help cover server costs and ongoing development.
        </p>
        <a href="https://buymeachai.ezee.li/vybhvdev" target="_blank" className="btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 8H4M4 8v10a4 4 0 004 4h8a4 4 0 004-4V8M4 8l2-4h12l2 4M12 12v5M8 12v5m8-5v5"/></svg>
          Buy Us a Chai
        </a>
      </section>

      <footer className="text-center">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">
          MANGYX v1.0 — 2026
        </p>
      </footer>
    </div>
  )
}
