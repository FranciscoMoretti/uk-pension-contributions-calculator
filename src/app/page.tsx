"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateChartData } from "@/utils/taxCalculations"
import { PensionChart } from "@/components/PensionChart"
import { TaxBreakdown } from "@/components/TaxBreakdown"

export default function PensionCalculator() {
  const [grossSalary, setGrossSalary] = useState(50000)
  const [pensionContribution, setPensionContribution] = useState(5000)

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
          <CardContent>
            <TaxBreakdown 
              grossSalary={grossSalary} 
              pensionContribution={pensionContribution} 
            />
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

