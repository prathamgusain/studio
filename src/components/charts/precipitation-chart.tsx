'use client';

import * as React from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  value: {
    label: 'Events',
  },
  ExtremeDrought: {
    label: 'Extreme Drought',
    color: 'hsl(var(--chart-5))',
  },
  ModerateDrought: {
    label: 'Moderate Drought',
    color: 'hsl(var(--chart-1))',
  },
  Normal: {
    label: 'Normal',
    color: 'hsl(var(--chart-2))',
  },
  HighPrecipitation: {
    label: 'High Precipitation',
    color: 'hsl(var(--chart-3))',
  },
  ExtremeFlooding: {
    label: 'Extreme Flooding',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function PrecipitationChart({ data }: { data: any[] }) {
    const totalValue = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.value, 0);
    }, [data]);

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[300px]">
      <PieChart accessibilityLayer>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        >
            {data.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Pie>
         <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-3xl font-bold"
        >
          {totalValue.toLocaleString()}%
        </text>
        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  );
}
