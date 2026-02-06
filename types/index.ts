export type BusinessProcess = 
  | 'Sales' 
  | 'Marketing' 
  | 'Service' 
  | 'Finance' 
  | 'Supply Chain' 
  | 'Legal' 
  | 'IT'

export type ScreenType = 'agent-details' | 'kpis'

// KPI-specific input interfaces
export interface MoreLeadsInputs {
  currentLeads: number
  leadConversionRate: number
  opportunityWinRate: number
  averageDealSize: number
  incrementPct: number
}

export interface ImprovedLeadConversionInputs {
  currentLeads: number
  leadConversionRate: number
  opportunityWinRate: number
  averageDealSize: number
  optimisationPct: number
}

export interface ImprovedWinRateInputs {
  opportunitiesPerSeller: number
  opportunityWinRate: number
  averageDealSize: number
  numberOfSellers: number
  optimisationPct: number
}

export interface IncreasedDealSizeInputs {
  opportunitiesPerSeller: number
  opportunityWinRate: number
  averageDealSize: number
  numberOfSellers: number
  upliftPct: number
}

export interface AcceleratedSalesCycleInputs {
  salesCycleLengthDays: number
  opportunitiesPerSeller: number
  opportunityWinRate: number
  averageDealSize: number
  numberOfSellers: number
  daysReduction: number
}

export interface SellerTimeSavingsInputs {
  hoursPerWeekLowValueTasks: number
  numberOfOpportunities: number
  opportunityWinRate: number
  averageDealSize: number
  numberOfSellers: number
  productivityRecaptureRate: number
  optimisedHours: number
}

// Service KPI Input Interfaces
export interface AverageHandlingTimeInputs {
  currentAHTMinutes: number
  casesPerMonth: number
  agentHourlyCost: number
  ahtReductionPct: number
}

export interface FirstCallResolutionInputs {
  currentFCRRate: number
  totalCasesPerMonth: number
  costPerCase: number
  fcrImprovementPct: number
}

export interface IssueResolutionTimeInputs {
  currentResolutionHours: number
  issuesPerMonth: number
  customerImpactCostPerHour: number
  resolutionTimeReductionPct: number
}

export interface ChannelShiftInputs {
  totalCasesPerMonth: number
  pctHandledByHumans: number
  humanHandlingCost: number
  lowCostChannelCost: number
  shiftPct: number
}

export interface CaseVolumeReductionInputs {
  currentCaseVolume: number
  costPerCase: number
  volumeReductionPct: number
}

// Marketing KPI Input Interfaces
export interface AgencySpendInputs {
  currentAgencySpendPerMonth: number
  agencyTasksPerMonth: number
  automationPct: number
  costSavingsPct: number
}

export interface CostPerLeadInputs {
  totalMarketingSpendPerMonth: number
  leadsGeneratedPerMonth: number
  costReductionPct: number
}

export interface RevenuePerLeadInputs {
  leadsPerMonth: number
  conversionRate: number
  averageRevenuePerCustomer: number
  revenueImprovementPct: number
}

export interface BrandValueIncreaseInputs {
  currentBrandValue: number
  brandAwarenessGrowthPct: number
  revenueMultiplier: number
}

export interface CustomerRetentionInputs {
  totalCustomers: number
  currentRetentionRate: number
  averageRevenuePerCustomer: number
  retentionImprovementPct: number
}

export interface LeadsGeneratedInputs {
  currentLeadsPerMonth: number
  conversionRate: number
  averageRevenuePerCustomer: number
  leadGrowthPct: number
}

// Finance KPI Input Interfaces
export interface FinanceOutsourcingSpendInputs {
  currentOutsourcingSpendPerMonth: number
  outsourcedTasksPerMonth: number
  automationPct: number
  costSavingsPct: number
}

export interface CostPerAnalysisInputs {
  totalAnalysisRequestsPerMonth: number
  currentCostPerAnalysis: number
  efficiencyImprovementPct: number
}

export interface ReconciliationTimeInputs {
  reconciliationsPerMonth: number
  currentTimePerReconciliationHours: number
  analystHourlyCost: number
  timeReductionPct: number
}

