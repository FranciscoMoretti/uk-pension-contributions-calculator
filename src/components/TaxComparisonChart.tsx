"use client";

import { BaseChart } from "@/components/ui/BaseChart";
import { ChartConfig } from "@/components/ui/chart";

interface ChartData {
  pension: number;
  marginalReliefPercentage: number;
  taxSalaryPercentage: number;
  taxPensionPercentage: number;
  combinedTaxPercentage: number;
}

const chartConfig = {
  marginalReliefPercentage: {
    label: "Marginal Immediate Tax Savings",
    color: "hsl(var(--chart-4))",
  },
  taxSalaryPercentage: {
    label: "Current Salary Tax Rate",
    color: "hsl(var(--chart-5))",
  },
  taxPensionPercentage: {
    label: "Future Pension Tax Rate",
    color: "hsl(var(--chart-6))",
  },
  combinedTaxPercentage: {
    label: "Total Tax Rate",
    color: "hsl(var(--foreground))",
  },
  marginalCombinedReliefPercentage: {
    label: "Marginal Net Tax Savings",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function TaxComparisonChart({
  data,
  currentPension,
  title = "Tax Rates & Savings by Pension Contribution",
  xAxisLabel = "Pension Contribution",
}: {
  data: ChartData[];
  currentPension: number;
  title?: string;
  xAxisLabel?: string;
}) {
  return (
    <BaseChart
      data={data}
      config={chartConfig}
      title={title}
      xAxisLabel={xAxisLabel}
      description="Shows your current tax rates and potential savings. The black line shows your total tax rate (salary + future pension). The blue line shows your net tax savings after considering both current and future taxes."
      currentValue={currentPension}
      xAxisKey="pension"
      lines={[
        "marginalReliefPercentage",
        "marginalCombinedReliefPercentage",
        "taxSalaryPercentage",
        "taxPensionPercentage",
        "combinedTaxPercentage",
      ]}
      dottedLines={[
        "marginalReliefPercentage",
        "taxSalaryPercentage",
        "taxPensionPercentage",
      ]}
      showPercentages={true}
      tooltipLabel="Tax Rate Comparison"
      hideRightAxis={true}
    />
  );
}
