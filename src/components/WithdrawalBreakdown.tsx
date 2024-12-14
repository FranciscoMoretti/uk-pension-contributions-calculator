import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { calculatePensionWithdrawal } from "@/utils/taxCalculations"

interface WithdrawalBreakdownProps {
  potValue: number
  annualWithdrawal: number
}

export function WithdrawalBreakdown({ potValue, annualWithdrawal }: WithdrawalBreakdownProps) {
  const { 
    taxFreePortion,
    taxFreeAmount,
    taxableAmount,
    incomeTaxBands,
    totalTax,
    netWithdrawal,
  } = calculatePensionWithdrawal(potValue, annualWithdrawal)

  const totalTaxPercentage = (totalTax / annualWithdrawal) * 100

  return (
    <div className="space-y-6">
      {/* Withdrawal Calculation */}
      <div>
        <h3 className="text-sm font-medium mb-2">Withdrawal Calculation</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Annual Withdrawal</TableCell>
              <TableCell className="text-right">£{annualWithdrawal.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-4">
                Tax-Free Amount ({(taxFreePortion * 100).toFixed(1)}%)
              </TableCell>
              <TableCell className="text-right">£{Math.round(taxFreeAmount).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow className="border-t">
              <TableCell className="font-medium">Taxable Amount</TableCell>
              <TableCell className="text-right font-medium">£{Math.round(taxableAmount).toLocaleString()}</TableCell>
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
              <TableCell className="text-right font-medium text-red-500">-£{Math.round(totalTax).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total Tax % (of withdrawal)</TableCell>
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
              <TableCell className="font-medium">Net Withdrawal</TableCell>
              <TableCell className="text-right font-medium">£{Math.round(netWithdrawal).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-xs text-muted-foreground" colSpan={2}>
                Based on a pot value of £{potValue.toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 