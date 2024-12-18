"use client";

import {
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
  Line,
  ComposedChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// import { ChartTooltip } from "@/components/ui/chart-tooltip";

interface BaseChartProps {
  data: unknown[];
  config: ChartConfig;
  title: string;
  description?: string;
  currentValue?: number;
  currentLabel?: string;
  xAxisKey: string;
  xAxisFormatter?: (value: number) => string;
  leftAxisFormatter?: (value: number) => string;
  rightAxisFormatter?: (value: number) => string;
  areas?: string[];
  lines?: string[];
  height?: number;
  showPercentages?: boolean;
  tooltipLabel?: string;
  hideRightAxis?: boolean;
}

export function BaseChart({
  data,
  config,
  title,
  description,
  currentValue,
  currentLabel = "Current",
  xAxisKey,
  xAxisFormatter = (value) => `£${value.toLocaleString()}`,
  rightAxisFormatter = (value) => `${value}%`,
  areas = [],
  lines = [],
  height = 400,
  showPercentages = false,
  tooltipLabel,
  hideRightAxis = false,
}: BaseChartProps) {
  const maxX = Math.max(...data.map((d) => d[xAxisKey]));
  const yAxisFormatter = showPercentages
    ? (value: number) => `${value}%`
    : (value: number) => `£${value.toLocaleString()}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <ComposedChart
            data={data}
            margin={{ left: 12, right: hideRightAxis ? 12 : 48, top: 20 }}
            height={height}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              type="number"
              domain={[0, maxX]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={xAxisFormatter}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={yAxisFormatter}
              domain={showPercentages ? [0, 100] : undefined}
            />
            {!hideRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 100]}
                tickFormatter={rightAxisFormatter}
              />
            )}
            <ChartTooltip
              content={({ active, payload }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload?.map((p) => ({
                    ...p,
                    value: showPercentages
                      ? `${Number(p.value)?.toFixed(1)}%`
                      : `£${p.value?.toLocaleString("en-GB", {
                          maximumFractionDigits: 0,
                        })}`,
                  }))}
                  className="min-w-[10rem]"
                  label={tooltipLabel}
                />
              )}
            />

            {areas.map((key) => (
              <Area
                key={key}
                yAxisId="left"
                dataKey={key}
                stackId="a"
                type="monotone"
                fill={`var(--color-${key})`}
                stroke={`var(--color-${key})`}
                fillOpacity={0.6}
                strokeWidth={1.5}
              />
            ))}

            {lines.map((key) => (
              <Line
                key={key}
                yAxisId="left"
                type="monotone"
                dataKey={key}
                stroke={`var(--color-${key})`}
                strokeWidth={key.includes("combined") ? 3 : 2}
                dot={false}
                // strokeDasharray={key === 'marginalRelief' ? "4 2" : "3 3"}
              />
            ))}

            {currentValue && (
              <ReferenceLine
                x={currentValue}
                yAxisId="left"
                stroke="hsl(var(--foreground))"
                strokeDasharray="3 3"
                label={{
                  value: currentLabel,
                  position: "top",
                  fill: "var(--foreground)",
                }}
              />
            )}

            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => config[value as keyof typeof config].label}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
