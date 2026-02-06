import { KPIResult } from '@/types'

interface AgentConfig {
  agentName: string
  process: string
  results: KPIResult[]
}

// Generate McKinsey-style executive summary with specific KPI insights
export function generateMcKinseyExecutiveSummary(
  industry: string,
  customerName: string,
  totalImpact: number,
  revenueImpact: number,
  ebitdaImpact: number,
  agents: AgentConfig[]
): string {
  const customerDisplay = customerName || 'Your organization'
  
  // Analyze KPI distribution
  const allKPIs = agents.flatMap(a => a.results)
  const topRevenueKPIs = allKPIs
    .filter(k => k.impactType === 'Revenue')
    .sort((a, b) => b.impactGBP - a.impactGBP)
    .slice(0, 2)
  
  const topEbitdaKPIs = allKPIs
    .filter(k => k.impactType === 'EBITDA')
    .sort((a, b) => b.impactGBP - a.impactGBP)
    .slice(0, 2)
  
  // Build narrative based on actual KPIs chosen
  let narrative = `${customerDisplay} can realize $${totalImpact.toLocaleString('en-US')} in annual value through strategic AI deployment across ${agents.length} use cases. `
  
  if (revenueImpact > 0 && topRevenueKPIs.length > 0) {
    const revenuePercentage = ((revenueImpact / totalImpact) * 100).toFixed(0)
    narrative += `Revenue growth opportunities represent ${revenuePercentage}% of total impact ($${revenueImpact.toLocaleString('en-US')}), primarily driven by ${topRevenueKPIs.map(k => k.kpiName.toLowerCase()).join(' and ')}. `
  }
  
  if (ebitdaImpact > 0 && topEbitdaKPIs.length > 0) {
    const ebitdaPercentage = ((ebitdaImpact / totalImpact) * 100).toFixed(0)
    narrative += `EBITDA improvement represents ${ebitdaPercentage}% of value ($${ebitdaImpact.toLocaleString('en-US')}), with key levers including ${topEbitdaKPIs.map(k => k.kpiName.toLowerCase()).join(' and ')}. `
  }
  
  // Add industry-specific context
  const industryContext = getIndustryContext(industry, agents, totalImpact)
  narrative += industryContext
  
  return narrative
}

// Generate detailed value story for each agent
export function generateAgentValueStory(
  agentName: string,
  process: string,
  industry: string,
  results: KPIResult[]
): string {
  const totalImpact = results.reduce((sum, r) => sum + r.impactGBP, 0)
  const revenueResults = results.filter(r => r.impactType === 'Revenue')
  const ebitdaResults = results.filter(r => r.impactType === 'EBITDA')
  
  let story = `${agentName} transforms ${process.toLowerCase()} operations through AI-powered automation, delivering $${totalImpact.toLocaleString('en-US')} in annual value. `
  
  // Revenue value drivers
  if (revenueResults.length > 0) {
    const revenueTotal = revenueResults.reduce((sum, r) => sum + r.impactGBP, 0)
    story += `\n\nRevenue Impact ($${revenueTotal.toLocaleString('en-US')}): `
    
    revenueResults.forEach((result, index) => {
      const percentage = ((result.impactGBP / totalImpact) * 100).toFixed(0)
      story += `${index > 0 ? '; ' : ''}${result.kpiName} contributes ${percentage}% of total value through ${getKPIValueDriver(result.kpiName, industry)}`
    })
    story += '. '
  }
  
  // EBITDA value drivers
  if (ebitdaResults.length > 0) {
    const ebitdaTotal = ebitdaResults.reduce((sum, r) => sum + r.impactGBP, 0)
    story += `\n\nEBITDA Impact ($${ebitdaTotal.toLocaleString('en-US')}): `
    
    ebitdaResults.forEach((result, index) => {
      const percentage = ((result.impactGBP / totalImpact) * 100).toFixed(0)
      story += `${index > 0 ? '; ' : ''}${result.kpiName} delivers ${percentage}% of value via ${getKPIValueDriver(result.kpiName, industry)}`
    })
    story += '. '
  }
  
  // Add implementation insight
  story += `\n\n${getImplementationInsight(process, industry, results.length)}`
  
  return story
}

