"use client";

import { BaseChart } from "@/components/ui/BaseChart";
import { ChartConfig } from "@/components/ui/chart";

interface ChartData {
  pension: number;
  takeHome: number;
  tax: number;
  pensionContribution: number;
}

const chartConfig = {
  takeHome: {
    label: "Take Home",
    color: "hsl(var(--chart-1))",
  },
  pensionContribution: {
    label: "Pension",
    color: "hsl(var(--chart-3))",
  },
  tax: {
    label: "Tax",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function SalaryBreakdownChart({
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
      title="Salary Breakdown"
      description="Impact of varying pension contributions on take-home pay, tax, and pension"
      currentValue={currentPension}
      xAxisKey="pension"
      areas={["takeHome", "pensionContribution", "tax"]}
      showPercentages={false}
      tooltipLabel="Salary Breakdown"
    />
  );
}
