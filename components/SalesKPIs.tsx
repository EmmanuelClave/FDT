'use client'

import { KPIInputsData, KPIResult } from '@/types'
import {
  calculateMoreLeads,
  calculateImprovedLeadConversion,
  calculateImprovedWinRate,
  calculateIncreasedDealSize,
  calculateAcceleratedSalesCycle,
  calculateSellerTimeSavings,
} from '@/lib/calculations'
import {
  DEFAULT_MORE_LEADS,
  DEFAULT_IMPROVED_LEAD_CONVERSION,
  DEFAULT_IMPROVED_WIN_RATE,
  DEFAULT_INCREASED_DEAL_SIZE,
  DEFAULT_ACCELERATED_SALES_CYCLE,
  DEFAULT_SELLER_TIME_SAVINGS,
} from '@/lib/defaults'

interface SalesKPIsProps {
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

function formatPercentage(value: number, decimals = 0): string {
  return `${(value * 100).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`
}

export default function SalesKPIs({
  agentName,
  kpiInputs,
  results,
  onUpdateKPIInputs,
  onUpdateResults,
  onBack,
  onSaveAgent,
}: SalesKPIsProps) {
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

  // Handle shared field updates - propagate to all KPIs
  const handleSharedFieldUpdate = (field: 'currentLeads' | 'leadConversionRate' | 'opportunityWinRate' | 'averageDealSize', value: number) => {
    const updatedInputs = { ...kpiInputs }
    
    // Update all KPIs that have this field (excludes improvedWinRate, increasedDealSize, acceleratedSalesCycle which have different fields)
    if (updatedInputs.moreLeads) {
      updatedInputs.moreLeads = { ...updatedInputs.moreLeads, [field]: value }
    }
    if (updatedInputs.improvedLeadConversion) {
      updatedInputs.improvedLeadConversion = { ...updatedInputs.improvedLeadConversion, [field]: value }
    }
    
    onUpdateKPIInputs(updatedInputs)
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
          <p className="text-neutral-600">Configure Sales KPIs and calculate business impact</p>
        </div>
        {hasSavedKPIs && (
          <button onClick={onSaveAgent} className="btn-primary">
            Save Agent & Create New
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MoreLeadsCard
          inputs={kpiInputs.moreLeads || DEFAULT_MORE_LEADS}
          result={getResultForKPI('More Leads')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, moreLeads: inputs })}
          onUpdateShared={handleSharedFieldUpdate}
          onCalculate={(result) => handleCalculate('More Leads', result)}
        />

        <ImprovedLeadConversionCard
          inputs={kpiInputs.improvedLeadConversion || DEFAULT_IMPROVED_LEAD_CONVERSION}
          result={getResultForKPI('Improved Lead Conversion')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, improvedLeadConversion: inputs })}
          onUpdateShared={handleSharedFieldUpdate}
          onCalculate={(result) => handleCalculate('Improved Lead Conversion', result)}
        />

