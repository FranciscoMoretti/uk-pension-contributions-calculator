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
    label: "Marginal Tax Relief",
    color: "hsl(var(--chart-4))",
  },
  taxSalaryPercentage: {
    label: "Salary Tax",
    color: "hsl(var(--chart-5))",
  },
  taxPensionPercentage: {
    label: "Pension Withdrawal Tax ",
    color: "hsl(var(--chart-6))",
  },
  combinedTaxPercentage: {
    label: "Combined Tax",
    color: "hsl(var(--foreground))",
  },
  marginalCombinedReliefPercentage: {
    label: "Marginal Combined Relief",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function TaxComparisonChart({
  data,
  currentPension,
}: {
  data: ChartData[];
  currentPension: number;
}) {
  return (
    <BaseChart
      data={data}
      config={chartConfig}
      title="Tax Rate Comparison"
      description="Comparison of different tax rates based on pension contribution"
      currentValue={currentPension}
      xAxisKey="pension"
      lines={[
        "marginalReliefPercentage",
        "marginalCombinedReliefPercentage",
        "taxSalaryPercentage",
        "taxPensionPercentage",
        "combinedTaxPercentage",
      ]}
      showPercentages={true}
      tooltipLabel="Tax Rate Comparison"
      hideRightAxis={true}
    />
  );
}
