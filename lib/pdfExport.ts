'use client'

import type { AgentConfig } from '@/types'
import { generateIndustryNarrative, generateExecutiveSummary } from './industryNarratives'

interface CustomerInfo {
  name: string
  revenue: string
  ebitda: string
  industry: string
}

export async function generatePDFReport(savedAgents: AgentConfig[], customerInfo?: CustomerInfo) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  
  // Calculate totals
  const totalRevenue = savedAgents.reduce((sum, agent) => {
    return sum + agent.results.filter(r => r.impactType === 'Revenue').reduce((s, r) => s + r.impactGBP, 0)
  }, 0)
  
  const totalEBITDA = savedAgents.reduce((sum, agent) => {
    return sum + agent.results.filter(r => r.impactType === 'EBITDA').reduce((s, r) => s + r.impactGBP, 0)
  }, 0)
  
  const totalImpact = totalRevenue + totalEBITDA
  
  let yPos = 20
  
  // Title Page
  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, 210, 297, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  doc.text('AI Agent Impact Analysis', 105, 80, { align: 'center' })
  
  doc.setFontSize(18)
  doc.setFont('helvetica', 'normal')
  doc.text('Financial Business Case Report', 105, 95, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setTextColor(203, 213, 225)
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  doc.text(`Generated: ${date}`, 105, 140, { align: 'center' })
  doc.text(`${savedAgents.length} Agent${savedAgents.length !== 1 ? 's' : ''} Analyzed`, 105, 150, { align: 'center' })
  
  // Page 2: Executive Summary
  doc.addPage()
  yPos = 20
  
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Executive Summary', 20, yPos)
  yPos += 15
  
  // Key Metrics Boxes
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  // Total Impact Box
  doc.setFillColor(59, 130, 246)
  doc.roundedRect(20, yPos, 55, 30, 3, 3, 'F')
  doc.setTextColor(224, 231, 255)
  doc.text('Total Annual Impact', 47.5, yPos + 8, { align: 'center' })
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`$${totalImpact.toLocaleString('en-US')}`, 47.5, yPos + 20, { align: 'center' })
  
  // Revenue Impact Box
  doc.setFillColor(16, 185, 129)
  doc.roundedRect(80, yPos, 55, 30, 3, 3, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(209, 250, 229)
  doc.text('Revenue Impact', 107.5, yPos + 8, { align: 'center' })
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`$${totalRevenue.toLocaleString('en-US')}`, 107.5, yPos + 20, { align: 'center' })
  
  // EBITDA Impact Box
  doc.setFillColor(99, 102, 241)
  doc.roundedRect(140, yPos, 55, 30, 3, 3, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(224, 231, 255)
  doc.text('EBITDA Impact', 167.5, yPos + 8, { align: 'center' })
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`$${totalEBITDA.toLocaleString('en-US')}`, 167.5, yPos + 20, { align: 'center' })
  
  yPos += 40
  
  // Analysis Overview with Industry Context
  doc.setTextColor(71, 85, 105)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Executive Summary', 20, yPos)
  yPos += 10
  
  doc.setTextColor(51, 65, 85)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  // Use industry-specific narrative if available
  const executiveSummary = customerInfo?.industry 
    ? generateExecutiveSummary(
        customerInfo.industry,
        customerInfo.name,
        totalImpact,
        totalRevenue,
        totalEBITDA,
        savedAgents.length
      )
    : `This analysis evaluates ${savedAgents.length} AI agent${savedAgents.length !== 1 ? 's' : ''} with combined annual financial impact of $${totalImpact.toLocaleString('en-US')}. Revenue-generating initiatives contribute $${totalRevenue.toLocaleString('en-US')} in additional top-line growth. Cost-reduction initiatives deliver $${totalEBITDA.toLocaleString('en-US')} in EBITDA improvement through operational efficiency.`
  
  const summaryLines = doc.splitTextToSize(executiveSummary, 170)
  summaryLines.forEach((line: string) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    doc.text(line, 20, yPos)
    yPos += 5
  })
  
  yPos += 5
  
  const commentary = [
    ``,
    `Recommendations assume successful deployment with stated adoption rates and`,
    `value creation opportunity.`,
    ``,
    `Recommendations assume successful deployment with stated adoption rates and`,
    `productivity improvements.`
  ]
  
  commentary.forEach((line) => {
    doc.text(line, 20, yPos)
    yPos += 5
  })
  
  // Footer
  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.setFont('helvetica', 'italic')
  doc.text('Confidential - Internal Use Only', 105, 280, { align: 'center' })
  
  // Page 3: Charts and Visualizations
  doc.addPage()
  yPos = 20
  
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Impact Visualization', 20, yPos)
  yPos += 15
  
  // Total Impact Overview - Vertical Bar Chart
  doc.setFontSize(14)
  doc.text('Total Impact Overview', 20, yPos)
  yPos += 10
  
  const maxBarHeight = 80
  const chartWidth = 40
  const gap = 15
  const startX = 35
  
  // Revenue Bar
  const revenueHeight = totalRevenue > 0 ? Math.max((totalRevenue / totalImpact) * maxBarHeight, 10) : 0
  doc.setFillColor(34, 197, 94) // green
  doc.rect(startX, yPos + (maxBarHeight - revenueHeight), chartWidth, revenueHeight, 'F')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.text(`$${(totalRevenue / 1000000).toFixed(1)}M`, startX + chartWidth/2, yPos + (maxBarHeight - revenueHeight) + 5, { align: 'center' })
  doc.setTextColor(51, 65, 85)
  doc.setFontSize(9)
  doc.text('Revenue', startX + chartWidth/2, yPos + maxBarHeight + 6, { align: 'center' })
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  const revenueKPICount = savedAgents.reduce((sum, agent) => sum + agent.results.filter(r => r.impactType === 'Revenue').length, 0)
  doc.text(`${revenueKPICount} KPIs`, startX + chartWidth/2, yPos + maxBarHeight + 11, { align: 'center' })
  
  // EBITDA Bar
  const ebitdaHeight = totalEBITDA > 0 ? Math.max((totalEBITDA / totalImpact) * maxBarHeight, 10) : 0
  doc.setFillColor(59, 130, 246) // blue
  doc.rect(startX + chartWidth + gap, yPos + (maxBarHeight - ebitdaHeight), chartWidth, ebitdaHeight, 'F')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.text(`$${(totalEBITDA / 1000000).toFixed(1)}M`, startX + chartWidth + gap + chartWidth/2, yPos + (maxBarHeight - ebitdaHeight) + 5, { align: 'center' })
  doc.setTextColor(51, 65, 85)
  doc.setFontSize(9)
  doc.text('EBITDA', startX + chartWidth + gap + chartWidth/2, yPos + maxBarHeight + 6, { align: 'center' })
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  const ebitdaKPICount = savedAgents.reduce((sum, agent) => sum + agent.results.filter(r => r.impactType === 'EBITDA').length, 0)
  doc.text(`${ebitdaKPICount} KPIs`, startX + chartWidth + gap + chartWidth/2, yPos + maxBarHeight + 11, { align: 'center' })
  
  // Total Bar
  doc.setFillColor(168, 85, 247) // purple
  doc.rect(startX + (chartWidth + gap) * 2, yPos, chartWidth, maxBarHeight, 'F')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.text(`$${(totalImpact / 1000000).toFixed(1)}M`, startX + (chartWidth + gap) * 2 + chartWidth/2, yPos + 5, { align: 'center' })
  doc.setTextColor(51, 65, 85)
  doc.setFontSize(9)
  doc.text('Total', startX + (chartWidth + gap) * 2 + chartWidth/2, yPos + maxBarHeight + 6, { align: 'center' })
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text(`${revenueKPICount + ebitdaKPICount} KPIs`, startX + (chartWidth + gap) * 2 + chartWidth/2, yPos + maxBarHeight + 11, { align: 'center' })
  
  yPos += maxBarHeight + 25
  
  // Impact by KPI
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Impact by KPI', 20, yPos)
  yPos += 8
  
  // Aggregate KPI impacts across all agents
  const kpiImpacts = new Map<string, { impact: number, type: 'Revenue' | 'EBITDA' }>()
  savedAgents.forEach(agent => {
    agent.results.forEach(result => {
      const current = kpiImpacts.get(result.kpiName) || { impact: 0, type: result.impactType }
      kpiImpacts.set(result.kpiName, {
        impact: current.impact + result.impactGBP,
        type: result.impactType
      })
    })
  })
  
  const sortedKPIs = Array.from(kpiImpacts.entries())
    .map(([name, data]) => ({ name, impact: data.impact, type: data.type }))
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 8) // Show top 8 KPIs
  
  const maxKPIImpact = Math.max(...sortedKPIs.map(k => k.impact))
  const barMaxWidth = 130
  
  sortedKPIs.forEach((kpi, index) => {
    const barWidth = (kpi.impact / maxKPIImpact) * barMaxWidth
    const barColor = kpi.type === 'Revenue' ? [34, 197, 94] : [59, 130, 246]
    
    doc.setFontSize(8)
    doc.setTextColor(51, 65, 85)
    doc.setFont('helvetica', 'normal')
    const kpiText = kpi.name.length > 35 ? kpi.name.substring(0, 32) + '...' : kpi.name
    doc.text(kpiText, 22, yPos + 3)
    
    doc.setFillColor(barColor[0], barColor[1], barColor[2])
    doc.rect(22, yPos + 4, barWidth, 4, 'F')
    
    doc.setFontSize(7)
    doc.setTextColor(71, 85, 105)
    doc.setFont('helvetica', 'bold')
    doc.text(`$${kpi.impact.toLocaleString('en-US')}`, 155, yPos + 3)
    
    yPos += 10
    
    if (yPos > 270 && index < sortedKPIs.length - 1) {
      doc.addPage()
      yPos = 20
    }
  })
  
  // Add new page for Impact by Agent if needed
  if (yPos > 200) {
    doc.addPage()
    yPos = 20
  } else {
    yPos += 10
  }
  
  // Impact by Agent
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Impact by Agent', 20, yPos)
  yPos += 8
  
  const agentData = savedAgents.map(agent => {
    const impact = agent.results.reduce((sum, r) => sum + r.impactGBP, 0)
    return {
      name: agent.agentName,
      process: agent.process,
      impact,
      kpiCount: agent.results.length
    }
  }).sort((a, b) => b.impact - a.impact)
  
  const maxAgentImpact = Math.max(...agentData.map(a => a.impact))
  const agentColors = [
    [59, 130, 246],   // blue
    [99, 102, 241],   // indigo
    [168, 85, 247],   // purple
    [236, 72, 153],   // pink
    [244, 63, 94],    // rose
    [251, 146, 60]    // orange
  ]
  
  agentData.forEach((agent, index) => {
    const barWidth = (agent.impact / maxAgentImpact) * barMaxWidth
    const color = agentColors[index % agentColors.length]
    
    doc.setFontSize(8)
    doc.setTextColor(51, 65, 85)
    doc.setFont('helvetica', 'normal')
    const agentText = agent.name.length > 25 ? agent.name.substring(0, 22) + '...' : agent.name
    doc.text(`${agentText} (${agent.process})`, 22, yPos + 3)
    
    doc.setFillColor(color[0], color[1], color[2])
    doc.rect(22, yPos + 4, barWidth, 4, 'F')
    
    doc.setFontSize(7)
    doc.setTextColor(71, 85, 105)
    doc.setFont('helvetica', 'bold')
    doc.text(`$${agent.impact.toLocaleString('en-US')}`, 155, yPos + 3)
    
    yPos += 10
    
    if (yPos > 270 && index < agentData.length - 1) {
      doc.addPage()
      yPos = 20
    }
  })
  
  // Process Distribution Pie Chart
  if (yPos > 190) {
    doc.addPage()
    yPos = 20
  } else {
    yPos += 10
  }
  
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Impact Distribution by Business Process', 20, yPos)
  yPos += 10
  
  // Aggregate impact by process
  const processImpacts = new Map<string, number>()
  savedAgents.forEach(agent => {
    const current = processImpacts.get(agent.process) || 0
    const agentImpact = agent.results.reduce((sum, r) => sum + r.impactGBP, 0)
    processImpacts.set(agent.process, current + agentImpact)
  })
  
  const processData = Array.from(processImpacts.entries())
    .map(([process, impact]) => ({ process, impact }))
    .sort((a, b) => b.impact - a.impact)
  
  // Create pie chart manually
  const pieRadius = 35
  const pieCenterX = 60
  const pieCenterY = yPos + 40
  const processColors = [
    [59, 130, 246],   // blue
    [16, 185, 129],   // green
    [99, 102, 241],   // indigo
    [245, 158, 11],   // amber
    [168, 85, 247],   // purple
    [236, 72, 153],   // pink
    [6, 182, 212]     // cyan
  ]
  
  let startAngle = -90 // Start at top
  processData.forEach((item, index) => {
    const percentage = (item.impact / totalImpact) * 100
    const sweepAngle = (item.impact / totalImpact) * 360
    const color = processColors[index % processColors.length]
    
    // Draw pie slice
    doc.setFillColor(color[0], color[1], color[2])
    
    // Create pie slice using multiple small segments
    const segments = Math.ceil(sweepAngle / 2)
    for (let i = 0; i <= segments; i++) {
      const angle1 = (startAngle + (i / segments) * sweepAngle) * Math.PI / 180
      const angle2 = (startAngle + ((i + 1) / segments) * sweepAngle) * Math.PI / 180
      
      const x1 = pieCenterX + pieRadius * Math.cos(angle1)
      const y1 = pieCenterY + pieRadius * Math.sin(angle1)
      const x2 = pieCenterX + pieRadius * Math.cos(angle2)
      const y2 = pieCenterY + pieRadius * Math.sin(angle2)
      
      doc.triangle(pieCenterX, pieCenterY, x1, y1, x2, y2, 'F')
    }
    
    startAngle += sweepAngle
  })
  
  // Legend
  let legendY = yPos + 10
  processData.forEach((item, index) => {
    const color = processColors[index % processColors.length]
    const percentage = ((item.impact / totalImpact) * 100).toFixed(1)
    
    doc.setFillColor(color[0], color[1], color[2])
    doc.rect(110, legendY, 4, 4, 'F')
    
    doc.setTextColor(51, 65, 85)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(item.process, 117, legendY + 3)
    
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(71, 85, 105)
    doc.text(`${percentage}% - $${item.impact.toLocaleString('en-US')}`, 160, legendY + 3)
    
    legendY += 7
  })
  
  // Agent Detail Pages
  savedAgents.forEach((agent, index) => {
    doc.addPage()
    yPos = 20
    
    // Agent Header
    doc.setTextColor(15, 23, 42)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(`Agent ${index + 1}: ${agent.agentName}`, 20, yPos)
    yPos += 8
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 116, 139)
    doc.text(`${agent.process} Process`, 20, yPos)
    yPos += 15
    
    // Calculate agent totals
    const agentRevenue = agent.results.filter(r => r.impactType === 'Revenue').reduce((s, r) => s + r.impactGBP, 0)
    const agentEBITDA = agent.results.filter(r => r.impactType === 'EBITDA').reduce((s, r) => s + r.impactGBP, 0)
    const agentTotal = agentRevenue + agentEBITDA
    
    // Summary boxes
    doc.setFillColor(241, 245, 249)
    doc.roundedRect(20, yPos, 50, 20, 2, 2, 'F')
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(9)
    doc.text('Total Impact', 45, yPos + 6, { align: 'center' })
    doc.setTextColor(59, 130, 246)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`$${agentTotal.toLocaleString('en-US')}`, 45, yPos + 15, { align: 'center' })
    
    doc.setFillColor(236, 253, 245)
    doc.roundedRect(75, yPos, 55, 20, 2, 2, 'F')
    doc.setTextColor(6, 95, 70)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Revenue Impact', 102.5, yPos + 6, { align: 'center' })
    doc.setTextColor(16, 185, 129)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`$${agentRevenue.toLocaleString('en-US')}`, 102.5, yPos + 15, { align: 'center' })
    
    doc.setFillColor(238, 242, 255)
    doc.roundedRect(135, yPos, 55, 20, 2, 2, 'F')
    doc.setTextColor(49, 46, 129)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('EBITDA Impact', 162.5, yPos + 6, { align: 'center' })
    doc.setTextColor(99, 102, 241)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`$${agentEBITDA.toLocaleString('en-US')}`, 162.5, yPos + 15, { align: 'center' })
    
    yPos += 30
    
    // KPI Breakdown Table
    doc.setTextColor(71, 85, 105)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Detailed KPI Breakdown', 20, yPos)
    yPos += 8
    
    // Table header
    doc.setFillColor(51, 65, 85)
    doc.rect(20, yPos, 170, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('KPI', 22, yPos + 5.5)
    doc.text('Type', 115, yPos + 5.5)
    doc.text('Impact ($)', 180, yPos + 5.5, { align: 'right' })
    yPos += 8
    
    // Table rows
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(51, 65, 85)
    agent.results.forEach((result, i) => {
      if (yPos > 260) {
        doc.addPage()
        yPos = 20
      }
      
      if (i % 2 === 0) {
        doc.setFillColor(249, 250, 251)
        doc.rect(20, yPos, 170, 7, 'F')
      }
      
      doc.setFontSize(8)
      doc.text(result.kpiName.substring(0, 45), 22, yPos + 5)
      
      const typeColor = result.impactType === 'Revenue' ? [16, 185, 129] : [99, 102, 241]
      doc.setTextColor(typeColor[0], typeColor[1], typeColor[2])
      doc.setFont('helvetica', 'bold')
      doc.text(result.impactType, 115, yPos + 5)
      
      doc.setTextColor(51, 65, 85)
      doc.setFont('helvetica', 'normal')
      doc.text(`$${result.impactGBP.toLocaleString('en-US')}`, 188, yPos + 5, { align: 'right' })
      yPos += 7
    })
    
    // Total row
    doc.setFillColor(241, 245, 249)
    doc.rect(20, yPos, 170, 8, 'F')
    doc.setTextColor(15, 23, 42)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Total', 22, yPos + 5.5)
    doc.setTextColor(59, 130, 246)
    doc.text(`$${agentTotal.toLocaleString('en-US')}`, 188, yPos + 5.5, { align: 'right' })
    yPos += 15
    
    // Value Narrative Section
    if (yPos > 260) {
      doc.addPage()
      yPos = 20
    }
    
    // Contextualized Value Narrative
    doc.setTextColor(71, 85, 105)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Value Creation & Industry Context', 20, yPos)
    yPos += 8
    
    doc.setTextColor(51, 65, 85)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    
    // Create contextualized narrative with agent, KPIs, and industry
    const revenueKPIs = agent.results.filter(r => r.impactType === 'Revenue')
    const ebitdaKPIs = agent.results.filter(r => r.impactType === 'EBITDA')
    
    let contextualizedNarrative = `${agent.agentName} delivers $${agentTotal.toLocaleString('en-US')} in annual value `
    
    if (customerInfo?.name) {
      contextualizedNarrative += `for ${customerInfo.name} `
    }
    
    contextualizedNarrative += `through ${agent.process} process optimization. `
    
    if (revenueKPIs.length > 0) {
      const revenueImpact = revenueKPIs.reduce((s, r) => s + r.impactGBP, 0)
      const revenueKPINames = revenueKPIs.map(r => r.kpiName).join(', ')
      contextualizedNarrative += `\n\nThe agent drives $${revenueImpact.toLocaleString('en-US')} in revenue growth by improving: ${revenueKPINames}. `
    }
    
    if (ebitdaKPIs.length > 0) {
      const ebitdaImpact = ebitdaKPIs.reduce((s, r) => s + r.impactGBP, 0)
      const ebitdaKPINames = ebitdaKPIs.map(r => r.kpiName).join(', ')
      contextualizedNarrative += `\n\nAdditionally, it generates $${ebitdaImpact.toLocaleString('en-US')} in EBITDA improvement through: ${ebitdaKPINames}. `
    }
    
    if (customerInfo?.industry) {
      const industryNarrative = generateIndustryNarrative(
        customerInfo.industry,
        agent.agentName,
        agent.process,
        agent.results
      )
      contextualizedNarrative += `\n\n${industryNarrative}`
    }
    
    const narrativeLines = doc.splitTextToSize(contextualizedNarrative, 170)
    narrativeLines.forEach((line: string) => {
      if (yPos > 275) {
        doc.addPage()
        yPos = 20
      }
      doc.text(line, 20, yPos)
      yPos += 4
    })
    
    yPos += 6
    
    // Industry-specific narrative if available - REMOVED (now integrated above)
    /*
    if (customerInfo?.industry) {
      doc.setTextColor(71, 85, 105)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Industry Context & Value Creation', 20, yPos)
      yPos += 8
      
      doc.setTextColor(51, 65, 85)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      
      const industryNarrative = generateIndustryNarrative(
        customerInfo.industry,
        agent.agentName,
        agent.process,
        agent.results
      )
      
      const narrativeLines = doc.splitTextToSize(industryNarrative, 170)
      narrativeLines.forEach((line: string) => {
        if (yPos > 275) {
          doc.addPage()
          yPos = 20
        }
        doc.text(line, 20, yPos)
        yPos += 4
      })
      
      yPos += 6
    }
    */
    
    doc.setTextColor(71, 85, 105)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('How This Agent Optimizes Your Process', 20, yPos)
    yPos += 8
    
    doc.setTextColor(51, 65, 85)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    
    agent.results.forEach((result) => {
      if (yPos > 260) {
        doc.addPage()
        yPos = 20
      }
      
      // KPI Name header
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(30, 64, 175)
      doc.text(result.kpiName, 20, yPos)
      yPos += 5
      
      // Narrative text
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(51, 65, 85)
      const narrative = generateValueNarrative(result.kpiName, agent.agentName, agent.process)
      const lines = doc.splitTextToSize(narrative, 170)
      lines.forEach((line: string) => {
        if (yPos > 275) {
          doc.addPage()
          yPos = 20
        }
        doc.text(line, 20, yPos)
        yPos += 4
      })
      yPos += 4
    })
    
    yPos += 5
    
    // Key Insights
    if (yPos < 240) {
      doc.setTextColor(71, 85, 105)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Key Insights', 20, yPos)
      yPos += 7
      
      const insights = generateAgentInsights(agent)
      doc.setTextColor(51, 65, 85)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      
      insights.forEach((insight) => {
        if (yPos > 275) return
        const lines = doc.splitTextToSize(`• ${insight}`, 170)
        lines.forEach((line: string) => {
          doc.text(line, 20, yPos)
          yPos += 5
        })
      })
    }
    
    // Footer
    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184)
    doc.setFont('helvetica', 'italic')
    doc.text(`Agent ${index + 1} of ${savedAgents.length} | Confidential`, 105, 285, { align: 'center' })
  })
  
  // Final Summary Page
  doc.addPage()
  yPos = 20
  
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary & Recommendations', 20, yPos)
  yPos += 15
  
  doc.setFontSize(12)
  doc.setTextColor(71, 85, 105)
  doc.text('Implementation Priorities', 20, yPos)
  yPos += 8
  
  // Rank agents by impact
  const rankedAgents = [...savedAgents].sort((a, b) => {
    const aTotal = a.results.reduce((s, r) => s + r.impactGBP, 0)
    const bTotal = b.results.reduce((s, r) => s + r.impactGBP, 0)
    return bTotal - aTotal
  })
  
  doc.setFontSize(10)
  doc.setTextColor(30, 64, 175)
  doc.setFont('helvetica', 'bold')
  rankedAgents.slice(0, 3).forEach((agent, i) => {
    const agentTotal = agent.results.reduce((s, r) => s + r.impactGBP, 0)
    doc.text(`${i + 1}. ${agent.agentName} - $${agentTotal.toLocaleString('en-US')}`, 20, yPos)
    yPos += 7
  })
  
  yPos += 8
  doc.setTextColor(71, 85, 105)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Next Steps', 20, yPos)
  yPos += 8
  
  const nextSteps = [
    'Validate assumptions with business stakeholders and domain experts',
    'Conduct pilot program with highest-impact agent to prove ROI',
    'Develop detailed implementation roadmap with timelines and milestones',
    'Establish KPI tracking and measurement framework for ongoing monitoring',
    'Secure executive sponsorship and budget allocation for deployment'
  ]
  
  doc.setTextColor(51, 65, 85)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  
  nextSteps.forEach((step) => {
    const lines = doc.splitTextToSize(`• ${step}`, 170)
    lines.forEach((line: string) => {
      doc.text(line, 20, yPos)
      yPos += 5
    })
    yPos += 1
  })
  
  // Save PDF
  const fileName = `Agent-Impact-Report-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

function generateAgentInsights(agent: AgentConfig): string[] {
  const insights: string[] = []
  const totalImpact = agent.results.reduce((s, r) => s + r.impactGBP, 0)
  const revenueKPIs = agent.results.filter(r => r.impactType === 'Revenue')
  const ebitdaKPIs = agent.results.filter(r => r.impactType === 'EBITDA')
  
  const sortedKPIs = [...agent.results].sort((a, b) => b.impactGBP - a.impactGBP)
  const topKPI = sortedKPIs[0]
  
  if (topKPI) {
    const percentage = ((topKPI.impactGBP / totalImpact) * 100).toFixed(0)
    insights.push(`${topKPI.kpiName} drives ${percentage}% of total impact for this agent`)
  }
  
  if (revenueKPIs.length > 0) {
    const revTotal = revenueKPIs.reduce((s, r) => s + r.impactGBP, 0)
    insights.push(`Revenue initiatives contribute $${revTotal.toLocaleString('en-US')} through ${revenueKPIs.length} growth-focused KPI${revenueKPIs.length !== 1 ? 's' : ''}`)
  }
  
  if (ebitdaKPIs.length > 0) {
    const ebitdaTotal = ebitdaKPIs.reduce((s, r) => s + r.impactGBP, 0)
    insights.push(`EBITDA improvements of $${ebitdaTotal.toLocaleString('en-US')} achieved through ${ebitdaKPIs.length} efficiency-focused KPI${ebitdaKPIs.length !== 1 ? 's' : ''}`)
  }
  
  insights.push(`Implementation recommended within ${agent.process} process with phased rollout approach`)
  
  return insights.slice(0, 4)
}

function generateValueNarrative(kpiName: string, agentName: string, process: string): string {
  const narratives: { [key: string]: string } = {
    // Sales KPIs
    'More Leads': `By leveraging AI-powered prospecting and lead identification, ${agentName} automatically discovers and qualifies new opportunities, expanding your pipeline without additional manual effort. The agent analyzes patterns in successful conversions to identify high-potential prospects.`,
    'Improved Lead Conversion': `${agentName} enhances lead-to-opportunity conversion by providing personalized engagement strategies, optimal timing recommendations, and context-aware nurturing sequences. Machine learning models identify which leads are most likely to convert and suggest the best approach for each prospect.`,
    'Improved Win Rate': `Through intelligent competitive analysis and opportunity scoring, ${agentName} helps prioritize deals with the highest win probability. The agent provides real-time insights on competitor positioning, pricing strategies, and customer pain points to strengthen your proposals.`,
    'Increased Deal Size': `${agentName} identifies upsell and cross-sell opportunities by analyzing customer needs, usage patterns, and comparable deals. The agent recommends optimal product bundles and value propositions that resonate with each customer's specific requirements.`,
    'Accelerated Sales Cycle': `By automating routine tasks, generating proposals, and providing instant answers to common questions, ${agentName} eliminates bottlenecks in your sales process. The agent ensures smooth handoffs between stages and proactively addresses potential delays.`,
    'Seller Time Savings': `${agentName} handles time-consuming administrative tasks like data entry, meeting scheduling, follow-up emails, and CRM updates. This frees your sales team to focus on high-value activities like relationship building and strategic deal advancement.`,
    
    // Service KPIs
    'Average Handling Time Reduction': `${agentName} accelerates case resolution by providing instant access to knowledge bases, suggesting proven solutions, and auto-completing repetitive tasks. The agent learns from successful resolutions to recommend the most effective approaches, reducing the time agents spend searching for information.`,
    'First Call Resolution Improvement': `By equipping service agents with real-time guidance, comprehensive customer context, and intelligent troubleshooting workflows, ${agentName} increases the likelihood of resolving issues on the first contact. This reduces callbacks, improves customer satisfaction, and lowers operational costs.`,
    'Issue Resolution Time Reduction': `${agentName} proactively identifies patterns in complex issues and routes them to the right specialists. The agent maintains continuity across handoffs, tracks escalations, and ensures no issue falls through the cracks, significantly reducing time-to-resolution for challenging cases.`,
    'Channel Shift to Low-Cost': `Through intelligent automation and self-service capabilities, ${agentName} enables customers to resolve simple issues through low-cost digital channels like chatbots and knowledge portals. This reserves human agents for complex, high-value interactions while maintaining customer satisfaction.`,
    'Case Volume Reduction': `${agentName} analyzes root causes of recurring issues and provides proactive alerts and preventive guidance to customers. By identifying patterns and addressing problems before they escalate, the agent reduces overall case volume and improves the customer experience.`,
    
    // Marketing KPIs
    'Agency Spend Reduction': `${agentName} automates creative production, campaign execution, and content generation tasks traditionally handled by external agencies. By leveraging AI for design iterations, copy variations, and performance optimization, the agent reduces dependency on expensive agency services while maintaining quality.`,
    'Cost Per Lead Reduction': `Through intelligent budget allocation, real-time bidding optimization, and audience targeting refinement, ${agentName} maximizes the efficiency of every marketing dollar. The agent continuously tests and learns from campaign performance to identify the most cost-effective channels and messaging.`,
    'Revenue Per Lead Increase': `${agentName} enhances lead quality through advanced scoring models, behavioral analysis, and personalized nurturing sequences. By identifying which leads are most likely to convert and providing them with tailored content at optimal times, the agent increases the revenue value of each prospect.`,
    'Brand Value Increase': `By analyzing market trends, competitor positioning, and audience sentiment, ${agentName} identifies opportunities to strengthen brand perception and awareness. The agent recommends strategic content, partnerships, and campaigns that resonate with target audiences and differentiate your brand in the market.`,
    'Customer Retention Improvement': `${agentName} predicts churn risk by monitoring engagement patterns and customer behavior. The agent triggers personalized retention campaigns, recommends relevant offers, and identifies the right moments to re-engage customers, increasing lifetime value and reducing acquisition costs.`,
    'Leads Generated Increase': `Through AI-powered content optimization, SEO enhancement, and multi-channel campaign orchestration, ${agentName} expands your reach and attracts more qualified prospects. The agent identifies high-performing tactics and scales them efficiently across channels to maximize lead generation.`,
    
    // Finance KPIs
    'Finance Outsourcing Spend Reduction': `${agentName} automates routine finance tasks currently handled by external vendors, including data entry, report generation, and basic analysis. By bringing these capabilities in-house through AI automation, you reduce dependence on costly outsourcing while maintaining quality and speed.`,
    'Cost Per Analysis Reduction': `${agentName} streamlines financial analysis by automatically gathering data from multiple sources, performing calculations, and generating insights. This reduces the time and resources needed per analysis request, allowing your finance team to handle more requests with the same headcount.`,
    'Analysis Time Reduction': `By automating data collection, cleansing, and preliminary analysis, ${agentName} accelerates the financial analysis process. Analysts can focus on interpretation and strategic recommendations rather than manual data manipulation, significantly reducing time-to-insight.`,
    'Reconciliation Time Reduction': `${agentName} automates account reconciliation by matching transactions across systems, identifying discrepancies, and flagging issues for human review. This reduces the manual effort required for month-end close processes and improves accuracy.`,
    'Days Sales Outstanding Reduction': `${agentName} monitors outstanding invoices, sends automated payment reminders, predicts payment delays, and prioritizes collection efforts. By accelerating cash collection, you improve working capital and reduce the cost of financing receivables.`,
    'Compliance Rate Improvement': `${agentName} continuously monitors transactions and processes against regulatory requirements, flags potential violations before they occur, and ensures documentation is complete. This proactive compliance approach reduces penalties, audit costs, and reputational risk.`
  }
  
  return narratives[kpiName] || `${agentName} optimizes the ${process} process by leveraging AI to improve efficiency and effectiveness.`
}
