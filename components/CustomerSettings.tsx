import { useState, useEffect } from 'react'

interface CustomerInfo {
  name: string
  revenue: string
  ebitda: string
  industry: string
}

interface CustomerSettingsProps {
  isOpen: boolean
  onClose: () => void
  customerInfo: CustomerInfo
  onSave: (info: CustomerInfo) => void
}

const INDUSTRIES = [
  'Technology',
  'Financial Services',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Energy & Utilities',
  'Telecommunications',
  'Consumer Goods',
  'Automotive',
  'Pharmaceuticals',
  'Real Estate',
  'Transportation & Logistics',
  'Media & Entertainment',
  'Professional Services',
  'Hospitality & Tourism'
]

export default function CustomerSettings({ isOpen, onClose, customerInfo, onSave }: CustomerSettingsProps) {
  const [formData, setFormData] = useState<CustomerInfo>(customerInfo)

  useEffect(() => {
    setFormData(customerInfo)
  }, [customerInfo])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Customer Settings</h2>
              <p className="text-sm text-blue-100 mt-1">Configure customer information for personalized reporting</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="customerName" className="block text-sm font-semibold text-neutral-900 mb-2">
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Contoso Corporation"
              className="input-field"
            />
            <p className="text-xs text-neutral-500 mt-2">
              💼 Enter the company name for personalized reports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="revenue" className="block text-sm font-semibold text-neutral-900 mb-2">
                Annual Revenue (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">$</span>
                <input
                  id="revenue"
                  type="text"
                  value={formData.revenue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    handleChange('revenue', value ? parseInt(value).toLocaleString('en-US') : '')
                  }}
                  placeholder="e.g., 500,000,000"
                  className="input-field pl-7"
                />
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                📊 Current annual revenue
              </p>
            </div>

            <div>
              <label htmlFor="ebitda" className="block text-sm font-semibold text-neutral-900 mb-2">
                Annual EBITDA (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">$</span>
                <input
                  id="ebitda"
                  type="text"
                  value={formData.ebitda}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    handleChange('ebitda', value ? parseInt(value).toLocaleString('en-US') : '')
                  }}
                  placeholder="e.g., 75,000,000"
                  className="input-field pl-7"
                />
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                💰 Current annual EBITDA
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-semibold text-neutral-900 mb-2">
              Industry
            </label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="input-field"
            >
              <option value="">Select an industry...</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <p className="text-xs text-neutral-500 mt-2">
              🏢 Select the primary industry sector
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">ℹ️</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">Why provide this information?</p>
                <p className="text-xs text-blue-800">
                  Customer details enhance your reports with context-specific insights, industry benchmarks, 
                  and personalized financial impact analysis. This information is stored locally in your browser.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
