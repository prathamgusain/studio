'use client';

import React, { useState, useMemo } from 'react';
import { useDashboard } from '@/app/dashboard/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getCorrelation, type CorrelationOutput } from '@/app/actions';
import { GitMerge, Loader2, Info } from 'lucide-react';
import { CorrelationChart } from '@/components/charts/correlation-chart';
import { UpgradePrompt } from '@/components/upgrade-prompt';

type Metric = 'temperature' | 'co2' | 'sea-level' | 'arctic-ice' | 'extreme-weather';

const metricOptions: { value: Metric, label: string }[] = [
    { value: 'temperature', label: 'Temperature Anomaly' },
    { value: 'co2', label: 'Atmospheric CO₂' },
    { value: 'sea-level', label: 'Sea Level Rise' },
    { value: 'arctic-ice', label: 'Arctic Ice Extent' },
    { value: 'extreme-weather', label: 'Extreme Weather Events' },
];

export default function CorrelationPage() {
    const { filters, tempData, co2Data, seaLevelData, arcticIceData, extremeWeatherEventsData, loading: historicalDataLoading, userProfile, isProfileLoading } = useDashboard();
    const { toast } = useToast();

    const [metric1, setMetric1] = useState<Metric>('temperature');
    const [metric2, setMetric2] = useState<Metric>('co2');
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<CorrelationOutput | null>(null);
    const [summary, setSummary] = useState<string | null>(null);

    const isPro = userProfile?.role === 'pro';

    const dataMap = useMemo(() => ({
        temperature: tempData,
        co2: co2Data,
        'sea-level': seaLevelData,
        'arctic-ice': arcticIceData,
        'extreme-weather': extremeWeatherEventsData,
    }), [tempData, co2Data, seaLevelData, arcticIceData, extremeWeatherEventsData]);

    const metric1Label = useMemo(() => metricOptions.find(m => m.value === metric1)?.label || '', [metric1]);
    const metric2Label = useMemo(() => metricOptions.find(m => m.value === metric2)?.label || '', [metric2]);

    const getManualSummary = (correlationResult: CorrelationOutput) => {
        if (correlationResult.correlation === null) {
            return correlationResult.interpretation;
        }

        const r = correlationResult.correlation;
        const absR = Math.abs(r);
        let strength: string;
        if (absR >= 0.8) strength = 'Very Strong';
        else if (absR >= 0.6) strength = 'Strong';
        else if (absR >= 0.4) strength = 'Moderate';
        else if (absR >= 0.2) strength = 'Weak';
        else strength = 'Very Weak or No';

        const direction = r > 0 ? 'positive' : r < 0 ? 'negative' : 'neutral';

        if (strength === 'Very Weak or No') {
            return `The analysis shows little to no meaningful linear relationship between ${metric1Label} and ${metric2Label}. Changes in one metric do not correspond to predictable changes in the other. Other factors are likely influencing these metrics independently.`;
        }

        let summary = `The analysis reveals a ${strength.toLowerCase()} ${direction} correlation. `;
        if (direction === 'positive') {
            summary += `This suggests that as ${metric1Label} increases, ${metric2Label} also tends to increase. `;
        } else {
            summary += `This suggests that as ${metric1Label} increases, ${metric2Label} tends to decrease. `;
        }

        if (strength === 'Very Strong' || strength === 'Strong') {
            summary += `This strong relationship indicates that the two metrics are closely linked.`;
        } else if (strength === 'Moderate') {
            summary += `This moderate relationship indicates a noticeable but not perfect connection between the two metrics.`;
        } else { // Weak
            summary += `While a trend is present, the connection is weak, and other factors likely have a significant impact.`;
        }
        return summary;
    }

    const handleCalculateCorrelation = async () => {
        if (metric1 === metric2) {
            toast({
                variant: 'destructive',
                title: 'Invalid Selection',
                description: 'Please select two different metrics to compare.',
            });
            return;
        }

        setIsCalculating(true);
        setResult(null);
        setSummary(null);

        try {
            const dataset1 = dataMap[metric1];
            const dataset2 = dataMap[metric2];
            
            const correlationResult = await getCorrelation({ dataset1, dataset2 });
            setResult(correlationResult);

            if (correlationResult.correlation === null) {
                 toast({
                    variant: 'default',
                    title: 'Calculation Notice',
                    description: correlationResult.interpretation,
                });
            } else {
                const manualSummary = getManualSummary(correlationResult);
                setSummary(manualSummary);
            }

        } catch (error) {
            console.error('Failed to calculate correlation:', error);
            toast({
                variant: 'destructive',
                title: 'Calculation Failed',
                description: error instanceof Error ? error.message : 'Could not calculate correlation.',
            });
        } finally {
            setIsCalculating(false);
        }
    };
    
    const PageContent = () => {
        if (isProfileLoading) {
            return (
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                    <Card className="w-full max-w-2xl mx-auto">
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-48 w-full" />
                        </CardContent>
                    </Card>
                </div>
            )
        }
    
        if (!isPro) {
          return <UpgradePrompt />;
        }
    
        return (
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Analyze Metric Relationships</CardTitle>
                        <CardDescription>
                            Select two climate metrics to calculate the Pearson correlation coefficient and visualize their relationship with a scatter plot chart.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Metric 1 (X-Axis)</label>
                                    <Select value={metric1} onValueChange={(v) => setMetric1(v as Metric)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select first metric" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {metricOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Metric 2 (Y-Axis)</label>
                                    <Select value={metric2} onValueChange={(v) => setMetric2(v as Metric)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select second metric" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {metricOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button onClick={handleCalculateCorrelation} disabled={isCalculating || historicalDataLoading} className="w-full">
                                {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GitMerge className="mr-2 h-4 w-4" />}
                                Calculate Correlation
                            </Button>
                            {(isCalculating) && (
                                 <Skeleton className="h-[480px] w-full" />
                            )}

                            {!isCalculating && result && (
                                 <Card className="bg-secondary">
                                     <CardHeader>
                                         <CardTitle className="text-lg">Correlation Result</CardTitle>
                                         <CardDescription>
                                             Between {metric1Label} and {metric2Label}.
                                         </CardDescription>
                                     </CardHeader>
                                     <CardContent className="space-y-4">
                                        <div className="text-center">
                                            {result.correlation !== null ? (
                                                <>
                                                    <p className="text-4xl font-bold font-mono">
                                                        r = {result.correlation.toFixed(4)}
                                                    </p>
                                                    <p className="text-muted-foreground mt-2">{result.interpretation}</p>
                                                </>
                                            ) : (
                                                 <p className="text-muted-foreground">{result.interpretation}</p>
                                            )}
                                        </div>
                                        
                                        {summary && (
                                            <div className="rounded-md border border-dashed bg-background p-4">
                                                <h4 className="text-sm font-semibold mb-2 flex items-center">
                                                    <Info className="mr-2 h-4 w-4 text-accent" />
                                                    Insight Summary
                                                </h4>
                                                <p className="text-sm text-muted-foreground">{summary}</p>
                                            </div>
                                        )}
                                        
                                        {result.pairedData.length > 0 && (
                                            <CorrelationChart 
                                                data={result.pairedData}
                                                xLabel={metric1Label}
                                                yLabel={metric2Label}
                                            />
                                        )}
                                     </CardContent>
                                 </Card>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4 no-print">
                <Header region={filters.region} />
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <h2 className="text-xl font-bold tracking-tight px-2">Correlation Analysis</h2>
                <PageContent />
            </main>
        </div>
    );
}
