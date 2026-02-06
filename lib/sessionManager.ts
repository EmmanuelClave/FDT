import { AgentInput } from '@/types'

export interface SessionData {
  version: string
  timestamp: string
  customerInfo: {
    name: string
    revenue: number
    ebitda: number
    industry: string
  } | null
  agents: AgentInput[]
}

export const saveSession = (): void => {
  try {
    // Prompt for filename
    const defaultName = `agent-impact-session-${new Date().toISOString().split('T')[0]}`
    const filename = prompt('Enter filename:', defaultName)
    
    if (!filename) {
      // User cancelled
      return
    }

    // Get customer info from localStorage
    const customerInfoStr = localStorage.getItem('customerInfo')
    const customerInfo = customerInfoStr ? JSON.parse(customerInfoStr) : null

    // Get saved agents from localStorage
    const savedAgentsStr = localStorage.getItem('savedAgents')
    const savedAgents = savedAgentsStr ? JSON.parse(savedAgentsStr) : []

    const sessionData: SessionData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      customerInfo,
      agents: savedAgents
    }

    // Create blob and download
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    // Add .json extension if not present
    const finalFilename = filename.endsWith('.json') ? filename : `${filename}.json`
    link.download = finalFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error saving session:', error)
    alert('Failed to save session. Please try again.')
  }
}

export const loadSession = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const sessionData: SessionData = JSON.parse(content)

        // Validate session data
        if (!sessionData.version || !sessionData.agents) {
          throw new Error('Invalid session file format')
        }

        // Load customer info
        if (sessionData.customerInfo) {
          localStorage.setItem('customerInfo', JSON.stringify(sessionData.customerInfo))
        }

        // Load agents
        localStorage.setItem('savedAgents', JSON.stringify(sessionData.agents))

        // Reload the page to reflect changes
        window.location.reload()
        resolve()
      } catch (error) {
        console.error('Error loading session:', error)
        reject(new Error('Failed to load session. Please check the file format.'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}

export const clearSession = (): void => {
  if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
    localStorage.removeItem('savedAgents')
    localStorage.removeItem('customerInfo')
    window.location.reload()
  }
}