// Industry-specific context based on actual agents deployed
function getIndustryContext(industry: string, agents: AgentConfig[], totalImpact: number): string {
  const processes = [...new Set(agents.map(a => a.process))]
  
  const contexts: { [key: string]: string } = {
    'Technology': `For technology companies, these improvements address critical scalability challenges while maintaining innovation velocity. Focus on ${processes.join(', ').toLowerCase()} optimization positions the organization to handle 2-3x growth without proportional headcount increases.`,
    
    'Financial Services': `In financial services, this transformation enhances regulatory compliance while improving customer experience—both critical competitive differentiators. The ${processes.join(', ').toLowerCase()} improvements directly support risk management and client retention objectives.`,
    
    'Healthcare': `For healthcare organizations, these efficiencies free clinical staff to focus on patient care while ensuring operational sustainability. Improvements in ${processes.join(', ').toLowerCase()} directly correlate with better patient outcomes and staff satisfaction.`,
    
    'Retail': `In retail, these capabilities enable omnichannel excellence and real-time responsiveness to market trends. Enhanced ${processes.join(', ').toLowerCase()} performance is essential for competing with digital-native disruptors.`,
    
    'Manufacturing': `For manufacturing, these optimizations improve production efficiency while reducing waste and quality issues. Excellence in ${processes.join(', ').toLowerCase()} translates directly to competitive cost position and customer satisfaction.`,
    
    'Energy & Utilities': `In energy and utilities, these improvements enhance asset reliability while supporting sustainability goals. Optimized ${processes.join(', ').toLowerCase()} operations reduce downtime and improve regulatory compliance.`,
    
    'Telecommunications': `For telecom providers, these capabilities reduce churn while improving network performance. Enhanced ${processes.join(', ').toLowerCase()} directly impact customer lifetime value and operational margins.`,
    
    'Consumer Goods': `In consumer goods, these improvements accelerate time-to-market while enhancing brand consistency. Streamlined ${processes.join(', ').toLowerCase()} enable faster response to consumer trends and competitive moves.`,
    
    'Automotive': `For automotive companies, these efficiencies support the transition to electric and autonomous vehicles. Improved ${processes.join(', ').toLowerCase()} performance is critical for managing increasing product complexity.`,
    
    'Pharmaceuticals': `In pharmaceuticals, these optimizations accelerate development timelines while maintaining compliance. Enhanced ${processes.join(', ').toLowerCase()} capabilities directly impact innovation velocity and market access.`,
    
    'Real Estate': `For real estate, these improvements enhance client experience while optimizing resource utilization. Better ${processes.join(', ').toLowerCase()} performance drives higher transaction velocity and customer satisfaction.`,
    
    'Transportation & Logistics': `In transportation and logistics, these capabilities improve delivery reliability while reducing costs. Optimized ${processes.join(', ').toLowerCase()} operations enhance service levels and profitability.`,
    
    'Media & Entertainment': `For media companies, these improvements enable content personalization at scale. Enhanced ${processes.join(', ').toLowerCase()} capabilities support audience engagement and monetization.`,
    
    'Professional Services': `In professional services, these efficiencies allow consultants to focus on high-value advisory work. Improved ${processes.join(', ').toLowerCase()} operations enhance both client satisfaction and team utilization.`,
    
    'Hospitality & Tourism': `For hospitality companies, these capabilities elevate guest experience while managing costs. Optimized ${processes.join(', ').toLowerCase()} operations drive revenue per guest and operational efficiency.`
  }
  
  return contexts[industry] || `These improvements position the organization for sustainable competitive advantage through operational excellence in ${processes.join(', ').toLowerCase()}.`
}

