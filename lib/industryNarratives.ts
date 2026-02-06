interface CustomerInfo {
  name: string
  revenue: string
  ebitda: string
  industry: string
}

interface AgentResult {
  kpiName: string
  impactType: 'Revenue' | 'EBITDA'
  impactGBP: number
}

export function generateIndustryNarrative(
  industry: string,
  agentName: string,
  process: string,
  results: AgentResult[]
): string {
  const totalImpact = results.reduce((sum, r) => sum + r.impactGBP, 0)
  const revenueImpact = results.filter(r => r.impactType === 'Revenue').reduce((sum, r) => sum + r.impactGBP, 0)
  const ebitdaImpact = results.filter(r => r.impactType === 'EBITDA').reduce((sum, r) => sum + r.impactGBP, 0)
  
  const industryContexts: { [key: string]: string } = {
    'Technology': `In the fast-paced technology sector, ${agentName} addresses critical challenges in ${process.toLowerCase()} operations. Technology companies face intense competition and rapid innovation cycles, making operational efficiency and customer engagement paramount. This AI agent delivers $${totalImpact.toLocaleString('en-US')} in annual value by automating repetitive tasks and enabling teams to focus on innovation and strategic initiatives.`,
    
    'Financial Services': `The financial services industry demands precision, compliance, and exceptional customer service. ${agentName} transforms ${process.toLowerCase()} operations by ensuring regulatory compliance while improving efficiency. With $${totalImpact.toLocaleString('en-US')} in annual impact, this solution helps navigate complex regulatory environments while delivering superior client experiences and operational excellence.`,
    
    'Healthcare': `Healthcare organizations balance quality patient care with operational efficiency and regulatory compliance. ${agentName} optimizes ${process.toLowerCase()} workflows while maintaining the highest standards of care. The $${totalImpact.toLocaleString('en-US')} annual impact reflects improved patient outcomes, reduced administrative burden, and enhanced resource allocation across the care continuum.`,
    
    'Retail': `In retail's competitive landscape, customer experience and operational agility are key differentiators. ${agentName} enhances ${process.toLowerCase()} capabilities to meet evolving consumer expectations. The $${totalImpact.toLocaleString('en-US')} value creation stems from improved customer engagement, optimized inventory management, and data-driven decision making that drives both revenue growth and margin improvement.`,
    
    'Manufacturing': `Manufacturing excellence requires precision in ${process.toLowerCase()} operations and supply chain coordination. ${agentName} drives $${totalImpact.toLocaleString('en-US')} in annual value through enhanced production efficiency, reduced waste, and improved quality control. This automation enables manufacturers to compete globally while maintaining operational excellence.`,
    
    'Energy & Utilities': `The energy and utilities sector faces unique challenges balancing reliability, sustainability, and cost management. ${agentName} optimizes ${process.toLowerCase()} operations while supporting the transition to cleaner energy. With $${totalImpact.toLocaleString('en-US')} in annual impact, this solution improves asset utilization, enhances grid reliability, and supports regulatory compliance.`,
    
    'Telecommunications': `Telecommunications companies operate in a highly competitive, technology-intensive environment. ${agentName} transforms ${process.toLowerCase()} operations to improve customer retention and operational efficiency. The $${totalImpact.toLocaleString('en-US')} annual value reflects reduced churn, improved network performance, and enhanced customer satisfaction in a market where service quality drives competitive advantage.`,
    
    'Consumer Goods': `Consumer goods companies must balance brand value with operational efficiency across complex supply chains. ${agentName} optimizes ${process.toLowerCase()} operations while maintaining brand standards. Delivering $${totalImpact.toLocaleString('en-US')} annually, this agent improves market responsiveness, reduces time-to-market, and enhances consumer engagement.`,
    
    'Automotive': `The automotive industry is undergoing transformative change with electrification and autonomous technologies. ${agentName} modernizes ${process.toLowerCase()} operations to support this evolution. The $${totalImpact.toLocaleString('en-US')} impact comes from improved production efficiency, enhanced customer experience, and better supply chain visibility in an increasingly complex ecosystem.`,
    
    'Pharmaceuticals': `Pharmaceutical companies navigate stringent regulations while innovating to improve patient outcomes. ${agentName} enhances ${process.toLowerCase()} operations with precision and compliance. The $${totalImpact.toLocaleString('en-US')} annual value reflects accelerated processes, improved compliance, and enhanced collaboration while maintaining the highest quality standards.`,
    
    'Real Estate': `Real estate success depends on market insight, customer service, and operational efficiency. ${agentName} transforms ${process.toLowerCase()} operations to deliver superior client experiences. With $${totalImpact.toLocaleString('en-US')} in annual impact, this solution improves transaction velocity, enhances client satisfaction, and optimizes resource allocation.`,
    
    'Transportation & Logistics': `Transportation and logistics companies must optimize complex networks while managing costs and service levels. ${agentName} enhances ${process.toLowerCase()} operations with real-time intelligence. The $${totalImpact.toLocaleString('en-US')} value creation stems from improved route optimization, reduced delays, and enhanced customer visibility.`,
    
    'Media & Entertainment': `Media and entertainment companies face rapidly evolving content consumption patterns and intense competition. ${agentName} transforms ${process.toLowerCase()} operations to engage audiences effectively. Delivering $${totalImpact.toLocaleString('en-US')} annually, this agent improves content personalization, audience insights, and operational efficiency.`,
    
    'Professional Services': `Professional services firms differentiate through expertise and client relationships. ${agentName} elevates ${process.toLowerCase()} operations while preserving the human touch. The $${totalImpact.toLocaleString('en-US')} annual impact reflects improved client service, enhanced team productivity, and better resource utilization.`,
    
    'Hospitality & Tourism': `Hospitality and tourism companies thrive on exceptional guest experiences and operational excellence. ${agentName} enhances ${process.toLowerCase()} operations to exceed guest expectations. With $${totalImpact.toLocaleString('en-US')} in annual value, this solution improves guest satisfaction, optimizes resource allocation, and drives revenue growth.`
  }
  
  return industryContexts[industry] || `${agentName} delivers $${totalImpact.toLocaleString('en-US')} in annual value by optimizing ${process.toLowerCase()} operations through intelligent automation and data-driven insights.`
}

