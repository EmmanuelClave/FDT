import {
  KPIResult,
  KPIDetail,
  MoreLeadsInputs,
  ImprovedLeadConversionInputs,
  ImprovedWinRateInputs,
  IncreasedDealSizeInputs,
  AcceleratedSalesCycleInputs,
  SellerTimeSavingsInputs,
  AverageHandlingTimeInputs,
  FirstCallResolutionInputs,
  IssueResolutionTimeInputs,
  ChannelShiftInputs,
  CaseVolumeReductionInputs,
  AgencySpendInputs,
  CostPerLeadInputs,
  RevenuePerLeadInputs,
  BrandValueIncreaseInputs,
  CustomerRetentionInputs,
  LeadsGeneratedInputs,
  FinanceOutsourcingSpendInputs,
  CostPerAnalysisInputs,
  ReconciliationTimeInputs,
  ComplianceRateInputs,
  DaysSalesOutstandingInputs,
  AnalysisTimeInputs,
  InventoryTurnoverInputs,
  OnTimeDeliveryInputs,
  OrderAccuracyInputs,
  CashToCashCycleInputs,
  FreightCostPerUnitInputs,
  SupplyChainDSOInputs,
  FillRateInputs,
  ITOutsourcingCostsInputs,
  ITIssueResolutionTimeInputs,
  ShadowITRiskInputs,
  ApplicationDowntimeInputs,
  ContractReviewTimeInputs,
  LegalResearchTimeInputs,
  ComplianceAuditEfficiencyInputs,
  ExternalCounselSpendInputs
} from '@/types'

/**
 * KPI 1 — More Leads
 * Calculates the impact of generating more leads through agent assistance
 */
export function calculateMoreLeads(inputs: MoreLeadsInputs): KPIResult {
  const { currentLeads, leadConversionRate, opportunityWinRate, averageDealSize, incrementPct } = inputs

  const incrementalLeads = currentLeads * incrementPct
  const additionalOpportunities = incrementalLeads * leadConversionRate
  const additionalDeals = additionalOpportunities * opportunityWinRate
  const impactGBP = additionalDeals * averageDealSize

  const details: KPIDetail[] = [
    { label: 'Incremental Leads', value: Math.round(incrementalLeads) },
    { label: 'Additional Opportunities', value: Math.round(additionalOpportunities) },
    { label: 'Additional Deals', value: Math.round(additionalDeals) },
  ]

  return {
    kpiName: 'More Leads',
    details,
    impactGBP,
    impactType: 'Revenue',
  }
}

/**
 * KPI 2 — Improved Lead Conversion
 * Calculates the impact of optimizing lead-to-opportunity conversion rate
 */
export function calculateImprovedLeadConversion(inputs: ImprovedLeadConversionInputs): KPIResult {
  const { currentLeads, leadConversionRate, opportunityWinRate, averageDealSize, optimisationPct } = inputs

  const optimizedCR = leadConversionRate * (1 + optimisationPct)
  const additionalOpportunities = (optimizedCR - leadConversionRate) * currentLeads
  const additionalDeals = additionalOpportunities * opportunityWinRate
  const impactGBP = additionalDeals * averageDealSize

  const details: KPIDetail[] = [
    { label: 'Optimized Conversion Rate', value: `${(optimizedCR * 100).toFixed(1)}%` },
    { label: 'Additional Opportunities', value: Math.round(additionalOpportunities) },
    { label: 'Additional Deals', value: Math.round(additionalDeals) },
  ]

  return {
    kpiName: 'Improved Lead Conversion',
    details,
    impactGBP,
    impactType: 'Revenue',
  }
}

/**
 * KPI 3 — Improved Win Rate
 * Calculates the impact of optimizing opportunity-to-deal win rate
 */
export function calculateImprovedWinRate(inputs: ImprovedWinRateInputs): KPIResult {
  const { opportunitiesPerSeller, opportunityWinRate, averageDealSize, numberOfSellers, optimisationPct } = inputs

  const totalOpportunities = opportunitiesPerSeller * numberOfSellers
  const baselineDeals = totalOpportunities * opportunityWinRate
  const optimizedWinRate = opportunityWinRate + (opportunityWinRate * optimisationPct)
  const optimizedDeals = totalOpportunities * optimizedWinRate
  const additionalDeals = optimizedDeals - baselineDeals
  const impactGBP = additionalDeals * averageDealSize

  const details: KPIDetail[] = [
    { label: 'Total Opportunities', value: Math.round(totalOpportunities) },
    { label: 'Optimized Win Rate', value: `${(optimizedWinRate * 100).toFixed(1)}%` },
    { label: 'Additional Deals', value: Math.round(additionalDeals) },
  ]

  return {
    kpiName: 'Improved Win Rate',
    details,
    impactGBP,
    impactType: 'Revenue',
  }
}

/**
 * KPI 4 — Increased Deal Size
 * Calculates the impact of uplifting average deal size
 */
export function calculateIncreasedDealSize(inputs: IncreasedDealSizeInputs): KPIResult {
  const { opportunitiesPerSeller, opportunityWinRate, averageDealSize, numberOfSellers, upliftPct } = inputs

  const totalOpportunities = opportunitiesPerSeller * numberOfSellers
  const baselineDeals = totalOpportunities * opportunityWinRate
  const upliftedDealSize = averageDealSize * (1 + upliftPct)
  const impactGBP = baselineDeals * (upliftedDealSize - averageDealSize)

  const details: KPIDetail[] = [
    { label: 'Total Opportunities', value: Math.round(totalOpportunities) },
    { label: 'Baseline Deals', value: Math.round(baselineDeals) },
    { label: 'Uplifted Deal Size', value: formatCurrency(upliftedDealSize) },
  ]

  return {
    kpiName: 'Increased Deal Size',
    details,
    impactGBP,
    impactType: 'Revenue',
  }
}

/**
 * KPI 5 — Accelerated Sales Cycle
 * Calculates the impact of shortening the sales cycle
 */
