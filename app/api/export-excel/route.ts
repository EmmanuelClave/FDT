import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { 
      agentDetails,
      salesKPIs, 
      marketingKPIs, 
      serviceKPIs, 
      financeKPIs,
      supplyChainKPIs,
      itKPIs,
      legalKPIs 
    } = data

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Agent Impact Calculator'
    workbook.created = new Date()

    // Helper function to format currency
    const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

    // Agent Details Sheet
    const detailsSheet = workbook.addWorksheet('Agent Details')
    detailsSheet.columns = [
      { header: 'Field', key: 'field', width: 30 },
      { header: 'Value', key: 'value', width: 50 }
    ]
    
    detailsSheet.addRow({ field: 'Agent Name', value: agentDetails.agentName })
    detailsSheet.addRow({ field: 'Copilot Technology', value: agentDetails.copilotTechnology })
    detailsSheet.addRow({ field: 'Industry', value: agentDetails.industry })
    detailsSheet.addRow({ field: 'Department', value: agentDetails.department })
    detailsSheet.addRow({ field: 'Use Case', value: agentDetails.useCase })
    detailsSheet.addRow({ field: 'Description', value: agentDetails.description })

    // Style the header
    detailsSheet.getRow(1).font = { bold: true, size: 12 }
    detailsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0078D4' }
    }
    detailsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

    // Sales KPIs Sheet
    if (salesKPIs && salesKPIs.length > 0) {
      const salesSheet = workbook.addWorksheet('Sales KPIs')
      
      // Set up columns
      salesSheet.columns = [
        { header: 'KPI Name', key: 'kpiName', width: 30 },
        { header: 'Input Field', key: 'inputField', width: 25 },
        { header: 'Value', key: 'value', width: 15 },
        { header: 'Annual Impact (GBP)', key: 'impact', width: 20 }
      ]

      // Style header
      salesSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      salesSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0078D4' }
      }

      let currentRow = 2
      salesKPIs.forEach((kpi: any) => {
        const inputs = kpi.inputs
        const result = kpi.result
        
        // Add KPI name row
        salesSheet.getCell(`A${currentRow}`).value = kpi.name
        salesSheet.getCell(`A${currentRow}`).font = { bold: true }
        salesSheet.getCell(`D${currentRow}`).value = { formula: `D${currentRow + Object.keys(inputs).length}`, result: result.impactGBP }
        salesSheet.getCell(`D${currentRow}`).numFmt = '$#,##0'
        salesSheet.getCell(`D${currentRow}`).font = { bold: true, color: { argb: 'FF0078D4' } }
        
        currentRow++

        // Add input rows with formulas
        Object.entries(inputs).forEach(([key, value]: [string, any]) => {
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim()
          
          salesSheet.getCell(`B${currentRow}`).value = label
          salesSheet.getCell(`C${currentRow}`).value = typeof value === 'number' ? value : parseFloat(value) || 0
          currentRow++
        })

        // Add impact calculation formula based on KPI type
        const impactRow = currentRow - 1
        salesSheet.getCell(`D${impactRow}`).value = result.impactGBP
        salesSheet.getCell(`D${impactRow}`).numFmt = '$#,##0'

        currentRow++
      })

      // Add total row
      salesSheet.getCell(`A${currentRow}`).value = 'TOTAL SALES IMPACT'
      salesSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 }
      const totalImpact = salesKPIs.reduce((sum: number, kpi: any) => sum + (kpi.result?.impactGBP || 0), 0)
      salesSheet.getCell(`D${currentRow}`).value = totalImpact
      salesSheet.getCell(`D${currentRow}`).numFmt = '$#,##0'
      salesSheet.getCell(`D${currentRow}`).font = { bold: true, size: 12, color: { argb: 'FF107C10' } }
      salesSheet.getCell(`D${currentRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7F4E7' }
      }
    }

    // Marketing KPIs Sheet
    if (marketingKPIs && marketingKPIs.length > 0) {
      const marketingSheet = workbook.addWorksheet('Marketing KPIs')
      
      marketingSheet.columns = [
        { header: 'KPI Name', key: 'kpiName', width: 30 },
        { header: 'Input Field', key: 'inputField', width: 25 },
        { header: 'Value', key: 'value', width: 15 },
        { header: 'Annual Impact (GBP)', key: 'impact', width: 20 }
      ]

      marketingSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      marketingSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0078D4' }
      }

      let currentRow = 2
      marketingKPIs.forEach((kpi: any) => {
        const inputs = kpi.inputs
        const result = kpi.result
        
        marketingSheet.getCell(`A${currentRow}`).value = kpi.name
        marketingSheet.getCell(`A${currentRow}`).font = { bold: true }
        marketingSheet.getCell(`D${currentRow}`).value = result.impactGBP
        marketingSheet.getCell(`D${currentRow}`).numFmt = '$#,##0'
        marketingSheet.getCell(`D${currentRow}`).font = { bold: true, color: { argb: 'FF0078D4' } }
        
        currentRow++

        Object.entries(inputs).forEach(([key, value]: [string, any]) => {
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim()
          
          marketingSheet.getCell(`B${currentRow}`).value = label
          marketingSheet.getCell(`C${currentRow}`).value = typeof value === 'number' ? value : parseFloat(value) || 0
          currentRow++
        })

        currentRow++
      })

      marketingSheet.getCell(`A${currentRow}`).value = 'TOTAL MARKETING IMPACT'
      marketingSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 }
      const totalImpact = marketingKPIs.reduce((sum: number, kpi: any) => sum + (kpi.result?.impactGBP || 0), 0)
      marketingSheet.getCell(`D${currentRow}`).value = totalImpact
      marketingSheet.getCell(`D${currentRow}`).numFmt = '$#,##0'
      marketingSheet.getCell(`D${currentRow}`).font = { bold: true, size: 12, color: { argb: 'FF107C10' } }
      marketingSheet.getCell(`D${currentRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7F4E7' }
      }
    }

    // Service KPIs Sheet
    if (serviceKPIs && serviceKPIs.length > 0) {
      const serviceSheet = workbook.addWorksheet('Service KPIs')
      
      serviceSheet.columns = [
        { header: 'KPI Name', key: 'kpiName', width: 30 },
        { header: 'Input Field', key: 'inputField', width: 25 },
        { header: 'Value', key: 'value', width: 15 },
        { header: 'Annual Impact (GBP)', key: 'impact', width: 20 }
      ]

      serviceSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      serviceSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0078D4' }
      }

      let currentRow = 2
      serviceKPIs.forEach((kpi: any) => {
        const inputs = kpi.inputs
        const result = kpi.result
        
        serviceSheet.getCell(`A${currentRow}`).value = kpi.name
        serviceSheet.getCell(`A${currentRow}`).font = { bold: true }
        serviceSheet.getCell(`D${currentRow}`).value = result.impactGBP
        serviceSheet.getCell(`D${currentRow}`).numFmt = '$#,##0'
        serviceSheet.getCell(`D${currentRow}`).font = { bold: true, color: { argb: 'FF0078D4' } }
        
        currentRow++

        Object.entries(inputs).forEach(([key, value]: [string, any]) => {
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim()
          
          serviceSheet.getCell(`B${currentRow}`).value = label
          serviceSheet.getCell(`C${currentRow}`).value = typeof value === 'number' ? value : parseFloat(value) || 0
          currentRow++
        })

        currentRow++
      })

      serviceSheet.getCell(`A${currentRow}`).value = 'TOTAL SERVICE IMPACT'
      serviceSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 }
      const totalImpact = serviceKPIs.reduce((sum: number, kpi: any) => sum + (kpi.result?.impactGBP || 0), 0)
      serviceSheet.getCell(`D${currentRow}`).value = totalImpact
      serviceSheet.getCell(`D${currentRow}`).numFmt = '$#,##0'
      serviceSheet.getCell(`D${currentRow}`).font = { bold: true, size: 12, color: { argb: 'FF107C10' } }
      serviceSheet.getCell(`D${currentRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7F4E7' }
      }
    }

    // Finance KPIs Sheet
    if (financeKPIs && financeKPIs.length > 0) {
      const financeSheet = workbook.addWorksheet('Finance KPIs')
      
      financeSheet.columns = [
        { header: 'KPI Name', key: 'kpiName', width: 30 },
        { header: 'Input Field', key: 'inputField', width: 25 },
        { header: 'Value', key: 'value', width: 15 },
        { header: 'Annual Impact (GBP)', key: 'impact', width: 20 }
      ]

      financeSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      financeSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0078D4' }
      }

      let currentRow = 2
      financeKPIs.forEach((kpi: any) => {
        const inputs = kpi.inputs
        const result = kpi.result
        
        financeSheet.getCell(`A${currentRow}`).value = kpi.name
        financeSheet.getCell(`A${currentRow}`).font = { bold: true }
        financeSheet.getCell(`D${currentRow}`).value = result.impactGBP
        financeSheet.getCell(`D${currentRow}`).numFmt = '$#,##0'
        financeSheet.getCell(`D${currentRow}`).font = { bold: true, color: { argb: 'FF0078D4' } }
        
        currentRow++

        Object.entries(inputs).forEach(([key, value]: [string, any]) => {
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim()
          
          financeSheet.getCell(`B${currentRow}`).value = label
          financeSheet.getCell(`C${currentRow}`).value = typeof value === 'number' ? value : parseFloat(value) || 0
          currentRow++
        })

        currentRow++
      })

      financeSheet.getCell(`A${currentRow}`).value = 'TOTAL FINANCE IMPACT'
      financeSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 }
      const totalImpact = financeKPIs.reduce((sum: number, kpi: any) => sum + (kpi.result?.impactGBP || 0), 0)
      financeSheet.getCell(`D${currentRow}`).value = totalImpact
      financeSheet.getCell(`D${currentRow}`).numFmt = '$#,##0'
      financeSheet.getCell(`D${currentRow}`).font = { bold: true, size: 12, color: { argb: 'FF107C10' } }
      financeSheet.getCell(`D${currentRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7F4E7' }
      }
    }

    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Summary', { views: [{ state: 'frozen', ySplit: 1 }] })
    summarySheet.columns = [
      { header: 'Department', key: 'department', width: 25 },
      { header: 'Total Impact (GBP)', key: 'impact', width: 20 }
    ]

    summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 }
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0078D4' }
    }

    const departmentTotals = [
      { name: 'Sales', total: salesKPIs?.reduce((sum: number, kpi: any) => sum + (kpi.result?.impactGBP || 0), 0) || 0 },
      { name: 'Marketing', total: marketingKPIs?.reduce((sum: number, kpi: any) => sum + (kpi.result?.impactGBP || 0), 0) || 0 },
      { name: 'Service', total: serviceKPIs?.reduce((sum: number, kpi: any) => sum + (kpi.result?.impactGBP || 0), 0) || 0 },
      { name: 'Finance', total: financeKPIs?.reduce((sum: number, kpi: any) => sum + (kpi.result?.impactGBP || 0), 0) || 0 },
      { name: 'Supply Chain', total: supplyChainKPIs?.reduce((sum: number, kpi: any) => sum + (kpi.result?.impactGBP || 0), 0) || 0 },
      { name: 'IT', total: itKPIs?.reduce((sum: number, kpi: any) => sum + (kpi.result?.impactGBP || 0), 0) || 0 },
      { name: 'Legal', total: legalKPIs?.reduce((sum: number, kpi: any) => sum + (kpi.result?.impactGBP || 0), 0) || 0 },
    ]

    departmentTotals.forEach((dept, index) => {
      const row = summarySheet.addRow({ department: dept.name, impact: dept.total })
      row.getCell('B').numFmt = '$#,##0'
    })

    // Add grand total
    const grandTotalRow = summarySheet.addRow({ 
      department: 'GRAND TOTAL', 
      impact: departmentTotals.reduce((sum, dept) => sum + dept.total, 0) 
    })
    grandTotalRow.font = { bold: true, size: 13 }
    grandTotalRow.getCell('B').numFmt = '$#,##0'
    grandTotalRow.getCell('B').font = { bold: true, size: 13, color: { argb: 'FF107C10' } }
    grandTotalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE7F4E7' }
    }

    // Move Summary to first position
    workbook.worksheets.forEach((sheet, index) => {
      if (sheet.name === 'Summary') {
        workbook.removeWorksheet(sheet.id)
        workbook.insertWorksheet(0, sheet)
      }
    })

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Agent-Impact-Analysis-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error('Excel export error:', error)
    return NextResponse.json({ error: 'Failed to generate Excel file' }, { status: 500 })
  }
}
