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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { ChartTooltip } from "@/components/ui/chart-tooltip";

interface BaseChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  config: ChartConfig;
  title: string;
  description?: string;
  currentValue?: number;
  currentLabel?: string;
  xAxisKey: string;
  xAxisFormatter?: (value: number) => string;
  xAxisLabel?: string;
  rightAxisFormatter?: (value: number) => string;
  areas?: string[];
  lines?: string[];
  dottedLines?: string[];
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
  xAxisLabel,
  xAxisFormatter = (value) => `£${String(value).toLocaleString()}`,
  rightAxisFormatter = (value) => `${value}%`,
  areas = [],
  lines = [],
  dottedLines = [],
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
        <ScrollArea className="w-[calc(100dvw-48px)] sm:w-full">
          <div className="w-full min-w-[590px]">
            <ChartContainer config={config}>
              <ComposedChart
                data={data}
                margin={{
                  left: 12,
                  right: hideRightAxis ? 12 : 48,
                  top: 20,
                  bottom: 35,
                }}
                height={height}
                width={800}
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
                  label={{
                    value: xAxisLabel,
                    position: "bottom",
                    offset: 0,
                  }}
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
                      label={
                        tooltipLabel
                          ? `${tooltipLabel} for ${xAxisFormatter(
                              payload?.[0]?.payload?.[xAxisKey]
                            )}`
                          : xAxisFormatter(payload?.[0]?.payload?.[xAxisKey])
                      }
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
                    strokeDasharray={
                      dottedLines?.includes(key) ? "4 2" : undefined
                    }
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
                  height={46}
                  formatter={(value) =>
                    config[value as keyof typeof config].label
                  }
                />
              </ComposedChart>
            </ChartContainer>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