export function calculateAcceleratedSalesCycle(inputs: AcceleratedSalesCycleInputs): KPIResult {
  const { salesCycleLengthDays, opportunitiesPerSeller, opportunityWinRate, averageDealSize, numberOfSellers, daysReduction } = inputs

  const totalOpportunities = opportunitiesPerSeller * numberOfSellers
  const baselineDeals = totalOpportunities * opportunityWinRate
  
  // Calculate capacity increase from faster sales cycle
  const improvedCycleDays = salesCycleLengthDays - daysReduction
  const capacityIncreaseFactor = salesCycleLengthDays / improvedCycleDays
  const additionalDeals = baselineDeals * (capacityIncreaseFactor - 1)
  const impactGBP = additionalDeals * averageDealSize

  const details: KPIDetail[] = [
    { label: 'Improved Cycle (days)', value: improvedCycleDays },
    { label: 'Capacity Increase', value: `${((capacityIncreaseFactor - 1) * 100).toFixed(1)}%` },
    { label: 'Additional Deals', value: additionalDeals.toFixed(0) },
  ]

  return {
    kpiName: 'Accelerated Sales Cycle',
    details,
    impactGBP,
    impactType: 'Revenue',
  }
}

/**
 * KPI 6 — Seller Time Savings
 * Calculates the impact of saving seller time through automation
 */
export function calculateSellerTimeSavings(inputs: SellerTimeSavingsInputs): KPIResult {
  const { hoursPerWeekLowValueTasks, numberOfOpportunities, opportunityWinRate, averageDealSize, numberOfSellers, productivityRecaptureRate, optimisedHours } = inputs

  // Calculate baseline wins per seller
  const baselineWins = numberOfOpportunities * opportunityWinRate
  
  // Calculate percentage of low value tasks saved
  const percentageLowValueTasksSaved = optimisedHours / hoursPerWeekLowValueTasks
  
  // Apply productivity recapture rate
  const effectiveCapacityIncrease = percentageLowValueTasksSaved * productivityRecaptureRate
  
  // Calculate incremental wins per seller
  const incrementalWinsPerSeller = baselineWins * effectiveCapacityIncrease
  
  // Calculate total incremental wins across all sellers
  const totalIncrementalWins = incrementalWinsPerSeller * numberOfSellers
  
  // Calculate annual revenue impact (52 weeks)
  const impactGBP = totalIncrementalWins * averageDealSize * 52

  const details: KPIDetail[] = [
    { label: 'Baseline Wins/Seller/Week', value: baselineWins.toFixed(1) },
    { label: 'Low Value Tasks Saved', value: `${(percentageLowValueTasksSaved * 100).toFixed(1)}%` },
    { label: 'Incremental Wins/Year', value: (totalIncrementalWins * 52).toFixed(0) },
  ]

  return {
    kpiName: 'Seller Time Savings',
    details,
    impactGBP,
    impactType: 'Revenue',
  }
}

/**
 * Format currency in UK locale (£)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * SERVICE KPI 1 — Average Handling Time Reduction
 * Calculates savings from reducing average handling time per case
 */
export function calculateAverageHandlingTime(inputs: AverageHandlingTimeInputs): KPIResult {
  const { currentAHTMinutes, casesPerMonth, agentHourlyCost, ahtReductionPct } = inputs

  const reducedAHTMinutes = currentAHTMinutes * (1 - ahtReductionPct)
  const timeSavedPerCaseMinutes = currentAHTMinutes - reducedAHTMinutes
  const totalTimeSavedHours = (timeSavedPerCaseMinutes * casesPerMonth) / 60
  const monthlySavings = totalTimeSavedHours * agentHourlyCost
  const impactGBP = monthlySavings * 12

  const details: KPIDetail[] = [
    { label: 'Current AHT', value: `${currentAHTMinutes.toFixed(1)} min` },
    { label: 'Reduced AHT', value: `${reducedAHTMinutes.toFixed(1)} min` },
    { label: 'Time Saved Per Case', value: `${timeSavedPerCaseMinutes.toFixed(1)} min` },
    { label: 'Total Hours Saved/Month', value: Math.round(totalTimeSavedHours) },
    { label: 'Monthly Savings', value: formatCurrency(monthlySavings) },
  ]

  return {
    kpiName: 'Average Handling Time Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA',
  }
}

/**
 * SERVICE KPI 2 — First Call Resolution Improvement
 * Calculates savings from improving first call resolution rate (reducing repeat contacts)
 */
export function calculateFirstCallResolution(inputs: FirstCallResolutionInputs): KPIResult {
  const { currentFCRRate, totalCasesPerMonth, costPerCase, fcrImprovementPct } = inputs

  const improvedFCRRate = currentFCRRate * (1 + fcrImprovementPct)
  const fcrRateIncrease = improvedFCRRate - currentFCRRate
  const repeatContactsAvoided = totalCasesPerMonth * fcrRateIncrease
  const monthlySavings = repeatContactsAvoided * costPerCase
  const impactGBP = monthlySavings * 12

  const details: KPIDetail[] = [
    { label: 'Current FCR Rate', value: `${(currentFCRRate * 100).toFixed(1)}%` },
    { label: 'Improved FCR Rate', value: `${(improvedFCRRate * 100).toFixed(1)}%` },
    { label: 'Repeat Contacts Avoided/Month', value: Math.round(repeatContactsAvoided) },
    { label: 'Monthly Savings', value: formatCurrency(monthlySavings) },
  ]

  return {
    kpiName: 'First Call Resolution Improvement',
    details,
    impactGBP,
    impactType: 'EBITDA',
  }
}

/**
 * SERVICE KPI 3 — Issue Resolution Time Reduction
 * Calculates value from reducing time to resolve customer issues
 */
