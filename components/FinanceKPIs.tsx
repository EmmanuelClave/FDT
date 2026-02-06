'use client'

import { KPIInputsData, KPIResult } from '@/types'
import {
  calculateFinanceOutsourcingSpend,
  calculateCostPerAnalysis,
  calculateAnalysisTime,
  calculateReconciliationTime,
  calculateDaysSalesOutstanding,
  calculateComplianceRate,
} from '@/lib/calculations'
import {
  DEFAULT_FINANCE_OUTSOURCING_SPEND,
  DEFAULT_COST_PER_ANALYSIS,
  DEFAULT_ANALYSIS_TIME,
  DEFAULT_RECONCILIATION_TIME,
  DEFAULT_DAYS_SALES_OUTSTANDING,
  DEFAULT_COMPLIANCE_RATE,
} from '@/lib/defaults'

interface FinanceKPIsProps {
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


export default function FinanceKPIs({
  agentName,
  kpiInputs,
  results,
  onUpdateKPIInputs,
  onUpdateResults,
  onBack,
  onSaveAgent,
}: FinanceKPIsProps) {
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
          <p className="text-neutral-600">Configure Finance KPIs and calculate business impact</p>
        </div>
        {hasSavedKPIs && (
          <button onClick={onSaveAgent} className="btn-primary">
            Save Agent & Create New
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FinanceOutsourcingSpendCard
          inputs={kpiInputs.financeOutsourcingSpend || DEFAULT_FINANCE_OUTSOURCING_SPEND}
          result={getResultForKPI('Finance Outsourcing Spend Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, financeOutsourcingSpend: inputs })}
          onCalculate={(result) => handleCalculate('Finance Outsourcing Spend Reduction', result)}
        />

        <CostPerAnalysisCard
          inputs={kpiInputs.costPerAnalysis || DEFAULT_COST_PER_ANALYSIS}
          result={getResultForKPI('Cost Per Analysis Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, costPerAnalysis: inputs })}
          onCalculate={(result) => handleCalculate('Cost Per Analysis Reduction', result)}
        />

        <AnalysisTimeCard
          inputs={kpiInputs.analysisTime || DEFAULT_ANALYSIS_TIME}
          result={getResultForKPI('Analysis Time Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, analysisTime: inputs })}
          onCalculate={(result) => handleCalculate('Analysis Time Reduction', result)}
        />

        <ReconciliationTimeCard
          inputs={kpiInputs.reconciliationTime || DEFAULT_RECONCILIATION_TIME}
          result={getResultForKPI('Reconciliation Time Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, reconciliationTime: inputs })}
          onCalculate={(result) => handleCalculate('Reconciliation Time Reduction', result)}
        />

        <DaysSalesOutstandingCard
          inputs={kpiInputs.daysSalesOutstanding || DEFAULT_DAYS_SALES_OUTSTANDING}
          result={getResultForKPI('Days Sales Outstanding Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, daysSalesOutstanding: inputs })}
          onCalculate={(result) => handleCalculate('Days Sales Outstanding Reduction', result)}
        />

        <ComplianceRateCard
          inputs={kpiInputs.complianceRate || DEFAULT_COMPLIANCE_RATE}
          result={getResultForKPI('Compliance Rate Improvement')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, complianceRate: inputs })}
          onCalculate={(result) => handleCalculate('Compliance Rate Improvement', result)}
        />
      </div>

      {/* Value Narrative */}
      {hasSavedKPIs && (
        <div className="mt-8 card bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>How {agentName} Optimizes Your Finance Process</span>
          </h3>
          <div className="space-y-3 text-sm text-neutral-700">
            {results.filter(r => r.saved).map((result, idx) => {
              let narrative = ''
              switch (result.kpiName) {
                case 'Finance Outsourcing Spend Reduction':
                  narrative = `${agentName} automates routine finance tasks currently handled by external vendors, such as data entry, invoice processing, and basic reporting. By handling these tasks internally through AI automation, the agent significantly reduces outsourcing costs while maintaining accuracy and compliance.`
                  break
                case 'Cost Per Analysis Reduction':
                  narrative = `${agentName} streamlines financial analysis by automatically gathering data from multiple sources, consolidating information, and generating preliminary insights. This automation reduces the manual effort required for each analysis, lowering the cost per analysis while improving speed and consistency.`
                  break
                case 'Analysis Time Reduction':
                  narrative = `Through intelligent automation of data collection, cleansing, and preliminary analysis, ${agentName} dramatically reduces the time required to complete financial analyses. The agent handles repetitive tasks, allowing finance teams to focus on strategic interpretation and decision-making.`
                  break
                case 'Reconciliation Time Reduction':
                  narrative = `${agentName} automates account reconciliation by matching transactions across systems, identifying discrepancies, and flagging items for review. This reduces manual reconciliation time from hours to minutes, improving accuracy and allowing finance teams to close books faster.`
                  break
                case 'Days Sales Outstanding Reduction':
                  narrative = `By monitoring outstanding invoices, sending automated payment reminders, and predicting payment delays, ${agentName} helps accelerate cash collection. The agent identifies at-risk accounts early and triggers appropriate follow-up actions, improving cash flow and reducing DSO.`
                  break
                case 'Compliance Rate Improvement':
                  narrative = `${agentName} continuously monitors transactions and processes against regulatory requirements, flagging potential compliance issues in real-time. The agent ensures consistent application of policies, reduces human error, and provides audit trails, improving overall compliance rates.`
                  break
              }
              return narrative ? (
                <div key={idx} className="pb-3 border-b border-emerald-200 last:border-0 last:pb-0">
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
function FinanceOutsourcingSpendCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-emerald-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 1</div>
            <h3 className="text-sm font-bold text-neutral-900">Finance Outsourcing Spend Reduction</h3>
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
          Reduce external finance service costs through AI automation
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Monthly Outsourcing Spend ($)</label>
              <input
                type="number"
                value={inputs.currentOutsourcingSpendPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentOutsourcingSpendPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFinanceOutsourcingSpend(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Tasks/Month</label>
              <input
                type="number"
                value={inputs.outsourcedTasksPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, outsourcedTasksPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFinanceOutsourcingSpend(newInputs), saved: true })
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
                    onCalculate({ ...calculateFinanceOutsourcingSpend(newInputs), saved: true })
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
                    onCalculate({ ...calculateFinanceOutsourcingSpend(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateFinanceOutsourcingSpend(inputs))} 
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

function CostPerAnalysisCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-teal-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 2</div>
            <h3 className="text-sm font-bold text-neutral-900">Cost Per Analysis Reduction</h3>
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
          Reduce cost per financial analysis through automation
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Analyses/Month</label>
              <input
                type="number"
                value={inputs.analysesPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, analysesPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCostPerAnalysis(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Hours/Analysis</label>
              <input
                type="number"
                step="0.5"
                value={inputs.hoursPerAnalysis}
                onChange={(e) => {
                  const newInputs = { ...inputs, hoursPerAnalysis: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCostPerAnalysis(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Hourly Rate ($)</label>
              <input
                type="number"
                value={inputs.hourlyRate}
                onChange={(e) => {
                  const newInputs = { ...inputs, hourlyRate: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCostPerAnalysis(newInputs), saved: true })
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
              {(inputs.timeReductionPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="80"
            step="1"
            value={inputs.timeReductionPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, timeReductionPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateCostPerAnalysis(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateCostPerAnalysis(inputs))} 
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

function AnalysisTimeCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-cyan-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 3</div>
            <h3 className="text-sm font-bold text-neutral-900">Analysis Time Reduction</h3>
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
          Accelerate financial analysis through automated data processing
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Analysts</label>
              <input
                type="number"
                value={inputs.numberOfAnalysts}
                onChange={(e) => {
                  const newInputs = { ...inputs, numberOfAnalysts: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAnalysisTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Hours/Week</label>
              <input
                type="number"
                step="0.5"
                value={inputs.hoursPerWeek}
                onChange={(e) => {
                  const newInputs = { ...inputs, hoursPerWeek: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAnalysisTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Hourly Rate ($)</label>
              <input
                type="number"
                value={inputs.hourlyRate}
                onChange={(e) => {
                  const newInputs = { ...inputs, hourlyRate: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateAnalysisTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Time Savings (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.timeSavingsPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="70"
            step="1"
            value={inputs.timeSavingsPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, timeSavingsPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateAnalysisTime(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateAnalysisTime(inputs))} 
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

function ReconciliationTimeCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-sky-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 4</div>
            <h3 className="text-sm font-bold text-neutral-900">Reconciliation Time Reduction</h3>
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
          Automate account reconciliation to reduce manual effort
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Reconciliations/Month</label>
              <input
                type="number"
                value={inputs.reconciliationsPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, reconciliationsPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateReconciliationTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Hours/Reconciliation</label>
              <input
                type="number"
                step="0.5"
                value={inputs.hoursPerReconciliation}
                onChange={(e) => {
                  const newInputs = { ...inputs, hoursPerReconciliation: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateReconciliationTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Hourly Rate ($)</label>
              <input
                type="number"
                value={inputs.hourlyRate}
                onChange={(e) => {
                  const newInputs = { ...inputs, hourlyRate: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateReconciliationTime(newInputs), saved: true })
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
              {(inputs.timeReductionPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="90"
            step="1"
            value={inputs.timeReductionPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, timeReductionPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateReconciliationTime(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateReconciliationTime(inputs))} 
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

function DaysSalesOutstandingCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-violet-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 5</div>
            <h3 className="text-sm font-bold text-neutral-900">Days Sales Outstanding Reduction</h3>
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
          Accelerate cash collection through automated AR management
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current DSO (Days)</label>
              <input
                type="number"
                value={inputs.currentDSO}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentDSO: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateDaysSalesOutstanding(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Annual Revenue ($)</label>
              <input
                type="number"
                value={inputs.annualRevenue}
                onChange={(e) => {
                  const newInputs = { ...inputs, annualRevenue: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateDaysSalesOutstanding(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cost of Capital (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="30"
                value={inputs.costOfCapital * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, costOfCapital: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateDaysSalesOutstanding(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">DSO Reduction (Days)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {inputs.dsoReductionDays}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={inputs.dsoReductionDays}
            onChange={(e) => {
              const newInputs = { ...inputs, dsoReductionDays: Number(e.target.value) }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateDaysSalesOutstanding(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateDaysSalesOutstanding(inputs))} 
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

function ComplianceRateCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-purple-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 6</div>
            <h3 className="text-sm font-bold text-neutral-900">Compliance Rate Improvement</h3>
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
          Improve regulatory compliance through continuous monitoring
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Transactions/Month</label>
              <input
                type="number"
                value={inputs.transactionsPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, transactionsPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateComplianceRate(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current Compliance (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.currentComplianceRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentComplianceRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateComplianceRate(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cost Per Issue ($)</label>
              <input
                type="number"
                value={inputs.costPerComplianceIssue}
                onChange={(e) => {
                  const newInputs = { ...inputs, costPerComplianceIssue: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateComplianceRate(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700">Improvement (%)</label>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {(inputs.complianceImprovementPct * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={inputs.complianceImprovementPct * 100}
            onChange={(e) => {
              const newInputs = { ...inputs, complianceImprovementPct: Number(e.target.value) / 100 }
              onUpdate(newInputs)
              if (result?.saved) {
                onCalculate({ ...calculateComplianceRate(newInputs), saved: true })
              }
            }}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>

        <button 
          onClick={() => onCalculate(calculateComplianceRate(inputs))} 
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
