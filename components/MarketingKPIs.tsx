'use client'

import { KPIInputsData, KPIResult } from '@/types'
import {
  calculateAgencySpend,
  calculateCostPerLead,
  calculateRevenuePerLead,
  calculateBrandValueIncrease,
  calculateCustomerRetention,
  calculateLeadsGenerated,
} from '@/lib/calculations'
import {
  DEFAULT_AGENCY_SPEND,
  DEFAULT_COST_PER_LEAD,
  DEFAULT_REVENUE_PER_LEAD,
  DEFAULT_BRAND_VALUE_INCREASE,
  DEFAULT_CUSTOMER_RETENTION,
  DEFAULT_LEADS_GENERATED,
} from '@/lib/defaults'

interface MarketingKPIsProps {
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

export default function MarketingKPIs({
  agentName,
  kpiInputs,
  results,
  onUpdateKPIInputs,
  onUpdateResults,
  onBack,
  onSaveAgent,
}: MarketingKPIsProps) {
  const handleCalculate = (kpiName: string, result: KPIResult | null) => {
    const existingIndex = results.findIndex(r => r.kpiName === result?.kpiName)
    let newResults: KPIResult[]
    
    if (result === null) {
      newResults = results.filter(r => r.kpiName !== kpiName)
    } else if (existingIndex >= 0) {
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
          <p className="text-neutral-600">Configure Marketing KPIs and calculate business impact</p>
        </div>
        {hasSavedKPIs && (
          <button onClick={onSaveAgent} className="btn-primary">
            Save Agent & Create New
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <AgencySpendCard
          inputs={kpiInputs.agencySpend || DEFAULT_AGENCY_SPEND}
          result={getResultForKPI('Agency Spend Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, agencySpend: inputs })}
          onCalculate={(result) => handleCalculate('Agency Spend Reduction', result)}
        />

        <CostPerLeadCard
          inputs={kpiInputs.costPerLead || DEFAULT_COST_PER_LEAD}
          result={getResultForKPI('Cost Per Lead Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, costPerLead: inputs })}
          onCalculate={(result) => handleCalculate('Cost Per Lead Reduction', result)}
        />

        <RevenuePerLeadCard
          inputs={kpiInputs.revenuePerLead || DEFAULT_REVENUE_PER_LEAD}
          result={getResultForKPI('Revenue Per Lead Increase')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, revenuePerLead: inputs })}
          onCalculate={(result) => handleCalculate('Revenue Per Lead Increase', result)}
        />

        <BrandValueIncreaseCard
          inputs={kpiInputs.brandValueIncrease || DEFAULT_BRAND_VALUE_INCREASE}
          result={getResultForKPI('Brand Value Increase')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, brandValueIncrease: inputs })}
          onCalculate={(result) => handleCalculate('Brand Value Increase', result)}
        />

        <CustomerRetentionCard
          inputs={kpiInputs.customerRetention || DEFAULT_CUSTOMER_RETENTION}
          result={getResultForKPI('Customer Retention Improvement')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, customerRetention: inputs })}
          onCalculate={(result) => handleCalculate('Customer Retention Improvement', result)}
        />

        <LeadsGeneratedCard
          inputs={kpiInputs.leadsGenerated || DEFAULT_LEADS_GENERATED}
          result={getResultForKPI('Leads Generated Increase')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, leadsGenerated: inputs })}
          onCalculate={(result) => handleCalculate('Leads Generated Increase', result)}
        />
      </div>

      {/* Value Narrative */}
      {hasSavedKPIs && (
        <div className="mt-8 card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>How {agentName} Optimizes Your Marketing Process</span>
          </h3>
          <div className="space-y-3 text-sm text-neutral-700">
            {results.filter(r => r.saved).map((result, idx) => {
              let narrative = ''
              switch (result.kpiName) {
                case 'Agency Spend Reduction':
                  narrative = `${agentName} automates creative production, campaign execution, and content generation tasks traditionally handled by external agencies. By leveraging AI for design iterations, copy variations, and performance optimization, the agent reduces dependency on expensive agency services while maintaining quality.`
                  break
                case 'Cost Per Lead Reduction':
                  narrative = `Through intelligent budget allocation, real-time bidding optimization, and audience targeting refinement, ${agentName} maximizes the efficiency of every marketing dollar. The agent continuously tests and learns from campaign performance to identify the most cost-effective channels and messaging.`
                  break
                case 'Revenue Per Lead Increase':
                  narrative = `${agentName} enhances lead quality through advanced scoring models, behavioral analysis, and personalized nurturing sequences. By identifying which leads are most likely to convert and providing them with tailored content at optimal times, the agent increases the revenue value of each prospect.`
                  break
                case 'Brand Value Increase':
                  narrative = `By analyzing market trends, competitor positioning, and audience sentiment, ${agentName} identifies opportunities to strengthen brand perception and awareness. The agent recommends strategic content, partnerships, and campaigns that resonate with target audiences and differentiate your brand in the market.`
                  break
                case 'Customer Retention Improvement':
                  narrative = `${agentName} predicts churn risk by monitoring engagement patterns and customer behavior. The agent triggers personalized retention campaigns, recommends relevant offers, and identifies the right moments to re-engage customers, increasing lifetime value and reducing acquisition costs.`
                  break
                case 'Leads Generated Increase':
                  narrative = `Through AI-powered content optimization, SEO enhancement, and multi-channel campaign orchestration, ${agentName} expands your reach and attracts more qualified prospects. The agent identifies high-performing tactics and scales them efficiently across channels to maximize lead generation.`
                  break
              }
              return narrative ? (
                <div key={idx} className="pb-3 border-b border-purple-200 last:border-0 last:pb-0">
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
function AgencySpendCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-teal-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 1</div>
            <h3 className="text-sm font-bold text-neutral-900">Agency Spend Reduction</h3>
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
          Reduce external agency costs through AI automation
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Monthly Agency Spend ($)</label>
              <input
                type="number"
                value={inputs.currentAgencySpendPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentAgencySpendPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAgencySpend(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Tasks/Month</label>
              <input
                type="number"
                value={inputs.agencyTasksPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, agencyTasksPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAgencySpend(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Automation %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.automationPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, automationPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAgencySpend(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cost Savings %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.costSavingsPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, costSavingsPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAgencySpend(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateAgencySpend(inputs))} 
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

function CostPerLeadCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-cyan-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 2</div>
            <h3 className="text-sm font-bold text-neutral-900">Cost Per Lead Reduction</h3>
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
          Improve marketing efficiency and reduce cost per lead
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Marketing Spend/Month ($)</label>
              <input
                type="number"
                value={inputs.totalMarketingSpendPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, totalMarketingSpendPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCostPerLead(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Leads/Month</label>
              <input
                type="number"
                value={inputs.leadsGeneratedPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, leadsGeneratedPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCostPerLead(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Cost Reduction (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.costReductionPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={inputs.costReductionPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, costReductionPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateCostPerLead(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateCostPerLead(inputs))} 
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

function RevenuePerLeadCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-sky-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 3</div>
            <h3 className="text-sm font-bold text-neutral-900">Revenue Per Lead Increase</h3>
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
          Improve lead quality and conversion for higher revenue
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Leads/Month</label>
              <input
                type="number"
                value={inputs.leadsPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, leadsPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateRevenuePerLead(newInputs), saved: true })
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
                value={inputs.conversionRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, conversionRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateRevenuePerLead(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Avg Revenue/Customer ($)</label>
              <input
                type="number"
                value={inputs.averageRevenuePerCustomer}
                onChange={(e) => {
                  const newInputs = { ...inputs, averageRevenuePerCustomer: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateRevenuePerLead(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Revenue Improvement (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.revenueImprovementPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={inputs.revenueImprovementPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, revenueImprovementPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateRevenuePerLead(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateRevenuePerLead(inputs))} 
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

function BrandValueIncreaseCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-violet-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 4</div>
            <h3 className="text-sm font-bold text-neutral-900">Brand Value Increase</h3>
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
          Enhance brand awareness and positioning for revenue growth
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current Brand Value ($)</label>
              <input
                type="number"
                value={inputs.currentBrandValue}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentBrandValue: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateBrandValueIncrease(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Awareness Growth (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.brandAwarenessGrowthPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, brandAwarenessGrowthPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateBrandValueIncrease(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Revenue Multiplier</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="2"
                value={inputs.revenueMultiplier}
                onChange={(e) => {
                  const newInputs = { ...inputs, revenueMultiplier: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateBrandValueIncrease(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateBrandValueIncrease(inputs))} 
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

function CustomerRetentionCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-purple-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 5</div>
            <h3 className="text-sm font-bold text-neutral-900">Customer Retention</h3>
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
          Improve customer retention through better engagement
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Total Customers</label>
              <input
                type="number"
                value={inputs.totalCustomers}
                onChange={(e) => {
                  const newInputs = { ...inputs, totalCustomers: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCustomerRetention(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current Retention (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.currentRetentionRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentRetentionRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCustomerRetention(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Avg Revenue/Customer ($)</label>
              <input
                type="number"
                value={inputs.averageRevenuePerCustomer}
                onChange={(e) => {
                  const newInputs = { ...inputs, averageRevenuePerCustomer: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCustomerRetention(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Retention Improvement (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.retentionImprovementPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={inputs.retentionImprovementPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, retentionImprovementPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateCustomerRetention(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateCustomerRetention(inputs))} 
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

function LeadsGeneratedCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-slate-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 6</div>
            <h3 className="text-sm font-bold text-neutral-900">Leads Generated</h3>
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
          Generate more qualified leads through AI-powered campaigns
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current Leads/Month</label>
              <input
                type="number"
                value={inputs.currentLeadsPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentLeadsPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateLeadsGenerated(newInputs), saved: true })
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
                value={inputs.conversionRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, conversionRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateLeadsGenerated(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Avg Revenue/Customer ($)</label>
              <input
                type="number"
                value={inputs.averageRevenuePerCustomer}
                onChange={(e) => {
                  const newInputs = { ...inputs, averageRevenuePerCustomer: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateLeadsGenerated(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Lead Growth (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.leadGrowthPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={inputs.leadGrowthPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, leadGrowthPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateLeadsGenerated(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateLeadsGenerated(inputs))} 
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
