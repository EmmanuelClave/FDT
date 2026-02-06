'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import AgentDetails from '@/components/AgentDetails'
import SalesKPIs from '@/components/SalesKPIs'
import ServiceKPIs from '@/components/ServiceKPIs'
import MarketingKPIs from '@/components/MarketingKPIs'
import FinanceKPIs from '@/components/FinanceKPIs'
import SupplyChainKPIs from '@/components/SupplyChainKPIs'
import ITKPIs from '@/components/ITKPIs'
import LegalKPIs from '@/components/LegalKPIs'
import CustomerSettings from '@/components/CustomerSettings'
import { AppState, KPIResult, BusinessProcess, KPIInputsData, AgentConfig } from '@/types'
import { DEFAULT_KPI_INPUTS } from '@/lib/defaults'

interface CustomerInfo {
  name: string
  revenue: string
  ebitda: string
  industry: string
}

export default function Home() {
  const [state, setState] = useState<AppState>({
    agentName: '',
    process: 'Sales',
    kpiInputs: DEFAULT_KPI_INPUTS,
    results: [],
    currentScreen: 'agent-details',
    savedAgents: []
  })

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    revenue: '',
    ebitda: '',
    industry: ''
  })

  // Load customer info from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('customerInfo')
    if (saved) {
      setCustomerInfo(JSON.parse(saved))
    }
  }, [])

  const handleSaveCustomerInfo = (info: CustomerInfo) => {
    setCustomerInfo(info)
    localStorage.setItem('customerInfo', JSON.stringify(info))
  }

  const updateAgentName = (name: string) => {
    setState(prev => ({ ...prev, agentName: name }))
  }

  const updateProcess = (process: BusinessProcess) => {
    setState(prev => ({ ...prev, process }))
  }

  const continueToKPIs = () => {
    if (state.agentName && state.process) {
      setState(prev => ({ ...prev, currentScreen: 'kpis' }))
    }
  }

  const updateKPIInputs = (kpiInputs: KPIInputsData) => {
    setState(prev => ({ ...prev, kpiInputs }))
  }

  const updateResults = (results: KPIResult[]) => {
    setState(prev => ({ ...prev, results }))
  }

  const saveCurrentAgent = () => {
    const newAgent: AgentConfig = {
      id: `agent-${Date.now()}`,
      agentName: state.agentName,
      process: state.process,
      kpiInputs: state.kpiInputs,
      results: state.results.filter(r => r.saved),
      savedAt: new Date()
    }
    
    setState(prev => ({
      ...prev,
      savedAgents: [...prev.savedAgents, newAgent],
      // Reset for new agent
      agentName: '',
      process: 'Sales',
      kpiInputs: DEFAULT_KPI_INPUTS,
      results: [],
      currentScreen: 'agent-details'
    }))
  }

  const removeAgent = (agentId: string) => {
    setState(prev => ({
      ...prev,
      savedAgents: prev.savedAgents.filter(a => a.id !== agentId)
    }))
  }

  const loadAgent = (agent: AgentConfig) => {
    setState(prev => ({
      ...prev,
      agentName: agent.agentName,
      process: agent.process,
      kpiInputs: agent.kpiInputs,
      results: agent.results,
      currentScreen: 'kpis'
    }))
  }

  const backToAgent = () => {
    setState(prev => ({ ...prev, currentScreen: 'agent-details' }))
  }

  return (
    <Layout 
      state={state} 
      onNavigate={(screen) => setState(prev => ({ ...prev, currentScreen: screen }))}
    >
      {/* Settings Button */}
      <div className="fixed top-6 right-6 z-40">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="bg-white shadow-lg hover:shadow-xl border border-neutral-200 rounded-full p-3 transition-all hover:scale-105 group"
          title="Customer Settings"
        >
          <svg 
            className="w-6 h-6 text-neutral-600 group-hover:text-primary-600 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </button>
      </div>

      <CustomerSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        customerInfo={customerInfo}
        onSave={handleSaveCustomerInfo}
      />

      {state.currentScreen === 'agent-details' && (
        <AgentDetails
          agentName={state.agentName}
          process={state.process}
          onUpdateName={updateAgentName}
          onUpdateProcess={updateProcess}
          onContinue={continueToKPIs}
          savedAgents={state.savedAgents}
          onRemoveAgent={removeAgent}
          onLoadAgent={loadAgent}
          customerInfo={customerInfo}
        />
      )}
      
      {state.currentScreen === 'kpis' && state.process === 'Sales' && (
        <SalesKPIs
          agentName={state.agentName}
          kpiInputs={state.kpiInputs}
          results={state.results}
          onUpdateKPIInputs={updateKPIInputs}
          onUpdateResults={updateResults}
          onBack={backToAgent}
          onSaveAgent={saveCurrentAgent}
        />
      )}

      {state.currentScreen === 'kpis' && state.process === 'Service' && (
        <ServiceKPIs
          agentName={state.agentName}
          kpiInputs={state.kpiInputs}
          results={state.results}
          onUpdateKPIInputs={updateKPIInputs}
          onUpdateResults={updateResults}
          onBack={backToAgent}
          onSaveAgent={saveCurrentAgent}
        />
      )}

      {state.currentScreen === 'kpis' && state.process === 'Marketing' && (
        <MarketingKPIs
          agentName={state.agentName}
          kpiInputs={state.kpiInputs}
          results={state.results}
          onUpdateKPIInputs={updateKPIInputs}
          onUpdateResults={updateResults}
          onBack={backToAgent}
          onSaveAgent={saveCurrentAgent}
        />
      )}

      {state.currentScreen === 'kpis' && state.process === 'Finance' && (
        <FinanceKPIs
          agentName={state.agentName}
          kpiInputs={state.kpiInputs}
          results={state.results}
          onUpdateKPIInputs={updateKPIInputs}
          onUpdateResults={updateResults}
          onBack={backToAgent}
          onSaveAgent={saveCurrentAgent}
        />
      )}

      {state.currentScreen === 'kpis' && state.process === 'Supply Chain' && (
        <SupplyChainKPIs
          agentName={state.agentName}
          kpiInputs={state.kpiInputs}
          results={state.results}
          onUpdateKPIInputs={updateKPIInputs}
          onUpdateResults={updateResults}
          onBack={backToAgent}
          onSaveAgent={saveCurrentAgent}
        />
      )}

      {state.currentScreen === 'kpis' && state.process === 'IT' && (
        <ITKPIs
          agentName={state.agentName}
          kpiInputs={state.kpiInputs}
          results={state.results}
          onUpdateKPIInputs={updateKPIInputs}
          onUpdateResults={updateResults}
          onBack={backToAgent}
          onSaveAgent={saveCurrentAgent}
        />
      )}

      {state.currentScreen === 'kpis' && state.process === 'Legal' && (
        <LegalKPIs
          agentName={state.agentName}
          kpiInputs={state.kpiInputs}
          results={state.results}
          onUpdateKPIInputs={updateKPIInputs}
          onUpdateResults={updateResults}
          onBack={backToAgent}
          onSaveAgent={saveCurrentAgent}
        />
      )}
    </Layout>
  )
}