// Specific value driver narratives for different KPIs
function getKPIValueDriver(kpiName: string, industry: string): string {
  const kpiLower = kpiName.toLowerCase()
  
  // Sales KPIs
  if (kpiLower.includes('win rate') || kpiLower.includes('conversion')) {
    return 'improved qualification and personalized engagement'
  }
  if (kpiLower.includes('deal size') || kpiLower.includes('average order')) {
    return 'intelligent upselling and cross-selling recommendations'
  }
  if (kpiLower.includes('sales cycle')) {
    return 'automated workflows and faster decision-making'
  }
  if (kpiLower.includes('pipeline')) {
    return 'enhanced lead scoring and nurturing'
  }
  
  // Marketing KPIs
  if (kpiLower.includes('customer acquisition cost') || kpiLower.includes('cac')) {
    return 'optimized channel mix and targeting precision'
  }
  if (kpiLower.includes('conversion rate')) {
    return 'personalized content and journey optimization'
  }
  if (kpiLower.includes('roi') || kpiLower.includes('roas')) {
    return 'real-time campaign optimization and attribution'
  }
  if (kpiLower.includes('engagement')) {
    return 'relevant, timely content delivery'
  }
  
  // Service KPIs
  if (kpiLower.includes('resolution time') || kpiLower.includes('handle time')) {
    return 'automated responses and intelligent routing'
  }
  if (kpiLower.includes('satisfaction') || kpiLower.includes('csat') || kpiLower.includes('nps')) {
    return 'faster resolution and proactive support'
  }
  if (kpiLower.includes('first contact') || kpiLower.includes('fcr')) {
    return 'knowledge augmentation and guided troubleshooting'
  }
  if (kpiLower.includes('cost per contact')) {
    return 'self-service enablement and automation'
  }
  
  // Finance KPIs
  if (kpiLower.includes('invoice') || kpiLower.includes('processing time')) {
    return 'intelligent document processing and validation'
  }
  if (kpiLower.includes('dso') || kpiLower.includes('days sales')) {
    return 'automated follow-up and payment facilitation'
  }
  if (kpiLower.includes('accuracy') || kpiLower.includes('error')) {
    return 'automated validation and exception handling'
  }
  if (kpiLower.includes('close time') || kpiLower.includes('period close')) {
    return 'streamlined workflows and automated reconciliation'
  }
  
  // Supply Chain KPIs
  if (kpiLower.includes('inventory turnover')) {
    return 'demand forecasting and dynamic optimization'
  }
  if (kpiLower.includes('on-time') || kpiLower.includes('otd')) {
    return 'predictive logistics and proactive exception management'
  }
  if (kpiLower.includes('order accuracy')) {
    return 'automated verification and quality checks'
  }
  if (kpiLower.includes('freight cost')) {
    return 'route optimization and carrier selection'
  }
  
  // IT KPIs
  if (kpiLower.includes('outsourcing')) {
    return 'intelligent automation reducing external dependencies'
  }
  if (kpiLower.includes('issue resolution')) {
    return 'AI-powered diagnostics and auto-remediation'
  }
  if (kpiLower.includes('shadow it')) {
    return 'governed self-service and compliance monitoring'
  }
  if (kpiLower.includes('downtime')) {
    return 'predictive maintenance and rapid incident response'
  }
  
  // Legal KPIs
  if (kpiLower.includes('contract review')) {
    return 'AI-powered clause analysis and risk identification'
  }
  if (kpiLower.includes('research')) {
    return 'intelligent document search and precedent matching'
  }
  if (kpiLower.includes('compliance audit')) {
    return 'continuous monitoring and automated reporting'
  }
  if (kpiLower.includes('counsel spend')) {
    return 'in-house capability augmentation and triage'
  }
  
  return 'process automation and intelligent decision support'
}

