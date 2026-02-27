'use client';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  temperature: {
    label: 'Temp Anomaly',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export function TemperatureChart({ data, regionKey }: { data: any[], regionKey: string }) {
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
          tickFormatter={(value) => `${value}°C`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" labelFormatter={(label, payload) => `${payload[0]?.payload?.year}: ${payload[0]?.value}°C`}/>}
        />
        <Line
          dataKey={regionKey}
          type="monotone"
          stroke="var(--color-temperature)"
          strokeWidth={2}
          dot={true}
          name="Temp Anomaly"
        />
      </LineChart>
    </ChartContainer>
  );
}
