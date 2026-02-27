'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/app/dashboard/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getPrediction } from '@/app/actions';
import type { PredictClimateDataOutput } from '@/ai/flows/predict-climate-data';

import { TemperatureChart } from '@/components/charts/temperature-chart';
import { CO2Chart } from '@/components/charts/co2-chart';
import { SeaLevelChart } from '@/components/charts/sea-level-chart';
import { ArcticIceChart } from '@/components/charts/arctic-ice-chart';
import { ExtremeWeatherChart } from '@/components/charts/extreme-weather-chart';

type Predictions = {
    temp: PredictClimateDataOutput;
    co2: PredictClimateDataOutput;
    seaLevel: PredictClimateDataOutput;
    arcticIce: PredictClimateDataOutput;
    extremeWeather: PredictClimateDataOutput;
};

export default function PredictionsPage() {
    const { filters, tempData, co2Data, seaLevelData, arcticIceData, extremeWeatherEventsData, loading: historicalDataLoading } = useDashboard();
    const { toast } = useToast();

    const [predictions, setPredictions] = useState<Predictions | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);

    const handleGeneratePredictions = async () => {
        setIsPredicting(true);
        setPredictions(null);

        try {
            const [tempPrediction, co2Prediction, seaLevelPrediction, arcticIcePrediction, extremeWeatherPrediction] = await Promise.all([
                getPrediction({ dataType: 'Temperature Anomaly', data: tempData }),
                getPrediction({ dataType: 'Atmospheric CO2', data: co2Data }),
                getPrediction({ dataType: 'Sea Level Rise', data: seaLevelData }),
                getPrediction({ dataType: 'Arctic Ice Extent', data: arcticIceData }),
                getPrediction({ dataType: 'Extreme Weather Events', data: extremeWeatherEventsData }),
            ]);

            setPredictions({
                temp: tempPrediction,
                co2: co2Prediction,
                seaLevel: seaLevelPrediction,
                arcticIce: arcticIcePrediction,
                extremeWeather: extremeWeatherPrediction,
            });

            toast({
                title: 'Predictions Generated',
                description: 'Future trends up to 2040 have been added to the charts.',
            });
        } catch (error) {
            console.error('Failed to generate predictions:', error);
            toast({
                variant: 'destructive',
                title: 'Prediction Failed',
                description: error instanceof Error ? error.message : 'Could not generate predictions.',
            });
        } finally {
            setIsPredicting(false);
        }
    };
    
    const hasPredictions = predictions !== null;

    return (
        <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4 no-print">
                <Header region={filters.region} />
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight px-2">Predictive Analysis to 2040</h2>
                    <Button onClick={handleGeneratePredictions} disabled={isPredicting || historicalDataLoading}>
                        {isPredicting ? 'Generating...' : 'Generate Predictions'}
                    </Button>
                </div>
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                        <Card className="sm:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle>Temperature Anomaly</CardTitle>
                                <CardDescription>Historical data with prediction up to 2040.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {historicalDataLoading ? (
                                    <Skeleton className="h-[250px] w-full" />
                                ) : (
                                    <TemperatureChart data={tempData} predictionData={predictions?.temp} />
                                )}
                                {isPredicting && !hasPredictions && <Skeleton className="absolute inset-0 bg-background/80" />}
                            </CardContent>
                        </Card>
                        <Card className="sm:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle>Atmospheric CO₂ Levels</CardTitle>
                                <CardDescription>Historical data with prediction up to 2040.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {historicalDataLoading ? (
                                    <Skeleton className="h-[250px] w-full" />
                                ) : (
                                    <CO2Chart data={co2Data} predictionData={predictions?.co2} />
                                )}
                                {isPredicting && !hasPredictions && <Skeleton className="absolute inset-0 bg-background/80" />}
                            </CardContent>
                        </Card>
                        <Card className="sm:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle>Sea Level Rise</CardTitle>
                                <CardDescription>Historical data with prediction up to 2040.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {historicalDataLoading ? (
                                    <Skeleton className="h-[250px] w-full" />
                                ) : (
                                    <SeaLevelChart data={seaLevelData} predictionData={predictions?.seaLevel} />
                                )}
                                {isPredicting && !hasPredictions && <Skeleton className="absolute inset-0 bg-background/80" />}
                            </CardContent>
                        </Card>
                        <Card className="sm:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle>Arctic Ice Extent</CardTitle>
                                <CardDescription>Historical data with prediction up to 2040.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {historicalDataLoading ? (
                                    <Skeleton className="h-[250px] w-full" />
                                ) : (
                                    <ArcticIceChart data={arcticIceData} predictionData={predictions?.arcticIce} />
                                )}
                                {isPredicting && !hasPredictions && <Skeleton className="absolute inset-0 bg-background/80" />}
                            </CardContent>
                        </Card>
                        <Card className="sm:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle>Extreme Weather Events</CardTitle>
                                <CardDescription>Historical data with prediction up to 2040.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {historicalDataLoading ? (
                                    <Skeleton className="h-[250px] w-full" />
                                ) : (
                                    <ExtremeWeatherChart data={extremeWeatherEventsData} predictionData={predictions?.extremeWeather} />
                                )}
                                {isPredicting && !hasPredictions && <Skeleton className="absolute inset-0 bg-background/80" />}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
