# AIC Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AIC Web Application                           │
│                      (Next.js 14 + TypeScript)                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           UI Layer                                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────┐  ┌─────────────────┐       │
│  │ Navigation   │  │  Main Content    │  │ Summary Panel   │       │
│  │ - App        │  │  ┌────────────┐  │  │ - KPI Totals    │       │
│  │ - Scenarios  │  │  │ Agent      │  │  │ - Grand Total   │       │
│  │ - Assumptions│  │  │ Details    │  │  │ - Export CSV    │       │
│  │              │  │  └────────────┘  │  │ - Export PDF    │       │
│  │              │  │  ┌────────────┐  │  │                 │       │
│  │              │  │  │ Sales KPIs │  │  │                 │       │
│  │              │  │  │ (6 cards)  │  │  │                 │       │
│  │              │  │  └────────────┘  │  │                 │       │
│  └──────────────┘  └──────────────────┘  └─────────────────┘       │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │           Assumptions Drawer (Modal Overlay)                │    │
│  │  - Edit all baseline assumptions                            │    │
│  │  - Reset to defaults                                        │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        State Management                              │
├─────────────────────────────────────────────────────────────────────┤
│  AppState:                                                           │
│  - agentName: string                                                 │
│  - process: BusinessProcess                                          │
│  - assumptions: Assumptions                                          │
│  - kpiInputs: KPIInputs                                             │
│  - results: KPIResult[]                                             │
│  - currentScreen: ScreenType                                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       Business Logic Layer                           │
├─────────────────────────────────────────────────────────────────────┤
│  Calculation Functions (Pure):                                       │
│  - calculateMoreLeads()                                             │
│  - calculateImprovedLeadConversion()                                │
│  - calculateImprovedWinRate()                                       │
│  - calculateIncreasedDealSize()                                     │
│  - calculateAcceleratedSalesCycle()                                 │
│  - calculateSellerTimeSavings()                                     │
│                                                                      │
│  Utility Functions:                                                 │
│  - formatCurrency()                                                 │
│  - formatPercentage()                                               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          Data Layer                                  │
├─────────────────────────────────────────────────────────────────────┤
│  Default Values:                                                     │
│  - DEFAULT_ASSUMPTIONS                                              │
│  - DEFAULT_KPI_INPUTS                                               │
│                                                                      │
│  Type Definitions:                                                  │
│  - Assumptions, KPIInputs, KPIResult, AppState, etc.               │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Flow

```
User Journey:
1. Enter Agent Name + Select Process → AgentDetails Component
2. Click "Continue" → Navigate to SalesKPIs Component
3. Adjust sliders, click "Calculate" → Run calculation function
4. View results in KPI card + SummaryPanel → Display formatted impact
5. (Optional) Click Assumptions → Open AssumptionsDrawer
6. Export results → Generate CSV download
```

## Data Flow

```
User Input (Slider)
    ↓
Update KPIInputs in State
    ↓
User Clicks "Calculate"
    ↓
Call Pure Calculation Function
    ↓
Generate KPIResult
    ↓
Update Results Array in State
    ↓
Re-render UI Components
    ↓
Display in KPI Card + Summary Panel
```

## Key Design Patterns

1. **Unidirectional Data Flow**: Props down, callbacks up
2. **Pure Functions**: All calculations are side-effect free
3. **Component Composition**: Small, focused, reusable components
4. **Type Safety**: TypeScript for compile-time guarantees
5. **Responsive Layout**: Flexbox-based 3-column layout
6. **Accessible Forms**: Proper labels, ARIA attributes, semantic HTML

## Performance Considerations

- Client-side only (no server overhead for V1)
- Calculations run on-demand (not real-time on slider)
- Minimal re-renders via React state management
- No heavy dependencies (bundle size < 500KB)

## Security Considerations

- No backend or data persistence in V1
- No sensitive data storage
- Input validation via TypeScript types and range constraints
- Future: Add authentication, rate limiting, data encryption
