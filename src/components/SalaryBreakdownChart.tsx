"use client";

import { BaseChart } from "@/components/ui/BaseChart";
import { ChartConfig } from "@/components/ui/chart";

interface ChartData {
  pension: number;
  takeHome: number;
  tax: number;
  pensionContribution: number;
  net: number;
}

const chartConfig = {
  takeHome: {
    label: "Take Home",
    color: "hsl(var(--chart-2))",
  },
  pensionContribution: {
    label: "Pension",
    color: "hsl(var(--chart-3))",
  },
  tax: {
    label: "Salary Tax",
    color: "hsl(var(--chart-1))",
  },
  net: {
    label: "Net After Pension Tax",
    color: "hsl(var(--foreground))",
  },
} satisfies ChartConfig;

export function SalaryBreakdownChart({
  data,
  currentPension,
  title = "Salary & Pension Allocation by Pension Contribution",
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
      description="Shows how your total compensation (salary + pension) is split between take-home pay, pension savings, and taxes. The black line shows your total money after all taxes (including future pension withdrawal tax)."
      currentValue={currentPension}
      xAxisKey="pension"
      areas={["takeHome", "pensionContribution", "tax"]}
      lines={["net"]}
      tooltipLabel="Salary Breakdown"
      hideRightAxis={true}
    />
  );
}
