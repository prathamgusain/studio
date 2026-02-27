'use client';

import { useDashboard } from '@/app/dashboard/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/data-table';
import { PrecipitationDataTable } from '@/components/precipitation-data-table';
import { precipitationData } from '@/lib/data';

export default function DatasetsPage() {
  const { filters, tempData, co2Data, seaLevelData, arcticIceData, extremeWeatherEventsData, loading } = useDashboard();
  const fromYear = filters.dateRange?.from?.getFullYear();
  const toYear = filters.dateRange?.to?.getFullYear();

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4 no-print">
         <Header region={filters.region} />
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
              <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-8">
                <CardHeader className="pb-2">
                  <CardTitle>Arctic Ice Extent</CardTitle>
                  <CardDescription>For {filters.region} from {fromYear} to {toYear}.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                      <Skeleton className="h-[250px] w-full" />
                  ) : (
                      <DataTable data={arcticIceData} caption="Minimum Arctic sea ice extent (million km²)." />
                  )}
                </CardContent>
              </Card>
              <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-9">
                <CardHeader className="pb-2">
                  <CardTitle>Extreme Weather Events</CardTitle>
                  <CardDescription>For {filters.region} from {fromYear} to {toYear}.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                      <Skeleton className="h-[250px] w-full" />
                  ) : (
                      <DataTable data={extremeWeatherEventsData} caption="Count of extreme weather events." />
                  )}
                </CardContent>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
