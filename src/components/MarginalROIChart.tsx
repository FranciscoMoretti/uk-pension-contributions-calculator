"use client";

import { BaseChart } from "@/components/ui/BaseChart";
import { ChartConfig } from "@/components/ui/chart";

interface ChartData {
  pension: number;
  marginalCombinedReliefRate: number;
  baselineReturn: number;
  pensionBoost: number;
}

const chartConfig = {
  baselineReturn: {
    label: "Baseline Take-Home (No Pension)",
    color: "hsl(var(--chart-5))",
  },
  pensionBoost: {
    label: "Pension-Boosted Return",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

export function MarginalROIChart({
  data,
  currentPension,
}: {
  data: ChartData[];
  currentPension: number;
}) {
  const processedData = data.map((d) => ({
    ...d,
    baselineReturn: 100, // Always 100% as baseline
    pensionBoost:
      Math.round((1 / (1 - d.marginalCombinedReliefRate)) * 1000) / 10, // Convert to percentage with 1 decimal
  }));

  return (
    <BaseChart
      data={processedData}
      config={chartConfig}
      title="Return on Investment"
      description="For every £1 you put in your pension vs. taking it as salary. The purple line shows how much more money you get by using your pension vs. taking it as salary (due to tax savings)."
      currentValue={currentPension}
      xAxisKey="pension"
      lines={["baselineReturn", "pensionBoost"]}
      showPercentages={true}
      tooltipLabel="Return on Investment"
      hideRightAxis={true}
    />
  );
}