export interface ComplianceRateInputs {
  totalTransactions: number
  currentComplianceRate: number
  penaltyCostPerViolation: number
  complianceImprovementPct: number
}

export interface DaysSalesOutstandingInputs {
  annualRevenue: number
  currentDSO: number
  dsoReductionDays: number
  costOfCapitalPct: number
}

export interface AnalysisTimeInputs {
  analysisRequestsPerMonth: number
  currentAnalysisTimeHours: number
  analystHourlyCost: number
  timeReductionPct: number
}

// Supply Chain KPI Inputs
export interface InventoryTurnoverInputs {
  annualCOGS: number
  currentInventoryValue: number
  currentTurnover: number
  improvementPct: number
  holdingCostRate: number
}

export interface OnTimeDeliveryInputs {
  totalDeliveriesPerMonth: number
  currentOTDRate: number
  costPerLateDelivery: number
  otdImprovementPct: number
  revenuePerDelivery: number
}

export interface OrderAccuracyInputs {
  totalOrdersPerMonth: number
  currentAccuracyRate: number
  costPerError: number
  accuracyImprovementPct: number
}

export interface CashToCashCycleInputs {
  annualRevenue: number
  currentCycleDays: number
  cycleReductionDays: number
  costOfCapitalPct: number
}

export interface FreightCostPerUnitInputs {
  unitsShippedPerMonth: number
  currentFreightCostPerUnit: number
  costReductionPct: number
}

export interface SupplyChainDSOInputs {
  annualRevenue: number
  currentDSO: number
  dsoReductionDays: number
  costOfCapitalPct: number
}

export interface FillRateInputs {
  totalOrdersPerMonth: number
  currentFillRate: number
  revenuePerOrder: number
  fillRateImprovementPct: number
  lostSaleCostFactor: number
}

// IT KPI Input Interfaces
export interface ITOutsourcingCostsInputs {
  currentMonthlyITOutsourcingSpend: number
  tasksOutsourcedPerMonth: number
  automationPct: number
  costSavingsPct: number
}

export interface ITIssueResolutionTimeInputs {
  issuesPerMonth: number
  currentResolutionTimeHours: number
  itStaffHourlyCost: number
  resolutionTimeReductionPct: number
  productivityImpactCostPerHour: number
}

export interface ShadowITRiskInputs {
  employeesAtRisk: number
  incidentsPerYear: number
  currentComplianceRate: number
  costPerIncident: number
  riskReductionPct: number
}

export interface ApplicationDowntimeInputs {
  currentDowntimeHoursPerMonth: number
  affectedUsers: number
  productivityCostPerUserPerHour: number
  revenueLossPerHour: number
  downtimeReductionPct: number
}

// Legal KPI Input Interfaces
export interface ContractReviewTimeInputs {
  contractsPerMonth: number
  currentReviewTimeHours: number
  legalStaffHourlyCost: number
  reviewTimeReductionPct: number
  dealVelocityImpactPerDay: number
}

export interface LegalResearchTimeInputs {
  researchRequestsPerMonth: number
  currentResearchTimeHours: number
  legalStaffHourlyCost: number
  researchTimeReductionPct: number
}

export interface ComplianceAuditEfficiencyInputs {
  auditsPerYear: number
  currentAuditTimeHours: number
  auditStaffHourlyCost: number
  auditTimeReductionPct: number
  complianceRiskReductionValue: number
}

export interface ExternalCounselSpendInputs {
  currentMonthlyExternalSpend: number
  tasksOutsourcedPerMonth: number
  automationPct: number
  costSavingsPct: number
}

