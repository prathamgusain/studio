'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/app/dashboard/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getFutureOutlook } from '@/app/actions';
import { WandSparkles } from 'lucide-react';

export default function OutlookPage() {
    const { filters, tempData, co2Data, seaLevelData, arcticIceData, extremeWeatherEventsData, loading: historicalDataLoading } = useDashboard();
    const { toast } = useToast();

    const [outlook, setOutlook] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateOutlook = async () => {
        setIsGenerating(true);
        setOutlook(null);

        try {
            const result = await getFutureOutlook({
                region: filters.region,
                temperatureData: tempData,
                co2Data: co2Data,
                seaLevelData: seaLevelData,
                arcticIceData: arcticIceData,
                extremeWeatherEventsData: extremeWeatherEventsData,
            });

            setOutlook(result);

            toast({
                title: 'Future Outlook Generated',
                description: 'An AI-powered summary for the selected data has been created.',
            });
        } catch (error) {
            console.error('Failed to generate outlook:', error);
            toast({
                variant: 'destructive',
                title: 'Outlook Generation Failed',
                description: error instanceof Error ? error.message : 'Could not generate the future outlook.',
            });
        } finally {
            setIsGenerating(false);
        }
    };
    
    const renderMarkdown = (text: string) => {
        return text.split('\n').map((line, index) => {
            if (line.startsWith('#### ')) {
                return <h4 key={index} className="text-lg font-semibold mt-4 mb-2">{line.substring(5)}</h4>;
            }
            if (line.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{line.substring(4)}</h3>;
            }
            if (line.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{line.substring(3)}</h2>;
            }
            if (line.startsWith('# ')) {
                return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.substring(2)}</h1>;
            }
            if (line.startsWith('- ')) {
                 return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>
            }
            if (line.trim() === '') {
                return <br key={index} />;
            }
            const boldedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: boldedLine }} />;
        });
    };

    return (
        <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4 no-print">
                <Header region={filters.region} />
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight px-2">AI-Powered Future Outlook</h2>
                    <Button onClick={handleGenerateOutlook} disabled={isGenerating || historicalDataLoading}>
                        {isGenerating ? 'Generating...' : 'Generate Outlook'}
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Climate Outlook Summary for {filters.region}</CardTitle>
                        <CardDescription>
                            This is an AI-generated analysis based on historical data from {filters.dateRange?.from?.getFullYear()} to {filters.dateRange?.to?.getFullYear()}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isGenerating && (
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <br />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        )}
                        {outlook && !isGenerating && (
                           <div>{renderMarkdown(outlook)}</div>
                        )}
                        {!outlook && !isGenerating && (
                            <div className="text-center py-12 text-muted-foreground">
                                <WandSparkles className="mx-auto h-12 w-12" />
                                <p className="mt-4">Click "Generate Outlook" to create a report.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
