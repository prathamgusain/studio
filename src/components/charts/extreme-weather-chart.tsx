'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  value: {
    label: 'Events',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;


export function ExtremeWeatherChart({ data }: { data: any[] }) {
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
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" labelFormatter={(label, payload) => `${payload[0]?.payload?.year}: ${payload[0]?.value} events`}/>}
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} name="Events" />
      </BarChart>
    </ChartContainer>
  );
}
