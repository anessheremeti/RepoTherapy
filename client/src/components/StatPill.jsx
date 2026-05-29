export default function StatPill({ icon, label, value }) {
  return (
    <div className="stat-card min-w-[80px]">
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-roast-text font-semibold text-sm leading-tight">{value}</span>
      <span className="text-roast-muted text-xs">{label}</span>
    </div>
  )
}
