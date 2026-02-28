'use client';

import {
  Scatter,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label as RechartsLabel,
  ResponsiveContainer,
} from 'recharts';
import React from 'react';

interface CorrelationChartProps {
  data: { x: number; y: number }[];
  xLabel: string;
  yLabel: string;
}

const CustomTooltip = ({ active, payload, xLabel, yLabel }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {xLabel}
            </span>
            <span className="font-bold">
              {typeof data.x === 'number' ? data.x.toFixed(2) : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {yLabel}
            </span>
            <span className="font-bold">
              {typeof data.y === 'number' ? data.y.toFixed(2) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


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
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            content={<CustomTooltip xLabel={xLabel} yLabel={yLabel} />}
          />
          <Scatter name={`${yLabel} vs ${xLabel}`} data={data} fill="hsl(var(--primary))" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
