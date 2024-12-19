import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { calculatePensionWithdrawal } from "@/utils/taxCalculations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

interface WithdrawalBreakdownProps {
  potValue: number;
  annualWithdrawal: number;
}

export function WithdrawalBreakdown({
  potValue,
  annualWithdrawal,
}: WithdrawalBreakdownProps) {
  const {
    taxFreePortion,
    taxFreeAmount,
    taxableAmount,
    incomeTaxBands,
    totalTax,
    netWithdrawal,
  } = calculatePensionWithdrawal(potValue, annualWithdrawal);

  const totalTaxPercentage = (totalTax / annualWithdrawal) * 100;

  return (
    <div className="space-y-6">
      {/* Withdrawal Calculation */}
      <div>
        <h3 className="text-sm font-medium mb-2">Withdrawal Calculation</h3>
        <div className="text-xs text-muted-foreground mb-2">
          The first 25% of your pension withdrawals are tax-free
        </div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Annual Withdrawal</TableCell>
              <TableCell className="text-right">
                £{annualWithdrawal.toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-4">
                Tax-Free Amount ({(taxFreePortion * 100).toFixed(1)}%)
              </TableCell>
              <TableCell className="text-right">
                £{Math.round(taxFreeAmount).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow className="border-t">
              <TableCell className="font-medium">Taxable Amount</TableCell>
              <TableCell className="text-right font-medium">
                £{Math.round(taxableAmount).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Tax Breakdown */}
      <div>
        <h3 className="text-sm font-medium mb-2">Tax on Withdrawals</h3>
        <div className="text-xs text-muted-foreground mb-2">
          The taxable portion is treated as income and taxed at your marginal
          rate
        </div>
        <Accordion type="multiple">
          <AccordionItem value="income-tax" className="border-0">
            <AccordionTrigger className="hover:no-underline py-2 [&[data-state=open]_svg]:rotate-180 w-full flex justify-between items-center hover:bg-muted/50 px-1.5">
              <div className="flex gap-2 items-center">
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                <span>Income Tax</span>
              </div>
              <span className="text-right font-medium text-red-500">
                -£{Math.round(totalTax).toLocaleString()}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-0">
              <Table>
                <TableBody>
                  {incomeTaxBands.map(
                    (band) =>
                      band.amount > 0 && (
                        <TableRow key={band.name}>
                          <TableCell className="">
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
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Table className="border-t">
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                Total Tax % (of withdrawal)
              </TableCell>
              <TableCell className="text-right font-medium text-red-500">
                {totalTaxPercentage.toFixed(1)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Final Results */}
      <div>
        <h3 className="text-sm font-medium mb-2">Net Withdrawal</h3>
        <div className="text-xs text-muted-foreground mb-2">
          The amount you&apos;ll receive after tax is deducted from your
          withdrawal
        </div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Net Withdrawal</TableCell>
              <TableCell className="text-right font-medium">
                £{Math.round(netWithdrawal).toLocaleString()}
              </TableCell>
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
  );
}
