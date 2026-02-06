'use client'

import { KPIInputsData, KPIResult } from '@/types'
import {
  calculateAverageHandlingTime,
  calculateFirstCallResolution,
  calculateIssueResolutionTime,
  calculateChannelShift,
  calculateCaseVolumeReduction,
} from '@/lib/calculations'
import {
  DEFAULT_AVERAGE_HANDLING_TIME,
  DEFAULT_FIRST_CALL_RESOLUTION,
  DEFAULT_ISSUE_RESOLUTION_TIME,
  DEFAULT_CHANNEL_SHIFT,
  DEFAULT_CASE_VOLUME_REDUCTION,
} from '@/lib/defaults'

interface ServiceKPIsProps {
  agentName: string
  kpiInputs: KPIInputsData
  results: KPIResult[]
  onUpdateKPIInputs: (inputs: KPIInputsData) => void
  onUpdateResults: (results: KPIResult[]) => void
  onBack: () => void
  onSaveAgent: () => void
}

function formatCurrency(value: number, decimals = 0): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

export default function ServiceKPIs({
  agentName,
  kpiInputs,
  results,
  onUpdateKPIInputs,
  onUpdateResults,
  onBack,
  onSaveAgent,
}: ServiceKPIsProps) {
  const handleCalculate = (kpiName: string, result: KPIResult) => {
    const existingIndex = results.findIndex(r => r.kpiName === result.kpiName)
    let newResults: KPIResult[]
    
    if (existingIndex >= 0) {
      newResults = [...results]
      newResults[existingIndex] = result
    } else {
      newResults = [...results, result]
    }
    
    onUpdateResults(newResults)
  }

  const getResultForKPI = (kpiName: string): KPIResult | undefined => {
    return results.find(r => r.kpiName === kpiName)
  }

  const hasSavedKPIs = results.some(r => r.saved)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={onBack} className="text-primary-600 hover:text-primary-700 mb-2 text-sm font-medium">
            ← Back to Agent Details
          </button>
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">{agentName}</h1>
          <p className="text-neutral-600">Configure Service KPIs and calculate business impact</p>
        </div>
        {hasSavedKPIs && (
          <button onClick={onSaveAgent} className="btn-primary">
            Save Agent & Create New
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AverageHandlingTimeCard
          inputs={kpiInputs.averageHandlingTime || DEFAULT_AVERAGE_HANDLING_TIME}
          result={getResultForKPI('Average Handling Time Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, averageHandlingTime: inputs })}
          onCalculate={(result) => handleCalculate('Average Handling Time Reduction', result)}
        />

        <FirstCallResolutionCard
          inputs={kpiInputs.firstCallResolution || DEFAULT_FIRST_CALL_RESOLUTION}
          result={getResultForKPI('First Call Resolution Improvement')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, firstCallResolution: inputs })}
          onCalculate={(result) => handleCalculate('First Call Resolution Improvement', result)}
        />

        <IssueResolutionTimeCard
          inputs={kpiInputs.issueResolutionTime || DEFAULT_ISSUE_RESOLUTION_TIME}
          result={getResultForKPI('Issue Resolution Time Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, issueResolutionTime: inputs })}
          onCalculate={(result) => handleCalculate('Issue Resolution Time Reduction', result)}
        />

        <ChannelShiftCard
          inputs={kpiInputs.channelShift || DEFAULT_CHANNEL_SHIFT}
          result={getResultForKPI('Channel Shift to Low-Cost')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, channelShift: inputs })}
          onCalculate={(result) => handleCalculate('Channel Shift to Low-Cost', result)}
        />

        <CaseVolumeReductionCard
          inputs={kpiInputs.caseVolumeReduction || DEFAULT_CASE_VOLUME_REDUCTION}
          result={getResultForKPI('Case Volume Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, caseVolumeReduction: inputs })}
          onCalculate={(result) => handleCalculate('Case Volume Reduction', result)}
        />
      </div>

      {/* Value Narrative */}
      {hasSavedKPIs && (
        <div className="mt-8 card bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>How {agentName} Optimizes Your Service Process</span>
          </h3>
          <div className="space-y-3 text-sm text-neutral-700">
            {results.filter(r => r.saved).map((result, idx) => {
              let narrative = ''
              switch (result.kpiName) {
                case 'Average Handling Time Reduction':
                  narrative = `${agentName} accelerates case resolution by providing instant access to knowledge bases, suggesting proven solutions, and auto-completing repetitive tasks. The agent learns from successful resolutions to recommend the most effective approaches, reducing the time agents spend searching for information.`
                  break
                case 'First Call Resolution Improvement':
                  narrative = `By equipping service agents with real-time guidance, comprehensive customer context, and intelligent troubleshooting workflows, ${agentName} increases the likelihood of resolving issues on the first contact. This reduces callbacks, improves customer satisfaction, and lowers operational costs.`
                  break
                case 'Issue Resolution Time Reduction':
                  narrative = `${agentName} proactively identifies patterns in complex issues and routes them to the right specialists. The agent maintains continuity across handoffs, tracks escalations, and ensures no issue falls through the cracks, significantly reducing time-to-resolution for challenging cases.`
                  break
                case 'Channel Shift to Low-Cost':
                  narrative = `Through intelligent automation and self-service capabilities, ${agentName} enables customers to resolve simple issues through low-cost digital channels like chatbots and knowledge portals. This reserves human agents for complex, high-value interactions while maintaining customer satisfaction.`
                  break
                case 'Case Volume Reduction':
                  narrative = `${agentName} analyzes root causes of recurring issues and provides proactive alerts and preventive guidance to customers. By identifying patterns and addressing problems before they escalate, the agent reduces overall case volume and improves the customer experience.`
                  break
              }
              return narrative ? (
                <div key={idx} className="pb-3 border-b border-teal-200 last:border-0 last:pb-0">
                  <div className="font-semibold text-neutral-900 mb-1">{result.kpiName}</div>
                  <p className="leading-relaxed">{narrative}</p>
                </div>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// KPI 1: Average Handling Time Card
function AverageHandlingTimeCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-teal-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 1</div>
            <h3 className="text-sm font-bold text-neutral-900">Average Handling Time Reduction</h3>
          </div>
          {result?.saved && (
            <div className="text-right">
              <div className="text-xs text-neutral-500">Impact</div>
              <div className="text-sm font-bold text-primary-600">{formatCurrency(result.impactGBP)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-neutral-600 mb-3">
          Reduce time spent per case
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current AHT (min)</label>
              <input
                type="number"
                value={inputs.currentAHTMinutes}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentAHTMinutes: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAverageHandlingTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cases/Month</label>
              <input
                type="number"
                value={inputs.casesPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, casesPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAverageHandlingTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Agent Hourly Cost ($)</label>
              <input
                type="number"
                value={inputs.agentHourlyCost}
                onChange={(e) => {
                  const newInputs = { ...inputs, agentHourlyCost: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAverageHandlingTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">AHT Reduction (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.ahtReductionPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={inputs.ahtReductionPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, ahtReductionPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateAverageHandlingTime(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateAverageHandlingTime(inputs))} 
          className="btn-secondary text-xs py-1.5 mb-3"
        >
          Calculate Impact
        </button>

        {result && (
          <div className="mt-auto pt-3 border-t border-neutral-200">
            <div className="bg-neutral-50 rounded p-2 mb-2">
              {result.details.slice(0, 3).map((detail: any, i: number) => (
                <div key={i} className="flex justify-between text-xs mb-0.5 last:mb-0">
                  <span className="text-neutral-600">{detail.label}:</span>
                  <span className="font-semibold text-neutral-900">{detail.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {!result.saved ? (
                <button 
                  onClick={() => onCalculate({ ...result, saved: true })} 
                  className="btn-primary flex-1 text-xs py-1.5"
                >
                  Save KPI
                </button>
              ) : (
                <div className="flex-1 bg-primary-100 border border-primary-300 rounded px-2 py-1.5 text-center text-xs font-medium text-primary-800">
                  ✓ Saved
                </div>
              )}
              <button 
                onClick={() => onCalculate(null)} 
                className="btn-secondary text-xs py-1.5 text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// KPI 2: First Call Resolution Card  
function FirstCallResolutionCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-cyan-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 2</div>
            <h3 className="text-sm font-bold text-neutral-900">First Call Resolution Improvement</h3>
          </div>
          {result?.saved && (
            <div className="text-right">
              <div className="text-xs text-neutral-500">Impact</div>
              <div className="text-sm font-bold text-primary-600">{formatCurrency(result.impactGBP)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-neutral-600 mb-3">
          Resolve more issues on first contact
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current FCR (%)</label>
              <input
                type="number"
                value={inputs.currentFCRRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentFCRRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFirstCallResolution(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cases/Month</label>
              <input
                type="number"
                value={inputs.totalCasesPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, totalCasesPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFirstCallResolution(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cost Per Case ($)</label>
              <input
                type="number"
                value={inputs.costPerCase}
                onChange={(e) => {
                  const newInputs = { ...inputs, costPerCase: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFirstCallResolution(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">FCR Improvement (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.fcrImprovementPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={inputs.fcrImprovementPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, fcrImprovementPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateFirstCallResolution(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateFirstCallResolution(inputs))} 
          className="btn-secondary text-xs py-1.5 mb-3"
        >
          Calculate Impact
        </button>

        {result && (
          <div className="mt-auto pt-3 border-t border-neutral-200">
            <div className="bg-neutral-50 rounded p-2 mb-2">
              {result.details.slice(0, 3).map((detail: any, i: number) => (
                <div key={i} className="flex justify-between text-xs mb-0.5 last:mb-0">
                  <span className="text-neutral-600">{detail.label}:</span>
                  <span className="font-semibold text-neutral-900">{detail.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {!result.saved ? (
                <button 
                  onClick={() => onCalculate({ ...result, saved: true })} 
                  className="btn-primary flex-1 text-xs py-1.5"
                >
                  Save KPI
                </button>
              ) : (
                <div className="flex-1 bg-primary-100 border border-primary-300 rounded px-2 py-1.5 text-center text-xs font-medium text-primary-800">
                  ✓ Saved
                </div>
              )}
              <button 
                onClick={() => onCalculate(null)} 
                className="btn-secondary text-xs py-1.5 text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// KPI 3: Issue Resolution Time Card
function IssueResolutionTimeCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-sky-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 3</div>
            <h3 className="text-sm font-bold text-neutral-900">Issue Resolution Time Reduction</h3>
          </div>
          {result?.saved && (
            <div className="text-right">
              <div className="text-xs text-neutral-500">Impact</div>
              <div className="text-sm font-bold text-primary-600">{formatCurrency(result.impactGBP)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-neutral-600 mb-3">
          Resolve customer issues faster
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current Time (hrs)</label>
              <input
                type="number"
                value={inputs.currentResolutionHours}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentResolutionHours: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateIssueResolutionTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Issues/Month</label>
              <input
                type="number"
                value={inputs.issuesPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, issuesPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateIssueResolutionTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Impact Cost/Hour ($)</label>
              <input
                type="number"
                value={inputs.customerImpactCostPerHour}
                onChange={(e) => {
                  const newInputs = { ...inputs, customerImpactCostPerHour: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateIssueResolutionTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Time Reduction (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.resolutionTimeReductionPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={inputs.resolutionTimeReductionPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, resolutionTimeReductionPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateIssueResolutionTime(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateIssueResolutionTime(inputs))} 
          className="btn-secondary text-xs py-1.5 mb-3"
        >
          Calculate Impact
        </button>

        {result && (
          <div className="mt-auto pt-3 border-t border-neutral-200">
            <div className="bg-neutral-50 rounded p-2 mb-2">
              {result.details.slice(0, 3).map((detail: any, i: number) => (
                <div key={i} className="flex justify-between text-xs mb-0.5 last:mb-0">
                  <span className="text-neutral-600">{detail.label}:</span>
                  <span className="font-semibold text-neutral-900">{detail.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {!result.saved ? (
                <button 
                  onClick={() => onCalculate({ ...result, saved: true })} 
                  className="btn-primary flex-1 text-xs py-1.5"
                >
                  Save KPI
                </button>
              ) : (
                <div className="flex-1 bg-primary-100 border border-primary-300 rounded px-2 py-1.5 text-center text-xs font-medium text-primary-800">
                  ✓ Saved
                </div>
              )}
              <button 
                onClick={() => onCalculate(null)} 
                className="btn-secondary text-xs py-1.5 text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// KPI 4: Channel Shift Card
function ChannelShiftCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-violet-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 4</div>
            <h3 className="text-sm font-bold text-neutral-900">Channel Shift to Low-Cost</h3>
          </div>
          {result?.saved && (
            <div className="text-right">
              <div className="text-xs text-neutral-500">Impact</div>
              <div className="text-sm font-bold text-primary-600">{formatCurrency(result.impactGBP)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-neutral-600 mb-3">
          Move cases to self-service & automation
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cases/Month</label>
              <input
                type="number"
                value={inputs.totalCasesPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, totalCasesPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateChannelShift(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">% By Humans</label>
              <input
                type="number"
                value={inputs.pctHandledByHumans * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, pctHandledByHumans: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateChannelShift(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Human Cost ($)</label>
              <input
                type="number"
                value={inputs.humanHandlingCost}
                onChange={(e) => {
                  const newInputs = { ...inputs, humanHandlingCost: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateChannelShift(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Low-Cost ($)</label>
              <input
                type="number"
                value={inputs.lowCostChannelCost}
                onChange={(e) => {
                  const newInputs = { ...inputs, lowCostChannelCost: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateChannelShift(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Shift % (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.shiftPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={inputs.shiftPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, shiftPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateChannelShift(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateChannelShift(inputs))} 
          className="btn-secondary text-xs py-1.5 mb-3"
        >
          Calculate Impact
        </button>

        {result && (
          <div className="mt-auto pt-3 border-t border-neutral-200">
            <div className="bg-neutral-50 rounded p-2 mb-2">
              {result.details.slice(0, 3).map((detail: any, i: number) => (
                <div key={i} className="flex justify-between text-xs mb-0.5 last:mb-0">
                  <span className="text-neutral-600">{detail.label}:</span>
                  <span className="font-semibold text-neutral-900">{detail.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {!result.saved ? (
                <button 
                  onClick={() => onCalculate({ ...result, saved: true })} 
                  className="btn-primary flex-1 text-xs py-1.5"
                >
                  Save KPI
                </button>
              ) : (
                <div className="flex-1 bg-primary-100 border border-primary-300 rounded px-2 py-1.5 text-center text-xs font-medium text-primary-800">
                  ✓ Saved
                </div>
              )}
              <button 
                onClick={() => onCalculate(null)} 
                className="btn-secondary text-xs py-1.5 text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// KPI 5: Case Volume Reduction Card
function CaseVolumeReductionCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-purple-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 5</div>
            <h3 className="text-sm font-bold text-neutral-900">Case Volume Reduction</h3>
          </div>
          {result?.saved && (
            <div className="text-right">
              <div className="text-xs text-neutral-500">Impact</div>
              <div className="text-sm font-bold text-primary-600">{formatCurrency(result.impactGBP)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-neutral-600 mb-3">
          Proactively reduce support cases
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current Case Volume/Month</label>
              <input
                type="number"
                value={inputs.currentCaseVolume}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentCaseVolume: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCaseVolumeReduction(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cost Per Case ($)</label>
              <input
                type="number"
                value={inputs.costPerCase}
                onChange={(e) => {
                  const newInputs = { ...inputs, costPerCase: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCaseVolumeReduction(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Volume Reduction (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.volumeReductionPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={inputs.volumeReductionPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, volumeReductionPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateCaseVolumeReduction(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateCaseVolumeReduction(inputs))} 
          className="btn-secondary text-xs py-1.5 mb-3"
        >
          Calculate Impact
        </button>

        {result && (
          <div className="mt-auto pt-3 border-t border-neutral-200">
            <div className="bg-neutral-50 rounded p-2 mb-2">
              {result.details.slice(0, 3).map((detail: any, i: number) => (
                <div key={i} className="flex justify-between text-xs mb-0.5 last:mb-0">
                  <span className="text-neutral-600">{detail.label}:</span>
                  <span className="font-semibold text-neutral-900">{detail.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {!result.saved ? (
                <button 
                  onClick={() => onCalculate({ ...result, saved: true })} 
                  className="btn-primary flex-1 text-xs py-1.5"
                >
                  Save KPI
                </button>
              ) : (
                <div className="flex-1 bg-primary-100 border border-primary-300 rounded px-2 py-1.5 text-center text-xs font-medium text-primary-800">
                  ✓ Saved
                </div>
              )}
              <button 
                onClick={() => onCalculate(null)} 
                className="btn-secondary text-xs py-1.5 text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
