# AIC — Agent Impact Calculator

A McKinsey-style, executive-grade web application for calculating the financial impact of AI agents on business processes.

## 🎯 Overview

**Version 1.0** focuses on **Sales KPIs** with 6 key performance indicators:
1. More Leads
2. Improved Lead Conversion
3. Improved Win Rate
4. Increased Deal Size
5. Accelerated Sales Cycle
6. Seller Time Savings

The total agent impact equals the sum of impacts across selected KPIs.

---

## 🏗️ Architecture

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Pattern**: Client-side state management with React hooks

### Project Structure
```
FDT/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main application page with state management
│   └── globals.css         # Global styles and Tailwind directives
├── components/
│   ├── Layout.tsx          # Main layout with nav, content, summary panel
│   ├── Navigation.tsx      # Left navigation sidebar
│   ├── SummaryPanel.tsx    # Right summary panel with totals and export
│   ├── AssumptionsDrawer.tsx  # Drawer for editing assumptions
│   ├── AgentDetails.tsx    # Screen 1: Agent name and process selection
│   └── SalesKPIs.tsx       # Screen 2: KPI cards with sliders and results
├── lib/
│   ├── calculations.ts     # Pure calculation functions for all 6 KPIs
│   └── defaults.ts         # Default values for assumptions and inputs
├── types/
│   └── index.ts            # TypeScript interfaces and types
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

### Component Hierarchy
```
Layout
├── Navigation (left sidebar)
├── Main Content (center)
│   ├── AgentDetails (Screen 1)
│   └── SalesKPIs (Screen 2)
└── SummaryPanel (right sidebar)
AssumptionsDrawer (modal overlay)
```

### State Management
- Single `AppState` object managed in `app/page.tsx`
- Props drilling for simple state updates
- No external state library needed for V1

---

## 📊 Data Model

### Assumptions (Defaults)
```typescript
{
  averageDealSize: 25000,              // £
  leadConversionRate: 0.10,            // 10%
  opportunityWinRate: 0.30,            // 30%
  currentLeads: 20000,                 // Annual
  currentOpportunities: 2000,          // Annual
  sellerHourlyCost: 60,                // £/hour
  sellerHoursSavedPerSellerPerWeek: 2,
  numberOfSellers: 50,
  weeksPerYear: 48,
  salesCycleLengthDays: 90
}
```

### KPI Inputs (Defaults)
```typescript
{
  moreLeadsIncrementPct: 0.03,           // 3%
  leadConversionOptimisationPct: 0.10,   // 10%
  winRateOptimisationPct: 0.10,          // 10%
  dealSizeUpliftPct: 0.05,               // 5%
  cycleAccelerationPct: 0.10,            // 10%
  sellerTimeSavingsPct: 0.10             // 10%
}
```

---

## 🧮 Calculation Formulas

### KPI 1: More Leads
```
incrementalLeads = currentLeads × moreLeadsIncrementPct
additionalOpportunities = incrementalLeads × leadConversionRate
additionalDeals = additionalOpportunities × opportunityWinRate
impactGBP = additionalDeals × averageDealSize
```

### KPI 2: Improved Lead Conversion
```
optimizedCR = leadConversionRate × (1 + leadConversionOptimisationPct)
additionalOpportunities = (optimizedCR - leadConversionRate) × currentLeads
additionalDeals = additionalOpportunities × opportunityWinRate
impactGBP = additionalDeals × averageDealSize
```

### KPI 3: Improved Win Rate
```
baselineOpportunities = currentLeads × leadConversionRate
optimizedWR = opportunityWinRate × (1 + winRateOptimisationPct)
additionalDeals = baselineOpportunities × (optimizedWR - opportunityWinRate)
impactGBP = additionalDeals × averageDealSize
```

### KPI 4: Increased Deal Size
```
baselineDeals = currentLeads × leadConversionRate × opportunityWinRate
upliftedADS = averageDealSize × (1 + dealSizeUpliftPct)
impactGBP = baselineDeals × (upliftedADS - averageDealSize)
```

### KPI 5: Accelerated Sales Cycle
```
baselineDeals = currentLeads × leadConversionRate × opportunityWinRate
baselineRevenue = baselineDeals × averageDealSize
daysSaved = salesCycleLengthDays × cycleAccelerationPct
annualisedBenefitFactor = daysSaved / 365
impactGBP = baselineRevenue × annualisedBenefitFactor
```

### KPI 6: Seller Time Savings
```
hoursSavedPerSellerPerYear = sellerHoursSavedPerSellerPerWeek × weeksPerYear × sellerTimeSavingsPct
totalHoursSaved = hoursSavedPerSellerPerYear × numberOfSellers
impactGBP = totalHoursSaved × sellerHourlyCost
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production
```bash
npm run build
npm start
```

