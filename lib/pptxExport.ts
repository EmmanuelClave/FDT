'use client'

import type { AgentConfig } from '@/types'

interface CustomerInfo {
  name: string
  revenue: string
  ebitda: string
  industry: string
}

export async function generatePPTReport(savedAgents: AgentConfig[], customerInfo?: CustomerInfo) {
  try {
    const response = await fetch('/api/export-ppt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ savedAgents, customerInfo }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to generate PowerPoint')
    }
    
    const { data, filename } = await response.json()
    
    // Convert base64 to blob and download
    const binaryString = atob(data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const blob = new Blob([bytes], { 
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
    })
    
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Error downloading PowerPoint:', error)
    throw error
  }
}
