import { ScreenType } from '@/types'

interface NavigationProps {
  currentScreen: ScreenType
  onNavigate: (screen: ScreenType) => void
}

export default function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'agent-details' as ScreenType, label: 'App', icon: '🏠' },
    { id: 'kpis' as ScreenType, label: 'KPIs', icon: '📊' },
  ]

  return (
    <nav className="w-64 bg-white border-r border-neutral-200 p-6">
      <div className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
              currentScreen === item.id
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-neutral-200">
        <p className="text-xs text-neutral-500 px-4">
          Version 1.0.0
          <br />
          Sales KPIs
        </p>
      </div>
    </nav>
  )
}