export function calculateIssueResolutionTime(inputs: IssueResolutionTimeInputs): KPIResult {
  const { currentResolutionHours, issuesPerMonth, customerImpactCostPerHour, resolutionTimeReductionPct } = inputs

  const reducedResolutionHours = currentResolutionHours * (1 - resolutionTimeReductionPct)
  const hoursSavedPerIssue = currentResolutionHours - reducedResolutionHours
  const totalHoursSaved = hoursSavedPerIssue * issuesPerMonth
  const monthlySavings = totalHoursSaved * customerImpactCostPerHour
  const impactGBP = monthlySavings * 12

  const details: KPIDetail[] = [
    { label: 'Current Resolution Time', value: `${currentResolutionHours.toFixed(1)} hrs` },
    { label: 'Reduced Resolution Time', value: `${reducedResolutionHours.toFixed(1)} hrs` },
    { label: 'Hours Saved Per Issue', value: `${hoursSavedPerIssue.toFixed(1)} hrs` },
    { label: 'Total Hours Saved/Month', value: Math.round(totalHoursSaved) },
    { label: 'Monthly Value', value: formatCurrency(monthlySavings) },
  ]

  return {
    kpiName: 'Issue Resolution Time Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA',
  }
}

/**
 * SERVICE KPI 4 — Channel Shift to Low-Cost
 * Calculates savings from shifting cases from human agents to low-cost channels (chatbot, self-service, etc.)
 */
export function calculateChannelShift(inputs: ChannelShiftInputs): KPIResult {
  const { totalCasesPerMonth, pctHandledByHumans, humanHandlingCost, lowCostChannelCost, shiftPct } = inputs

  const humanHandledCases = totalCasesPerMonth * pctHandledByHumans
  const casesShifted = humanHandledCases * shiftPct
  const costSavingsPerCase = humanHandlingCost - lowCostChannelCost
  const monthlySavings = casesShifted * costSavingsPerCase
  const impactGBP = monthlySavings * 12

  const details: KPIDetail[] = [
    { label: 'Current Human-Handled Cases', value: Math.round(humanHandledCases) },
    { label: 'Cases Shifted to Low-Cost', value: Math.round(casesShifted) },
    { label: 'Savings Per Case', value: formatCurrency(costSavingsPerCase) },
    { label: 'Monthly Savings', value: formatCurrency(monthlySavings) },
  ]

  return {
    kpiName: 'Channel Shift to Low-Cost',
    details,
    impactGBP,
    impactType: 'EBITDA',
  }
}

/**
 * SERVICE KPI 5 — Case Volume Reduction
 * Calculates savings from proactively reducing the number of support cases
 */
export function calculateCaseVolumeReduction(inputs: CaseVolumeReductionInputs): KPIResult {
  const { currentCaseVolume, costPerCase, volumeReductionPct } = inputs

  const casesReduced = currentCaseVolume * volumeReductionPct
  const monthlySavings = casesReduced * costPerCase
  const impactGBP = monthlySavings * 12

  const details: KPIDetail[] = [
    { label: 'Current Monthly Cases', value: Math.round(currentCaseVolume) },
    { label: 'Cases Reduced', value: Math.round(casesReduced) },
    { label: 'New Monthly Cases', value: Math.round(currentCaseVolume - casesReduced) },
    { label: 'Monthly Savings', value: formatCurrency(monthlySavings) },
  ]

  return {
    kpiName: 'Case Volume Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA',
  }
}

/**
 * MARKETING KPI 1 — Agency Spend Reduction
 * Calculates savings from reducing reliance on external agencies through AI automation
 */
export function calculateAgencySpend(inputs: AgencySpendInputs): KPIResult {
  const { currentAgencySpendPerMonth, agencyTasksPerMonth, automationPct, costSavingsPct } = inputs

  const tasksAutomated = agencyTasksPerMonth * automationPct
  const monthlySavings = currentAgencySpendPerMonth * automationPct * costSavingsPct
  const impactGBP = monthlySavings * 12

  const details: KPIDetail[] = [
    { label: 'Current Monthly Spend', value: formatCurrency(currentAgencySpendPerMonth) },
    { label: 'Tasks Automated', value: Math.round(tasksAutomated) },
    { label: 'Monthly Savings', value: formatCurrency(monthlySavings) },
  ]

  return {
    kpiName: 'Agency Spend Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA',
  }
}

/**
 * MARKETING KPI 2 — Cost Per Lead Reduction
 * Calculates savings from improving marketing efficiency and reducing cost per lead
 */
export function calculateCostPerLead(inputs: CostPerLeadInputs): KPIResult {
  const { totalMarketingSpendPerMonth, leadsGeneratedPerMonth, costReductionPct } = inputs

  const currentCostPerLead = totalMarketingSpendPerMonth / leadsGeneratedPerMonth
  const newCostPerLead = currentCostPerLead * (1 - costReductionPct)
  const savingsPerLead = currentCostPerLead - newCostPerLead
  const monthlySavings = savingsPerLead * leadsGeneratedPerMonth
  const impactGBP = monthlySavings * 12

  const details: KPIDetail[] = [
    { label: 'Current Cost Per Lead', value: formatCurrency(currentCostPerLead) },
    { label: 'New Cost Per Lead', value: formatCurrency(newCostPerLead) },
    { label: 'Savings Per Lead', value: formatCurrency(savingsPerLead) },
    { label: 'Monthly Savings', value: formatCurrency(monthlySavings) },
  ]

  return {
    kpiName: 'Cost Per Lead Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA',
  }
}

/**
 * MARKETING KPI 3 — Revenue Per Lead Increase
 * Calculates revenue impact from improving lead quality and conversion
 */
export function calculateRevenuePerLead(inputs: RevenuePerLeadInputs): KPIResult {
  const { leadsPerMonth, conversionRate, averageRevenuePerCustomer, revenueImprovementPct } = inputs

  const currentRevenuePerLead = conversionRate * averageRevenuePerCustomer
  const newRevenuePerLead = currentRevenuePerLead * (1 + revenueImprovementPct)
  const additionalRevenuePerLead = newRevenuePerLead - currentRevenuePerLead
  const monthlyAdditionalRevenue = additionalRevenuePerLead * leadsPerMonth
  const impactGBP = monthlyAdditionalRevenue * 12

  const details: KPIDetail[] = [
    { label: 'Current Revenue/Lead', value: formatCurrency(currentRevenuePerLead) },
    { label: 'New Revenue/Lead', value: formatCurrency(newRevenuePerLead) },
    { label: 'Additional Revenue/Lead', value: formatCurrency(additionalRevenuePerLead) },
    { label: 'Monthly Revenue Increase', value: formatCurrency(monthlyAdditionalRevenue) },
  ]

  return {
    kpiName: 'Revenue Per Lead Increase',
    details,
    impactGBP,
    impactType: 'Revenue',
  }
}

