# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd "C:\Users\emclave\OneDrive - Microsoft\Documents\FDT"
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: **http://localhost:3000**

---

## ✨ Using the Application

### Screen 1: Agent Details
1. **Enter Agent Name**
   - Example: "Sales Outreach Copilot"
   - This names your AI agent project

2. **Select Business Process**
   - Choose "Sales" (only option in V1)
   - Other processes coming in future versions

3. **Click "Continue to KPIs"**

### Screen 2: Sales KPIs

For each of the 6 KPIs, you can:

1. **Review the Description**
   - Understand what the KPI measures
   - Read the formula shown below each title

2. **Adjust the Optimization Slider**
   - Drag to set percentage improvement (1%-20% depending on KPI)
   - See real-time percentage display

3. **Click "Calculate Impact"**
   - Runs the calculation
   - Shows intermediate values
   - Displays final £ impact

4. **View Results**
   - Intermediate calculations appear in the card
   - Annual impact shown in blue box
   - Right panel shows cumulative totals

### Editing Assumptions

1. **Click "Assumptions" in Left Navigation**
2. **Edit Values** in the drawer:
   - Deal Metrics (Average Deal Size, Conversion Rates)
   - Pipeline Volume (Current Leads, Opportunities)
   - Seller Economics (Hourly Cost, Number of Sellers)
   - Time Parameters (Weeks/Year, Sales Cycle Length)

3. **Save or Reset**
   - Click "Save Changes" to apply
   - Click "Reset to Defaults" to restore

4. **Recalculate KPIs** to see updated impacts

### Exporting Results

- **Export CSV**: Download spreadsheet with all results
- **Export PDF**: Coming soon (stub in V1)

---

## 📊 Default Values (Pre-configured)

The app comes pre-loaded with realistic defaults:

**Assumptions:**
- Average Deal Size: £25,000
- Lead Conversion Rate: 10%
- Opportunity Win Rate: 30%
- Current Leads: 20,000/year
- Number of Sellers: 50
- Seller Hourly Cost: £60
- Sales Cycle: 90 days

**KPI Optimizations:**
- More Leads: 3%
- Lead Conversion Improvement: 10%
- Win Rate Improvement: 10%
- Deal Size Uplift: 5%
- Cycle Acceleration: 10%
- Time Savings: 10%

---

## 🧮 Example Calculation

**KPI: More Leads (3% improvement)**

**Inputs:**
- Current Leads = 20,000
- Increment % = 3%
- Lead CR = 10%
- Win Rate = 30%
- Avg Deal Size = £25,000

**Steps:**
1. Incremental Leads = 20,000 × 3% = **600**
2. Additional Opportunities = 600 × 10% = **60**
3. Additional Deals = 60 × 30% = **18**
4. Impact = 18 × £25,000 = **£450,000**

---

## 🎨 UI Navigation Tips

- **Left Sidebar**: Switch between screens and open assumptions
- **Main Content**: Work area for configuring KPIs
- **Right Panel**: Always-visible summary of calculated impacts
- **Sliders**: Drag or click on the track to adjust values
- **Calculate Buttons**: Must click to run calculations (not automatic)

---

## 🔧 Troubleshooting

**Dev server won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

**Port 3000 already in use:**
```bash
# Use different port
npm run dev -- -p 3001
```

**TypeScript errors:**
```bash
# Check TypeScript compilation
npx tsc --noEmit
```

---

## 📈 Next Steps

1. **Experiment with Values**: Try different optimization percentages
2. **Edit Assumptions**: Customize to match your business metrics
3. **Calculate All 6 KPIs**: See the total cumulative impact
4. **Export Results**: Download CSV for further analysis

---

## 💡 Tips for Best Results

- Start with conservative optimization percentages (3-5%)
- Ensure assumptions reflect your actual business metrics
- Calculate all KPIs to see the full portfolio impact
- Use the formula tooltips to understand calculations
- Recalculate after changing assumptions

---

**Ready to calculate your agent's impact? Open http://localhost:3000 and get started!**
