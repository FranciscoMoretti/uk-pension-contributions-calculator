"use client";

import { ChartConfig } from "./ui/chart";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey?: string;
  }>;
  config: ChartConfig;
  showPercentages?: boolean;
}

export function ChartTooltipContent({ active, payload, config, showPercentages = false }: TooltipProps) {
  if (!active || !payload?.length) return null;

  const xValue = payload[0]?.payload?.pension;
  const entries = payload.filter(p => config[p.dataKey as keyof typeof config]);

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm flex flex-col gap-2">
      <div className="text-sm font-medium">
        Contributing £{xValue?.toLocaleString()}
      </div>
      <div className="border-t pt-2">
        {entries.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center gap-2 text-sm w-full justify-between"
          >
            <div className="flex gap-1 items-center">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: config[entry.dataKey as keyof typeof config]?.color,
                }}
              />
              <span>{config[entry.dataKey as keyof typeof config]?.label}:</span>
            </div>
            <span className="font-medium">
              {showPercentages 
                ? `${entry.value.toFixed(1)}%`
                : `£${Math.round(entry.value).toLocaleString()}`
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 