/**
 * MARKETING KPI 4 — Brand Value Increase
 * Calculates revenue impact from improved brand awareness and positioning
 */
export function calculateBrandValueIncrease(inputs: BrandValueIncreaseInputs): KPIResult {
  const { currentBrandValue, brandAwarenessGrowthPct, revenueMultiplier } = inputs

  const brandValueIncrease = currentBrandValue * brandAwarenessGrowthPct
  const impactGBP = brandValueIncrease * revenueMultiplier

  const details: KPIDetail[] = [
    { label: 'Current Brand Value', value: formatCurrency(currentBrandValue) },
    { label: 'Brand Awareness Growth', value: `${(brandAwarenessGrowthPct * 100).toFixed(1)}%` },
    { label: 'Brand Value Increase', value: formatCurrency(brandValueIncrease) },
    { label: 'Revenue Multiplier', value: `${revenueMultiplier.toFixed(2)}x` },
  ]

  return {
    kpiName: 'Brand Value Increase',
    details,
    impactGBP,
    impactType: 'Revenue',
  }
}

/**
 * MARKETING KPI 5 — Customer Retention Improvement
 * Calculates revenue impact from improving customer retention through better engagement
 */
export function calculateCustomerRetention(inputs: CustomerRetentionInputs): KPIResult {
  const { totalCustomers, currentRetentionRate, averageRevenuePerCustomer, retentionImprovementPct } = inputs

  const currentRetainedCustomers = totalCustomers * currentRetentionRate
  const newRetentionRate = currentRetentionRate * (1 + retentionImprovementPct)
  const newRetainedCustomers = totalCustomers * newRetentionRate
  const additionalRetainedCustomers = newRetainedCustomers - currentRetainedCustomers
  const impactGBP = additionalRetainedCustomers * averageRevenuePerCustomer

  const details: KPIDetail[] = [
    { label: 'Current Retention Rate', value: `${(currentRetentionRate * 100).toFixed(1)}%` },
    { label: 'New Retention Rate', value: `${(newRetentionRate * 100).toFixed(1)}%` },
    { label: 'Additional Retained Customers', value: Math.round(additionalRetainedCustomers) },
    { label: 'Avg Revenue Per Customer', value: formatCurrency(averageRevenuePerCustomer) },
  ]

  return {
    kpiName: 'Customer Retention Improvement',
    details,
    impactGBP,
    impactType: 'Revenue',
  }
}

/**
 * MARKETING KPI 6 — Leads Generated Increase
 * Calculates revenue impact from generating more qualified leads through AI-powered campaigns
 */
export function calculateLeadsGenerated(inputs: LeadsGeneratedInputs): KPIResult {
  const { currentLeadsPerMonth, conversionRate, averageRevenuePerCustomer, leadGrowthPct } = inputs

  const additionalLeads = currentLeadsPerMonth * leadGrowthPct
  const additionalCustomers = additionalLeads * conversionRate
  const monthlyAdditionalRevenue = additionalCustomers * averageRevenuePerCustomer
  const impactGBP = monthlyAdditionalRevenue * 12

  const details: KPIDetail[] = [
    { label: 'Current Monthly Leads', value: Math.round(currentLeadsPerMonth) },
    { label: 'Additional Leads', value: Math.round(additionalLeads) },
    { label: 'Additional Customers', value: Math.round(additionalCustomers) },
    { label: 'Monthly Revenue Increase', value: formatCurrency(monthlyAdditionalRevenue) },
  ]

  return {
    kpiName: 'Leads Generated Increase',
    details,
    impactGBP,
    impactType: 'Revenue',
  }
}

