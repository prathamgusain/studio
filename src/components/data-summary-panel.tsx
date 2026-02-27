'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SidebarGroup, SidebarGroupLabel } from './ui/sidebar';
import { useDashboard } from '@/app/dashboard/layout';
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

const SummaryDisplay: React.FC<{ title: string; data: DataPoint[]; unit: string }> = ({ title, data, unit }) => {
  const summary = getSummary(data);

  if (summary.direction === 'neutral' || summary.change === undefined) {
    return (
       <AccordionItem value={title}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent className="text-muted-foreground text-sm">
          Not enough data to generate a summary for this period.
        </AccordionContent>
      </AccordionItem>
    )
  }

  const colorClass = summary.direction === 'increase' ? 'text-red-400' : 'text-green-400';
  const Icon = summary.direction === 'increase' ? ArrowUp : ArrowDown;

  return (
    <AccordionItem value={title}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent className="text-muted-foreground text-xs space-y-2">
        <div className="flex justify-between items-center">
            <span>Overall Change:</span>
            <span className={`font-semibold flex items-center ${colorClass}`}>
                <Icon className="h-3 w-3 mr-1" />
                {summary.change.toFixed(2)} {unit} ({summary.changePercent.toFixed(1)}%)
            </span>
        </div>
        <div className="flex justify-between">
            <span>Highest Point:</span>
            <span className="font-semibold">{summary.highest.value.toFixed(2)} {unit} ({summary.highest.year})</span>
        </div>
         <div className="flex justify-between">
            <span>Lowest Point:</span>
            <span className="font-semibold">{summary.lowest.value.toFixed(2)} {unit} ({summary.lowest.year})</span>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};


export function DataSummaryPanel() {
  const { tempData, co2Data, seaLevelData, loading } = useDashboard();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Data Summary</SidebarGroupLabel>
      <div className="space-y-4 pt-2 text-sm">
        {loading ? (
          <p className="text-muted-foreground">Loading data...</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            <SummaryDisplay title="Temperature" data={tempData} unit="°C" />
            <SummaryDisplay title="CO₂ Levels" data={co2Data} unit="ppm" />
            <SummaryDisplay title="Sea Level" data={seaLevelData} unit="mm" />
          </Accordion>
        )}
      </div>
    </SidebarGroup>
  );
}
