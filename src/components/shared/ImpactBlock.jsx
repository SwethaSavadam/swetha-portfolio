// src/components/shared/ImpactBlock.jsx
import React from 'react'

/**
 * Reusable Business Impact block
 * Props:
 * - title?: string = "Business Impact"
 * - problem: string
 * - solution: string
 * - points?: string[] (bullets)
 * - kpis?: Array<{ label: string, value: string }>
 */
export default function ImpactBlock({
  title = 'Business Impact',
  problem,
  solution,
  points = [],
  kpis = []
}) {
  return (
    <div className="rounded-3xl p-6 bg-card ring-soft shadow">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">{title}</h4>
        {kpis?.length > 0 && (
          <div className="hidden sm:flex gap-2">
            {kpis.map((k, i) => (
              <span key={i} className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-800 dark:text-white">
                <b>{k.value}</b> {k.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Problem */}
        <div className="rounded-2xl p-4 bg-card ring-soft">
          <div className="text-[11px] uppercase tracking-wide text-muted mb-1">Problem</div>
          <p className="text-sm text-app">
            {problem}
          </p>
        </div>

        {/* Solution / Automation */}
        <div className="rounded-2xl p-4 bg-card ring-soft">
          <div className="text-[11px] uppercase tracking-wide text-muted mb-1">Solution & Automation</div>
          <p className="text-sm text-app">
            {solution}
          </p>
        </div>

        {/* Impact bullets */}
        <div className="rounded-2xl p-4 bg-card ring-soft">
          <div className="text-[11px] uppercase tracking-wide text-muted mb-1">Impact</div>
          {points?.length > 0 ? (
            <ul className="text-sm space-y-1">
              {points.map((p, i) => <li key={i}>• {p}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-muted">Add bullets via the <code>points</code> prop.</p>
          )}
        </div>
      </div>

      {/* KPI chips on mobile */}
      {kpis?.length > 0 && (
        <div className="mt-4 sm:hidden flex flex-wrap gap-2">
          {kpis.map((k, i) => (
            <span key={i} className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-800 dark:text-white">
              <b>{k.value}</b> {k.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
