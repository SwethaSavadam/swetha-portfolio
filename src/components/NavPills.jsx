import React from 'react'
export default function NavPills({ className='' }){
  const tabs = ['Work','About','Resources','Contact']
  return (
    <nav className={(className ? className + ' ' : '') + "navpills bg-panel backdrop-blur border border-slate-200 rounded-full px-2 py-1 shadow-sm"}>
      <ul className="flex gap-1">
        {tabs.map((t, i) => (
          <li key={t}>
            <button
              className={(i===0 ? 'bg-slate-900 text-white ' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 ') + 'px-4 py-2 rounded-full text-sm font-medium transition-colors'}>
              {t}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