// Implementation insights based on process and industry
function getImplementationInsight(process: string, industry: string, kpiCount: number): string {
  const insights: { [key: string]: string } = {
    'Sales': `Implementation Success Factors: Deploy in phases starting with lead qualification, ensure CRM integration for seamless data flow, provide sales team training on AI co-pilot capabilities. Typical adoption reaches 80%+ within 3 months with proper change management.`,
    
    'Marketing': `Implementation Success Factors: Begin with high-volume campaigns for rapid ROI, integrate with existing marketing automation platforms, establish feedback loops for continuous optimization. Early wins in first 60 days drive organizational buy-in.`,
    
    'Service': `Implementation Success Factors: Start with common inquiry types (typically 40-60% of volume), maintain human escalation paths, monitor customer satisfaction closely during rollout. Gradual expansion ensures service quality while building confidence.`,
    
    'Finance': `Implementation Success Factors: Pilot with high-volume, low-complexity transactions, ensure audit trail compliance, integrate with ERP systems. Process standardization before automation yields 2-3x better results.`,
    
    'Supply Chain': `Implementation Success Factors: Begin with demand forecasting for select SKUs, ensure data quality across systems, establish clear KPI baselines. Phased rollout by product line or geography reduces risk.`,
    
    'IT': `Implementation Success Factors: Start with repetitive incidents (password resets, access requests), integrate with ITSM tools, maintain proper escalation protocols. Quick wins in Tier 1 support demonstrate value.`,
    
    'Legal': `Implementation Success Factors: Begin with contract review for standard agreements, ensure human attorney oversight, integrate with document management systems. Build confidence through transparency and accuracy metrics.`
  }
  
  return insights[process] || `Implementation Success Factors: Phased deployment with clear success metrics, integration with existing systems, comprehensive user training and change management. Monitor closely in first 90 days to optimize performance.`
}

// Generate strategic recommendations based on portfolio
export function generateStrategicRecommendations(
  agents: AgentConfig[],
  industry: string,
  totalImpact: number
): string[] {
  const recommendations: string[] = []
  
  // Analyze portfolio characteristics
  const processes = [...new Set(agents.map(a => a.process))]
  const avgImpact = totalImpact / agents.length
  
  // Recommendation 1: Sequencing
  const sortedByImpact = [...agents].sort((a, b) => {
    const aTotal = a.results.reduce((sum, r) => sum + r.impactGBP, 0)
    const bTotal = b.results.reduce((sum, r) => sum + r.impactGBP, 0)
    return bTotal - aTotal
  })
  
  recommendations.push(`Prioritize ${sortedByImpact[0].agentName} (${sortedByImpact[0].process}) for initial deployment given its $${sortedByImpact[0].results.reduce((sum, r) => sum + r.impactGBP, 0).toLocaleString('en-US')} impact potential and proof-of-concept value for subsequent initiatives`)
  
  // Recommendation 2: Process focus
  if (processes.length > 3) {
    recommendations.push(`Focus initial efforts on ${processes.slice(0, 3).join(', ')} processes to build expertise and change management capabilities before expanding to additional areas`)
  } else {
    recommendations.push(`Deploy across ${processes.join(', ')} processes in parallel to demonstrate enterprise-wide value and build momentum for broader AI adoption`)
  }
  
  // Recommendation 3: Quick wins
  const quickWins = agents.filter(a => {
    const impact = a.results.reduce((sum, r) => sum + r.impactGBP, 0)
    return impact > avgImpact * 0.7 && a.results.length <= 3
  })
  
  if (quickWins.length > 0) {
    recommendations.push(`Target ${quickWins.map(a => a.agentName).join(' and ')} for 90-day quick wins to build organizational confidence and fund subsequent deployments`)
  }
  
  // Recommendation 4: Infrastructure
  recommendations.push(`Establish shared AI infrastructure including data pipelines, model governance, and monitoring frameworks to support efficient scaling across use cases`)
  
  // Recommendation 5: Industry-specific
  const industryRec: { [key: string]: string } = {
    'Financial Services': 'Prioritize regulatory compliance and audit trail capabilities in all deployments to meet heightened scrutiny requirements',
    'Healthcare': 'Ensure HIPAA compliance and clinical validation for all patient-facing agents before production deployment',
    'Retail': 'Integrate with existing omnichannel infrastructure to provide consistent customer experience across touchpoints',
    'Manufacturing': 'Start with non-critical production processes to build confidence before automating quality or safety-critical workflows',
    'Technology': 'Leverage existing technical capabilities to accelerate deployment and customize solutions for unique workflows'
  }
  
  if (industryRec[industry]) {
    recommendations.push(industryRec[industry])
  }
  
  return recommendations
}
