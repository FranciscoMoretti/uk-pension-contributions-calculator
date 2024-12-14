"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
  Line,
  ComposedChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

interface ChartData {
  pension: number;
  takeHome: number;
  tax: number;
  pensionContribution: number;
  marginalRelief: number;
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
  marginalRelief: {
    label: "Tax Relief Rate",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function PensionChart({
  data,
  currentPension,
}: {
  data: ChartData[];
  currentPension: number;
}) {
  const maxPension = Math.max(...data.map(d => d.pension));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pension Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart data={data} margin={{ left: 12, right: 12, top: 20 }} height={400}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="pension"
              type="number"
              domain={[0, maxPension]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: "Pension Contributions (£)",
                position: "bottom",
                offset: 0,
              }}
              tickFormatter={(value) => `£${value.toLocaleString()}`}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `£${value.toLocaleString()}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload) return null;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm flex flex-col gap-2">
                    <div className="text-sm font-medium">
                      Contributing £{payload[0]?.payload.pension.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Tax Relief Rate: {payload.find(p => p.name === 'marginalRelief')?.value}%
                    </div>
                    {payload.filter(entry => entry.name !== 'marginalRelief').map((entry: any) => (
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
                          £{Math.round(entry.value).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />

            <Area
              yAxisId="left"
              dataKey="takeHome"
              stackId="a"
              type="monotone"
              fill="var(--color-takeHome)"
              stroke="var(--color-takeHome)"
              fillOpacity={0.4}
            />
            <Area
              yAxisId="left"
              dataKey="pensionContribution"
              stackId="a"
              type="monotone"
              fill="var(--color-pensionContribution)"
              stroke="var(--color-pensionContribution)"
              fillOpacity={0.4}
            />
            <Area
              yAxisId="left"
              dataKey="tax"
              stackId="a"
              type="monotone"
              fill="var(--color-tax)"
              stroke="var(--color-tax)"
              fillOpacity={0.1}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="marginalRelief"
              stroke="var(--color-marginalRelief)"
              strokeWidth={2}
              dot={false}
            />
            <ReferenceLine
              x={currentPension}
              yAxisId="left"
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
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
