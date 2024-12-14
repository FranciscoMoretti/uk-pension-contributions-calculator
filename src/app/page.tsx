"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { calculateTax, generateChartData } from "@/utils/taxCalculations"
import { PensionChart } from "@/components/PensionChart"

export default function PensionCalculator() {
  const [grossSalary, setGrossSalary] = useState(50000)
  const [pensionContribution, setPensionContribution] = useState(5000)

  const { taxableIncome, incomeTax, ni, totalTax, netTakeHome, incomeTaxBands, niBands } = calculateTax(grossSalary, pensionContribution)
  const chartData = generateChartData(grossSalary)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">UK Pension Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Details</CardTitle>
            <CardDescription>Enter your salary and pension contribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="grossSalary">Yearly Gross Salary (£)</Label>
                <Input
                  id="grossSalary"
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="pensionContribution">Pension Contribution (£ per year)</Label>
                <Input
                  id="pensionContribution"
                  type="number"
                  value={pensionContribution}
                  onChange={(e) => setPensionContribution(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Breakdown of your finances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pension Contribution Analysis</CardTitle>
          <CardDescription>Impact of varying pension contributions on take-home pay, tax, and pension</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <PensionChart data={chartData} currentPension={pensionContribution} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