        <ImprovedWinRateCard
          inputs={kpiInputs.improvedWinRate || DEFAULT_IMPROVED_WIN_RATE}
          result={getResultForKPI('Improved Win Rate')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, improvedWinRate: inputs })}
          onCalculate={(result) => handleCalculate('Improved Win Rate', result)}
        />

        <IncreasedDealSizeCard
          inputs={kpiInputs.increasedDealSize || DEFAULT_INCREASED_DEAL_SIZE}
          result={getResultForKPI('Increased Deal Size')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, increasedDealSize: inputs })}
          onCalculate={(result) => handleCalculate('Increased Deal Size', result)}
        />

        <AcceleratedSalesCycleCard
          inputs={kpiInputs.acceleratedSalesCycle || DEFAULT_ACCELERATED_SALES_CYCLE}
          result={getResultForKPI('Accelerated Sales Cycle')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, acceleratedSalesCycle: inputs })}
          onCalculate={(result) => handleCalculate('Accelerated Sales Cycle', result)}
        />

        <SellerTimeSavingsCard
          inputs={kpiInputs.sellerTimeSavings || DEFAULT_SELLER_TIME_SAVINGS}
          result={getResultForKPI('Seller Time Savings')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, sellerTimeSavings: inputs })}
          onCalculate={(result) => handleCalculate('Seller Time Savings', result)}
        />
      </div>

      {/* Value Narrative */}
      {hasSavedKPIs && (
        <div className="mt-8 card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>How {agentName} Optimizes Your Sales Process</span>
          </h3>
          <div className="space-y-3 text-sm text-neutral-700">
            {results.filter(r => r.saved).map((result, idx) => {
              let narrative = ''
              switch (result.kpiName) {
                case 'More Leads':
                  narrative = `By leveraging AI-powered prospecting and lead identification, ${agentName} automatically discovers and qualifies new opportunities, expanding your pipeline without additional manual effort. The agent analyzes patterns in successful conversions to identify high-potential prospects.`
                  break
                case 'Improved Lead Conversion':
                  narrative = `${agentName} enhances lead-to-opportunity conversion by providing personalized engagement strategies, optimal timing recommendations, and context-aware nurturing sequences. Machine learning models identify which leads are most likely to convert and suggest the best approach for each prospect.`
                  break
                case 'Improved Win Rate':
                  narrative = `Through intelligent competitive analysis and opportunity scoring, ${agentName} helps prioritize deals with the highest win probability. The agent provides real-time insights on competitor positioning, pricing strategies, and customer pain points to strengthen your proposals.`
                  break
                case 'Increased Deal Size':
                  narrative = `${agentName} identifies upsell and cross-sell opportunities by analyzing customer needs, usage patterns, and comparable deals. The agent recommends optimal product bundles and value propositions that resonate with each customer's specific requirements.`
                  break
                case 'Accelerated Sales Cycle':
                  narrative = `By automating routine tasks, generating proposals, and providing instant answers to common questions, ${agentName} eliminates bottlenecks in your sales process. The agent ensures smooth handoffs between stages and proactively addresses potential delays.`
                  break
                case 'Seller Time Savings':
                  narrative = `${agentName} handles time-consuming administrative tasks like data entry, meeting scheduling, follow-up emails, and CRM updates. This frees your sales team to focus on high-value activities like relationship building and strategic deal advancement.`
                  break
              }
              return narrative ? (
                <div key={idx} className="pb-3 border-b border-blue-200 last:border-0 last:pb-0">
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

// Individual KPI Card Components
function MoreLeadsCard({ inputs, result, onUpdate, onUpdateShared, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-blue-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 1</div>
            <h3 className="text-sm font-bold text-neutral-900">More Leads</h3>
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
          Generate additional leads through AI-assisted prospecting
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Number of leads</label>
              <input
                type="number"
                value={inputs.currentLeads}
                onChange={(e) => {
                  onUpdateShared('currentLeads', Number(e.target.value))
                  if (result?.saved) {
                    const newInputs = { ...inputs, currentLeads: Number(e.target.value) }
                    onCalculate({ ...calculateMoreLeads(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Conversion Rate (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.leadConversionRate * 100}
                onChange={(e) => {
                  onUpdateShared('leadConversionRate', Number(e.target.value) / 100)
                  if (result?.saved) {
                    const newInputs = { ...inputs, leadConversionRate: Number(e.target.value) / 100 }
                    onCalculate({ ...calculateMoreLeads(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Win Rate (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.opportunityWinRate * 100}
                onChange={(e) => {
                  onUpdateShared('opportunityWinRate', Number(e.target.value) / 100)
                  if (result?.saved) {
                    const newInputs = { ...inputs, opportunityWinRate: Number(e.target.value) / 100 }
                    onCalculate({ ...calculateMoreLeads(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Avg Deal ($)</label>
              <input
                type="number"
                value={inputs.averageDealSize}
                onChange={(e) => {
                  onUpdateShared('averageDealSize', Number(e.target.value))
                  if (result?.saved) {
                    const newInputs = { ...inputs, averageDealSize: Number(e.target.value) }
                    onCalculate({ ...calculateMoreLeads(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Lead Increment (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.incrementPct * 100).toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={inputs.incrementPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, incrementPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateMoreLeads(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateMoreLeads(inputs))} 
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

function ImprovedLeadConversionCard({ inputs, result, onUpdate, onUpdateShared, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-indigo-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 2</div>
            <h3 className="text-sm font-bold text-neutral-900">Improved Lead Conversion</h3>
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
          Increase conversion rate from leads to opportunities
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Number of leads</label>
              <input
                type="number"
                value={inputs.currentLeads}
                onChange={(e) => {
                  onUpdateShared('currentLeads', Number(e.target.value))
                  if (result?.saved) {
                    const newInputs = { ...inputs, currentLeads: Number(e.target.value) }
                    onCalculate({ ...calculateImprovedLeadConversion(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Conversion Rate (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.leadConversionRate * 100}
                onChange={(e) => {
                  onUpdateShared('leadConversionRate', Number(e.target.value) / 100)
                  if (result?.saved) {
                    const newInputs = { ...inputs, leadConversionRate: Number(e.target.value) / 100 }
                    onCalculate({ ...calculateImprovedLeadConversion(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Win Rate (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.opportunityWinRate * 100}
                onChange={(e) => {
                  onUpdateShared('opportunityWinRate', Number(e.target.value) / 100)
                  if (result?.saved) {
                    const newInputs = { ...inputs, opportunityWinRate: Number(e.target.value) / 100 }
                    onCalculate({ ...calculateImprovedLeadConversion(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Avg Deal ($)</label>
              <input
                type="number"
                value={inputs.averageDealSize}
                onChange={(e) => {
                  onUpdateShared('averageDealSize', Number(e.target.value))
                  if (result?.saved) {
                    const newInputs = { ...inputs, averageDealSize: Number(e.target.value) }
                    onCalculate({ ...calculateImprovedLeadConversion(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">CR Improvement (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.optimisationPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={inputs.optimisationPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, optimisationPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateImprovedLeadConversion(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateImprovedLeadConversion(inputs))} 
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

function ImprovedWinRateCard({ inputs, result, onUpdate, onUpdateShared, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-sky-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 3</div>
            <h3 className="text-sm font-bold text-neutral-900">Improved Win Rate</h3>
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
          Increase the rate at which opportunities convert to wins
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">#Oppties / Seller</label>
              <input
                type="number"
                value={inputs.opportunitiesPerSeller}
                onChange={(e) => {
                  const newInputs = { ...inputs, opportunitiesPerSeller: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateImprovedWinRate(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Win Rate (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.opportunityWinRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, opportunityWinRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateImprovedWinRate(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Avg Deal ($)</label>
              <input
                type="number"
                value={inputs.averageDealSize}
                onChange={(e) => {
                  const newInputs = { ...inputs, averageDealSize: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateImprovedWinRate(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">#Sellers</label>
              <input
                type="number"
                value={inputs.numberOfSellers}
                onChange={(e) => {
                  const newInputs = { ...inputs, numberOfSellers: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateImprovedWinRate(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Win Rate Improvement (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.optimisationPct * 100).toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={inputs.optimisationPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, optimisationPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateImprovedWinRate(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateImprovedWinRate(inputs))} 
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

function IncreasedDealSizeCard({ inputs, result, onUpdate, onUpdateShared, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-violet-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 4</div>
            <h3 className="text-sm font-bold text-neutral-900">Increased Deal Size</h3>
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
          Increase average revenue per deal through better targeting
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">#Oppties / Seller</label>
              <input
                type="number"
                value={inputs.opportunitiesPerSeller}
                onChange={(e) => {
                  const newInputs = { ...inputs, opportunitiesPerSeller: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateIncreasedDealSize(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Win Rate (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.opportunityWinRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, opportunityWinRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateIncreasedDealSize(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Avg Deal ($)</label>
              <input
                type="number"
                value={inputs.averageDealSize}
                onChange={(e) => {
                  const newInputs = { ...inputs, averageDealSize: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateIncreasedDealSize(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">#Sellers</label>
              <input
                type="number"
                value={inputs.numberOfSellers}
                onChange={(e) => {
                  const newInputs = { ...inputs, numberOfSellers: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateIncreasedDealSize(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Deal Size Improvement (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.upliftPct * 100).toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={inputs.upliftPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, upliftPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateIncreasedDealSize(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateIncreasedDealSize(inputs))} 
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

function AcceleratedSalesCycleCard({ inputs, result, onUpdate, onUpdateShared, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-purple-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 5</div>
            <h3 className="text-sm font-bold text-neutral-900">Accelerated Sales Cycle</h3>
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
          Reduce sales cycle time to increase deal velocity
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Sales Cycle (days)</label>
              <input
                type="number"
                value={inputs.salesCycleLengthDays}
                onChange={(e) => {
                  const newInputs = { ...inputs, salesCycleLengthDays: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAcceleratedSalesCycle(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">#Oppties / Seller</label>
              <input
                type="number"
                value={inputs.opportunitiesPerSeller}
                onChange={(e) => {
                  const newInputs = { ...inputs, opportunitiesPerSeller: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAcceleratedSalesCycle(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Win Rate (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.opportunityWinRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, opportunityWinRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAcceleratedSalesCycle(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Avg Deal ($)</label>
              <input
                type="number"
                value={inputs.averageDealSize}
                onChange={(e) => {
                  const newInputs = { ...inputs, averageDealSize: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAcceleratedSalesCycle(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">#Sellers</label>
              <input
                type="number"
                value={inputs.numberOfSellers}
                onChange={(e) => {
                  const newInputs = { ...inputs, numberOfSellers: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAcceleratedSalesCycle(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Cycle Reduction (days)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {Math.round(inputs.daysReduction)} days
            </span>
          </div>
          <input
            type="range"
            min="1"
            max={Math.min(inputs.salesCycleLengthDays - 1, 30)}
            step="1"
            value={inputs.daysReduction}
            onChange={(e) => {
              const newInputs = { ...inputs, daysReduction: Number(e.target.value) }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateAcceleratedSalesCycle(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateAcceleratedSalesCycle(inputs))} 
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

function SellerTimeSavingsCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-slate-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 6</div>
            <h3 className="text-sm font-bold text-neutral-900">Seller Time Savings</h3>
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
          Free up seller time by automating routine tasks
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">#Hours/W Low Value Tasks</label>
              <input
                type="number"
                value={inputs.hoursPerWeekLowValueTasks}
                onChange={(e) => {
                  const newInputs = { ...inputs, hoursPerWeekLowValueTasks: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateSellerTimeSavings(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">#Oppties</label>
              <input
                type="number"
                value={inputs.numberOfOpportunities}
                onChange={(e) => {
                  const newInputs = { ...inputs, numberOfOpportunities: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateSellerTimeSavings(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Win Rate (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.opportunityWinRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, opportunityWinRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateSellerTimeSavings(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Avg Deal ($)</label>
              <input
                type="number"
                value={inputs.averageDealSize}
                onChange={(e) => {
                  const newInputs = { ...inputs, averageDealSize: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateSellerTimeSavings(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">#Sellers</label>
              <input
                type="number"
                value={inputs.numberOfSellers}
                onChange={(e) => {
                  const newInputs = { ...inputs, numberOfSellers: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateSellerTimeSavings(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Productivity Recapture (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.productivityRecaptureRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, productivityRecaptureRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateSellerTimeSavings(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Optimised Hours</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {inputs.optimisedHours.toFixed(1)}h
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={inputs.hoursPerWeekLowValueTasks}
            step="0.5"
            value={inputs.optimisedHours}
            onChange={(e) => {
              const newInputs = { ...inputs, optimisedHours: Number(e.target.value) }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateSellerTimeSavings(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateSellerTimeSavings(inputs))} 
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
