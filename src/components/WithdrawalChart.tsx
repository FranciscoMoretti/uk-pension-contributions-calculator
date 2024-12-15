"use client";

import { BaseChart } from "@/components/ui/BaseChart";
import { ChartConfig } from "@/components/ui/chart";

interface ChartData {
  withdrawal: number;
  taxFree: number;
  tax: number;
  taxable: number;
}

const chartConfig = {
  taxFree: {
    label: "Tax-Free",
    color: "hsl(var(--chart-3))",
  },
  taxable: {
    label: "Taxed",
    color: "hsl(var(--chart-1))",
  },
  tax: {
    label: "Tax",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function WithdrawalChart({
  data,
  currentWithdrawal,
}: {
  data: ChartData[];
  currentWithdrawal: number;
}) {
  return (
    <BaseChart
      data={data}
      config={chartConfig}
      title="Withdrawal Breakdown"
      description="Impact of varying withdrawal amounts on tax and take-home amount"
      currentValue={currentWithdrawal}
      xAxisKey="withdrawal"
      areas={["taxFree", "taxable", "tax"]}
      tooltipLabel="Withdrawal"
      hideRightAxis={true}
    />
  );
} 