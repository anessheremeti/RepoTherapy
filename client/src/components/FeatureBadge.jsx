const FEATURES = [
  { icon: '🔥', label: 'Brutal roast' },
  { icon: '💪', label: 'Strengths' },
  { icon: '🎭', label: 'Developer archetype' },
  { icon: '📊', label: 'Funny scorecards' },
  { icon: '🎯', label: 'Survival tips' },
  { icon: '🤖', label: 'AI-powered analysis' },
]

export default function FeatureBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
      {FEATURES.map(({ icon, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 text-xs text-roast-dim border border-roast-border
                     rounded-full px-3 py-1 bg-roast-surface/50"
        >
          {icon} {label}
        </span>
      ))}
    </div>
  )
}
