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
import { PensionCalculations } from "@/components/PensionCalculations";

const formSchema = z.object({
  grossSalary: z.number().min(0).max(1000000),
  pensionContribution: z.number().min(0).max(60000),
  potValue: z.number().min(0),
  annualWithdrawal: z.number().min(0),
});

const handleNumberInput = (value: string) => {
  // Allow empty string for backspace/delete operations
  if (value === "") return 0;

  // Remove any non-digit characters except decimal point
  const sanitized = value.replace(/[^\d.]/g, "");
  // Ensure only one decimal point
  const parts = sanitized.split(".");
  const cleaned = parts[0] + (parts.length > 1 ? "." + parts[1] : "");

  return Number(cleaned) || 0;
};

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">UK Pension Calculator</h1>

      {/* All Inputs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Salary & Contribution Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Salary & Contribution</CardTitle>
            <CardDescription>
              Enter your salary and pension contribution
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
                            type="text"
                            {...field}
                            value={field.value === 0 ? "" : field.value}
                            // onChange={(e) =>
                            //   field.onChange(handleNumberInput(e.target.value))
                            // }
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
                              {...field}
                              value={field.value === 0 ? "" : field.value}
                              onChange={(e) =>
                                field.onChange(
                                  handleNumberInput(e.target.value)
                                )
                              }
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
                      <FormLabel>Pension Pot Value</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">£</span>
                          <Input
                            type="text"
                            {...field}
                            value={field.value === 0 ? "" : field.value}
                            onChange={(e) =>
                              field.onChange(handleNumberInput(e.target.value))
                            }
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
                            type="text"
                            {...field}
                            value={field.value === 0 ? "" : field.value}
                            onChange={(e) =>
                              field.onChange(handleNumberInput(e.target.value))
                            }
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

      <PensionCalculations
        grossSalary={grossSalary}
        pensionContribution={pensionContribution}
        potValue={potValue}
        annualPensionWithdrawal={annualWithdrawal}
      />
    </div>
  );
}
