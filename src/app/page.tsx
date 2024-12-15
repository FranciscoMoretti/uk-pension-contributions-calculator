"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { calculatePensionWithdrawal, generateChartData, generateWithdrawalChartData } from "@/utils/taxCalculations"
import { SalaryBreakdownChart } from "@/components/SalaryBreakdownChart"
import { TaxComparisonChart } from "@/components/TaxComparisonChart"
import { TaxBreakdown } from "@/components/TaxBreakdown"
import { WithdrawalBreakdown } from "@/components/WithdrawalBreakdown"
import { WithdrawalChart } from "@/components/WithdrawalChart"
import { Slider } from "@/components/ui/slider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  grossSalary: z.number().min(0).max(1000000),
  pensionContribution: z.number().min(0).max(60000),
  potValue: z.number().min(0),
  annualWithdrawal: z.number().min(0),
})

const handleNumberInput = (value: string) => {
  // Remove any non-digit characters except decimal point
  const sanitized = value.replace(/[^\d]/g, '')
  return sanitized === '' ? 0 : Number(sanitized)
}

export default function PensionCalculator() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossSalary: 50000,
      pensionContribution: 5000,
      potValue: 500000,
      annualWithdrawal: 25000,
    },
  })

  const { grossSalary, pensionContribution, potValue, annualWithdrawal: annualPensionWithdrawal } = form.watch()
  
  const withdrawalChartData = generateWithdrawalChartData(potValue, annualPensionWithdrawal)
  const { totalTax: totalPensionWithdrawalTax } = calculatePensionWithdrawal(potValue, annualPensionWithdrawal);

  const chartData = generateChartData(grossSalary, pensionContribution).map(item => ({
    ...item,
    taxPensionPercentage: Math.round((totalPensionWithdrawalTax / annualPensionWithdrawal) * 1000) / 10,
    combinedTaxPercentage: Math.round((totalPensionWithdrawalTax / annualPensionWithdrawal * 100 + item.taxSalaryPercentage) * 10) / 10,
  }))

  function onSubmit(values: z.infer<typeof formSchema>) {
    // This is just for form validation, we're using the values directly via watch()
    console.log(values)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">UK Pension Calculator</h1>
      
      {/* Contribution Section */}
      <h2 className="text-2xl font-bold mb-4">Pension Contributions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Input Details</CardTitle>
            <CardDescription>Enter your salary and pension contribution</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Salary Input */}
                <FormField
                  control={form.control}
                  name="grossSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yearly Gross Salary</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">£</span>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            {...field}
                            value={field.value === 0 ? '' : field.value}
                            onChange={e => field.onChange(handleNumberInput(e.target.value))}
                            className="w-[200px]"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pension Input */}
                <FormField
                  control={form.control}
                  name="pensionContribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yearly Pension Contribution</FormLabel>
                      <FormControl>
                        <div className="space-y-4 flex gap-4 items-center flex-wrap">
                            <Slider
                              value={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                              max={Math.min(grossSalary, 60000)}
                              step={100}
                              className="min-w-[200px] flex-1"
                            />
                          <div className="flex items-center space-x-2 min-w-[100px]">
                            <span className="text-sm font-medium">£</span>
                            <Input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              {...field}
                              value={field.value === 0 ? '' : field.value}
                              onChange={e => field.onChange(handleNumberInput(e.target.value))}
                              className="w-[200px]"
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Maximum contribution: £60,000 or 100% of salary
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Salary Tax Breakdown</CardTitle>
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

      <div className="grid gap-8">
        <SalaryBreakdownChart data={chartData} currentPension={pensionContribution} />
        <TaxComparisonChart data={chartData} currentPension={pensionContribution} />
      </div>

      {/* Withdrawal Section */}
      <h2 className="text-2xl font-bold mb-4">Pension Withdrawals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Details</CardTitle>
            <CardDescription>Enter your pension pot value and desired annual withdrawal</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Pot Value Input */}
                <FormField
                  control={form.control}
                  name="potValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pension Pot Value</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">£</span>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            {...field}
                            value={field.value === 0 ? '' : field.value}
                            onChange={e => field.onChange(handleNumberInput(e.target.value))}
                            className="w-[200px]"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Tax-free portion is 25% up to £1,073,100 pot value
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Annual Withdrawal Input */}
                <FormField
                  control={form.control}
                  name="annualWithdrawal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Withdrawal</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">£</span>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            {...field}
                            value={field.value === 0 ? '' : field.value}
                            onChange={e => field.onChange(handleNumberInput(e.target.value))}
                            className="w-[200px]"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Tax Breakdown</CardTitle>
            <CardDescription>Analysis of taxes on pension withdrawals</CardDescription>
          </CardHeader>
          <CardContent>
            <WithdrawalBreakdown 
              potValue={potValue}
              annualWithdrawal={annualPensionWithdrawal}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Withdrawal Analysis</CardTitle>
          <CardDescription>Impact of varying withdrawal amounts on tax and take-home amount</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="">
            <WithdrawalChart data={withdrawalChartData} currentWithdrawal={annualPensionWithdrawal} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

