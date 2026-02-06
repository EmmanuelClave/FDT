import {
  KPIInputsData,
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

export const DEFAULT_MORE_LEADS: MoreLeadsInputs = {
  currentLeads: 20000,
  leadConversionRate: 0.10,
  opportunityWinRate: 0.30,
  averageDealSize: 25000,
  incrementPct: 0.03,
}

export const DEFAULT_IMPROVED_LEAD_CONVERSION: ImprovedLeadConversionInputs = {
  currentLeads: 20000,
  leadConversionRate: 0.10,
  opportunityWinRate: 0.30,
  averageDealSize: 25000,
  optimisationPct: 0.10,
}

export const DEFAULT_IMPROVED_WIN_RATE: ImprovedWinRateInputs = {
  opportunitiesPerSeller: 100,
  opportunityWinRate: 0.30,
  averageDealSize: 25000,
  numberOfSellers: 50,
  optimisationPct: 0.05,
}

export const DEFAULT_INCREASED_DEAL_SIZE: IncreasedDealSizeInputs = {
  opportunitiesPerSeller: 100,
  opportunityWinRate: 0.30,
  averageDealSize: 25000,
  numberOfSellers: 50,
  upliftPct: 0.05,
}

export const DEFAULT_ACCELERATED_SALES_CYCLE: AcceleratedSalesCycleInputs = {
  salesCycleLengthDays: 90,
  opportunitiesPerSeller: 100,
  opportunityWinRate: 0.30,
  averageDealSize: 25000,
  numberOfSellers: 50,
  daysReduction: 10,
}

export const DEFAULT_SELLER_TIME_SAVINGS: SellerTimeSavingsInputs = {
  hoursPerWeekLowValueTasks: 10,
  numberOfOpportunities: 100,
  opportunityWinRate: 0.30,
  averageDealSize: 25000,
  numberOfSellers: 50,
  productivityRecaptureRate: 0.50,
  optimisedHours: 5,
}

export const DEFAULT_AVERAGE_HANDLING_TIME: AverageHandlingTimeInputs = {
  currentAHTMinutes: 12,
  casesPerMonth: 10000,
  agentHourlyCost: 35,
  ahtReductionPct: 0.15,
}

export const DEFAULT_FIRST_CALL_RESOLUTION: FirstCallResolutionInputs = {
  currentFCRRate: 0.70,
  totalCasesPerMonth: 10000,
  costPerCase: 25,
  fcrImprovementPct: 0.10,
}

export const DEFAULT_ISSUE_RESOLUTION_TIME: IssueResolutionTimeInputs = {
  currentResolutionHours: 24,
  issuesPerMonth: 2000,
  customerImpactCostPerHour: 100,
  resolutionTimeReductionPct: 0.20,
}

export const DEFAULT_CHANNEL_SHIFT: ChannelShiftInputs = {
  totalCasesPerMonth: 10000,
  pctHandledByHumans: 0.80,
  humanHandlingCost: 25,
  lowCostChannelCost: 5,
  shiftPct: 0.15,
}

export const DEFAULT_CASE_VOLUME_REDUCTION: CaseVolumeReductionInputs = {
  currentCaseVolume: 10000,
  costPerCase: 25,
  volumeReductionPct: 0.10,
}

export const DEFAULT_AGENCY_SPEND: AgencySpendInputs = {
  currentAgencySpendPerMonth: 50000,
  agencyTasksPerMonth: 100,
  automationPct: 0.30,
  costSavingsPct: 0.70,
}

export const DEFAULT_COST_PER_LEAD: CostPerLeadInputs = {
  totalMarketingSpendPerMonth: 100000,
  leadsGeneratedPerMonth: 2000,
  costReductionPct: 0.15,
}

export const DEFAULT_REVENUE_PER_LEAD: RevenuePerLeadInputs = {
  leadsPerMonth: 2000,
  conversionRate: 0.15,
  averageRevenuePerCustomer: 5000,
  revenueImprovementPct: 0.20,
}

export const DEFAULT_BRAND_VALUE_INCREASE: BrandValueIncreaseInputs = {
  currentBrandValue: 10000000,
  brandAwarenessGrowthPct: 0.10,
  revenueMultiplier: 0.15,
}

export const DEFAULT_CUSTOMER_RETENTION: CustomerRetentionInputs = {
  totalCustomers: 5000,
  currentRetentionRate: 0.85,
  averageRevenuePerCustomer: 5000,
  retentionImprovementPct: 0.05,
}

export const DEFAULT_LEADS_GENERATED: LeadsGeneratedInputs = {
  currentLeadsPerMonth: 2000,
  conversionRate: 0.15,
  averageRevenuePerCustomer: 5000,
  leadGrowthPct: 0.20,
}

// Finance Defaults
export const DEFAULT_FINANCE_OUTSOURCING_SPEND: FinanceOutsourcingSpendInputs = {
  currentOutsourcingSpendPerMonth: 80000,
  outsourcedTasksPerMonth: 500,
  automationPct: 60,
  costSavingsPct: 45,
}

export const DEFAULT_COST_PER_ANALYSIS: CostPerAnalysisInputs = {
  totalAnalysisRequestsPerMonth: 200,
  currentCostPerAnalysis: 500,
  efficiencyImprovementPct: 50,
}

export const DEFAULT_ANALYSIS_TIME: AnalysisTimeInputs = {
  analysisRequestsPerMonth: 150,
  currentAnalysisTimeHours: 8,
  analystHourlyCost: 75,
  timeReductionPct: 60,
}

export const DEFAULT_RECONCILIATION_TIME: ReconciliationTimeInputs = {
  reconciliationsPerMonth: 250,
  currentTimePerReconciliationHours: 2,
  analystHourlyCost: 65,
  timeReductionPct: 70,
}

export const DEFAULT_DAYS_SALES_OUTSTANDING: DaysSalesOutstandingInputs = {
  annualRevenue: 50000000,
  currentDSO: 45,
  dsoReductionDays: 10,
  costOfCapitalPct: 8,
}

export const DEFAULT_COMPLIANCE_RATE: ComplianceRateInputs = {
  totalTransactions: 10000,
  currentComplianceRate: 92,
  penaltyCostPerViolation: 5000,
  complianceImprovementPct: 5,
}

// Supply Chain Defaults
export const DEFAULT_INVENTORY_TURNOVER: InventoryTurnoverInputs = {
  annualCOGS: 20000000,
  currentInventoryValue: 5000000,
  currentTurnover: 4,
  improvementPct: 0.25,
  holdingCostRate: 0.20,
}

export const DEFAULT_ON_TIME_DELIVERY: OnTimeDeliveryInputs = {
  totalDeliveriesPerMonth: 5000,
  currentOTDRate: 0.85,
  costPerLateDelivery: 150,
  otdImprovementPct: 0.10,
  revenuePerDelivery: 1500,
}

export const DEFAULT_ORDER_ACCURACY: OrderAccuracyInputs = {
  totalOrdersPerMonth: 8000,
  currentAccuracyRate: 0.95,
  costPerError: 200,
  accuracyImprovementPct: 0.03,
}

export const DEFAULT_CASH_TO_CASH_CYCLE: CashToCashCycleInputs = {
  annualRevenue: 50000000,
  currentCycleDays: 65,
  cycleReductionDays: 15,
  costOfCapitalPct: 0.08,
}

export const DEFAULT_FREIGHT_COST_PER_UNIT: FreightCostPerUnitInputs = {
  unitsShippedPerMonth: 100000,
  currentFreightCostPerUnit: 8.50,
  costReductionPct: 0.15,
}

export const DEFAULT_SUPPLY_CHAIN_DSO: SupplyChainDSOInputs = {
  annualRevenue: 50000000,
  currentDSO: 45,
  dsoReductionDays: 10,
  costOfCapitalPct: 0.08,
}

export const DEFAULT_FILL_RATE: FillRateInputs = {
  totalOrdersPerMonth: 8000,
  currentFillRate: 0.92,
  revenuePerOrder: 2500,
  fillRateImprovementPct: 0.05,
  lostSaleCostFactor: 1.5,
}
// IT KPI Defaults
export const DEFAULT_IT_OUTSOURCING_COSTS: ITOutsourcingCostsInputs = {
  currentMonthlyITOutsourcingSpend: 50000,
  tasksOutsourcedPerMonth: 200,
  automationPct: 0.60,
  costSavingsPct: 0.50
}

export const DEFAULT_IT_ISSUE_RESOLUTION_TIME: ITIssueResolutionTimeInputs = {
  issuesPerMonth: 150,
  currentResolutionTimeHours: 4,
  itStaffHourlyCost: 75,
  resolutionTimeReductionPct: 0.40,
  productivityImpactCostPerHour: 50
}

export const DEFAULT_SHADOW_IT_RISK: ShadowITRiskInputs = {
  employeesAtRisk: 500,
  incidentsPerYear: 12,
  currentComplianceRate: 0.75,
  costPerIncident: 25000,
  riskReductionPct: 0.60
}

export const DEFAULT_APPLICATION_DOWNTIME: ApplicationDowntimeInputs = {
  currentDowntimeHoursPerMonth: 8,
  affectedUsers: 200,
  productivityCostPerUserPerHour: 45,
  revenueLossPerHour: 5000,
  downtimeReductionPct: 0.50
}

// Legal KPI Defaults
export const DEFAULT_CONTRACT_REVIEW_TIME: ContractReviewTimeInputs = {
  contractsPerMonth: 50,
  currentReviewTimeHours: 6,
  legalStaffHourlyCost: 150,
  reviewTimeReductionPct: 0.60,
  dealVelocityImpactPerDay: 2000
}

export const DEFAULT_LEGAL_RESEARCH_TIME: LegalResearchTimeInputs = {
  researchRequestsPerMonth: 80,
  currentResearchTimeHours: 8,
  legalStaffHourlyCost: 150,
  researchTimeReductionPct: 0.70
}

export const DEFAULT_COMPLIANCE_AUDIT_EFFICIENCY: ComplianceAuditEfficiencyInputs = {
  auditsPerYear: 12,
  currentAuditTimeHours: 40,
  auditStaffHourlyCost: 125,
  auditTimeReductionPct: 0.50,
  complianceRiskReductionValue: 50000
}

export const DEFAULT_EXTERNAL_COUNSEL_SPEND: ExternalCounselSpendInputs = {
  currentMonthlyExternalSpend: 75000,
  tasksOutsourcedPerMonth: 30,
  automationPct: 0.40,
  costSavingsPct: 0.60
}
export const DEFAULT_KPI_INPUTS: KPIInputsData = {
  moreLeads: DEFAULT_MORE_LEADS,
  improvedLeadConversion: DEFAULT_IMPROVED_LEAD_CONVERSION,
  improvedWinRate: DEFAULT_IMPROVED_WIN_RATE,
  increasedDealSize: DEFAULT_INCREASED_DEAL_SIZE,
  acceleratedSalesCycle: DEFAULT_ACCELERATED_SALES_CYCLE,
  sellerTimeSavings: DEFAULT_SELLER_TIME_SAVINGS,
  averageHandlingTime: DEFAULT_AVERAGE_HANDLING_TIME,
  firstCallResolution: DEFAULT_FIRST_CALL_RESOLUTION,
  issueResolutionTime: DEFAULT_ISSUE_RESOLUTION_TIME,
  channelShift: DEFAULT_CHANNEL_SHIFT,
  caseVolumeReduction: DEFAULT_CASE_VOLUME_REDUCTION,
  agencySpend: DEFAULT_AGENCY_SPEND,
  costPerLead: DEFAULT_COST_PER_LEAD,
  revenuePerLead: DEFAULT_REVENUE_PER_LEAD,
  brandValueIncrease: DEFAULT_BRAND_VALUE_INCREASE,
  customerRetention: DEFAULT_CUSTOMER_RETENTION,
  leadsGenerated: DEFAULT_LEADS_GENERATED,
  financeOutsourcingSpend: DEFAULT_FINANCE_OUTSOURCING_SPEND,
  costPerAnalysis: DEFAULT_COST_PER_ANALYSIS,
  analysisTime: DEFAULT_ANALYSIS_TIME,
  reconciliationTime: DEFAULT_RECONCILIATION_TIME,
  daysSalesOutstanding: DEFAULT_DAYS_SALES_OUTSTANDING,
  complianceRate: DEFAULT_COMPLIANCE_RATE,
  inventoryTurnover: DEFAULT_INVENTORY_TURNOVER,
  onTimeDelivery: DEFAULT_ON_TIME_DELIVERY,
  orderAccuracy: DEFAULT_ORDER_ACCURACY,
  cashToCashCycle: DEFAULT_CASH_TO_CASH_CYCLE,
  freightCostPerUnit: DEFAULT_FREIGHT_COST_PER_UNIT,
  supplyChainDSO: DEFAULT_SUPPLY_CHAIN_DSO,
  fillRate: DEFAULT_FILL_RATE,
  itOutsourcingCosts: DEFAULT_IT_OUTSOURCING_COSTS,
  itIssueResolutionTime: DEFAULT_IT_ISSUE_RESOLUTION_TIME,
  shadowITRisk: DEFAULT_SHADOW_IT_RISK,
  applicationDowntime: DEFAULT_APPLICATION_DOWNTIME,
  contractReviewTime: DEFAULT_CONTRACT_REVIEW_TIME,
  legalResearchTime: DEFAULT_LEGAL_RESEARCH_TIME,
  complianceAuditEfficiency: DEFAULT_COMPLIANCE_AUDIT_EFFICIENCY,
  externalCounselSpend: DEFAULT_EXTERNAL_COUNSEL_SPEND
}
