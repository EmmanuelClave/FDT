import { KPIResult } from '@/types'
import { formatCurrency } from '@/lib/calculations'
import { useState } from 'react'

interface SummaryPanelProps {
  results: KPIResult[]
}

export default function SummaryPanel({ results }: SummaryPanelProps) {
  const [isExporting, setIsExporting] = useState(false)
  
  // Only show saved results
  const savedResults = results.filter(r => (r as any).saved === true)
  
  // Split by impact type
  const revenueResults = savedResults.filter(r => r.impactType === 'Revenue')
  const ebitdaResults = savedResults.filter(r => r.impactType === 'EBITDA')
  
  const totalRevenue = revenueResults.reduce((sum, result) => sum + result.impactGBP, 0)
  const totalEBITDA = ebitdaResults.reduce((sum, result) => sum + result.impactGBP, 0)
  const totalImpact = totalRevenue + totalEBITDA

  const handleExportCSV = () => {
    const headers = ['KPI', 'Impact ($)']
    const rows = savedResults.map(r => [r.kpiName, r.impactGBP.toFixed(2)])
    rows.push(['Total', totalImpact.toFixed(2)])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'agent-impact-results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    alert('PDF export functionality coming soon!')
  }

  const handleExportExcel = async () => {
    setIsExporting(true)
    try {
      // Get all state from localStorage
      const stateStr = localStorage.getItem('appState')
      const state = stateStr ? JSON.parse(stateStr) : {}
      const kpiInputs = state.kpiInputs || {}
      
      // Helper to attach inputs to a result
      const attachInputs = (result: KPIResult, inputKey: string) => ({
        name: result.kpiName,
        inputs: kpiInputs[inputKey] || {},
        result: result
      })
      
      // Organize KPIs by department with their inputs
      const salesKPIs = []
      if (savedResults.find(r => r.kpiName === 'More Leads')) {
        salesKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'More Leads')!, 'moreLeads'))
      }
      if (savedResults.find(r => r.kpiName === 'Improved Lead Conversion')) {
        salesKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Improved Lead Conversion')!, 'improvedLeadConversion'))
      }
      if (savedResults.find(r => r.kpiName === 'Improved Win Rate')) {
        salesKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Improved Win Rate')!, 'improvedWinRate'))
      }
      if (savedResults.find(r => r.kpiName === 'Increased Deal Size')) {
        salesKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Increased Deal Size')!, 'increasedDealSize'))
      }
      if (savedResults.find(r => r.kpiName === 'Accelerated Sales Cycle')) {
        salesKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Accelerated Sales Cycle')!, 'acceleratedSalesCycle'))
      }
      if (savedResults.find(r => r.kpiName === 'Seller Time Savings')) {
        salesKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Seller Time Savings')!, 'sellerTimeSavings'))
      }

      const marketingKPIs = []
      if (savedResults.find(r => r.kpiName === 'Reduced Agency Spend')) {
        marketingKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Reduced Agency Spend')!, 'agencySpend'))
      }
      if (savedResults.find(r => r.kpiName === 'Improved Cost Per Lead')) {
        marketingKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Improved Cost Per Lead')!, 'costPerLead'))
      }

      const serviceKPIs = []
      if (savedResults.find(r => r.kpiName === 'Reduced Average Handling Time')) {
        serviceKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Reduced Average Handling Time')!, 'averageHandlingTime'))
      }
      if (savedResults.find(r => r.kpiName === 'Channel Shift to Lower Cost')) {
        serviceKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Channel Shift to Lower Cost')!, 'channelShift'))
      }
      if (savedResults.find(r => r.kpiName === 'Case Volume Reduction')) {
        serviceKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Case Volume Reduction')!, 'caseVolumeReduction'))
      }

      const financeKPIs = []
      if (savedResults.find(r => r.kpiName === 'Faster Forecast Accuracy')) {
        financeKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Faster Forecast Accuracy')!, 'forecastAccuracy'))
      }
      if (savedResults.find(r => r.kpiName === 'Reduced Days to Close')) {
        financeKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Reduced Days to Close')!, 'daysToClose'))
      }
      if (savedResults.find(r => r.kpiName === 'Faster Invoice Processing')) {
        financeKPIs.push(attachInputs(savedResults.find(r => r.kpiName === 'Faster Invoice Processing')!, 'invoiceProcessing'))
      }

      const supplyChainKPIs = savedResults.filter(r => r.kpiName?.includes('Inventory') || r.kpiName?.includes('Lead Time') || r.kpiName?.includes('Supply')).map(r => ({
        name: r.kpiName,
        inputs: {},
        result: r
      }))

      const itKPIs = savedResults.filter(r => r.kpiName?.includes('Ticket') || r.kpiName?.includes('Incident') || r.kpiName?.includes('IT')).map(r => ({
        name: r.kpiName,
        inputs: {},
        result: r
      }))

      const legalKPIs = savedResults.filter(r => r.kpiName?.includes('Contract') || r.kpiName?.includes('Compliance') || r.kpiName?.includes('Legal')).map(r => ({
        name: r.kpiName,
        inputs: {},
        result: r
      }))

      const response = await fetch('/api/export-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentDetails: {
            agentName: state.agentName || 'Untitled Agent',
            copilotTechnology: state.copilotTechnology || '',
            industry: state.industry || '',
            department: state.department || '',
            useCase: state.useCase || '',
            description: state.description || '',
          },
          salesKPIs,
          marketingKPIs,
          serviceKPIs,
          financeKPIs,
          supplyChainKPIs,
          itKPIs,
          legalKPIs
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to export Excel')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Agent-Impact-Analysis-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export Excel file')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <aside className="w-80 bg-white border-l border-neutral-200 p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Impact Summary</h2>

      {savedResults.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Calculate and save KPIs to see impact summary
        </p>
      ) : (
        <>
          {/* Revenue Impact Section */}
          {revenueResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                Revenue Impact
              </h3>
              <div className="space-y-3">
                {revenueResults.map((result, index) => (
                  <div key={index} className="pb-3 border-b border-neutral-200 last:border-0">
                    <p className="text-xs text-neutral-600 mb-1">{result.kpiName}</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      ${result.impactGBP.toLocaleString('en-US')}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-300 bg-green-50 rounded p-2">
                <p className="text-xs text-neutral-600 mb-0.5">Total Revenue</p>
                <p className="text-xl font-bold text-green-600">
                  ${totalRevenue.toLocaleString('en-US')}
                </p>
              </div>
            </div>
          )}

          {/* EBITDA Impact Section */}
          {ebitdaResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                EBITDA Impact
              </h3>
              <div className="space-y-3">
                {ebitdaResults.map((result, index) => (
                  <div key={index} className="pb-3 border-b border-neutral-200 last:border-0">
                    <p className="text-xs text-neutral-600 mb-1">{result.kpiName}</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      ${result.impactGBP.toLocaleString('en-US')}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-300 bg-blue-50 rounded p-2">
                <p className="text-xs text-neutral-600 mb-0.5">Total EBITDA</p>
                <p className="text-xl font-bold text-blue-600">
                  ${totalEBITDA.toLocaleString('en-US')}
                </p>
              </div>
            </div>
          )}

          <div className="pt-6 border-t-2 border-neutral-300">
            <p className="text-sm text-neutral-600 mb-1">Total Annual Impact</p>
            <p className="text-2xl font-bold text-primary-600">
              ${totalImpact.toLocaleString('en-US')}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="w-full btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? '⏳ Exporting...' : '📊 Export Excel'}
            </button>
            <button
              onClick={handleExportCSV}
              className="w-full btn-secondary text-sm"
            >
              📥 Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="w-full btn-secondary text-sm"
            >
              📄 Export PDF
            </button>
          </div>
        </>
      )}
    </aside>
  )
}
