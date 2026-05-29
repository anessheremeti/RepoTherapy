import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Results() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [barsAnimated, setBarsAnimated] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setError(null)
    setBarsAnimated(false)

    axios
      .get(`/api/roast/${username}`, { signal: controller.signal })
      .then(res => {
        setData(res.data)
        setLoading(false)
        setTimeout(() => setBarsAnimated(true), 400)
      })
      .catch(err => {
        if (axios.isCancel(err)) return
        setError(err.response?.data?.error || 'Failed to analyze profile. Try again.')
        setLoading(false)
      })

    return () => controller.abort()
  }, [username])

  if (loading) return <LoadingScreen username={username} />
  if (error) return <ErrorScreen error={error} onBack={() => navigate('/')} />

  const {
    user, repos, topLanguages,
    developerType, roastHeadline, roast,
    strengths, redFlags, careerAdvice, scores,
  } = data

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
  const topLangs = Object.entries(topLanguages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([lang]) => lang)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-roast-accent/5 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-roast-border/50 bg-roast-bg/80 backdrop-blur-sm">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-roast-muted hover:text-roast-text transition-colors text-sm"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <span className="animate-flicker">🔥</span>
          <span className="font-bold text-roast-text tracking-tight">roastmyrepo</span>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-roast-muted hover:text-roast-text transition-colors"
        >
          @{username}
        </a>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10 space-y-6 animate-fade-in">

        {/* Profile card */}
        <div className="flex items-start gap-5 p-6 rounded-2xl bg-roast-surface border border-roast-border">
          <img
            src={user.avatar_url}
            alt={username}
            className="w-[72px] h-[72px] rounded-full border-2 border-roast-border flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-roast-text truncate">
                {user.name || user.login}
              </h1>
              <span className="font-mono text-roast-muted text-sm">@{user.login}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-roast-accent/15 border border-roast-accent/30 text-roast-accent font-medium">
                {developerType}
              </span>
            </div>
            {user.bio && (
              <p className="text-roast-dim text-sm mb-3 leading-relaxed">{user.bio}</p>
            )}
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-roast-muted">
              <span>📦 {user.public_repos} repos</span>
              <span>⭐ {totalStars.toLocaleString()} stars</span>
              <span>👥 {user.followers.toLocaleString()} followers</span>
              {topLangs.length > 0 && <span>💻 {topLangs.join(' · ')}</span>}
              {user.location && <span>📍 {user.location}</span>}
              {user.company && <span>🏢 {user.company.replace(/^@/, '')}</span>}
            </div>
          </div>
        </div>

        {/* Roast */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-roast-accent/40 bg-roast-accent/5">
          <div className="absolute inset-0 bg-gradient-to-br from-roast-accent/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl glow-accent">🔥</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-roast-accent">
              The Roast
            </span>
          </div>
          <p className="text-roast-text font-bold text-lg sm:text-xl mb-3 leading-snug">
            {roastHeadline}
          </p>
          <p className="text-roast-dim text-sm sm:text-base leading-relaxed">
            {roast}
          </p>
        </div>

        {/* Strengths + Red Flags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-roast-surface border border-roast-border">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">💪</span>
              <h2 className="font-bold text-roast-text">Strengths</h2>
            </div>
            <ul className="space-y-3">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-roast-dim">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-roast-surface border border-roast-border">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🚩</span>
              <h2 className="font-bold text-roast-text">Red Flags</h2>
            </div>
            <ul className="space-y-3">
              {redFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-roast-dim">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scores */}
        <div className="p-6 rounded-2xl bg-roast-surface border border-roast-border">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg">📊</span>
            <h2 className="font-bold text-roast-text">Scorecard</h2>
          </div>
          <div className="space-y-5">
            {SCORE_CONFIG.map(({ key, name, inverted }) => (
              <ScoreBar
                key={key}
                name={name}
                score={scores[key]}
                inverted={inverted}
                animated={barsAnimated}
              />
            ))}
          </div>
        </div>

        {/* Career Advice */}
        <div className="p-6 rounded-2xl bg-roast-surface border border-roast-border">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎯</span>
            <h2 className="font-bold text-roast-text">Career Advice</h2>
          </div>
          <p className="text-roast-dim text-sm leading-relaxed">{careerAdvice}</p>
        </div>

      </main>

      <footer className="px-6 py-4 border-t border-roast-border/50 text-center text-xs text-roast-muted">
        Built with caffeine and passive aggression ·{' '}
        <span className="font-mono">v0.1.0</span>
      </footer>
    </div>
  )
}

const SCORE_CONFIG = [
  { key: 'commitDiscipline', name: 'Commit Discipline', inverted: false },
  { key: 'tutorialAddiction', name: 'Tutorial Addiction', inverted: true },
  { key: 'bugSummoning', name: 'Bug Summoning', inverted: true },
]

function ScoreBar({ name, score, inverted, animated }) {
  const effectiveScore = inverted ? 100 - score : score
  const color =
    effectiveScore >= 70 ? '#22c55e' : effectiveScore >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-roast-dim">{name}</span>
        <span className="text-sm font-mono font-bold w-7 text-right" style={{ color }}>
          {score}
        </span>
      </div>
      <div className="h-1.5 bg-roast-bg rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${score}%` : '0%',
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
      </div>
    </div>
  )
}

const LOADING_STEPS = [
  { icon: '📖', text: 'Scanning README delusion levels...' },
  { icon: '💀', text: 'Reading every commit. Every. Single. One.' },
  { icon: '🕵️', text: 'Judging variable names in silence...' },
  { icon: '🌙', text: 'Detecting 3am push sessions...' },
  { icon: '📝', text: 'Counting TODO comments (oh no)...' },
  { icon: '🧪', text: 'Testing code that has no tests...' },
  { icon: '🔥', text: 'Calculating shame index...' },
  { icon: '🤖', text: 'AI is forming a strong opinion...' },
  { icon: '📊', text: 'Preparing your scorecard...' },
]

function LoadingScreen({ username }) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressId = setInterval(() => {
      setProgress(p => (p >= 90 ? p : p + (90 - p) * 0.07))
    }, 200)
    const stepId = setInterval(() => {
      setStep(s => (s + 1) % LOADING_STEPS.length)
    }, 1600)
    return () => {
      clearInterval(progressId)
      clearInterval(stepId)
    }
  }, [])

  const current = LOADING_STEPS[step]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
      <div className="text-6xl animate-bounce">🔥</div>
      <div className="text-center">
        <p className="text-roast-muted text-xs uppercase tracking-widest mb-1">Roasting</p>
        <p className="text-roast-text font-bold text-2xl font-mono">@{username}</p>
      </div>
      <div className="w-full max-w-sm">
        <div className="h-1 bg-roast-surface rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out bg-roast-accent"
            style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(255,69,0,0.7)' }}
          />
        </div>
      </div>
      <div key={step} className="flex items-center gap-2.5 animate-fade-in">
        <span className="text-xl">{current.icon}</span>
        <span className="text-roast-dim text-sm">{current.text}</span>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 bg-roast-accent rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

function ErrorScreen({ error, onBack }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-5xl">💀</div>
      <h2 className="text-xl font-bold text-roast-text">Something Went Wrong</h2>
      <p className="text-roast-muted text-sm max-w-sm">{error}</p>
      <button onClick={onBack} className="mt-4 btn-roast">
        Try Again
      </button>
    </div>
  )
}
