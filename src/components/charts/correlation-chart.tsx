'use client';

import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label as RechartsLabel, ResponsiveContainer } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import React from 'react';

interface CorrelationChartProps {
  data: { x: number; y: number }[];
  xLabel: string;
  yLabel: string;
}

export function CorrelationChart({ data, xLabel, yLabel }: CorrelationChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center rounded-lg border bg-background text-muted-foreground">
        Not enough data to display chart.
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer>
        <ScatterChart
          margin={{
            top: 20,
            right: 30,
            bottom: 20,
            left: 30,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name={xLabel} stroke="hsl(var(--muted-foreground))" fontSize={12}>
             <RechartsLabel value={xLabel} offset={-15} position="insideBottom" fill="hsl(var(--foreground))" />
          </XAxis>
          <YAxis type="number" dataKey="y" name={yLabel} stroke="hsl(var(--muted-foreground))" fontSize={12}>
              <RechartsLabel value={yLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="hsl(var(--foreground))" />
          </YAxis>
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent indicator="dot" />} />
          <Scatter name={`${yLabel} vs ${xLabel}`} data={data} fill="hsl(var(--primary))" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