export function generateExecutiveSummary(
  industry: string,
  customerName: string,
  totalImpact: number,
  revenueImpact: number,
  ebitdaImpact: number,
  agentCount: number
): string {
  const customerDisplay = customerName || 'Your organization'
  
  if (!industry) {
    return `This analysis presents a comprehensive AI transformation roadmap for ${customerDisplay}, evaluating ${agentCount} intelligent agent${agentCount !== 1 ? 's' : ''} with combined annual financial impact of $${totalImpact.toLocaleString('en-US')}. The initiative balances revenue growth of $${revenueImpact.toLocaleString('en-US')} with operational efficiency improvements of $${ebitdaImpact.toLocaleString('en-US')}, positioning the organization for sustainable competitive advantage.`
  }
  
  const industryInsights: { [key: string]: string } = {
    'Technology': `${customerDisplay} operates in a technology sector characterized by rapid innovation and fierce competition. This AI transformation initiative addresses critical operational challenges while positioning for future growth. With ${agentCount} intelligent agent${agentCount !== 1 ? 's' : ''} delivering $${totalImpact.toLocaleString('en-US')} in annual value, the strategy combines $${revenueImpact.toLocaleString('en-US')} in revenue acceleration with $${ebitdaImpact.toLocaleString('en-US')} in operational excellence—critical for maintaining technology leadership.`,
    
    'Financial Services': `As a financial services organization, ${customerDisplay} faces heightened regulatory scrutiny and evolving customer expectations. This AI initiative delivers $${totalImpact.toLocaleString('en-US')} through ${agentCount} strategic agent${agentCount !== 1 ? 's' : ''}, balancing revenue growth ($${revenueImpact.toLocaleString('en-US')}) with operational efficiency ($${ebitdaImpact.toLocaleString('en-US')}). The approach ensures compliance while enhancing competitive position in an industry where trust and efficiency are paramount.`,
    
    'Healthcare': `${customerDisplay}'s position in healthcare requires balancing quality patient outcomes with operational sustainability. The ${agentCount} AI agent${agentCount !== 1 ? 's' : ''} analyzed deliver $${totalImpact.toLocaleString('en-US')} in annual value—$${revenueImpact.toLocaleString('en-US')} through enhanced service delivery and $${ebitdaImpact.toLocaleString('en-US')} via operational optimization. This transformation supports improved patient care while ensuring financial viability in a complex regulatory environment.`,
    
    'Retail': `In retail's rapidly evolving landscape, ${customerDisplay} must continuously adapt to changing consumer behaviors. This analysis evaluates ${agentCount} AI agent${agentCount !== 1 ? 's' : ''} generating $${totalImpact.toLocaleString('en-US')} in annual value. The balanced approach delivers $${revenueImpact.toLocaleString('en-US')} in revenue enhancement through better customer engagement, complemented by $${ebitdaImpact.toLocaleString('en-US')} in margin improvement through operational excellence.`,
    
    'Manufacturing': `For ${customerDisplay} in the manufacturing sector, operational precision and efficiency directly impact competitiveness. The ${agentCount} intelligent agent${agentCount !== 1 ? 's' : ''} deliver $${totalImpact.toLocaleString('en-US')} annually by optimizing production processes ($${ebitdaImpact.toLocaleString('en-US')}) while enabling revenue growth ($${revenueImpact.toLocaleString('en-US')}) through improved product quality and faster time-to-market.`,
    
    'Energy & Utilities': `Operating in the energy and utilities sector, ${customerDisplay} navigates regulatory complexity and infrastructure reliability requirements. This AI transformation roadmap evaluates ${agentCount} agent${agentCount !== 1 ? 's' : ''} with $${totalImpact.toLocaleString('en-US')} in combined value, balancing operational efficiency gains ($${ebitdaImpact.toLocaleString('en-US')}) with revenue optimization ($${revenueImpact.toLocaleString('en-US')}) while supporting sustainability objectives.`,
    
    'Telecommunications': `${customerDisplay} operates in telecommunications where network performance and customer experience drive competitive differentiation. The ${agentCount} AI agent${agentCount !== 1 ? 's' : ''} analyzed generate $${totalImpact.toLocaleString('en-US')} in annual value through enhanced customer retention ($${revenueImpact.toLocaleString('en-US')}) and operational efficiency ($${ebitdaImpact.toLocaleString('en-US')}), critical for success in a high-churn, technology-intensive market.`,
    
    'Consumer Goods': `As a consumer goods organization, ${customerDisplay} must balance brand value with operational efficiency. This initiative evaluates ${agentCount} intelligent agent${agentCount !== 1 ? 's' : ''} delivering $${totalImpact.toLocaleString('en-US')} annually—$${revenueImpact.toLocaleString('en-US')} through enhanced market responsiveness and $${ebitdaImpact.toLocaleString('en-US')} via supply chain optimization, crucial for maintaining brand position while improving profitability.`,
    
    'Automotive': `${customerDisplay}'s automotive operations face industry transformation with electrification and autonomous technologies. The ${agentCount} AI agent${agentCount !== 1 ? 's' : ''} deliver $${totalImpact.toLocaleString('en-US')} in value, combining manufacturing efficiency improvements ($${ebitdaImpact.toLocaleString('en-US')}) with revenue growth ($${revenueImpact.toLocaleString('en-US')}) through enhanced customer experience and innovation velocity.`,
    
    'Pharmaceuticals': `In pharmaceuticals, ${customerDisplay} must balance innovation with regulatory compliance and operational efficiency. This analysis of ${agentCount} AI agent${agentCount !== 1 ? 's' : ''} projects $${totalImpact.toLocaleString('en-US')} in annual value—$${revenueImpact.toLocaleString('en-US')} from accelerated processes and $${ebitdaImpact.toLocaleString('en-US')} from operational optimization, all while maintaining stringent quality standards.`,
    
    'Real Estate': `${customerDisplay}'s success in real estate depends on market insight and operational efficiency. The ${agentCount} intelligent agent${agentCount !== 1 ? 's' : ''} generate $${totalImpact.toLocaleString('en-US')} annually through improved transaction velocity ($${revenueImpact.toLocaleString('en-US')}) and optimized operations ($${ebitdaImpact.toLocaleString('en-US')}), enhancing competitive position in a relationship-driven market.`,
    
    'Transportation & Logistics': `Operating in transportation and logistics, ${customerDisplay} must optimize complex networks while managing costs. This AI transformation evaluates ${agentCount} agent${agentCount !== 1 ? 's' : ''} delivering $${totalImpact.toLocaleString('en-US')} through enhanced operational efficiency ($${ebitdaImpact.toLocaleString('en-US')}) and service quality improvements ($${revenueImpact.toLocaleString('en-US')}).`,
    
    'Media & Entertainment': `${customerDisplay} navigates rapidly evolving content consumption patterns in media and entertainment. The ${agentCount} AI agent${agentCount !== 1 ? 's' : ''} analyzed project $${totalImpact.toLocaleString('en-US')} in value through improved audience engagement ($${revenueImpact.toLocaleString('en-US')}) and operational efficiency ($${ebitdaImpact.toLocaleString('en-US')}), critical for success in a disrupted industry.`,
    
    'Professional Services': `For ${customerDisplay} in professional services, expertise and client relationships drive success. This initiative evaluates ${agentCount} intelligent agent${agentCount !== 1 ? 's' : ''} generating $${totalImpact.toLocaleString('en-US')} annually—$${revenueImpact.toLocaleString('en-US')} from enhanced client service and $${ebitdaImpact.toLocaleString('en-US')} from improved team productivity.`,
    
    'Hospitality & Tourism': `${customerDisplay}'s hospitality and tourism operations thrive on exceptional guest experiences. The ${agentCount} AI agent${agentCount !== 1 ? 's' : ''} deliver $${totalImpact.toLocaleString('en-US')} in value by enhancing guest satisfaction ($${revenueImpact.toLocaleString('en-US')}) while optimizing operations ($${ebitdaImpact.toLocaleString('en-US')}), crucial for differentiation in this competitive sector.`
  }
  
  return industryInsights[industry] || `This analysis presents a comprehensive AI transformation roadmap for ${customerDisplay}, evaluating ${agentCount} intelligent agent${agentCount !== 1 ? 's' : ''} with combined annual financial impact of $${totalImpact.toLocaleString('en-US')}. The initiative balances revenue growth of $${revenueImpact.toLocaleString('en-US')} with operational efficiency improvements of $${ebitdaImpact.toLocaleString('en-US')}, positioning the organization for sustainable competitive advantage.`
}
