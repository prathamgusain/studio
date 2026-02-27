'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import React from 'react';

const chartConfig = {
  historical: {
    label: 'CO₂ (ppm)',
    color: 'hsl(var(--primary))',
  },
  predicted: {
    label: 'Prediction',
    color: 'hsl(var(--primary))',
  }
} satisfies ChartConfig;

interface ChartProps {
  data: { year: string; value: number | null }[];
  predictionData?: { year: string; value: number }[];
}

export function CO2Chart({ data, predictionData }: ChartProps) {
  const chartData = React.useMemo(() => {
    const historical = data.map(d => ({ year: d.year, historical: d.value, predicted: null }));
    if (!predictionData || predictionData.length === 0) {
      return historical;
    }
    const predicted = predictionData.map(d => ({ year: d.year, historical: null, predicted: d.value }));
    const combined = [...historical, ...predicted];
    const uniqueYears = [...new Set(combined.map(d => d.year))].sort((a,b) => parseInt(a) - parseInt(b));

    return uniqueYears.map(year => {
      const historicalEntry = combined.find(d => d.year === year && d.historical !== null);
      const predictedEntry = combined.find(d => d.year === year && d.predicted !== null);
      return {
        year,
        historical: historicalEntry ? historicalEntry.historical : null,
        predicted: predictedEntry ? predictedEntry.predicted : null,
      };
    });
  }, [data, predictionData]);

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart 
        accessibilityLayer
        data={chartData}
        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(-2)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `${value}`}
          domain={['dataMin - 5', 'dataMax + 5']}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Legend />
        <Bar dataKey="historical" fill="var(--color-historical)" radius={4} name="CO₂ (ppm)" />
        {predictionData && predictionData.length > 0 && (
          <Bar dataKey="predicted" fill="var(--color-predicted)" fillOpacity={0.6} radius={4} name="Prediction" />
        )}
      </BarChart>
    </ChartContainer>
  );
}
