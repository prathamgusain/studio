'use client';

import React from 'react';
import { useDashboard } from '@/app/dashboard/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface DataPoint {
  year: string;
  value: number | null;
}

const getSummary = (data: DataPoint[]) => {
  if (!data) {
    return { direction: 'neutral' as const };
  }

  const validData = data.filter(d => d.value !== null && d.value !== undefined);
  if (validData.length < 2) {
    return { direction: 'neutral' as const };
  }

  const start = validData[0];
  const end = validData[validData.length - 1];
  
  const startValue = start.value!;
  const endValue = end.value!;

  const change = endValue - startValue;
  const changePercent = startValue !== 0 ? (change / Math.abs(startValue)) * 100 : 0;
  const direction = change > 0 ? 'increase' : (change < 0 ? 'decrease' : 'neutral');

  let highest = start;
  let lowest = start;

  for (const point of validData) {
    if (point.value! > highest.value!) {
      highest = point;
    }
    if (point.value! < lowest.value!) {
      lowest = point;
    }
  }

  return {
    change,
    changePercent,
    direction,
    highest: { year: highest.year, value: highest.value! },
    lowest: { year: lowest.year, value: lowest.value! },
  };
};

const SummaryDisplayCard: React.FC<{ title: string; data: DataPoint[]; unit: string; description: string }> = ({ title, data, unit, description }) => {
  const summary = getSummary(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        {summary.direction === 'neutral' || summary.change === undefined ? (
           <div className="text-muted-foreground">
            Not enough data to generate a summary for this period.
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Overall Change:</span>
                <span className={`font-semibold flex items-center ${summary.direction === 'increase' ? 'text-red-400' : 'text-green-400'}`}>
                    {summary.direction === 'increase' ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    {summary.change.toFixed(2)} {unit} ({summary.changePercent.toFixed(1)}%)
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Highest Point:</span>
                <span className="font-semibold">{summary.highest.value.toFixed(2)} {unit} ({summary.highest.year})</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Lowest Point:</span>
                <span className="font-semibold">{summary.lowest.value.toFixed(2)} {unit} ({summary.lowest.year})</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
};

export default function SummaryPage() {
  const { filters, tempData, co2Data, seaLevelData, loading } = useDashboard();
  const fromYear = filters.dateRange?.from?.getFullYear();
  const toYear = filters.dateRange?.to?.getFullYear();
  
  const descriptions = {
    temp: `Summary of temperature anomaly data for ${filters.region} from ${fromYear} to ${toYear}.`,
    co2: `Summary of atmospheric CO₂ data for ${filters.region} from ${fromYear} to ${toYear}.`,
    seaLevel: `Summary of sea level rise data for ${filters.region} from ${fromYear} to ${toYear}.`
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4 no-print">
         <Header region={filters.region} />
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
           <h2 className="text-xl font-bold tracking-tight px-2">Data Summaries</h2>
           <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
            {loading ? (
              <>
                <Skeleton className="h-[180px] w-full" />
                <Skeleton className="h-[180px] w-full" />
                <Skeleton className="h-[180px] w-full" />
              </>
            ) : (
              <>
                <SummaryDisplayCard title="Temperature" data={tempData} unit="°C" description={descriptions.temp} />
                <SummaryDisplayCard title="CO₂ Levels" data={co2Data} unit="ppm" description={descriptions.co2} />
                <SummaryDisplayCard title="Sea Level Rise" data={seaLevelData} unit="mm" description={descriptions.seaLevel} />
              </>
            )}
           </div>
        </div>
      </main>
    </div>
  );
}
