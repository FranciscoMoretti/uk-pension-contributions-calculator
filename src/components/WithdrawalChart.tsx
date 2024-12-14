"use client";

import {
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
} from "@/components/ui/chart";

interface ChartData {
  withdrawal: number;
  taxFree: number;
  tax: number;
  taxable: number;
}

const chartConfig = {
  taxFree: {
    label: "Tax-Free Amount",
    color: "hsl(var(--chart-3))",
  },
  taxable: {
    label: "Taxed Amount",
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
  const maxWithdrawal = Math.max(...data.map(d => d.withdrawal));

  return (
    <Card >
      <CardHeader>
        <CardTitle>Withdrawal Breakdown</CardTitle>
      </CardHeader>
      <CardContent >
        <ChartContainer config={chartConfig} >
          <ComposedChart  data={data} margin={{ left: 12, right: 12, top: 20 }} height={400}>
            <CartesianGrid vertical={false} />
            <XAxis
              className="py-10"
              dataKey="withdrawal"
              type="number"
              domain={[0, maxWithdrawal]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}

              tickFormatter={(value) => `£${value.toLocaleString()}`}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `£${value.toLocaleString()}`}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload) return null;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm flex flex-col gap-2">
                    <div className="text-sm font-medium">
                      Withdrawing £{payload[0]?.payload.withdrawal.toLocaleString()}
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
              dataKey="taxFree"
              stackId="a"
              type="monotone"
              fill="var(--color-taxFree)"
              stroke="var(--color-taxFree)"
              fillOpacity={0.4}
            />
            <Area
              yAxisId="left"
              dataKey="taxable"
              stackId="a"
              type="monotone"
              fill="var(--color-taxable)"
              stroke="var(--color-taxable)"
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
            <ReferenceLine
              x={currentWithdrawal}
              yAxisId="left"
              stroke="hsl(var(--foreground))"
              strokeDasharray="3 3"
              label={{
                value: "Current",
                position: "top",
                fill: "var(--foreground)",
              }}
            />
            <ChartLegend
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