export interface KPIInputsData {
  moreLeads?: MoreLeadsInputs
  improvedLeadConversion?: ImprovedLeadConversionInputs
  improvedWinRate?: ImprovedWinRateInputs
  increasedDealSize?: IncreasedDealSizeInputs
  acceleratedSalesCycle?: AcceleratedSalesCycleInputs
  sellerTimeSavings?: SellerTimeSavingsInputs
  averageHandlingTime?: AverageHandlingTimeInputs
  firstCallResolution?: FirstCallResolutionInputs
  issueResolutionTime?: IssueResolutionTimeInputs
  channelShift?: ChannelShiftInputs
  caseVolumeReduction?: CaseVolumeReductionInputs
  agencySpend?: AgencySpendInputs
  costPerLead?: CostPerLeadInputs
  revenuePerLead?: RevenuePerLeadInputs
  brandValueIncrease?: BrandValueIncreaseInputs
  customerRetention?: CustomerRetentionInputs
  leadsGenerated?: LeadsGeneratedInputs
  financeOutsourcingSpend?: FinanceOutsourcingSpendInputs
  costPerAnalysis?: CostPerAnalysisInputs
  reconciliationTime?: ReconciliationTimeInputs
  complianceRate?: ComplianceRateInputs
  daysSalesOutstanding?: DaysSalesOutstandingInputs
  analysisTime?: AnalysisTimeInputs
  inventoryTurnover?: InventoryTurnoverInputs
  onTimeDelivery?: OnTimeDeliveryInputs
  orderAccuracy?: OrderAccuracyInputs
  cashToCashCycle?: CashToCashCycleInputs
  freightCostPerUnit?: FreightCostPerUnitInputs
  supplyChainDSO?: SupplyChainDSOInputs
  fillRate?: FillRateInputs
  // IT KPIs
  itOutsourcingCosts?: ITOutsourcingCostsInputs
  itIssueResolutionTime?: ITIssueResolutionTimeInputs
  shadowITRisk?: ShadowITRiskInputs
  applicationDowntime?: ApplicationDowntimeInputs
  // Legal KPIs
  contractReviewTime?: ContractReviewTimeInputs
  legalResearchTime?: LegalResearchTimeInputs
  complianceAuditEfficiency?: ComplianceAuditEfficiencyInputs
  externalCounselSpend?: ExternalCounselSpendInputs
}

export interface KPIDetail {
  label: string
  value: number | string
}

export type ImpactType = 'Revenue' | 'EBITDA'

export interface KPIResult {
  kpiName: string
  details: KPIDetail[]
  impactGBP: number
  impactType: ImpactType
  saved?: boolean
}

export interface AgentConfig {
  id: string
  agentName: string
  process: BusinessProcess
  kpiInputs: KPIInputsData
  results: KPIResult[]
  savedAt: Date
}

export interface AppState {
  agentName: string
  process: BusinessProcess
  kpiInputs: KPIInputsData
  results: KPIResult[]
  currentScreen: ScreenType
  savedAgents: AgentConfig[]
}

export type SalesKPIName = 
  | 'More Leads'
  | 'Improved Lead Conversion'
  | 'Improved Win Rate'
  | 'Increased Deal Size'
  | 'Accelerated Sales Cycle'
  | 'Seller Time Savings'

export type ServiceKPIName =
  | 'Average Handling Time Reduction'
  | 'First Call Resolution Improvement'
  | 'Issue Resolution Time Reduction'
  | 'Channel Shift to Low-Cost'
  | 'Case Volume Reduction'

export type MarketingKPIName =
  | 'Agency Spend Reduction'
  | 'Cost Per Lead Reduction'
  | 'Revenue Per Lead Increase'
  | 'Brand Value Increase'
  | 'Customer Retention Improvement'
  | 'Leads Generated Increase'

export type FinanceKPIName =
  | 'Finance Outsourcing Spend Reduction'
  | 'Cost Per Analysis Reduction'
  | 'Analysis Time Reduction'
  | 'Reconciliation Time Reduction'
  | 'Days Sales Outstanding Reduction'
  | 'Compliance Rate Improvement'

export type SupplyChainKPIName =
  | 'Inventory Turnover Improvement'
  | 'On-Time Delivery Improvement'
  | 'Order Accuracy Improvement'
  | 'Cash-to-Cash Cycle Time Reduction'
  | 'Freight Cost Per Unit Reduction'
  | 'Days Sales Outstanding Reduction'
  | 'Fill Rate Improvement'

export type ITKPIName =
  | 'IT Outsourcing Cost Reduction'
  | 'IT Issue Resolution Time Reduction'
  | 'Shadow IT Risk Reduction'
  | 'Application Downtime Reduction'

export type LegalKPIName =
  | 'Contract Review Time Reduction'
  | 'Legal Research Time Reduction'
  | 'Compliance Audit Efficiency Improvement'
  | 'External Counsel Spend Reduction'
