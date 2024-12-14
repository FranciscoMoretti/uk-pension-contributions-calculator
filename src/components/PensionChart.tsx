"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  pension: string;
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

export function PensionChart({
  data,
  currentPension,
}: {
  data: ChartData[];
  currentPension: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pension Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={data} margin={{ left: 12, right: 12 }} height={400}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="pension"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: "Pension Contributions (£)",
                position: "bottom",
                offset: 0,
              }}
              tickFormatter={(value) => `£${value}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `£${value}`}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload) return null;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm flex flex-col gap-2">
                    <div className="text-sm font-medium">
                      Contributing £{payload[0]?.payload.pension}
                    </div>
                    {payload.map((entry: any) => (
                      <div
                        key={entry.name}
                        className="flex items-center gap-2 text-sm w-full justify-between"
                      >
                        <div className="flex gap-1 items-center">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                chartConfig[
                                  entry.name as keyof typeof chartConfig
                                ].color,
                            }}
                          />
                          <span>
                            {
                              chartConfig[
                                entry.name as keyof typeof chartConfig
                              ].label
                            }
                            :
                          </span>
                        </div>

                        <span className="font-medium">
                          £{entry.value.toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />

            <Area
              dataKey="takeHome"
              stackId="a"
              type="natural"
              fill="var(--color-takeHome)"
              stroke="var(--color-takeHome)"
              fillOpacity={0.4}
            />
            <Area
              dataKey="pensionContribution"
              stackId="a"
              type="natural"
              fill="var(--color-pensionContribution)"
              stroke="var(--color-pensionContribution)"
              fillOpacity={0.4}
            />
            <Area
              dataKey="tax"
              stackId="a"
              type="natural"
              fill="var(--color-tax)"
              stroke="var(--color-tax)"
              fillOpacity={0.1}
            />
            <ReferenceLine
              x={String(currentPension)}
              stroke="hsl(var(--foreground))"
              strokeDasharray="3 3"
              label={{
                value: "Current",
                position: "top",
                fill: "var(--foreground)",
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) =>
                chartConfig[value as keyof typeof chartConfig].label
              }
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
