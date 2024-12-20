"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BreakdownsAndResults } from "@/components/BreakdownsAndResults";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const formSchema = z.object({
  grossSalary: z.number().min(0).max(1000000),
  pensionContribution: z.number().min(0).max(60000),
  potValue: z.number().min(0),
  annualWithdrawal: z.number().min(0),
});

export default function PensionCalculator() {
  "use no memo";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossSalary: 50000,
      pensionContribution: 5000,
      potValue: 500000,
      annualWithdrawal: 25000,
    },
  });

  const { grossSalary, pensionContribution, potValue, annualWithdrawal } =
    form.watch();

  function onSubmit(values: z.infer<typeof formSchema>) {
    // This is just for form validation, we're using the values directly via watch()
    console.log(values);
  }

  return (
    <div>
      <nav className="border-b">
        <div className="container mx-auto p-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold">UK Pension Calculator</h1>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/FranciscoMoretti/uk-pension-contributions-calculator"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-2 mb-10">
          <h2 className="text-base ">
            Calculate how much you save through salary sacrifice pension
            contributions - one of the most tax-efficient ways to save for
            retirement
          </h2>
          <p className="text-sm text-muted-foreground">
            <strong>Salary Sacrifice:</strong> This calculator assumes
            you&apos;re using salary sacrifice, where pension contributions are
            taken before tax and National Insurance, maximizing tax efficiency.
          </p>
        </div>

        {/* All Inputs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Salary & Contribution Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Salary & Contribution</CardTitle>
              <CardDescription>
                Enter your gross salary and how much you want to contribute via
                salary sacrifice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                              type="number"
                              {...field}
                              className="w-[200px]"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pensionContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Yearly Pension Contribution</FormLabel>
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
                                type="number"
                                {...field}
                                className="w-[200px]"
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your salary sacrifice contribution. Note: The annual
                          allowance of £60,000 includes both your and your
                          employer&apos;s contributions. Your contribution
                          cannot exceed your gross salary.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Pension Withdrawal Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Pension Withdrawal</CardTitle>
              <CardDescription>
                Enter your pension pot value and desired annual withdrawal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="potValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pension Pot Value at Retirement</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">£</span>
                            <Input
                              type="number"
                              {...field}
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
                              type="number"
                              {...field}
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
        </div>

        <BreakdownsAndResults
          grossSalary={Number(grossSalary)}
          pensionContribution={Number(pensionContribution)}
          potValue={Number(potValue)}
          annualPensionWithdrawal={Number(annualWithdrawal)}
        />

        <footer className="mt-12 border-t pt-6 text-sm text-muted-foreground">
          <p>
            This calculator is for illustrative purposes only. Tax rates and
            allowances may change. Always consult a financial advisor for
            personalized advice.
          </p>
        </footer>
      </div>
    </div>
  );
}
