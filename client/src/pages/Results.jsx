import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

export default function Results() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const style = searchParams.get('style') || 'brutal'

  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    axios
      .post('/api/roast/generate', { username, style }, { signal: controller.signal })
      .then(res => {
        // replace: true so the back button goes to Home, not back to loading
        navigate(`/roast/${res.data.id}`, { replace: true, state: res.data })
      })
      .catch(err => {
        if (axios.isCancel(err)) return
        setError(err.response?.data?.error || 'Failed to analyze profile. Try again.')
      })

    return () => controller.abort()
  }, [username, style])

  if (error) return <ErrorScreen error={error} onBack={() => navigate('/')} />
  return <LoadingScreen username={username} />
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
