import { ReactNode, useRef } from 'react'
import { AppState, ScreenType } from '@/types'
import Navigation from './Navigation'
import SummaryPanel from './SummaryPanel'
import { saveSession, loadSession, clearSession } from '@/lib/sessionManager'

interface LayoutProps {
  children: ReactNode
  state: AppState
  onNavigate: (screen: ScreenType) => void
}

export default function Layout({ children, state, onNavigate }: LayoutProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLoadSession = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        await loadSession(file)
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to load session')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">AIC</h1>
            <p className="text-sm text-neutral-600">Agent Impact Calculator</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Session Management Buttons */}
            <button
              onClick={saveSession}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center gap-2"
              title="Save current session to file"
            >
              <span>💾</span>
              Save Session
            </button>
            <button
              onClick={handleLoadSession}
              className="px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm font-medium flex items-center gap-2"
              title="Load session from file"
            >
              <span>📂</span>
              Load Session
            </button>
            <button
              onClick={clearSession}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
              title="Clear all data"
            >
              <span>🗑️</span>
              Clear
            </button>
            {state.agentName && (
              <div className="text-right ml-4 pl-4 border-l border-neutral-200">
                <p className="text-sm text-neutral-600">Current Agent</p>
                <p className="font-semibold text-neutral-900">{state.agentName}</p>
              </div>
            )}
          </div>
        </div>
        {/* Hidden file input for loading sessions */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </header>

      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>

        {/* Right Summary Panel */}
        {state.currentScreen === 'kpis' && (
          <SummaryPanel results={state.results} />
        )}
      </div>
    </div>
  )
}
