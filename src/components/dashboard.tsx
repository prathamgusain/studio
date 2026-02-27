'use client';
import React from 'react';
import type { FilterState } from '@/app/dashboard/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TemperatureChart } from './charts/temperature-chart';
import { CO2Chart } from './charts/co2-chart';
import { PrecipitationChart } from './charts/precipitation-chart';
import { precipitationData } from '@/lib/data';
import { Header } from './header';
import { Skeleton } from '@/components/ui/skeleton';
import { SeaLevelChart } from './charts/sea-level-chart';
import { DataTable } from './data-table';
import { PrecipitationDataTable } from './precipitation-data-table';

interface DashboardProps {
  filters: FilterState;
  tempData: any[];
  co2Data: any[];
  seaLevelData: any[];
  loading: boolean;
}

export function Dashboard({ filters, tempData, co2Data, seaLevelData, loading }: DashboardProps) {
  const fromYear = filters.dateRange?.from?.getFullYear();
  const toYear = filters.dateRange?.to?.getFullYear();

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
            <Card className="sm:col-span-2 print-chart-wrapper" x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardTitle>Sea Level Rise</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Yearly sea level variation (mm) for {filters.region} relative to the 20-year average.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <SeaLevelChart data={seaLevelData} />
                )}
              </CardContent>
            </Card>
            <Card className="sm:col-span-2 print-chart-wrapper" x-chunk="dashboard-05-chunk-3">
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
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
           <h2 className="text-xl font-bold tracking-tight px-2">Raw Datasets</h2>
           <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-4">
                <CardHeader className="pb-2">
                  <CardTitle>Temperature Anomaly</CardTitle>
                  <CardDescription>For {filters.region} from {fromYear} to {toYear}.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                      <Skeleton className="h-[250px] w-full" />
                  ) : (
                      <DataTable data={tempData} caption="Temp. anomaly (°C) vs 1951-1980 avg." />
                  )}
                </CardContent>
              </Card>
              <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-5">
                <CardHeader className="pb-2">
                  <CardTitle>Atmospheric CO₂</CardTitle>
                  <CardDescription>For {filters.region} from {fromYear} to {toYear}.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                      <Skeleton className="h-[250px] w-full" />
                  ) : (
                      <DataTable data={co2Data} caption="Atmospheric CO₂ concentration (ppm)." />
                  )}
                </CardContent>
              </Card>
              <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-6">
                <CardHeader className="pb-2">
                  <CardTitle>Sea Level Rise</CardTitle>
                  <CardDescription>For {filters.region} from {fromYear} to {toYear}.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[250px] w-full" />
                  ) : (
                    <DataTable data={seaLevelData} caption="Sea level variation (mm) vs 20-yr avg." />
                  )}
                </CardContent>
              </Card>
              <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-7">
                <CardHeader className="pb-2">
                  <CardTitle>Precipitation Events</CardTitle>
                  <CardDescription>
                    Global land area percentages this year.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PrecipitationDataTable data={precipitationData} caption="Global precipitation event percentages." />
                </CardContent>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
