'use client';
import React, { useState, useEffect } from 'react';
import type { FilterState } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TemperatureChart } from './charts/temperature-chart';
import { CO2Chart } from './charts/co2-chart';
import { PrecipitationChart } from './charts/precipitation-chart';
import { precipitationData } from '@/lib/data';
import { Header } from './header';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  filters: FilterState;
}

export function Dashboard({ filters }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [tempData, setTempData] = useState([]);
  const [co2Data, setCo2Data] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (!filters.dateRange?.from || !filters.dateRange?.to) {
        return;
      }
      
      setLoading(true);
      
      const fromYear = filters.dateRange.from.getFullYear();
      const toYear = filters.dateRange.to.getFullYear();
      const region = filters.region;
      
      try {
        const [tempRes, co2Res] = await Promise.all([
          fetch(`/api/climate?type=temperature&region=${encodeURIComponent(region)}&from=${fromYear}&to=${toYear}`),
          fetch(`/api/climate?type=co2&region=${encodeURIComponent(region)}&from=${fromYear}&to=${toYear}`),
        ]);
        
        if (!tempRes.ok || !co2Res.ok) {
            throw new Error('Failed to fetch climate data');
        }

        const tempDataJson = await tempRes.json();
        const co2DataJson = await co2Res.json();
        
        setTempData(tempDataJson);
        setCo2Data(co2DataJson);
      } catch (error) {
        console.error("Failed to fetch climate data", error);
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: error instanceof Error ? error.message : "Could not fetch climate data.",
        })
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [filters.dateRange, filters.region, toast]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4 no-print">
         <Header region={filters.region} />
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2 print-chart-wrapper" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-2">
                <CardTitle>Temperature Anomaly</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Yearly temperature anomaly (°C) for {filters.region} relative to 1951-1980 average.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                    <Skeleton className="h-[250px] w-full" />
                ) : (
                    <TemperatureChart data={tempData} />
                )}
              </CardContent>
            </Card>
            <Card className="sm:col-span-2 print-chart-wrapper" x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardTitle>Atmospheric CO₂ Levels</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Annual average atmospheric CO₂ concentration (ppm) for {filters.region}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                    <Skeleton className="h-[250px] w-full" />
                ) : (
                    <CO2Chart data={co2Data} />
                )}
              </CardContent>
            </Card>
            <Card className="sm:col-span-4 print-chart-wrapper" x-chunk="dashboard-05-chunk-2">
              <CardHeader className="items-center pb-2">
                <CardTitle>Global Precipitation Events</CardTitle>
                <CardDescription>
                  Percentage of global land area experiencing different precipitation events this year.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <PrecipitationChart data={precipitationData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
