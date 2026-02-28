'use client';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import React from 'react';

const chartConfig = {
  historical: {
    label: 'Events',
    color: 'hsl(var(--chart-5))',
  },
  predicted: {
    label: 'Prediction',
    color: 'hsl(var(--chart-5))',
  }
} satisfies ChartConfig;

interface ChartProps {
  data: { year: string; value: number | null }[];
  predictionData?: { year: string; value: number }[];
}

export function ExtremeWeatherChart({ data, predictionData }: ChartProps) {
    const chartData = React.useMemo(() => {
    const historical = data.map(d => ({ year: d.year, historical: d.value, predicted: null }));
    if (!predictionData || predictionData.length === 0) {
      return historical;
    }
    const predicted = predictionData.map(d => ({ year: d.year, historical: null, predicted: d.value }));
    const validData = data.filter(d => d.value !== null);
    const lastHistoricalPoint = validData[validData.length - 1];

    if (lastHistoricalPoint) {
      const firstPrediction = predicted.find(p => parseInt(p.year) > parseInt(lastHistoricalPoint.year));
      if (firstPrediction) {
        predicted.unshift({ year: lastHistoricalPoint.year, historical: null, predicted: lastHistoricalPoint.value });
      }
    }

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
      <LineChart 
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
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Legend />
        <Line
          dataKey="historical"
          type="monotone"
          stroke="var(--color-historical)"
          strokeWidth={2}
          dot={true}
          name="Events"
          connectNulls={false}
        />
        {predictionData && predictionData.length > 0 && (
          <Line
            dataKey="predicted"
            type="monotone"
            stroke="var(--color-predicted)"
            strokeWidth={2}
            dot={true}
            strokeDasharray="5 5"
            name="Prediction"
            connectNulls={false}
          />
        )}
      </LineChart>
    </ChartContainer>
  );
}
