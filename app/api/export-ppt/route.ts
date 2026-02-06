import { NextRequest, NextResponse } from 'next/server'
import PptxGenJS from 'pptxgenjs'
import type { AgentConfig } from '@/types'
import { generateMcKinseyExecutiveSummary, generateAgentValueStory, generateStrategicRecommendations } from '@/lib/enhancedNarratives'

interface CustomerInfo {
  name: string
  revenue: string
  ebitda: string
  industry: string
}

export async function POST(request: NextRequest) {
  try {
    const { savedAgents, customerInfo }: { savedAgents: AgentConfig[], customerInfo?: CustomerInfo } = await request.json()
    
    const pptx = new PptxGenJS()
    
    // Calculate totals
    const totalRevenue = savedAgents.reduce((sum, agent) => {
      return sum + agent.results.filter(r => r.impactType === 'Revenue').reduce((s, r) => s + r.impactGBP, 0)
    }, 0)
    
    const totalEBITDA = savedAgents.reduce((sum, agent) => {
      return sum + agent.results.filter(r => r.impactType === 'EBITDA').reduce((s, r) => s + r.impactGBP, 0)
    }, 0)
    
    const totalImpact = totalRevenue + totalEBITDA
    
    // Slide 1: Title Page
    const titleSlide = pptx.addSlide()
    titleSlide.background = { color: '0F172A' }
    
    titleSlide.addText('AI Agent Impact Analysis', {
      x: 0.5,
      y: 2.0,
      w: 9,
      h: 1.5,
      fontSize: 48,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      valign: 'middle'
    })
    
    titleSlide.addText('Financial Business Case Report', {
      x: 0.5,
      y: 3.5,
      w: 9,
      h: 0.8,
      fontSize: 24,
      color: 'CBD5E1',
      align: 'center',
      valign: 'middle'
    })
    
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    titleSlide.addText(`Generated: ${date}`, {
      x: 0.5,
      y: 4.8,
      w: 9,
      h: 0.5,
      fontSize: 14,
      color: 'CBD5E1',
      align: 'center'
    })
    
    titleSlide.addText(`${savedAgents.length} Agent${savedAgents.length !== 1 ? 's' : ''} Analyzed`, {
      x: 0.5,
      y: 5.3,
      w: 9,
      h: 0.5,
      fontSize: 14,
      color: 'CBD5E1',
      align: 'center'
    })
    
    // Slide 2: Executive Summary - McKinsey Style
    const summarySlide = pptx.addSlide()
    summarySlide.background = { color: 'FFFFFF' }
    
    // Header with subtitle
    summarySlide.addText('Executive Summary', {
      x: 0.5,
      y: 0.4,
      w: 9,
      h: 0.4,
      fontSize: 28,
      bold: true,
      color: '000000'
    })
    
    summarySlide.addText(`AI transformation opportunity for ${customerInfo?.name || 'your organization'}`, {
      x: 0.5,
      y: 0.85,
      w: 9,
      h: 0.3,
      fontSize: 12,
      color: '666666',
      italic: true
    })
    
    // Key Metrics - Clean boxes
    summarySlide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 1.3,
      w: 2.8,
      h: 0.9,
      fill: { color: 'F3F4F6' },
      line: { color: 'D1D5DB', width: 1 }
    })
    
    summarySlide.addText('Total Value', {
      x: 0.6,
      y: 1.4,
      w: 2.6,
      h: 0.25,
      fontSize: 10,
      color: '6B7280'
    })
    
    summarySlide.addText(`$${(totalImpact / 1000000).toFixed(1)}M`, {
      x: 0.6,
      y: 1.7,
      w: 2.6,
      h: 0.4,
      fontSize: 24,
      bold: true,
      color: '000000'
    })
    
    summarySlide.addShape(pptx.ShapeType.rect, {
      x: 3.6,
      y: 1.3,
      w: 2.8,
      h: 0.9,
      fill: { color: 'ECFDF5' },
      line: { color: '10B981', width: 1 }
    })
    
    summarySlide.addText('Revenue Growth', {
      x: 3.7,
      y: 1.4,
      w: 2.6,
      h: 0.25,
      fontSize: 10,
      color: '047857'
    })
    
    summarySlide.addText(`$${(totalRevenue / 1000000).toFixed(1)}M`, {
      x: 3.7,
      y: 1.7,
      w: 2.6,
      h: 0.4,
      fontSize: 24,
      bold: true,
      color: '047857'
    })
    
    summarySlide.addShape(pptx.ShapeType.rect, {
      x: 6.7,
      y: 1.3,
      w: 2.8,
      h: 0.9,
      fill: { color: 'EEF2FF' },
      line: { color: '4F46E5', width: 1 }
    })
    
    summarySlide.addText('EBITDA Improvement', {
      x: 6.8,
      y: 1.4,
      w: 2.6,
      h: 0.25,
      fontSize: 10,
      color: '3730A3'
    })
    
    summarySlide.addText(`$${(totalEBITDA / 1000000).toFixed(1)}M`, {
      x: 6.8,
      y: 1.7,
      w: 2.6,
      h: 0.4,
      fontSize: 24,
      bold: true,
      color: '3730A3'
    })
    
    // Enhanced executive summary with actual KPIs
    const executiveSummary = generateMcKinseyExecutiveSummary(
      customerInfo?.industry || '',
      customerInfo?.name || '',
      totalImpact,
      totalRevenue,
      totalEBITDA,
      savedAgents
    )
    
    summarySlide.addText('Situation', {
      x: 0.5,
      y: 2.55,
      w: 9,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: '000000'
    })
    
    summarySlide.addText(executiveSummary, {
      x: 0.5,
      y: 3.0,
      w: 9,
      h: 1.5,
      fontSize: 11,
      color: '1F2937',
      lineSpacing: 18
    })
    
    // Key insights bullets
    const allKPIs = savedAgents.flatMap(a => a.results)
    const topKPI = allKPIs.sort((a, b) => b.impactGBP - a.impactGBP)[0]
    const processes = [...new Set(savedAgents.map(a => a.process))]
    
    summarySlide.addText('Key Insights', {
      x: 0.5,
      y: 4.8,
      w: 9,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: '000000'
    })
    
    const insights = [
      `${topKPI.kpiName} represents the largest single value driver at $${(topKPI.impactGBP / 1000000).toFixed(1)}M (${((topKPI.impactGBP / totalImpact) * 100).toFixed(0)}% of total value)`,
      `Portfolio spans ${processes.length} business process${processes.length > 1 ? 'es' : ''} (${processes.join(', ')}), enabling cross-functional transformation`,
      `Revenue opportunities represent ${((totalRevenue / totalImpact) * 100).toFixed(0)}% of value, with EBITDA improvements providing ${((totalEBITDA / totalImpact) * 100).toFixed(0)}% - balanced portfolio approach`,
      `Implementation can be phased over 12-18 months with early quick wins funding subsequent deployments`
    ]
    
    let yPos = 5.25
    insights.forEach(insight => {
      summarySlide.addText('▪', {
        x: 0.7,
        y: yPos,
        w: 0.2,
        h: 0.25,
        fontSize: 12,
        color: '3B82F6'
      })
      
      summarySlide.addText(insight, {
        x: 1.0,
        y: yPos,
        w: 8.5,
        h: 0.4,
        fontSize: 10,
        color: '374151',
        lineSpacing: 16
      })
      
      yPos += 0.42
    })
    
    // Footer
    summarySlide.addText('Source: Agent Impact Calculator analysis', {
      x: 0.5,
      y: 7.1,
      w: 9,
      h: 0.2,
      fontSize: 8,
      color: '9CA3AF',
      italic: true
    })
    
    // Slide 3: Implementation Roadmap - Enhanced Detail
    const recommendationsSlide = pptx.addSlide()
    recommendationsSlide.background = { color: 'FFFFFF' }
    
    recommendationsSlide.addText('Implementation Roadmap', {
      x: 0.5,
      y: 0.35,
      w: 9,
      h: 0.4,
      fontSize: 28,
      bold: true,
      color: '000000'
    })
    
    recommendationsSlide.addText('Phased approach to value realization', {
      x: 0.5,
      y: 0.8,
      w: 9,
      h: 0.3,
      fontSize: 12,
      color: '666666',
      italic: true
    })
    
    const recommendations = generateStrategicRecommendations(
      savedAgents,
      customerInfo?.industry || '',
      totalImpact
    )
    
    const phases = ['Phase 1: Foundation (Months 1-3)', 'Phase 2: Scale (Months 4-9)', 'Phase 3: Quick Wins (Months 4-6)', 'Phase 4: Infrastructure (Months 7-12)', 'Phase 5: Compliance (Ongoing)']
    
    let recYPos = 1.35
    recommendations.forEach((rec, index) => {
      // Phase background
      recommendationsSlide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: recYPos,
        w: 9,
        h: 1.02,
        fill: { color: index % 2 === 0 ? 'F9FAFB' : 'FFFFFF' },
        line: { type: 'none' }
      })
      
      // Recommendation number box
      recommendationsSlide.addShape(pptx.ShapeType.rect, {
        x: 0.7,
        y: recYPos + 0.15,
        w: 0.4,
        h: 0.4,
        fill: { color: '3B82F6' },
        line: { type: 'none' }
      })
      
      recommendationsSlide.addText((index + 1).toString(), {
        x: 0.7,
        y: recYPos + 0.15,
        w: 0.4,
        h: 0.4,
        fontSize: 18,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle'
      })
      
      // Phase label
      recommendationsSlide.addText(phases[index] || `Phase ${index + 1}`, {
        x: 1.3,
        y: recYPos + 0.15,
        w: 8.0,
        h: 0.28,
        fontSize: 10,
        bold: true,
        color: '3B82F6'
      })
      
      // Recommendation text
      recommendationsSlide.addText(rec, {
        x: 1.3,
        y: recYPos + 0.48,
        w: 8.0,
        h: 0.45,
        fontSize: 10,
        color: '374151',
        lineSpacing: 16
      })
      
      recYPos += 1.12
    })
    
    recommendationsSlide.addText('Source: Agent Impact Calculator analysis', {
      x: 0.5,
      y: 7.1,
      w: 9,
      h: 0.2,
      fontSize: 8,
      color: '9CA3AF',
      italic: true
    })
    
    // Charts & Visualization Slide - Matching App Style
    const chartsSlide = pptx.addSlide()
    chartsSlide.background = { color: 'FFFFFF' }
    
    chartsSlide.addText('Impact Analysis', {
      x: 0.5,
      y: 0.35,
      w: 9,
      h: 0.4,
      fontSize: 28,
      bold: true,
      color: '000000'
    })
    
    chartsSlide.addText('Comprehensive breakdown of value creation by agent, process, and KPI', {
      x: 0.5,
      y: 0.8,
      w: 9,
      h: 0.3,
      fontSize: 12,
      color: '666666',
      italic: true
    })
    
    // Impact by Agent - Horizontal bars like app
    const agentChartData = savedAgents.map(agent => {
      const agentImpact = agent.results.reduce((sum, r) => sum + r.impactGBP, 0)
      return {
        name: agent.agentName,
        impact: agentImpact,
        process: agent.process,
        kpiCount: agent.results.length
      }
    }).sort((a, b) => b.impact - a.impact)
    
    const maxAgentImpact = Math.max(...agentChartData.map(a => a.impact))
    
    chartsSlide.addText('Impact by Agent', {
      x: 0.5,
      y: 1.25,
      w: 4.5,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: '000000'
    })
    
    let yPosAgent = 1.65
    agentChartData.forEach((agent, index) => {
      const percentage = (agent.impact / maxAgentImpact) * 100
      const barWidth = (percentage / 100) * 3.5
      const colors = ['3B82F6', '6366F1', '8B5CF6', 'A855F7', 'C026D3', 'F59E0B']
      const color = colors[index % colors.length]
      
      // Agent name and details
      chartsSlide.addText(agent.name, {
        x: 0.7,
        y: yPosAgent,
        w: 3.0,
        h: 0.22,
        fontSize: 10,
        bold: true,
        color: '1F2937'
      })
      
      chartsSlide.addText(`${agent.process} • ${agent.kpiCount} KPIs`, {
        x: 0.7,
        y: yPosAgent + 0.24,
        w: 3.0,
        h: 0.16,
        fontSize: 8,
        color: '6B7280'
      })
      
      // Bar background
      chartsSlide.addShape(pptx.ShapeType.rect, {
        x: 0.7,
        y: yPosAgent + 0.45,
        w: 3.4,
        h: 0.18,
        fill: { color: 'E5E7EB' },
        line: { type: 'none' }
      })
      
      // Bar foreground
      chartsSlide.addShape(pptx.ShapeType.rect, {
        x: 0.7,
        y: yPosAgent + 0.45,
        w: (barWidth / 3.5) * 3.4,
        h: 0.18,
        fill: { color: color },
        line: { type: 'none' }
      })
      
      // Value
      chartsSlide.addText(`$${(agent.impact / 1000000).toFixed(1)}M`, {
        x: 4.3,
        y: yPosAgent + 0.2,
        w: 0.7,
        h: 0.22,
        fontSize: 10,
        bold: true,
        color: '1F2937',
        align: 'right'
      })
      
      yPosAgent += 0.78
    })
    
    // Process Distribution Pie Chart
    const processCounts = new Map<string, number>()
    savedAgents.forEach(agent => {
      const current = processCounts.get(agent.process) || 0
      const agentImpact = agent.results.reduce((sum, r) => sum + r.impactGBP, 0)
      processCounts.set(agent.process, current + agentImpact)
    })
    
    const pieData = Array.from(processCounts.entries()).map(([process, impact]) => ({
      name: process,
      labels: [process],
      values: [impact / 1000000]
    }))
    
    chartsSlide.addText('Impact by Process', {
      x: 5.5,
      y: 1.25,
      w: 4.0,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: '000000'
    })
    
    chartsSlide.addChart(pptx.ChartType.pie,
      pieData,
      {
        x: 5.5,
        y: 1.65,
        w: 4.0,
        h: 3.3,
        chartColors: ['3B82F6', '10B981', '6366F1', 'F59E0B', '8B5CF6', 'EC4899', '06B6D4'],
        showValue: false,
        showPercent: true,
        showLegend: true,
        legendPos: 'b',
        legendFontSize: 9,
        dataLabelFontSize: 11,
        dataLabelColor: 'FFFFFF'
      }
    )
    
    // KPI Impact Distribution
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
    
    const topKPIs = Array.from(kpiImpacts.entries())
      .map(([name, data]) => ({ name, impact: data.impact, type: data.type }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 8)
    
    const maxKPIImpact = Math.max(...topKPIs.map(k => k.impact))
    
    chartsSlide.addText('Top KPIs by Impact', {
      x: 0.5,
      y: 5.15,
      w: 9,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: '000000'
    })
    
    let yPosKPI = 5.55
    topKPIs.forEach((kpi) => {
      const percentage = (kpi.impact / maxKPIImpact) * 100
      const barWidth = (percentage / 100) * 7.5
      const barColor = kpi.type === 'Revenue' ? '10B981' : '3B82F6'
      
      // KPI name
      const kpiName = kpi.name.length > 48 ? kpi.name.substring(0, 45) + '...' : kpi.name
      chartsSlide.addText(kpiName, {
        x: 0.7,
        y: yPosKPI,
        w: 4.3,
        h: 0.16,
        fontSize: 9,
        color: '1F2937'
      })
      
      chartsSlide.addText(`(${kpi.type})`, {
        x: 5.1,
        y: yPosKPI,
        w: 0.9,
        h: 0.16,
        fontSize: 8,
        color: '6B7280'
      })
      
      // Bar background
      chartsSlide.addShape(pptx.ShapeType.rect, {
        x: 0.7,
        y: yPosKPI + 0.2,
        w: 7.3,
        h: 0.14,
        fill: { color: 'E5E7EB' },
        line: { type: 'none' }
      })
      
      // Bar foreground
      chartsSlide.addShape(pptx.ShapeType.rect, {
        x: 0.7,
        y: yPosKPI + 0.2,
        w: (barWidth / 7.5) * 7.3,
        h: 0.14,
        fill: { color: barColor },
        line: { type: 'none' }
      })
      
      // Value
      chartsSlide.addText(`$${(kpi.impact / 1000000).toFixed(1)}M`, {
        x: 8.2,
        y: yPosKPI,
        w: 1.2,
        h: 0.16,
        fontSize: 9,
        bold: true,
        color: '1F2937',
        align: 'right'
      })
      
      yPosKPI += 0.4
    })
    
    chartsSlide.addText('Source: Agent Impact Calculator analysis', {
      x: 0.5,
      y: 7.1,
      w: 9,
      h: 0.2,
      fontSize: 8,
      color: '9CA3AF',
      italic: true
    })
    
    // Agent Detail Slides - McKinsey Style
    savedAgents.forEach((agent, index) => {
      const agentDetailSlide = pptx.addSlide()
      agentDetailSlide.background = { color: 'FFFFFF' }
      
      // Header with process badge
      agentDetailSlide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 0.35,
        w: 1.35,
        h: 0.35,
        fill: { color: 'EEF2FF' },
        line: { color: '4F46E5', width: 1 }
      })
      
      agentDetailSlide.addText(agent.process.toUpperCase(), {
        x: 0.5,
        y: 0.35,
        w: 1.35,
        h: 0.35,
        fontSize: 10,
        bold: true,
        color: '4F46E5',
        align: 'center',
        valign: 'middle'
      })
      
      agentDetailSlide.addText(agent.agentName, {
        x: 2.0,
        y: 0.35,
        w: 7.5,
        h: 0.4,
        fontSize: 26,
        bold: true,
        color: '000000'
      })
      
      agentDetailSlide.addText(`Agent ${index + 1} of ${savedAgents.length}`, {
        x: 2.0,
        y: 0.76,
        w: 7.5,
        h: 0.22,
        fontSize: 11,
        color: '666666',
        italic: true
      })
      
      const agentRevenue = agent.results.filter(r => r.impactType === 'Revenue').reduce((s, r) => s + r.impactGBP, 0)
      const agentEBITDA = agent.results.filter(r => r.impactType === 'EBITDA').reduce((s, r) => s + r.impactGBP, 0)
      const agentTotal = agentRevenue + agentEBITDA
      
      // Clean metric boxes
      agentDetailSlide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 1.35,
        w: 2.3,
        h: 0.75,
        fill: { color: 'F3F4F6' },
        line: { color: 'D1D5DB', width: 1 }
      })
      
      agentDetailSlide.addText('Total Value', {
        x: 0.65,
        y: 1.45,
        w: 2.0,
        h: 0.22,
        fontSize: 10,
        color: '6B7280'
      })
      
      agentDetailSlide.addText(`$${(agentTotal / 1000000).toFixed(2)}M`, {
        x: 0.65,
        y: 1.7,
        w: 2.0,
        h: 0.32,
        fontSize: 20,
        bold: true,
        color: '000000'
      })
      
      agentDetailSlide.addShape(pptx.ShapeType.rect, {
        x: 3.0,
        y: 1.35,
        w: 2.3,
        h: 0.75,
        fill: { color: 'ECFDF5' },
        line: { color: '10B981', width: 1 }
      })
      
      agentDetailSlide.addText('Revenue', {
        x: 3.15,
        y: 1.45,
        w: 2.0,
        h: 0.22,
        fontSize: 10,
        color: '047857'
      })
      
      agentDetailSlide.addText(`$${(agentRevenue / 1000000).toFixed(2)}M`, {
        x: 3.15,
        y: 1.7,
        w: 2.0,
        h: 0.32,
        fontSize: 20,
        bold: true,
        color: '047857'
      })
      
      agentDetailSlide.addShape(pptx.ShapeType.rect, {
        x: 5.5,
        y: 1.35,
        w: 2.3,
        h: 0.75,
        fill: { color: 'EEF2FF' },
        line: { color: '4F46E5', width: 1 }
      })
      
      agentDetailSlide.addText('EBITDA', {
        x: 5.65,
        y: 1.45,
        w: 2.0,
        h: 0.22,
        fontSize: 10,
        color: '3730A3'
      })
      
      agentDetailSlide.addText(`$${(agentEBITDA / 1000000).toFixed(2)}M`, {
        x: 5.65,
        y: 1.7,
        w: 2.0,
        h: 0.32,
        fontSize: 20,
        bold: true,
        color: '3730A3'
      })
      
      agentDetailSlide.addShape(pptx.ShapeType.rect, {
        x: 8.0,
        y: 1.35,
        w: 1.5,
        h: 0.75,
        fill: { color: 'F3F4F6' },
        line: { color: 'D1D5DB', width: 1 }
      })
      
      agentDetailSlide.addText('KPIs', {
        x: 8.15,
        y: 1.45,
        w: 1.2,
        h: 0.22,
        fontSize: 10,
        color: '6B7280'
      })
      
      agentDetailSlide.addText(agent.results.length.toString(), {
        x: 8.15,
        y: 1.7,
        w: 1.2,
        h: 0.32,
        fontSize: 20,
        bold: true,
        color: '000000'
      })
      
      // KPI Table - Clean style
      agentDetailSlide.addText('Value Drivers', {
        x: 0.5,
        y: 2.35,
        w: 9,
        h: 0.32,
        fontSize: 15,
        bold: true,
        color: '000000'
      })
      
      const kpiTableRows: any[] = [
        [
          { text: 'KPI', options: { bold: true, fontSize: 11, color: 'FFFFFF', fill: { color: '1F2937' } } },
          { text: 'Type', options: { bold: true, fontSize: 11, color: 'FFFFFF', fill: { color: '1F2937' }, align: 'center' } },
          { text: 'Impact', options: { bold: true, fontSize: 11, color: 'FFFFFF', fill: { color: '1F2937' }, align: 'right' } }
        ]
      ]
      
      agent.results.forEach((result) => {
        kpiTableRows.push([
          { text: result.kpiName.substring(0, 55), options: { fontSize: 10, color: '1F2937' } },
          { 
            text: result.impactType, 
            options: { 
              fontSize: 10, 
              color: result.impactType === 'Revenue' ? '047857' : '3730A3',
              bold: true,
              align: 'center'
            } 
          },
          { text: `$${(result.impactGBP / 1000).toLocaleString('en-US')}K`, options: { fontSize: 10, color: '1F2937', align: 'right' } }
        ])
      })
      
      kpiTableRows.push([
        { text: 'Total', options: { bold: true, fontSize: 11, color: '000000', fill: { color: 'F3F4F6' } } },
        { text: '', options: { fontSize: 11, color: '000000', fill: { color: 'F3F4F6' } } },
        { 
          text: `$${(agentTotal / 1000).toLocaleString('en-US')}K`, 
          options: { bold: true, fontSize: 11, color: '000000', align: 'right', fill: { color: 'F3F4F6' } } 
        }
      ])
      
      agentDetailSlide.addTable(kpiTableRows, {
        x: 0.5,
        y: 2.75,
        w: 9,
        rowH: 0.32,
        border: { pt: 0.5, color: 'E5E7EB' },
        fill: { color: 'FFFFFF' },
        margin: 0.1,
        colW: [5.8, 1.5, 1.7]
      })
      
      // Enhanced value story
      const valueStory = generateAgentValueStory(
        agent.agentName,
        agent.process,
        customerInfo?.industry || '',
        agent.results
      )
      
      agentDetailSlide.addText('Value Creation Analysis', {
        x: 0.5,
        y: 5.2,
        w: 9,
        h: 0.32,
        fontSize: 15,
        bold: true,
        color: '000000'
      })
      
      agentDetailSlide.addText(valueStory, {
        x: 0.5,
        y: 5.62,
        w: 9,
        h: 1.35,
        fontSize: 10,
        color: '374151',
        lineSpacing: 16
      })
      
      agentDetailSlide.addText('Source: Agent Impact Calculator analysis', {
        x: 0.5,
        y: 7.1,
        w: 9,
        h: 0.2,
        fontSize: 8,
        color: '9CA3AF',
        italic: true
      })
    })
    
    // Generate file as base64
    const pptxData = await pptx.write({ outputType: 'base64' })
    
    return NextResponse.json({ 
      success: true,
      data: pptxData,
      filename: `Agent-Impact-Report-${new Date().toISOString().split('T')[0]}.pptx`
    })
    
  } catch (error) {
    console.error('Error generating PowerPoint:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate PowerPoint' },
      { status: 500 }
    )
  }
}
