'use client'

import { KPIInputsData, KPIResult } from '@/types'
import {
  calculateContractReviewTime,
  calculateLegalResearchTime,
  calculateComplianceAuditEfficiency,
  calculateExternalCounselSpend,
} from '@/lib/calculations'
import {
  DEFAULT_CONTRACT_REVIEW_TIME,
  DEFAULT_LEGAL_RESEARCH_TIME,
  DEFAULT_COMPLIANCE_AUDIT_EFFICIENCY,
  DEFAULT_EXTERNAL_COUNSEL_SPEND,
} from '@/lib/defaults'

interface LegalKPIsProps {
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


export default function LegalKPIs({
  agentName,
  kpiInputs,
  results,
  onUpdateKPIInputs,
  onUpdateResults,
  onBack,
  onSaveAgent,
}: LegalKPIsProps) {
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
          <p className="text-neutral-600">Configure Legal KPIs and calculate business impact</p>
        </div>
        {hasSavedKPIs && (
          <button onClick={onSaveAgent} className="btn-primary">
            Save Agent & Create New
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ContractReviewTimeCard
          inputs={kpiInputs.contractReviewTime || DEFAULT_CONTRACT_REVIEW_TIME}
          result={getResultForKPI('Contract Review Time Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, contractReviewTime: inputs })}
          onCalculate={(result) => handleCalculate('Contract Review Time Reduction', result)}
        />

        <LegalResearchTimeCard
          inputs={kpiInputs.legalResearchTime || DEFAULT_LEGAL_RESEARCH_TIME}
          result={getResultForKPI('Legal Research Time Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, legalResearchTime: inputs })}
          onCalculate={(result) => handleCalculate('Legal Research Time Reduction', result)}
        />

        <ComplianceAuditEfficiencyCard
          inputs={kpiInputs.complianceAuditEfficiency || DEFAULT_COMPLIANCE_AUDIT_EFFICIENCY}
          result={getResultForKPI('Compliance Audit Efficiency Improvement')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, complianceAuditEfficiency: inputs })}
          onCalculate={(result) => handleCalculate('Compliance Audit Efficiency Improvement', result)}
        />

        <ExternalCounselSpendCard
          inputs={kpiInputs.externalCounselSpend || DEFAULT_EXTERNAL_COUNSEL_SPEND}
          result={getResultForKPI('External Counsel Spend Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, externalCounselSpend: inputs })}
          onCalculate={(result) => handleCalculate('External Counsel Spend Reduction', result)}
        />
      </div>

      {/* Value Narrative */}
      {hasSavedKPIs && (
        <div className="mt-8 card bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>How {agentName} Optimizes Your Legal Process</span>
          </h3>
          <div className="space-y-3 text-sm text-neutral-700">
            {results.filter(r => r.saved).map((result, idx) => {
              let narrative = ''
              switch (result.kpiName) {
                case 'Contract Review Time Reduction':
                  narrative = `${agentName} accelerates contract review by automatically analyzing agreements, identifying key terms, flagging risks, and comparing against standard templates. The agent extracts critical clauses, checks for compliance requirements, and highlights deviations from company policies, enabling legal teams to focus on strategic negotiations while reducing review time and accelerating deal closure.`
                  break
                case 'Legal Research Time Reduction':
                  narrative = `Through AI-powered legal research capabilities, ${agentName} rapidly searches case law, statutes, regulations, and precedents across multiple jurisdictions. The agent synthesizes findings, identifies relevant precedents, and provides contextual analysis, transforming hours of manual research into minutes of targeted insights for legal professionals.`
                  break
                case 'Compliance Audit Efficiency Improvement':
                  narrative = `${agentName} streamlines compliance audits by continuously monitoring regulatory requirements, automatically checking processes and documentation against standards, and flagging potential issues before they become problems. The agent maintains audit trails, generates compliance reports, and ensures consistent application of policies across the organization, reducing audit preparation time and compliance risk.`
                  break
                case 'External Counsel Spend Reduction':
                  narrative = `By automating routine legal tasks such as document drafting, contract analysis, compliance checks, and initial research, ${agentName} significantly reduces the need for external counsel. The agent handles repetitive legal work internally, allowing the organization to reserve external legal resources for complex matters requiring specialized expertise, directly reducing legal spend while maintaining service quality.`
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
function ContractReviewTimeCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-emerald-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 1</div>
            <h3 className="text-sm font-bold text-neutral-900">Contract Review Time Reduction</h3>
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
          Accelerate contract analysis and approval through AI
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Contracts/Month</label>
              <input
                type="number"
                value={inputs.contractsPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, contractsPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateContractReviewTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Review Time (hrs)</label>
              <input
                type="number"
                step="0.5"
                value={inputs.currentReviewTimeHours}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentReviewTimeHours: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateContractReviewTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Staff Cost/Hr ($)</label>
              <input
                type="number"
                value={inputs.legalStaffHourlyCost}
                onChange={(e) => {
                  const newInputs = { ...inputs, legalStaffHourlyCost: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateContractReviewTime(newInputs), saved: true })
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
                value={inputs.reviewTimeReductionPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, reviewTimeReductionPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateContractReviewTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Deal Velocity Impact/Day ($)</label>
              <input
                type="number"
                value={inputs.dealVelocityImpactPerDay}
                onChange={(e) => {
                  const newInputs = { ...inputs, dealVelocityImpactPerDay: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateContractReviewTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateContractReviewTime(inputs))} 
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

function LegalResearchTimeCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-teal-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 2</div>
            <h3 className="text-sm font-bold text-neutral-900">Legal Research Time Reduction</h3>
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
          Automate legal research and case law analysis
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Requests/Month</label>
              <input
                type="number"
                value={inputs.researchRequestsPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, researchRequestsPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateLegalResearchTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Research Time (hrs)</label>
              <input
                type="number"
                step="0.5"
                value={inputs.currentResearchTimeHours}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentResearchTimeHours: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateLegalResearchTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Staff Cost/Hr ($)</label>
              <input
                type="number"
                value={inputs.legalStaffHourlyCost}
                onChange={(e) => {
                  const newInputs = { ...inputs, legalStaffHourlyCost: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateLegalResearchTime(newInputs), saved: true })
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
                value={inputs.researchTimeReductionPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, researchTimeReductionPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateLegalResearchTime(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateLegalResearchTime(inputs))} 
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

function ComplianceAuditEfficiencyCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-cyan-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 3</div>
            <h3 className="text-sm font-bold text-neutral-900">Compliance Audit Efficiency</h3>
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
          Streamline compliance checks and audit processes
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Audits/Year</label>
              <input
                type="number"
                value={inputs.auditsPerYear}
                onChange={(e) => {
                  const newInputs = { ...inputs, auditsPerYear: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateComplianceAuditEfficiency(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Audit Time (hrs)</label>
              <input
                type="number"
                step="1"
                value={inputs.currentAuditTimeHours}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentAuditTimeHours: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateComplianceAuditEfficiency(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Staff Cost/Hr ($)</label>
              <input
                type="number"
                value={inputs.auditStaffHourlyCost}
                onChange={(e) => {
                  const newInputs = { ...inputs, auditStaffHourlyCost: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateComplianceAuditEfficiency(newInputs), saved: true })
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
                value={inputs.auditTimeReductionPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, auditTimeReductionPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateComplianceAuditEfficiency(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Risk Reduction Value ($)</label>
              <input
                type="number"
                value={inputs.complianceRiskReductionValue}
                onChange={(e) => {
                  const newInputs = { ...inputs, complianceRiskReductionValue: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateComplianceAuditEfficiency(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateComplianceAuditEfficiency(inputs))} 
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

function ExternalCounselSpendCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-blue-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 4</div>
            <h3 className="text-sm font-bold text-neutral-900">External Counsel Spend Reduction</h3>
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
          Reduce legal fees through AI automation
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Monthly External Spend ($)</label>
              <input
                type="number"
                value={inputs.currentMonthlyExternalSpend}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentMonthlyExternalSpend: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateExternalCounselSpend(newInputs), saved: true })
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
                    onCalculate({ ...calculateExternalCounselSpend(newInputs), saved: true })
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
                    onCalculate({ ...calculateExternalCounselSpend(newInputs), saved: true })
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
                    onCalculate({ ...calculateExternalCounselSpend(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateExternalCounselSpend(inputs))} 
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