// Finance KPI Calculations
export function calculateFinanceOutsourcingSpend(inputs: FinanceOutsourcingSpendInputs) {
  // Agent automates outsourced tasks, reducing external vendor costs
  const annualOutsourcingSpend = inputs.currentOutsourcingSpendPerMonth * 12
  const tasksAutomated = inputs.outsourcedTasksPerMonth * (inputs.automationPct / 100)
  const costSavings = annualOutsourcingSpend * (inputs.costSavingsPct / 100)
  const impactGBP = costSavings

  const details: KPIDetail[] = [
    { label: 'Current Annual Outsourcing Spend', value: formatCurrency(annualOutsourcingSpend) },
    { label: 'Tasks Automated (Monthly)', value: Math.round(tasksAutomated) },
    { label: 'Cost Savings %', value: `${inputs.costSavingsPct}%` },
    { label: 'Annual Cost Savings', value: formatCurrency(costSavings) },
  ]

  return {
    kpiName: 'Finance Outsourcing Spend Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

export function calculateCostPerAnalysis(inputs: CostPerAnalysisInputs) {
  // Agent reduces time and resources needed per analysis request
  const currentAnnualCost = inputs.totalAnalysisRequestsPerMonth * inputs.currentCostPerAnalysis * 12
  const newCostPerAnalysis = inputs.currentCostPerAnalysis * (1 - inputs.efficiencyImprovementPct / 100)
  const newAnnualCost = inputs.totalAnalysisRequestsPerMonth * newCostPerAnalysis * 12
  const costSavings = currentAnnualCost - newAnnualCost
  const impactGBP = costSavings

  const details: KPIDetail[] = [
    { label: 'Current Cost Per Analysis', value: formatCurrency(inputs.currentCostPerAnalysis) },
    { label: 'New Cost Per Analysis', value: formatCurrency(newCostPerAnalysis) },
    { label: 'Annual Analysis Requests', value: inputs.totalAnalysisRequestsPerMonth * 12 },
    { label: 'Annual Cost Savings', value: formatCurrency(costSavings) },
  ]

  return {
    kpiName: 'Cost Per Analysis Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

export function calculateAnalysisTime(inputs: AnalysisTimeInputs) {
  // Agent accelerates financial analysis through automated data gathering and insights
  const currentMonthlyHours = inputs.analysisRequestsPerMonth * inputs.currentAnalysisTimeHours
  const timeSaved = currentMonthlyHours * (inputs.timeReductionPct / 100)
  const costSavings = timeSaved * inputs.analystHourlyCost * 12
  const impactGBP = costSavings

  const details: KPIDetail[] = [
    { label: 'Monthly Analysis Hours', value: Math.round(currentMonthlyHours) },
    { label: 'Time Reduction %', value: `${inputs.timeReductionPct}%` },
    { label: 'Annual Hours Saved', value: Math.round(timeSaved * 12) },
    { label: 'Annual Cost Savings', value: formatCurrency(costSavings) },
  ]

  return {
    kpiName: 'Analysis Time Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

export function calculateReconciliationTime(inputs: ReconciliationTimeInputs) {
  // Agent automates reconciliation process, reducing manual effort
  const currentMonthlyHours = inputs.reconciliationsPerMonth * inputs.currentTimePerReconciliationHours
  const timeSaved = currentMonthlyHours * (inputs.timeReductionPct / 100)
  const costSavings = timeSaved * inputs.analystHourlyCost * 12
  const impactGBP = costSavings

  const details: KPIDetail[] = [
    { label: 'Monthly Reconciliations', value: inputs.reconciliationsPerMonth },
    { label: 'Time Reduction %', value: `${inputs.timeReductionPct}%` },
    { label: 'Annual Hours Saved', value: Math.round(timeSaved * 12) },
    { label: 'Annual Cost Savings', value: formatCurrency(costSavings) },
  ]

  return {
    kpiName: 'Reconciliation Time Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

export function calculateDaysSalesOutstanding(inputs: DaysSalesOutstandingInputs) {
  // Agent accelerates collections and reduces payment delays, improving cash flow
  const dailyRevenue = inputs.annualRevenue / 365
  const currentOutstanding = dailyRevenue * inputs.currentDSO
  const newDSO = inputs.currentDSO - inputs.dsoReductionDays
  const newOutstanding = dailyRevenue * newDSO
  const cashFreed = currentOutstanding - newOutstanding
  const revenueImpact = cashFreed * (inputs.costOfCapitalPct / 100)
  const impactGBP = revenueImpact

  const details: KPIDetail[] = [
    { label: 'Current DSO (Days)', value: inputs.currentDSO },
    { label: 'New DSO (Days)', value: Math.round(newDSO) },
    { label: 'Cash Flow Improvement', value: formatCurrency(cashFreed) },
    { label: 'Annual Revenue Impact', value: formatCurrency(revenueImpact) },
  ]

  return {
    kpiName: 'Days Sales Outstanding Reduction',
    details,
    impactGBP,
    impactType: 'Revenue' as const,
  }
}

export function calculateComplianceRate(inputs: ComplianceRateInputs) {
  // Agent improves compliance monitoring, reducing violations and penalties
  const currentViolations = inputs.totalTransactions * (1 - inputs.currentComplianceRate / 100)
  const improvedRate = Math.min(100, inputs.currentComplianceRate + inputs.complianceImprovementPct)
  const newViolations = inputs.totalTransactions * (1 - improvedRate / 100)
  const violationsAvoided = currentViolations - newViolations
  const costSavings = violationsAvoided * inputs.penaltyCostPerViolation
  const impactGBP = costSavings

  const details: KPIDetail[] = [
    { label: 'Current Compliance Rate', value: `${inputs.currentComplianceRate}%` },
    { label: 'Improved Compliance Rate', value: `${improvedRate.toFixed(1)}%` },
    { label: 'Violations Avoided', value: Math.round(violationsAvoided) },
    { label: 'Annual Cost Savings', value: formatCurrency(costSavings) },
  ]

  return {
    kpiName: 'Compliance Rate Improvement',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * SUPPLY CHAIN KPIs
 */

/**
 * Inventory Turnover Improvement
 * Optimize inventory levels by improving turnover rates, reducing holding costs
 */
export function calculateInventoryTurnover(inputs: InventoryTurnoverInputs): KPIResult {
  const { annualCOGS, currentInventoryValue, currentTurnover, improvementPct, holdingCostRate } = inputs

  const newTurnover = currentTurnover * (1 + improvementPct)
  const newInventoryValue = annualCOGS / newTurnover
  const inventoryReduction = currentInventoryValue - newInventoryValue
  const holdingCostSavings = inventoryReduction * holdingCostRate
  const impactGBP = holdingCostSavings

  const details: KPIDetail[] = [
    { label: 'Current Turnover', value: `${currentTurnover.toFixed(1)}x` },
    { label: 'Improved Turnover', value: `${newTurnover.toFixed(1)}x` },
    { label: 'Inventory Reduction', value: formatCurrency(inventoryReduction) },
    { label: 'Annual Holding Cost Savings', value: formatCurrency(holdingCostSavings) },
  ]

  return {
    kpiName: 'Inventory Turnover Improvement',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * On-Time Delivery (OTD) Improvement
 * Increase delivery reliability and customer satisfaction through better logistics
 */
export function calculateOnTimeDelivery(inputs: OnTimeDeliveryInputs): KPIResult {
  const { totalDeliveriesPerMonth, currentOTDRate, costPerLateDelivery, otdImprovementPct, revenuePerDelivery } = inputs

  const currentLateDeliveries = totalDeliveriesPerMonth * (1 - currentOTDRate)
  const improvedOTDRate = Math.min(1, currentOTDRate + otdImprovementPct)
  const newLateDeliveries = totalDeliveriesPerMonth * (1 - improvedOTDRate)
  const lateDeliveriesReduced = currentLateDeliveries - newLateDeliveries
  
  // Cost savings from fewer late deliveries
  const costSavings = lateDeliveriesReduced * costPerLateDelivery * 12
  
  // Revenue impact from improved customer satisfaction
  const revenueImpact = lateDeliveriesReduced * revenuePerDelivery * 0.15 * 12 // 15% retention improvement
  
  const impactGBP = costSavings + revenueImpact

  const details: KPIDetail[] = [
    { label: 'Current OTD Rate', value: `${(currentOTDRate * 100).toFixed(1)}%` },
    { label: 'Improved OTD Rate', value: `${(improvedOTDRate * 100).toFixed(1)}%` },
    { label: 'Late Deliveries Reduced/Month', value: Math.round(lateDeliveriesReduced) },
    { label: 'Annual Cost Savings', value: formatCurrency(costSavings) },
    { label: 'Annual Revenue Impact', value: formatCurrency(revenueImpact) },
  ]

  return {
    kpiName: 'On-Time Delivery Improvement',
    details,
    impactGBP,
    impactType: 'Revenue' as const,
  }
}

/**
 * Order Accuracy Improvement
 * Reduce errors in order processing and fulfillment
 */
export function calculateOrderAccuracy(inputs: OrderAccuracyInputs): KPIResult {
  const { totalOrdersPerMonth, currentAccuracyRate, costPerError, accuracyImprovementPct } = inputs

  const currentErrors = totalOrdersPerMonth * (1 - currentAccuracyRate)
  const improvedAccuracyRate = Math.min(1, currentAccuracyRate + accuracyImprovementPct)
  const newErrors = totalOrdersPerMonth * (1 - improvedAccuracyRate)
  const errorsReduced = currentErrors - newErrors
  const costSavings = errorsReduced * costPerError * 12
  const impactGBP = costSavings

  const details: KPIDetail[] = [
    { label: 'Current Accuracy Rate', value: `${(currentAccuracyRate * 100).toFixed(1)}%` },
    { label: 'Improved Accuracy Rate', value: `${(improvedAccuracyRate * 100).toFixed(1)}%` },
    { label: 'Errors Reduced/Month', value: Math.round(errorsReduced) },
    { label: 'Annual Cost Savings', value: formatCurrency(costSavings) },
  ]

  return {
    kpiName: 'Order Accuracy Improvement',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * Cash-to-Cash Cycle Time Reduction
 * Accelerate cash flow by reducing the time between paying suppliers and receiving customer payments
 */
export function calculateCashToCashCycle(inputs: CashToCashCycleInputs): KPIResult {
  const { annualRevenue, currentCycleDays, cycleReductionDays, costOfCapitalPct } = inputs

  const dailyRevenue = annualRevenue / 365
  const cashFreed = dailyRevenue * cycleReductionDays
  const annualSavings = cashFreed * costOfCapitalPct
  const newCycleDays = currentCycleDays - cycleReductionDays
  const impactGBP = annualSavings

  const details: KPIDetail[] = [
    { label: 'Current Cycle Time', value: `${currentCycleDays} days` },
    { label: 'Improved Cycle Time', value: `${newCycleDays} days` },
    { label: 'Cash Freed Up', value: formatCurrency(cashFreed) },
    { label: 'Annual Savings', value: formatCurrency(annualSavings) },
  ]

  return {
    kpiName: 'Cash-to-Cash Cycle Time Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * Freight Cost Per Unit Reduction
 * Optimize logistics and routing to reduce transportation costs
 */
export function calculateFreightCostPerUnit(inputs: FreightCostPerUnitInputs): KPIResult {
  const { unitsShippedPerMonth, currentFreightCostPerUnit, costReductionPct } = inputs

  const costReduction = currentFreightCostPerUnit * costReductionPct
  const newCostPerUnit = currentFreightCostPerUnit - costReduction
  const monthlySavings = costReduction * unitsShippedPerMonth
  const annualSavings = monthlySavings * 12
  const impactGBP = annualSavings

  const details: KPIDetail[] = [
    { label: 'Current Cost/Unit', value: formatCurrency(currentFreightCostPerUnit, 2) },
    { label: 'Improved Cost/Unit', value: formatCurrency(newCostPerUnit, 2) },
    { label: 'Cost Reduction/Unit', value: formatCurrency(costReduction, 2) },
    { label: 'Annual Savings', value: formatCurrency(annualSavings) },
  ]

  return {
    kpiName: 'Freight Cost Per Unit Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * Days Sales Outstanding Reduction (Supply Chain)
 * Accelerate cash collection from customers
 */
export function calculateSupplyChainDSO(inputs: SupplyChainDSOInputs): KPIResult {
  const { annualRevenue, currentDSO, dsoReductionDays, costOfCapitalPct } = inputs

  const dailyRevenue = annualRevenue / 365
  const cashFreed = dailyRevenue * dsoReductionDays
  const annualSavings = cashFreed * costOfCapitalPct
  const newDSO = currentDSO - dsoReductionDays
  const impactGBP = annualSavings

  const details: KPIDetail[] = [
    { label: 'Current DSO', value: `${currentDSO} days` },
    { label: 'Improved DSO', value: `${newDSO} days` },
    { label: 'Cash Freed Up', value: formatCurrency(cashFreed) },
    { label: 'Annual Savings', value: formatCurrency(annualSavings) },
  ]

  return {
    kpiName: 'Days Sales Outstanding Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * Fill Rate Improvement
 * Increase order fulfillment success rate and customer satisfaction
 */
export function calculateFillRate(inputs: FillRateInputs): KPIResult {
  const { totalOrdersPerMonth, currentFillRate, revenuePerOrder, fillRateImprovementPct, lostSaleCostFactor } = inputs

  const currentUnfilledOrders = totalOrdersPerMonth * (1 - currentFillRate)
  const improvedFillRate = Math.min(1, currentFillRate + fillRateImprovementPct)
  const newUnfilledOrders = totalOrdersPerMonth * (1 - improvedFillRate)
  const ordersRecovered = currentUnfilledOrders - newUnfilledOrders
  
  // Revenue from recovered orders
  const recoveredRevenue = ordersRecovered * revenuePerOrder * 12
  
  // Additional revenue from improved customer satisfaction
  const retentionImpact = ordersRecovered * revenuePerOrder * lostSaleCostFactor * 12
  
  const impactGBP = recoveredRevenue + retentionImpact

  const details: KPIDetail[] = [
    { label: 'Current Fill Rate', value: `${(currentFillRate * 100).toFixed(1)}%` },
    { label: 'Improved Fill Rate', value: `${(improvedFillRate * 100).toFixed(1)}%` },
    { label: 'Orders Recovered/Month', value: Math.round(ordersRecovered) },
    { label: 'Annual Recovered Revenue', value: formatCurrency(recoveredRevenue) },
    { label: 'Customer Retention Impact', value: formatCurrency(retentionImpact) },
  ]

  return {
    kpiName: 'Fill Rate Improvement',
    details,
    impactGBP,
    impactType: 'Revenue' as const,
  }
}

/**
 * IT KPIs
 */

/**
 * IT Outsourcing Cost Reduction
 * Reduce external IT service costs through AI automation
 */
export function calculateITOutsourcingCosts(inputs: ITOutsourcingCostsInputs): KPIResult {
  const { currentMonthlyITOutsourcingSpend, tasksOutsourcedPerMonth, automationPct, costSavingsPct } = inputs

  const tasksAutomated = tasksOutsourcedPerMonth * automationPct
  const monthlySavings = currentMonthlyITOutsourcingSpend * automationPct * costSavingsPct
  const annualSavings = monthlySavings * 12
  const impactGBP = annualSavings

  const details: KPIDetail[] = [
    { label: 'Current Monthly Spend', value: formatCurrency(currentMonthlyITOutsourcingSpend) },
    { label: 'Tasks Automated/Month', value: Math.round(tasksAutomated) },
    { label: 'Monthly Savings', value: formatCurrency(monthlySavings) },
    { label: 'Annual Savings', value: formatCurrency(annualSavings) },
  ]

  return {
    kpiName: 'IT Outsourcing Cost Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * IT Issue Resolution Time Reduction
 * Accelerate IT support through automated diagnostics and solutions
 */
export function calculateITIssueResolutionTime(inputs: ITIssueResolutionTimeInputs): KPIResult {
  const { issuesPerMonth, currentResolutionTimeHours, itStaffHourlyCost, resolutionTimeReductionPct, productivityImpactCostPerHour } = inputs

  const timeSavedPerIssue = currentResolutionTimeHours * resolutionTimeReductionPct
  const newResolutionTime = currentResolutionTimeHours - timeSavedPerIssue
  
  // IT staff cost savings
  const monthlyITCostSavings = issuesPerMonth * timeSavedPerIssue * itStaffHourlyCost
  
  // User productivity savings
  const monthlyProductivitySavings = issuesPerMonth * timeSavedPerIssue * productivityImpactCostPerHour
  
  const totalMonthlySavings = monthlyITCostSavings + monthlyProductivitySavings
  const annualSavings = totalMonthlySavings * 12
  const impactGBP = annualSavings

  const details: KPIDetail[] = [
    { label: 'Current Resolution Time', value: `${currentResolutionTimeHours}h` },
    { label: 'New Resolution Time', value: `${newResolutionTime.toFixed(1)}h` },
    { label: 'Monthly IT Cost Savings', value: formatCurrency(monthlyITCostSavings) },
    { label: 'Monthly Productivity Savings', value: formatCurrency(monthlyProductivitySavings) },
    { label: 'Annual Total Savings', value: formatCurrency(annualSavings) },
  ]

  return {
    kpiName: 'IT Issue Resolution Time Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * Shadow IT Risk Reduction
 * Reduce compliance and security risks from unauthorized IT usage
 */
export function calculateShadowITRisk(inputs: ShadowITRiskInputs): KPIResult {
  const { employeesAtRisk, incidentsPerYear, currentComplianceRate, costPerIncident, riskReductionPct } = inputs

  const currentIncidents = incidentsPerYear
  const improvedComplianceRate = Math.min(1, currentComplianceRate + riskReductionPct * (1 - currentComplianceRate))
  const incidentsReduced = currentIncidents * riskReductionPct
  const newIncidents = currentIncidents - incidentsReduced
  const annualCostSavings = incidentsReduced * costPerIncident
  const impactGBP = annualCostSavings

  const details: KPIDetail[] = [
    { label: 'Employees at Risk', value: employeesAtRisk },
    { label: 'Current Compliance Rate', value: formatPercentage(currentComplianceRate, 0) },
    { label: 'Improved Compliance Rate', value: formatPercentage(improvedComplianceRate, 0) },
    { label: 'Incidents Reduced/Year', value: incidentsReduced.toFixed(1) },
    { label: 'Annual Cost Savings', value: formatCurrency(annualCostSavings) },
  ]

  return {
    kpiName: 'Shadow IT Risk Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * Application Downtime Reduction
 * Minimize system outages through proactive monitoring and faster recovery
 */
export function calculateApplicationDowntime(inputs: ApplicationDowntimeInputs): KPIResult {
  const { currentDowntimeHoursPerMonth, affectedUsers, productivityCostPerUserPerHour, revenueLossPerHour, downtimeReductionPct } = inputs

  const downtimeReduced = currentDowntimeHoursPerMonth * downtimeReductionPct
  const newDowntime = currentDowntimeHoursPerMonth - downtimeReduced
  
  // Productivity savings
  const monthlyProductivitySavings = downtimeReduced * affectedUsers * productivityCostPerUserPerHour
  
  // Revenue protection
  const monthlyRevenueSavings = downtimeReduced * revenueLossPerHour
  
  const totalMonthlySavings = monthlyProductivitySavings + monthlyRevenueSavings
  const annualSavings = totalMonthlySavings * 12
  const impactGBP = annualSavings

  const details: KPIDetail[] = [
    { label: 'Current Downtime/Month', value: `${currentDowntimeHoursPerMonth}h` },
    { label: 'New Downtime/Month', value: `${newDowntime.toFixed(1)}h` },
    { label: 'Monthly Productivity Savings', value: formatCurrency(monthlyProductivitySavings) },
    { label: 'Monthly Revenue Protection', value: formatCurrency(monthlyRevenueSavings) },
    { label: 'Annual Total Savings', value: formatCurrency(annualSavings) },
  ]

  return {
    kpiName: 'Application Downtime Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * LEGAL KPIs
 */

/**
 * Contract Review Time Reduction
 * Accelerate contract analysis and approval through AI-powered review
 */
export function calculateContractReviewTime(inputs: ContractReviewTimeInputs): KPIResult {
  const { contractsPerMonth, currentReviewTimeHours, legalStaffHourlyCost, reviewTimeReductionPct, dealVelocityImpactPerDay } = inputs

  const timeSavedPerContract = currentReviewTimeHours * reviewTimeReductionPct
  const newReviewTime = currentReviewTimeHours - timeSavedPerContract
  
  // Legal staff cost savings
  const monthlyStaffSavings = contractsPerMonth * timeSavedPerContract * legalStaffHourlyCost
  
  // Deal velocity improvement (contracts reviewed faster = deals close faster)
  const avgDaysAccelerated = (timeSavedPerContract / 8) // Convert hours to days
  const monthlyDealVelocitySavings = contractsPerMonth * avgDaysAccelerated * dealVelocityImpactPerDay
  
  const totalMonthlySavings = monthlyStaffSavings + monthlyDealVelocitySavings
  const annualSavings = totalMonthlySavings * 12
  const impactGBP = annualSavings

  const details: KPIDetail[] = [
    { label: 'Current Review Time', value: `${currentReviewTimeHours}h` },
    { label: 'New Review Time', value: `${newReviewTime.toFixed(1)}h` },
    { label: 'Monthly Staff Savings', value: formatCurrency(monthlyStaffSavings) },
    { label: 'Deal Velocity Impact', value: formatCurrency(monthlyDealVelocitySavings) },
    { label: 'Annual Total Savings', value: formatCurrency(annualSavings) },
  ]

  return {
    kpiName: 'Contract Review Time Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * Legal Research Time Reduction
 * Automate legal research and case law analysis
 */
export function calculateLegalResearchTime(inputs: LegalResearchTimeInputs): KPIResult {
  const { researchRequestsPerMonth, currentResearchTimeHours, legalStaffHourlyCost, researchTimeReductionPct } = inputs

  const timeSavedPerRequest = currentResearchTimeHours * researchTimeReductionPct
  const newResearchTime = currentResearchTimeHours - timeSavedPerRequest
  const monthlyTimeSavings = researchRequestsPerMonth * timeSavedPerRequest
  const monthlyCostSavings = monthlyTimeSavings * legalStaffHourlyCost
  const annualSavings = monthlyCostSavings * 12
  const impactGBP = annualSavings

  const details: KPIDetail[] = [
    { label: 'Current Research Time', value: `${currentResearchTimeHours}h` },
    { label: 'New Research Time', value: `${newResearchTime.toFixed(1)}h` },
    { label: 'Monthly Hours Saved', value: `${monthlyTimeSavings.toFixed(0)}h` },
    { label: 'Monthly Cost Savings', value: formatCurrency(monthlyCostSavings) },
    { label: 'Annual Savings', value: formatCurrency(annualSavings) },
  ]

  return {
    kpiName: 'Legal Research Time Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * Compliance Audit Efficiency Improvement
 * Streamline compliance checks and audit processes
 */
export function calculateComplianceAuditEfficiency(inputs: ComplianceAuditEfficiencyInputs): KPIResult {
  const { auditsPerYear, currentAuditTimeHours, auditStaffHourlyCost, auditTimeReductionPct, complianceRiskReductionValue } = inputs

  const timeSavedPerAudit = currentAuditTimeHours * auditTimeReductionPct
  const newAuditTime = currentAuditTimeHours - timeSavedPerAudit
  const annualTimeSavings = auditsPerYear * timeSavedPerAudit
  const annualStaffCostSavings = annualTimeSavings * auditStaffHourlyCost
  
  // Risk reduction value from better compliance
  const annualRiskReduction = complianceRiskReductionValue
  
  const totalAnnualSavings = annualStaffCostSavings + annualRiskReduction
  const impactGBP = totalAnnualSavings

  const details: KPIDetail[] = [
    { label: 'Current Audit Time', value: `${currentAuditTimeHours}h` },
    { label: 'New Audit Time', value: `${newAuditTime.toFixed(1)}h` },
    { label: 'Annual Staff Savings', value: formatCurrency(annualStaffCostSavings) },
    { label: 'Risk Reduction Value', value: formatCurrency(annualRiskReduction) },
    { label: 'Annual Total Savings', value: formatCurrency(totalAnnualSavings) },
  ]

  return {
    kpiName: 'Compliance Audit Efficiency Improvement',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}

/**
 * External Counsel Spend Reduction
 * Reduce legal fees through AI automation of routine legal tasks
 */
export function calculateExternalCounselSpend(inputs: ExternalCounselSpendInputs): KPIResult {
  const { currentMonthlyExternalSpend, tasksOutsourcedPerMonth, automationPct, costSavingsPct } = inputs

  const tasksAutomated = tasksOutsourcedPerMonth * automationPct
  const monthlySavings = currentMonthlyExternalSpend * automationPct * costSavingsPct
  const annualSavings = monthlySavings * 12
  const impactGBP = annualSavings

  const details: KPIDetail[] = [
    { label: 'Current Monthly Spend', value: formatCurrency(currentMonthlyExternalSpend) },
    { label: 'Tasks Automated/Month', value: Math.round(tasksAutomated) },
    { label: 'Monthly Savings', value: formatCurrency(monthlySavings) },
    { label: 'Annual Savings', value: formatCurrency(annualSavings) },
  ]

  return {
    kpiName: 'External Counsel Spend Reduction',
    details,
    impactGBP,
    impactType: 'EBITDA' as const,
  }
}
