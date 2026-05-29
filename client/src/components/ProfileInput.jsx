import { useState } from 'react'

const EXAMPLE_USERS = ['torvalds', 'gaearon', 'yyx990803']

function parseUsername(raw) {
  const trimmed = raw.trim()
  const urlMatch = trimmed.match(/github\.com\/([a-zA-Z0-9_-]+)/)
  if (urlMatch) return urlMatch[1]
  if (/^[a-zA-Z0-9_-]{1,39}$/.test(trimmed)) return trimmed
  return null
}

export default function ProfileInput({ onSubmit, loading }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const username = parseUsername(value)
    if (!username) {
      setError('Enter a valid GitHub username — e.g. torvalds or a profile URL')
      return
    }
    setError('')
    onSubmit(username)
  }

  function handleExample(username) {
    setValue(username)
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto animate-slide-up">
      <div className="relative group">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-roast-accent/20 to-orange-600/10 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10" />
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-roast-muted pointer-events-none select-none font-mono text-sm">
              github.com/
            </span>
            <input
              className="input-repo pl-[6.8rem]"
              type="text"
              placeholder="username"
              value={value}
              onChange={e => {
                setValue(e.target.value)
                if (error) setError('')
              }}
              disabled={loading}
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button type="submit" className="btn-roast whitespace-nowrap" disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                Analyzing…
              </>
            ) : (
              <>
                <span className="glow-accent">🔥</span>
                Roast
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <span className="text-roast-muted text-xs uppercase tracking-wider">Try:</span>
        {EXAMPLE_USERS.map(user => (
          <button
            key={user}
            type="button"
            onClick={() => handleExample(user)}
            disabled={loading}
            className="text-xs font-mono text-roast-dim border border-roast-border rounded-lg px-2.5 py-1
                       hover:border-roast-accent/50 hover:text-roast-text transition-colors duration-150"
          >
            {user}
          </button>
        ))}
      </div>
    </form>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}
