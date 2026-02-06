'use client'

import { KPIInputsData, KPIResult } from '@/types'
import {
  calculateInventoryTurnover,
  calculateOnTimeDelivery,
  calculateOrderAccuracy,
  calculateCashToCashCycle,
  calculateFreightCostPerUnit,
  calculateSupplyChainDSO,
  calculateFillRate,
} from '@/lib/calculations'
import {
  DEFAULT_INVENTORY_TURNOVER,
  DEFAULT_ON_TIME_DELIVERY,
  DEFAULT_ORDER_ACCURACY,
  DEFAULT_CASH_TO_CASH_CYCLE,
  DEFAULT_FREIGHT_COST_PER_UNIT,
  DEFAULT_SUPPLY_CHAIN_DSO,
  DEFAULT_FILL_RATE,
} from '@/lib/defaults'

interface SupplyChainKPIsProps {
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


export default function SupplyChainKPIs({
  agentName,
  kpiInputs,
  results,
  onUpdateKPIInputs,
  onUpdateResults,
  onBack,
  onSaveAgent,
}: SupplyChainKPIsProps) {
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
          <p className="text-neutral-600">Configure Supply Chain KPIs and calculate business impact</p>
        </div>
        {hasSavedKPIs && (
          <button onClick={onSaveAgent} className="btn-primary">
            Save Agent & Create New
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <InventoryTurnoverCard
          inputs={kpiInputs.inventoryTurnover || DEFAULT_INVENTORY_TURNOVER}
          result={getResultForKPI('Inventory Turnover Improvement')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, inventoryTurnover: inputs })}
          onCalculate={(result) => handleCalculate('Inventory Turnover Improvement', result)}
        />

        <OnTimeDeliveryCard
          inputs={kpiInputs.onTimeDelivery || DEFAULT_ON_TIME_DELIVERY}
          result={getResultForKPI('On-Time Delivery Improvement')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, onTimeDelivery: inputs })}
          onCalculate={(result) => handleCalculate('On-Time Delivery Improvement', result)}
        />

        <OrderAccuracyCard
          inputs={kpiInputs.orderAccuracy || DEFAULT_ORDER_ACCURACY}
          result={getResultForKPI('Order Accuracy Improvement')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, orderAccuracy: inputs })}
          onCalculate={(result) => handleCalculate('Order Accuracy Improvement', result)}
        />

        <CashToCashCycleCard
          inputs={kpiInputs.cashToCashCycle || DEFAULT_CASH_TO_CASH_CYCLE}
          result={getResultForKPI('Cash-to-Cash Cycle Time Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, cashToCashCycle: inputs })}
          onCalculate={(result) => handleCalculate('Cash-to-Cash Cycle Time Reduction', result)}
        />

        <FreightCostPerUnitCard
          inputs={kpiInputs.freightCostPerUnit || DEFAULT_FREIGHT_COST_PER_UNIT}
          result={getResultForKPI('Freight Cost Per Unit Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, freightCostPerUnit: inputs })}
          onCalculate={(result) => handleCalculate('Freight Cost Per Unit Reduction', result)}
        />

        <SupplyChainDSOCard
          inputs={kpiInputs.supplyChainDSO || DEFAULT_SUPPLY_CHAIN_DSO}
          result={getResultForKPI('Days Sales Outstanding Reduction')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, supplyChainDSO: inputs })}
          onCalculate={(result) => handleCalculate('Days Sales Outstanding Reduction', result)}
        />

        <FillRateCard
          inputs={kpiInputs.fillRate || DEFAULT_FILL_RATE}
          result={getResultForKPI('Fill Rate Improvement')}
          onUpdate={(inputs) => onUpdateKPIInputs({ ...kpiInputs, fillRate: inputs })}
          onCalculate={(result) => handleCalculate('Fill Rate Improvement', result)}
        />
      </div>

      {/* Value Narrative */}
      {hasSavedKPIs && (
        <div className="mt-8 card bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>How {agentName} Optimizes Your Supply Chain Process</span>
          </h3>
          <div className="space-y-3 text-sm text-neutral-700">
            {results.filter(r => r.saved).map((result, idx) => {
              let narrative = ''
              switch (result.kpiName) {
                case 'Inventory Turnover Improvement':
                  narrative = `${agentName} optimizes inventory levels using predictive analytics to forecast demand accurately. By analyzing historical patterns, market trends, and seasonality, the agent recommends optimal stock levels that reduce holding costs while preventing stockouts, directly improving inventory turnover and freeing up working capital.`
                  break
                case 'On-Time Delivery Improvement':
                  narrative = `Through real-time monitoring of shipments, route optimization, and proactive exception management, ${agentName} significantly improves on-time delivery performance. The agent predicts potential delays, suggests alternative routes, and automates customer notifications, reducing late deliveries and enhancing customer satisfaction.`
                  break
                case 'Order Accuracy Improvement':
                  narrative = `${agentName} automates order validation, verifying product codes, quantities, and delivery details against customer requirements. By cross-referencing data across systems and flagging discrepancies before fulfillment, the agent reduces picking errors, shipping mistakes, and costly returns.`
                  break
                case 'Cash-to-Cash Cycle Time Reduction':
                  narrative = `By optimizing the entire supply chain cycle—from procurement to payment collection—${agentName} accelerates cash flow. The agent coordinates supplier payments, production schedules, and customer invoicing to minimize the time between cash outflow and inflow, improving working capital efficiency.`
                  break
                case 'Freight Cost Per Unit Reduction':
                  narrative = `${agentName} analyzes shipping patterns, consolidates shipments, and optimizes carrier selection to reduce freight costs. The agent identifies opportunities for route optimization, load consolidation, and better carrier negotiations, lowering transportation costs per unit while maintaining service levels.`
                  break
                case 'Days Sales Outstanding Reduction':
                  narrative = `By monitoring outstanding invoices, sending automated payment reminders, and predicting payment delays, ${agentName} helps accelerate cash collection. The agent identifies at-risk accounts early and triggers appropriate follow-up actions, improving cash flow and reducing DSO.`
                  break
                case 'Fill Rate Improvement':
                  narrative = `${agentName} improves order fulfillment success through better demand forecasting, inventory positioning, and supplier coordination. By predicting stockouts and triggering proactive replenishment, the agent ensures products are available when customers order, reducing lost sales and improving customer satisfaction.`
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
function InventoryTurnoverCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-emerald-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 1</div>
            <h3 className="text-sm font-bold text-neutral-900">Inventory Turnover Improvement</h3>
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
          Optimize inventory levels by improving turnover rates, reducing holding costs
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Annual COGS ($)</label>
              <input
                type="number"
                value={inputs.annualCOGS}
                onChange={(e) => {
                  const newInputs = { ...inputs, annualCOGS: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateInventoryTurnover(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current Inventory Value ($)</label>
              <input
                type="number"
                value={inputs.currentInventoryValue}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentInventoryValue: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateInventoryTurnover(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current Turnover</label>
              <input
                type="number"
                step="0.1"
                value={inputs.currentTurnover}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentTurnover: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateInventoryTurnover(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Improvement %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.improvementPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, improvementPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateInventoryTurnover(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Holding Cost Rate %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.holdingCostRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, holdingCostRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateInventoryTurnover(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateInventoryTurnover(inputs))} 
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

function OnTimeDeliveryCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-teal-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 2</div>
            <h3 className="text-sm font-bold text-neutral-900">On-Time Delivery Improvement</h3>
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
          Increase delivery reliability and customer satisfaction through better logistics
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Deliveries/Month</label>
              <input
                type="number"
                value={inputs.totalDeliveriesPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, totalDeliveriesPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateOnTimeDelivery(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current OTD %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.currentOTDRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentOTDRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateOnTimeDelivery(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cost/Late Delivery ($)</label>
              <input
                type="number"
                value={inputs.costPerLateDelivery}
                onChange={(e) => {
                  const newInputs = { ...inputs, costPerLateDelivery: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateOnTimeDelivery(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">OTD Improvement %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.otdImprovementPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, otdImprovementPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateOnTimeDelivery(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Revenue Per Delivery ($)</label>
              <input
                type="number"
                value={inputs.revenuePerDelivery}
                onChange={(e) => {
                  const newInputs = { ...inputs, revenuePerDelivery: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateOnTimeDelivery(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateOnTimeDelivery(inputs))} 
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

function OrderAccuracyCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-cyan-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 3</div>
            <h3 className="text-sm font-bold text-neutral-900">Order Accuracy Improvement</h3>
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
          Reduce errors in order processing and fulfillment
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Orders/Month</label>
              <input
                type="number"
                value={inputs.totalOrdersPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, totalOrdersPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateOrderAccuracy(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Accuracy Rate %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.currentAccuracyRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentAccuracyRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateOrderAccuracy(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cost Per Error ($)</label>
              <input
                type="number"
                value={inputs.costPerError}
                onChange={(e) => {
                  const newInputs = { ...inputs, costPerError: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateOrderAccuracy(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Improvement %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.accuracyImprovementPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, accuracyImprovementPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateOrderAccuracy(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateOrderAccuracy(inputs))} 
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

function CashToCashCycleCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-blue-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 4</div>
            <h3 className="text-sm font-bold text-neutral-900">Cash-to-Cash Cycle Time Reduction</h3>
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
          Accelerate cash flow by reducing cycle time
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Annual Revenue ($)</label>
              <input
                type="number"
                value={inputs.annualRevenue}
                onChange={(e) => {
                  const newInputs = { ...inputs, annualRevenue: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCashToCashCycle(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current Cycle (days)</label>
              <input
                type="number"
                value={inputs.currentCycleDays}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentCycleDays: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCashToCashCycle(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Reduction (days)</label>
              <input
                type="number"
                value={inputs.cycleReductionDays}
                onChange={(e) => {
                  const newInputs = { ...inputs, cycleReductionDays: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCashToCashCycle(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cost of Capital %</label>
              <input
                type="number"
                step="0.1"
                value={inputs.costOfCapitalPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, costOfCapitalPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateCashToCashCycle(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateCashToCashCycle(inputs))} 
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

function FreightCostPerUnitCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-purple-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 5</div>
            <h3 className="text-sm font-bold text-neutral-900">Freight Cost Per Unit Reduction</h3>
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
          Optimize logistics and routing to reduce transportation costs
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Units Shipped/Month</label>
              <input
                type="number"
                value={inputs.unitsShippedPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, unitsShippedPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFreightCostPerUnit(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current Cost/Unit ($)</label>
              <input
                type="number"
                step="0.01"
                value={inputs.currentFreightCostPerUnit}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentFreightCostPerUnit: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFreightCostPerUnit(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cost Reduction %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.costReductionPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, costReductionPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFreightCostPerUnit(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateFreightCostPerUnit(inputs))} 
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

function SupplyChainDSOCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-pink-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 6</div>
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
          Accelerate cash collection from customers
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Annual Revenue ($)</label>
              <input
                type="number"
                value={inputs.annualRevenue}
                onChange={(e) => {
                  const newInputs = { ...inputs, annualRevenue: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateSupplyChainDSO(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current DSO (days)</label>
              <input
                type="number"
                value={inputs.currentDSO}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentDSO: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateSupplyChainDSO(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">DSO Reduction (days)</label>
              <input
                type="number"
                value={inputs.dsoReductionDays}
                onChange={(e) => {
                  const newInputs = { ...inputs, dsoReductionDays: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateSupplyChainDSO(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cost of Capital %</label>
              <input
                type="number"
                step="0.1"
                value={inputs.costOfCapitalPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, costOfCapitalPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateSupplyChainDSO(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateSupplyChainDSO(inputs))} 
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

function FillRateCard({ inputs, result, onUpdate, onCalculate }: any) {
  return (
    <div className="bg-white rounded border-2 border-indigo-500 shadow-sm hover:shadow transition-shadow h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">KPI 7</div>
            <h3 className="text-sm font-bold text-neutral-900">Fill Rate Improvement</h3>
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
          Increase order fulfillment success rate and customer satisfaction
        </p>

        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Orders/Month</label>
              <input
                type="number"
                value={inputs.totalOrdersPerMonth}
                onChange={(e) => {
                  const newInputs = { ...inputs, totalOrdersPerMonth: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFillRate(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Current Fill Rate %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.currentFillRate * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, currentFillRate: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFillRate(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Revenue/Order ($)</label>
              <input
                type="number"
                value={inputs.revenuePerOrder}
                onChange={(e) => {
                  const newInputs = { ...inputs, revenuePerOrder: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFillRate(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Improvement %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.fillRateImprovementPct * 100}
                onChange={(e) => {
                  const newInputs = { ...inputs, fillRateImprovementPct: Number(e.target.value) / 100 }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFillRate(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Lost Sale Cost Factor</label>
              <input
                type="number"
                step="0.1"
                value={inputs.lostSaleCostFactor}
                onChange={(e) => {
                  const newInputs = { ...inputs, lostSaleCostFactor: Number(e.target.value) }
                  onUpdate(newInputs)
                  if (result?.saved) {
                    onCalculate({ ...calculateFillRate(newInputs), saved: true })
                  }
                }}
                className="input-field text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onCalculate(calculateFillRate(inputs))} 
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
