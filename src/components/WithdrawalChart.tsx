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
    label: "After-Tax Portion",
    color: "hsl(var(--chart-1))",
  },
  tax: {
    label: "Tax Paid",
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
      title="Pension Withdrawal Breakdown"
      description="Shows how much you'll get to keep from your pension withdrawals. Part of it is tax-free due to LSA, and the rest is taxed as income."
      currentValue={currentWithdrawal}
      xAxisKey="withdrawal"
      areas={["taxFree", "taxable", "tax"]}
      tooltipLabel="Withdrawal"
      hideRightAxis={true}
    />
  );
}
