const STYLES = [
  {
    id: 'friendly',
    emoji: '😇',
    label: 'Friendly',
    description: 'Warm, encouraging, gently humorous',
  },
  {
    id: 'corporate',
    emoji: '👔',
    label: 'Corporate',
    description: 'Performance review meets LinkedIn cringe',
  },
  {
    id: 'brutal',
    emoji: '💀',
    label: 'Brutal',
    description: 'No mercy. Full roast. Zero survivors.',
  },
]

export default function RoastStyleSelector({ selected, onChange }) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <p className="text-xs text-roast-muted uppercase tracking-widest mb-3 text-center">
        Choose your roast style
      </p>
      <div className="grid grid-cols-3 gap-3">
        {STYLES.map(({ id, emoji, label, description }) => {
          const isSelected = selected === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={[
                'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center',
                'transition-all duration-200 select-none cursor-pointer',
                isSelected
                  ? 'border-roast-accent bg-roast-accent/10 text-roast-text scale-[1.02]'
                  : 'border-roast-border bg-roast-surface text-roast-dim hover:border-roast-accent/40 hover:text-roast-text',
              ].join(' ')}
            >
              <span className="text-2xl leading-none">{emoji}</span>
              <span className="text-xs font-semibold">{label}</span>
              <span className="text-[10px] text-roast-muted leading-tight">{description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { STYLES }
