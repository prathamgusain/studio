'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  co2: {
    label: 'CO₂ (ppm)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


export function CO2Chart({ data, regionKey }: { data: any[], regionKey: string }) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart 
        accessibilityLayer
        data={data}
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
          content={<ChartTooltipContent indicator="dot" labelFormatter={(label, payload) => `${payload[0]?.payload?.year}: ${payload[0]?.value} ppm`}/>}
        />
        <Bar dataKey={regionKey} fill="var(--color-co2)" radius={4} name="CO₂ (ppm)" />
      </BarChart>
    </ChartContainer>
  );
}
