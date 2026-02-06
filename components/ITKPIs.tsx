'use client'

import { KPIInputsData, KPIResult } from '@/types'
import {
  calculateITOutsourcingCosts,
  calculateITIssueResolutionTime,
  calculateShadowITRisk,
  calculateApplicationDowntime,
} from '@/lib/calculations'
import {
  DEFAULT_IT_OUTSOURCING_COSTS,
  DEFAULT_IT_ISSUE_RESOLUTION_TIME,
  DEFAULT_SHADOW_IT_RISK,
  DEFAULT_APPLICATION_DOWNTIME,
} from '@/lib/defaults'

interface ITKPIsProps {
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


export default function ITKPIs({
  agentName,
  kpiInputs,
  results,
  onUpdateKPIInputs,
  onUpdateResults,
  onBack,
  onSaveAgent,
}: ITKPIsProps) {
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
          <p className="text-neutral-600">Configure IT KPIs and calculate business impact</p>
        </div>
        {hasSavedKPIs && (
          <button onClick={onSaveAgent} className="btn-primary">
            Save Agent & Create New
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ITOutsourcingCostsCard
          inputs={kpiInputs.itOutsourcingCosts || DEFAULT_IT_OUTSOURCING_COSTS}
          result={getResultForKPI('IT Outsourcing Cost Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, itOutsourcingCosts: inputs })}
          onCalculate={(result) => handleCalculate('IT Outsourcing Cost Reduction', result)}
        />

        <ITIssueResolutionTimeCard
          inputs={kpiInputs.itIssueResolutionTime || DEFAULT_IT_ISSUE_RESOLUTION_TIME}
          result={getResultForKPI('IT Issue Resolution Time Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, itIssueResolutionTime: inputs })}
          onCalculate={(result) => handleCalculate('IT Issue Resolution Time Reduction', result)}
        />

        <ShadowITRiskCard
          inputs={kpiInputs.shadowITRisk || DEFAULT_SHADOW_IT_RISK}
          result={getResultForKPI('Shadow IT Risk Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, shadowITRisk: inputs })}
          onCalculate={(result) => handleCalculate('Shadow IT Risk Reduction', result)}
        />

        <ApplicationDowntimeCard
          inputs={kpiInputs.applicationDowntime || DEFAULT_APPLICATION_DOWNTIME}
          result={getResultForKPI('Application Downtime Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, applicationDowntime: inputs })}
          onCalculate={(result) => handleCalculate('Application Downtime Reduction', result)}
        />
      </div>

      {/* Value Narrative */}
      {hasSavedKPIs && (
        <div className="mt-8 card bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>How {agentName} Optimizes Your IT Process</span>
          </h3>
          <div className="space-y-3 text-sm text-neutral-700">
            {results.filter(r => r.saved).map((result, idx) => {
              let narrative = ''
              switch (result.kpiName) {
                case 'IT Outsourcing Cost Reduction':
                  narrative = `${agentName} automates routine IT tasks currently handled by external vendors, such as user provisioning, password resets, software installations, and basic troubleshooting. By handling these tasks internally through AI automation, the agent significantly reduces outsourcing costs while maintaining service quality and response times.`
                  break
                case 'IT Issue Resolution Time Reduction':
                  narrative = `Through intelligent diagnostics, automated triage, and knowledge base integration, ${agentName} dramatically reduces IT issue resolution time. The agent analyzes problems, suggests solutions, and even implements fixes automatically for common issues, freeing IT staff to focus on complex problems while improving user satisfaction.`
                  break
                case 'Shadow IT Risk Reduction':
                  narrative = `${agentName} monitors and manages unauthorized IT usage by detecting shadow IT applications, assessing risks, and providing compliant alternatives. The agent helps enforce IT policies, reduces security vulnerabilities, and ensures regulatory compliance while educating users on approved tools and best practices.`
                  break
                case 'Application Downtime Reduction':
                  narrative = `By proactively monitoring system health, predicting potential failures, and automating recovery processes, ${agentName} minimizes application downtime. The agent detects anomalies early, triggers preventive actions, and orchestrates rapid recovery when issues occur, protecting both productivity and revenue.`
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
function ITOutsourcingCostsCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-emerald-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 1</div>
            <h3 className="text-sm font-bold text-neutral-900">IT Outsourcing Cost Reduction</h3>
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
          Reduce external IT service costs through AI automation
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Monthly Outsourcing Spend ($)</label>
              <input
                type="number"
                value={inputs.currentMonthlyITOutsourcingSpend}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentMonthlyITOutsourcingSpend: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateITOutsourcingCosts(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Tasks/Month</label>
              <input
                type="number"
                value={inputs.tasksOutsourcedPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, tasksOutsourcedPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateITOutsourcingCosts(newInputs), saved: true })
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
                    onCalculate({ ...calculateITOutsourcingCosts(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
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
                    onCalculate({ ...calculateITOutsourcingCosts(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateITOutsourcingCosts(inputs))} 
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

function ITIssueResolutionTimeCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-teal-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 2</div>
            <h3 className="text-sm font-bold text-neutral-900">IT Issue Resolution Time Reduction</h3>
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
          Accelerate IT support through automated diagnostics
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Issues/Month</label>
              <input
                type="number"
                value={inputs.issuesPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, issuesPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateITIssueResolutionTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Resolution Time (hrs)</label>
              <input
                type="number"
                step="0.5"
                value={inputs.currentResolutionTimeHours}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentResolutionTimeHours: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateITIssueResolutionTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">IT Staff Cost/Hr ($)</label>
              <input
                type="number"
                value={inputs.itStaffHourlyCost}
                onChange={(e) => {
                  const newInputs = { ...inputs, itStaffHourlyCost: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateITIssueResolutionTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Time Reduction %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.resolutionTimeReductionPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, resolutionTimeReductionPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateITIssueResolutionTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Productivity Cost/Hr ($)</label>
              <input
                type="number"
                value={inputs.productivityImpactCostPerHour}
                onChange={(e) => {
                  const newInputs = { ...inputs, productivityImpactCostPerHour: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateITIssueResolutionTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateITIssueResolutionTime(inputs))} 
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

function ShadowITRiskCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-cyan-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 3</div>
            <h3 className="text-sm font-bold text-neutral-900">Shadow IT Risk Reduction</h3>
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
          Reduce compliance and security risks from unauthorized IT
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Employees at Risk</label>
              <input
                type="number"
                value={inputs.employeesAtRisk}
                onChange={(e) => {
                  const newInputs = { ...inputs, employeesAtRisk: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateShadowITRisk(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Incidents/Year</label>
              <input
                type="number"
                value={inputs.incidentsPerYear}
                onChange={(e) => {
                  const newInputs = { ...inputs, incidentsPerYear: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateShadowITRisk(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Compliance Rate %</label>
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
                    onCalculate({ ...calculateShadowITRisk(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cost/Incident ($)</label>
              <input
                type="number"
                value={inputs.costPerIncident}
                onChange={(e) => {
                  const newInputs = { ...inputs, costPerIncident: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateShadowITRisk(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Risk Reduction %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.riskReductionPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, riskReductionPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateShadowITRisk(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateShadowITRisk(inputs))} 
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

function ApplicationDowntimeCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-blue-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 4</div>
            <h3 className="text-sm font-bold text-neutral-900">Application Downtime Reduction</h3>
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
          Minimize system outages through proactive monitoring
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Downtime Hrs/Month</label>
              <input
                type="number"
                step="0.5"
                value={inputs.currentDowntimeHoursPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentDowntimeHoursPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateApplicationDowntime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Affected Users</label>
              <input
                type="number"
                value={inputs.affectedUsers}
                onChange={(e) => {
                  const newInputs = { ...inputs, affectedUsers: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateApplicationDowntime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">User Cost/Hr ($)</label>
              <input
                type="number"
                value={inputs.productivityCostPerUserPerHour}
                onChange={(e) => {
                  const newInputs = { ...inputs, productivityCostPerUserPerHour: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateApplicationDowntime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Revenue Loss/Hr ($)</label>
              <input
                type="number"
                value={inputs.revenueLossPerHour}
                onChange={(e) => {
                  const newInputs = { ...inputs, revenueLossPerHour: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateApplicationDowntime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Downtime Reduction %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.downtimeReductionPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, downtimeReductionPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateApplicationDowntime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateApplicationDowntime(inputs))} 
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
