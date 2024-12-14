"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateChartData } from "@/utils/taxCalculations"
import { PensionChart } from "@/components/PensionChart"
import { TaxBreakdown } from "@/components/TaxBreakdown"
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
    },
  })

  const { grossSalary, pensionContribution } = form.watch()
  const chartData = generateChartData(grossSalary)

  function onSubmit(values: z.infer<typeof formSchema>) {
    // This is just for form validation, we're using the values directly via watch()
    console.log(values)
  }

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

