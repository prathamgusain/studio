'use client';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  value: {
    label: 'Arctic Ice Extent',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ArcticIceChart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart
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
          tickFormatter={(value) => `${value}M km²`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" labelFormatter={(label, payload) => `${payload[0]?.payload?.year}: ${payload[0]?.value}M km²`}/>}
        />
        <Line
          dataKey="value"
          type="monotone"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={true}
          name="Arctic Ice Extent"
        />
      </LineChart>
    </ChartContainer>
  );
}
