import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileInput from '../components/ProfileInput'
import FeatureBadges from '../components/FeatureBadge'

const TAGLINES = [
  "We'll read every commit. Every. Single. One.",
  "Your code has feelings. We don't care.",
  "Brutally honest. AI-powered. Emotionally devastating.",
  "No profile goes unroasted.",
]

export default function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [tagline] = useState(() => TAGLINES[Math.floor(Math.random() * TAGLINES.length)])

  function handleSubmit(username) {
    setLoading(true)
    navigate(`/results/${username}`)
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px]
                        bg-roast-accent/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[400px] h-[400px]
                        bg-orange-700/5 rounded-full blur-[100px]" />
      </div>

      <header className="flex items-center justify-between px-6 py-5 border-b border-roast-border/50">
        <div className="flex items-center gap-2">
          <span className="text-xl animate-flicker">🔥</span>
          <span className="font-bold text-roast-text tracking-tight">roastmyrepo</span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-roast-muted hover:text-roast-text transition-colors text-sm"
        >
          GitHub
        </a>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="animate-fade-in mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase
                           text-roast-accent border border-roast-accent/30 rounded-full px-4 py-1.5
                           bg-roast-accent/5">
            <span className="w-1.5 h-1.5 rounded-full bg-roast-accent animate-pulse" />
            AI Profile Judgment Day
          </span>
        </div>

        <h1 className="animate-slide-up text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
                       leading-[1.1] mb-4 max-w-3xl">
          Your GitHub profile review{' '}
          <span className="text-gradient">nobody asked for</span>
        </h1>

        <p className="animate-fade-in text-roast-dim text-base sm:text-lg mb-10 max-w-md">
          {tagline}
        </p>

        <ProfileInput onSubmit={handleSubmit} loading={loading} />

        <div className="mt-14 mb-6 flex items-center gap-4 w-full max-w-xs">
          <div className="flex-1 h-px bg-roast-border" />
          <span className="text-roast-muted text-xs uppercase tracking-wider">What we judge</span>
          <div className="flex-1 h-px bg-roast-border" />
        </div>

        <FeatureBadges />

        <p className="mt-10 text-roast-muted text-xs">
          Read-only access · No auth required · Your secrets stay secret
        </p>
      </main>

      <footer className="px-6 py-4 border-t border-roast-border/50 flex items-center justify-between text-xs text-roast-muted">
        <span>Built with caffeine and passive aggression</span>
        <span className="font-mono">v0.1.0</span>
      </footer>
    </div>
  )
}