---

## 📖 User Guide

### Step 1: Agent Details
1. Enter a descriptive **Agent Name** (e.g., "Sales Outreach Copilot")
2. Select **Business Process** from dropdown (V1 supports Sales only)
3. Click **Continue to KPIs**

### Step 2: Configure KPIs
1. Review the 6 Sales KPI cards
2. For each KPI you want to evaluate:
   - Adjust the **optimization slider** (percentage impact)
   - Click **Calculate Impact**
3. View intermediate calculations and final impact in £
4. See cumulative totals in the **right summary panel**

### Step 3: Adjust Assumptions (Optional)
1. Click **Assumptions** in left navigation
2. Edit baseline values (deal size, conversion rates, etc.)
3. Click **Save Changes** or **Reset to Defaults**
4. Recalculate KPIs to see updated impacts

### Step 4: Export Results
1. Click **Export CSV** for spreadsheet-compatible data
2. Click **Export PDF** (stub in V1)

---

## 🎨 Design Principles

### Visual Tone
- **Consulting-grade**: Clean, minimal, professional
- **High contrast**: Clear hierarchy and readability
- **Generous whitespace**: Breathing room between elements
- **Grid alignment**: Precise positioning and spacing

### Typography
- **Headings**: Inter (system-ui fallback)
- **Body**: Highly legible, consistent sizing
- **Numbers**: UK locale formatting (£, thousands separators)

### Interaction
- **Sliders**: Real-time percentage display
- **Tooltips**: Formula explanations inline
- **Validation**: Range constraints on inputs
- **Micro-interactions**: Hover states, smooth transitions

---

## 🧪 Testing Calculations

All calculation functions are pure and unit-testable. Example test:

```typescript
import { calculateMoreLeads } from '@/lib/calculations'
import { DEFAULT_ASSUMPTIONS, DEFAULT_KPI_INPUTS } from '@/lib/defaults'

const result = calculateMoreLeads(DEFAULT_ASSUMPTIONS, DEFAULT_KPI_INPUTS)
console.log(result.impactGBP) // Expected: £135,000
```

---

## 🔮 Future Enhancements (V2+)

- Support for Marketing, Service, Finance, Supply Chain, Legal, IT processes
- Saved scenarios and comparison views
- Advanced PDF export with charts
- Multi-agent portfolios
- Sensitivity analysis and what-if scenarios
- Backend persistence (database)
- User authentication and multi-tenancy

---

## 📄 License

Proprietary — Internal use only

---

## 👥 Contact

For questions or feature requests, contact the AIC development team.

---

## 🎓 Appendix: Formula Derivations

### More Leads
Assumes new leads follow the same conversion funnel as existing leads. The agent generates a percentage uplift in lead volume, which cascades through the pipeline.

### Improved Lead Conversion
Models the effect of better lead qualification and nurturing. The agent optimizes conversion from lead to opportunity stage.

### Improved Win Rate
Captures the impact of AI-powered insights on closing deals. The agent helps sellers win more opportunities.

### Increased Deal Size
Represents upselling and cross-selling enabled by intelligent recommendations. The agent identifies expansion opportunities.

### Accelerated Sales Cycle
Treats cycle compression as bringing forward revenue. The annualized benefit uses a proportional time-value proxy.

### Seller Time Savings
Quantifies cost savings from automation. Hours freed are valued at the fully-loaded hourly cost of sellers.

---

**Built with ❤️ using Next.js, React, and TypeScript**
