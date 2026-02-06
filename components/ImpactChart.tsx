import { AgentConfig } from '@/types'

interface ImpactChartProps {
  savedAgents: AgentConfig[]
}

export default function ImpactChart({ savedAgents }: ImpactChartProps) {
  if (savedAgents.length === 0) {
    return (
      <div className="card bg-neutral-50 border-neutral-200 text-center py-8">
        <p className="text-neutral-500">No agents configured yet. Create your first agent to see impact analysis.</p>
      </div>
    )
  }

  // Aggregate all KPI impacts across all agents with impact type
  const kpiImpacts = new Map<string, { impact: number, type: 'Revenue' | 'EBITDA' }>()
  
  savedAgents.forEach(agent => {
    agent.results.forEach(result => {
      const current = kpiImpacts.get(result.kpiName) || { impact: 0, type: result.impactType }
      kpiImpacts.set(result.kpiName, {
        impact: current.impact + result.impactGBP,
        type: result.impactType
      })
    })
  })

  const kpiData = Array.from(kpiImpacts.entries())
    .map(([name, data]) => ({ name, impact: data.impact, type: data.type }))
    .sort((a, b) => b.impact - a.impact)

  const maxKPIImpact = Math.max(...kpiData.map(d => d.impact))

  // Aggregate impact by agent with Revenue/EBITDA split
  const agentData = savedAgents.map(agent => {
    const revenueImpact = agent.results.filter(r => r.impactType === 'Revenue').reduce((sum, r) => sum + r.impactGBP, 0)
    const ebitdaImpact = agent.results.filter(r => r.impactType === 'EBITDA').reduce((sum, r) => sum + r.impactGBP, 0)
    const totalImpact = revenueImpact + ebitdaImpact
    return {
      name: agent.agentName,
      impact: totalImpact,
      revenueImpact,
      ebitdaImpact,
      process: agent.process,
      kpiCount: agent.results.length
    }
  }).sort((a, b) => b.impact - a.impact)

  const maxAgentImpact = Math.max(...agentData.map(d => d.impact))
  
  const totalRevenue = kpiData.filter(k => k.type === 'Revenue').reduce((sum, k) => sum + k.impact, 0)
  const totalEBITDA = kpiData.filter(k => k.type === 'EBITDA').reduce((sum, k) => sum + k.impact, 0)

  const colors = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-rose-500',
    'bg-orange-500',
  ]

  const totalImpact = totalRevenue + totalEBITDA
  const maxBarHeight = 240 // pixels
  
  // Calculate bar heights with minimum visible height
  const revenueBarHeight = totalRevenue > 0 ? Math.max((totalRevenue / totalImpact) * maxBarHeight, 40) : 0
  const ebitdaBarHeight = totalEBITDA > 0 ? Math.max((totalEBITDA / totalImpact) * maxBarHeight, 40) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Impact by KPI */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Impact by KPI</h3>
        <div className="space-y-3">
          {kpiData.map((kpi) => {
            const percentage = (kpi.impact / maxKPIImpact) * 100
            const color = kpi.type === 'Revenue' ? 'bg-green-500' : 'bg-blue-500'
            
            return (
              <div key={kpi.name}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700">{kpi.name}</span>
                    <span className="text-xs text-neutral-500">({kpi.type})</span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">
                    ${kpi.impact.toLocaleString('en-US')}
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${color} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-neutral-600 flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-green-500 rounded"></span>
              Revenue Impact
            </span>
            <span className="text-lg font-bold text-green-600">
              ${totalRevenue.toLocaleString('en-US')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-neutral-600 flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded"></span>
              EBITDA Impact
            </span>
            <span className="text-lg font-bold text-blue-600">
              ${totalEBITDA.toLocaleString('en-US')}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-neutral-300">
            <span className="text-sm font-medium text-neutral-700">Total Impact</span>
            <span className="text-xl font-bold text-primary-600">
              ${kpiData.reduce((sum, kpi) => sum + kpi.impact, 0).toLocaleString('en-US')}
            </span>
          </div>
        </div>
      </div>

      {/* Impact by Agent */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Impact by Agent</h3>
        <div className="space-y-3">
          {agentData.map((agent, index) => {
            const percentage = (agent.impact / maxAgentImpact) * 100
            const color = colors[index % colors.length]
            
            return (
              <div key={agent.name}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-neutral-700">{agent.name}</span>
                    <span className="text-xs text-neutral-500 ml-2">
                      {agent.process} • {agent.kpiCount} KPIs
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">
                    ${agent.impact.toLocaleString('en-US')}
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${color} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-neutral-700">Total Agents</span>
            <span className="text-xl font-bold text-primary-600">
              {agentData.length}
            </span>
          </div>
        </div>
      </div>

      {/* Total Impact Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Total Impact Overview</h3>
        <div className="flex items-end justify-center gap-6 pb-4" style={{ height: `${maxBarHeight + 60}px` }}>
          {/* Revenue Bar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-20 flex items-end" style={{ height: `${maxBarHeight}px` }}>
              {totalRevenue > 0 && (
                <div 
                  className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-700 ease-out shadow-lg relative group border-2 border-green-700"
                  style={{ height: `${revenueBarHeight}px` }}
                >
                  <div className="absolute inset-0 bg-white/10 rounded-t-lg"></div>
                  <div className="absolute top-2 left-0 right-0 text-center">
                    <div className="text-white text-sm font-bold drop-shadow-lg">
                      ${(totalRevenue / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div className="absolute -top-14 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded shadow-lg inline-block">
                      ${totalRevenue.toLocaleString('en-US')}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-neutral-700">Revenue Impact</div>
              <div className="text-xs text-neutral-500 mt-0.5">
                {kpiData.filter(k => k.type === 'Revenue').length} KPIs
              </div>
            </div>
          </div>

          {/* EBITDA Bar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-20 flex items-end" style={{ height: `${maxBarHeight}px` }}>
              {totalEBITDA > 0 && (
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-700 ease-out shadow-lg relative group border-2 border-blue-700"
                  style={{ height: `${ebitdaBarHeight}px` }}
                >
                  <div className="absolute inset-0 bg-white/10 rounded-t-lg"></div>
                  <div className="absolute top-2 left-0 right-0 text-center">
                    <div className="text-white text-sm font-bold drop-shadow-lg">
                      ${(totalEBITDA / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div className="absolute -top-14 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded shadow-lg inline-block">
                      ${totalEBITDA.toLocaleString('en-US')}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-neutral-700">EBITDA Impact</div>
              <div className="text-xs text-neutral-500 mt-0.5">
                {kpiData.filter(k => k.type === 'EBITDA').length} KPIs
              </div>
            </div>
          </div>

          {/* Total Bar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-20 flex items-end" style={{ height: `${maxBarHeight}px` }}>
              {totalImpact > 0 && (
                <div 
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-700 ease-out shadow-lg relative group border-2 border-purple-700"
                  style={{ height: `${maxBarHeight}px` }}
                >
                  <div className="absolute inset-0 bg-white/10 rounded-t-lg"></div>
                  <div className="absolute top-2 left-0 right-0 text-center">
                    <div className="text-white text-sm font-bold drop-shadow-lg">
                      ${(totalImpact / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div className="absolute -top-14 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded shadow-lg inline-block">
                      ${totalImpact.toLocaleString('en-US')}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-neutral-700">Total Impact</div>
              <div className="text-xs text-neutral-500 mt-0.5">
                {kpiData.length} KPIs
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-neutral-200 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-neutral-600 mb-1">Revenue %</div>
            <div className="text-lg font-bold text-green-600">
              {totalImpact > 0 ? ((totalRevenue / totalImpact) * 100).toFixed(0) : 0}%
            </div>
          </div>
          <div>
            <div className="text-xs text-neutral-600 mb-1">EBITDA %</div>
            <div className="text-lg font-bold text-blue-600">
              {totalImpact > 0 ? ((totalEBITDA / totalImpact) * 100).toFixed(0) : 0}%
            </div>
          </div>
          <div>
            <div className="text-xs text-neutral-600 mb-1">Total Agents</div>
            <div className="text-lg font-bold text-purple-600">
              {savedAgents.length}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
