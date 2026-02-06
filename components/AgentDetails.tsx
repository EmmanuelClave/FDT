import { BusinessProcess, AgentConfig } from '@/types'
import ImpactChart from './ImpactChart'
import { generatePDFReport } from '@/lib/pdfExport'
import { generatePPTReport } from '@/lib/pptxExport'
import { useState } from 'react'

interface CustomerInfo {
  name: string
  revenue: string
  ebitda: string
  industry: string
}

interface AgentDetailsProps {
  agentName: string
  process: BusinessProcess
  onUpdateName: (name: string) => void
  onUpdateProcess: (process: BusinessProcess) => void
  onContinue: () => void
  savedAgents: AgentConfig[]
  onRemoveAgent: (agentId: string) => void
  onLoadAgent: (agent: AgentConfig) => void
  customerInfo: CustomerInfo
}

const BUSINESS_PROCESSES: BusinessProcess[] = [
  'Sales',
  'Marketing',
  'Service',
  'Finance',
  'Supply Chain',
  'Legal',
  'IT',
]

export default function AgentDetails({
  agentName,
  process,
  onUpdateName,
  onUpdateProcess,
  onContinue,
  savedAgents,
  onRemoveAgent,
  onLoadAgent,
  customerInfo,
}: AgentDetailsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'ppt' | null>(null)
  const canContinue = agentName.trim().length > 0 && (process === 'Sales' || process === 'Service' || process === 'Marketing' || process === 'Finance' || process === 'Supply Chain' || process === 'IT' || process === 'Legal')
  
  const totalSavedImpact = savedAgents.reduce((sum, agent) => {
    const agentTotal = agent.results.reduce((s, r) => s + r.impactGBP, 0)
    return sum + agentTotal
  }, 0)

  const handleExportPDF = async () => {
    if (savedAgents.length === 0) return
    
    setIsExporting(true)
    setExportFormat('pdf')
    try {
      await generatePDFReport(savedAgents, customerInfo)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsExporting(false)
      setExportFormat(null)
    }
  }

  const handleExportPPT = async () => {
    if (savedAgents.length === 0) return
    
    setIsExporting(true)
    setExportFormat('ppt')
    try {
      await generatePPTReport(savedAgents, customerInfo)
    } catch (error) {
      console.error('Error generating PowerPoint:', error)
      alert('Error generating PowerPoint. Please try again.')
    } finally {
      setIsExporting(false)
      setExportFormat(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Impact Charts Section */}
      {savedAgents.length > 0 && (
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-neutral-900">Portfolio Overview</h2>
            <p className="text-sm text-neutral-600 mt-1">Analysis of all configured AI agents and their business impact</p>
          </div>
          <ImpactChart savedAgents={savedAgents} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Agent Configuration */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Configure New Agent</h1>
            <p className="text-neutral-600">
              Define your AI agent and select the business process to evaluate its financial impact
            </p>
          </div>

          <div className="card space-y-6">
            <div>
              <label htmlFor="agentName" className="block text-sm font-semibold text-neutral-900 mb-2">
                Agent Name
              </label>
              <input
                id="agentName"
                type="text"
                value={agentName}
                onChange={(e) => onUpdateName(e.target.value)}
                placeholder="e.g., Sales Outreach Copilot, Customer Support Assistant"
                className="input-field"
              />
              <p className="text-xs text-neutral-500 mt-2">
                💡 Choose a descriptive name that reflects the agent's primary function
              </p>
            </div>

            <div>
              <label htmlFor="process" className="block text-sm font-semibold text-neutral-900 mb-2">
                Business Process
              </label>
              <select
                id="process"
                value={process}
                onChange={(e) => onUpdateProcess(e.target.value as BusinessProcess)}
                className="input-field"
              >
                {BUSINESS_PROCESSES.map((proc) => (
                  <option key={proc} value={proc}>
                    {proc}
                  </option>
                ))}
              </select>
              <p className="text-xs text-neutral-500 mt-2">
                📊 Select the primary business area where this agent will operate
              </p>
            </div>

{process !== 'Sales' && process !== 'Service' && process !== 'Marketing' && process !== 'Finance' && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-900 mb-1">Limited Availability</p>
                  <p className="text-xs text-yellow-800">
                    Only <span className="font-semibold">Sales</span>, <span className="font-semibold">Marketing</span>, <span className="font-semibold">Service</span>, and <span className="font-semibold">Finance</span> KPIs are currently available. Support for {process} and other processes coming soon.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-200">
              <button
                onClick={onContinue}
                disabled={!canContinue}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base py-3"
              >
                <span>Continue to {process} KPIs</span>
                <span>→</span>
              </button>
              {!canContinue && (
                <p className="text-xs text-neutral-500 text-center mt-2">
                  Please enter an agent name and select Sales, Marketing, Service, or Finance process
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Saved Agents */}
        <div>
          {savedAgents.length > 0 ? (
            <div className="sticky top-6">
              <div className="card bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2">
                    <span>📁</span>
                    <span>Saved Agents</span>
                  </h3>
                  <p className="text-sm text-neutral-600">{savedAgents.length} agent{savedAgents.length !== 1 ? 's' : ''} configured</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-neutral-600">Total Impact</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                    ${totalSavedImpact.toLocaleString('en-US')}
                  </div>
                </div>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {savedAgents.map((agent) => {
                  const agentTotal = agent.results.reduce((s, r) => s + r.impactGBP, 0)
                  return (
                    <div 
                      key={agent.id} 
                      onClick={() => onLoadAgent(agent)}
                      className="bg-white rounded-lg p-3 shadow-sm border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-neutral-900 truncate">{agent.agentName}</div>
                          <div className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-neutral-100 rounded-full">{agent.process}</span>
                            <span>•</span>
                            <span>{agent.results.length} KPI{agent.results.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-3">
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary-600">
                              ${agentTotal.toLocaleString('en-US')}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onRemoveAgent(agent.id)
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded p-1.5 transition-colors"
                            title="Remove agent"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-primary-200 space-y-2">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>{isExporting && exportFormat === 'pdf' ? '📄 Generating PDF...' : '📄 Export PDF Report'}</span>
                </button>
                <button
                  onClick={handleExportPPT}
                  disabled={isExporting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <span>{isExporting && exportFormat === 'ppt' ? '📊 Generating PowerPoint...' : '📊 Export PowerPoint'}</span>
                </button>
                <p className="text-xs text-neutral-600 mt-2 text-center">
                  Comprehensive financial report with executive summary
                </p>
              </div>
            </div>
            </div>
          ) : (
            <div className="card bg-neutral-50 border-neutral-200 text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="font-semibold text-neutral-900 mb-2">No Agents Yet</h3>
              <p className="text-sm text-neutral-600 max-w-xs mx-auto">
                Configure your first AI agent to start analyzing business impact and building your portfolio
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
