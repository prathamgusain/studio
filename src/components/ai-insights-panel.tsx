'use client';

import React, { useState, useTransition } from 'react';
import { Button } from './ui/button';
import { WandSparkles, Loader2 } from 'lucide-react';
import { getAiInsights } from '@/app/actions';
import type { GenerateClimateInsightsOutput } from '@/ai/flows/generate-climate-insights';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from './ui/badge';
import { SidebarGroup, SidebarGroupLabel } from './ui/sidebar';
import type { FilterState } from '@/app/dashboard/layout';
import { useDashboard } from '@/app/dashboard/layout';

interface AiInsightsPanelProps {
  filters: FilterState;
}

export function AiInsightsPanel({ filters }: AiInsightsPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [insights, setInsights] = useState<GenerateClimateInsightsOutput | null>(null);
  const { toast } = useToast();
  const { tempData, co2Data, seaLevelData } = useDashboard();

  const handleGenerateInsights = () => {
    startTransition(async () => {
      setInsights(null);
      if (!filters.region || !filters.dateRange?.from || !filters.dateRange?.to) {
        toast({
          variant: 'destructive',
          title: 'Incomplete Filters',
          description: 'Please select a region and a full date range to generate insights.',
        });
        return;
      }
      
      const createDataSummary = (name: string, data: any[], unit: string) => {
        if (!data || data.length === 0) {
            return `${name}: No data available for the selected range.`;
        }
        const start = data[0];
        const end = data[data.length - 1];
        return `${name} from ${start.year} to ${end.year}:
- Starts at ${start.value?.toFixed(2)} ${unit} in ${start.year}.
- Ends at ${end.value?.toFixed(2)} ${unit} in ${end.year}.
- Contains ${data.length} data points.`;
      };

      const climateDataSummary = `
Analysis is for the ${filters.region} region, from ${filters.dateRange.from.toLocaleDateString()} to ${filters.dateRange.to.toLocaleDateString()}.

Raw Data Summary:
${createDataSummary('Temperature Anomaly', tempData, '°C')}
${createDataSummary('Atmospheric CO₂', co2Data, 'ppm')}
${createDataSummary('Sea Level Rise', seaLevelData, 'mm')}
`;

      try {
        const result = await getAiInsights({ climateDataSummary });
        setInsights(result);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error generating insights',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
      }
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>AI Insights</SidebarGroupLabel>
      <div className="space-y-4 pt-2">
        <Button onClick={handleGenerateInsights} disabled={isPending} className="w-full bg-primary/90 hover:bg-primary text-primary-foreground">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <WandSparkles className="mr-2 h-4 w-4" />
          )}
          Generate Insights
        </Button>

        {insights && (
          <Accordion type="multiple" className="w-full text-sm">
            <AccordionItem value="summary">
              <AccordionTrigger>Summary</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{insights.summary}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="trends">
              <AccordionTrigger>
                Trends <Badge variant="secondary" className="ml-2">{insights.trends.length}</Badge>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
                  {insights.trends.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="anomalies">
              <AccordionTrigger>
                Anomalies <Badge variant="secondary" className="ml-2">{insights.anomalies.length}</Badge>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
                  {insights.anomalies.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="future-impacts">
              <AccordionTrigger>
                Future Impacts <Badge variant="destructive" className="ml-2">{insights.futureImpacts.length}</Badge>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
                  {insights.futureImpacts.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </SidebarGroup>
  );
}
