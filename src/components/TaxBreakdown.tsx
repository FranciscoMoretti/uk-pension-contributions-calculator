import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { calculateTax } from "@/utils/taxCalculations"

interface TaxBreakdownProps {
  grossSalary: number
  pensionContribution: number
}

export function TaxBreakdown({ grossSalary, pensionContribution }: TaxBreakdownProps) {
  const { taxableIncome, incomeTax, ni, totalTax, netTakeHome, incomeTaxBands, niBands } = calculateTax(grossSalary, pensionContribution)
  const totalTaxPercentage = (totalTax / grossSalary) * 100

  return (
    <div className="space-y-6">
      {/* Income Calculation */}
      <div>
        <h3 className="text-sm font-medium mb-2">Income Calculation</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Gross Salary</TableCell>
              <TableCell className="text-right">£{grossSalary.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Pension Contribution</TableCell>
              <TableCell className="text-right text-red-500">-£{pensionContribution.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow className="border-t">
              <TableCell className="font-medium">Taxable Income</TableCell>
              <TableCell className="text-right font-medium">£{taxableIncome.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Tax Breakdown */}
      <div>
        <h3 className="text-sm font-medium mb-2">Tax Breakdown</h3>
        <Table>
          <TableBody>
            {/* Income Tax Bands */}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={2} className="font-medium">Income Tax Bands</TableCell>
            </TableRow>
            {incomeTaxBands.map((band) => 
              band.amount > 0 && (
                <TableRow key={band.name}>
                  <TableCell className="pl-4">
                    {band.name} ({band.rate}%)
                    <div className="text-xs text-muted-foreground">
                      £{band.amount.toLocaleString()} @ {band.rate}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-red-500">
                    -£{Math.round(band.taxPaid).toLocaleString()}
                  </TableCell>
                </TableRow>
              )
            )}
            <TableRow className="border-t">
              <TableCell className="font-medium">Total Income Tax</TableCell>
              <TableCell className="text-right font-medium text-red-500">-£{Math.round(incomeTax).toLocaleString()}</TableCell>
            </TableRow>

            {/* NI Bands */}
            <TableRow className="bg-muted/50 border-t-4">
              <TableCell colSpan={2} className="font-medium">National Insurance Bands</TableCell>
            </TableRow>
            {niBands.map((band) => 
              band.amount > 0 && (
                <TableRow key={band.name}>
                  <TableCell className="pl-4">
                    {band.name} ({band.rate}%)
                    <div className="text-xs text-muted-foreground">
                      £{band.amount.toLocaleString()} @ {band.rate}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-red-500">
                    -£{Math.round(band.taxPaid).toLocaleString()}
                  </TableCell>
                </TableRow>
              )
            )}
            <TableRow className="border-t">
              <TableCell className="font-medium">Total National Insurance</TableCell>
              <TableCell className="text-right font-medium text-red-500">-£{Math.round(ni).toLocaleString()}</TableCell>
            </TableRow>

            {/* Total Tax */}
            <TableRow className="border-t-4">
              <TableCell className="font-medium">Total Tax</TableCell>
              <TableCell className="text-right font-medium text-red-500">-£{Math.round(totalTax).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total Tax % (of gross salary)</TableCell>
              <TableCell className="text-right font-medium text-red-500">
                {totalTaxPercentage.toFixed(1)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Final Results */}
      <div>
        <h3 className="text-sm font-medium mb-2">Final Results</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Net Take Home</TableCell>
              <TableCell className="text-right font-medium">£{Math.round(netTakeHome).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Net Take Home + Pension</TableCell>
              <TableCell className="text-right font-medium">£{Math.round(netTakeHome + pensionContribution).toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 