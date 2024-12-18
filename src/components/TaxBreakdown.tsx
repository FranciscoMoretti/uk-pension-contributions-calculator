import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { calculateTax } from "@/utils/taxCalculations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

interface TaxBreakdownProps {
  grossSalary: number;
  pensionContribution: number;
}

export function TaxBreakdown({
  grossSalary,
  pensionContribution,
}: TaxBreakdownProps) {
  const {
    taxableIncome,
    incomeTax,
    ni,
    totalTax,
    netTakeHome,
    incomeTaxBands,
    niBands,
  } = calculateTax(grossSalary, pensionContribution);
  const totalTaxPercentage = (totalTax / grossSalary) * 100;

  return (
    <div className="space-y-6">
      {/* Income Calculation */}
      <div>
        <h3 className="text-sm font-medium mb-2">Income Calculation</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Gross Salary</TableCell>
              <TableCell className="text-right">
                £{grossSalary.toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Pension Contribution</TableCell>
              <TableCell className="text-right text-red-500">
                -£{pensionContribution.toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow className="border-t">
              <TableCell className="font-medium">Taxable Income</TableCell>
              <TableCell className="text-right font-medium">
                £{taxableIncome.toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Tax Breakdown */}
      <div>
        <h3 className="text-sm font-medium mb-2">Tax Breakdown</h3>
        <Accordion type="multiple" className="">
          {/* Income Tax Bands */}
          <AccordionItem value="income-tax" className="border-0">
            <AccordionTrigger className="hover:no-underline py-2 [&[data-state=open]_svg]:rotate-180 w-full flex justify-between items-center hover:bg-muted/50 px-1.5">
              <div className="flex gap-2 items-center">
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                <span>Income Tax</span>
              </div>
              <span className="text-right font-medium text-red-500">
                -£{Math.round(incomeTax).toLocaleString()}
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

          {/* NI Bands */}
          <AccordionItem value="ni" className="border-0 mt-0 py-0 border-t">
            <AccordionTrigger className="hover:no-underline py-2 [&[data-state=open]_svg]:rotate-180 w-full flex justify-between items-center hover:bg-muted/50 px-1.5">
              <div className="flex gap-2 items-center">
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                <span>National Insurance</span>
              </div>
              <span className="text-right font-medium text-red-500">
                -£{Math.round(ni).toLocaleString()}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-0">
              <Table>
                <TableBody>
                  {niBands.map(
                    (band) =>
                      band.amount > 0 && (
                        <TableRow key={band.name}>
                          <TableCell className="">
                            {band.name} ({band.rate}%)
                            <div className="text-xs text-muted-foreground">
                              £{band.amount.toLocaleString()} @ {band.rate}%
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-red-500 ">
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

        {/* Totals */}
        <Table className="">
          <TableBody>
            <TableRow className="border-t">
              <TableCell className="font-medium">Total Tax</TableCell>
              <TableCell className="text-right font-medium text-red-500">
                -£{Math.round(totalTax).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Total Tax % (of gross salary)
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
        <h3 className="text-sm font-medium mb-2">Final Results</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Net Take Home</TableCell>
              <TableCell className="text-right font-medium">
                £{Math.round(netTakeHome).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Net Take Home + Pension
              </TableCell>
              <TableCell className="text-right font-medium">
                £
                {Math.round(netTakeHome + pensionContribution).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
