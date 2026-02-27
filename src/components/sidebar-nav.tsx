'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Droplets, Download, Upload, BarChart, Database } from 'lucide-react';
import { format } from 'date-fns';
import type { FilterState } from '@/app/dashboard/layout';
import type { Dispatch, SetStateAction } from 'react';
import { AiInsightsPanel } from './ai-insights-panel';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { DateRange } from 'react-day-picker';

interface SidebarNavProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  onDataUpload: (data: any[], dataType: 'temperature' | 'co2' | 'sea-level') => void;
}

const regions = ['Global', 'North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];

export function SidebarNav({ filters, setFilters, onDataUpload }: SidebarNavProps) {
  const pathname = usePathname();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadDataType, setUploadDataType] = useState<'temperature' | 'co2' | 'sea-level'>('temperature');
  const [isClient, setIsClient] = useState(false);
  const [maxDate, setMaxDate] = useState<Date | null>(null);

  useEffect(() => {
    setIsClient(true);
    setMaxDate(new Date());
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split('\n');
          const header = rows[0].split(',').map(h => h.trim());
          const yearIndex = header.indexOf('year');
          const valueIndex = header.indexOf('value');

          if (yearIndex === -1 || valueIndex === -1) {
            throw new Error('CSV must have "year" and "value" columns.');
          }

          const parsedData = rows
            .slice(1)
            .map(row => {
                if (row.trim() === '') return null;
                const columns = row.split(',');
                const year = columns[yearIndex]?.trim();
                const value = columns[valueIndex]?.trim();
                if (year && value) {
                    return { year: year, value: parseFloat(value) };
                }
                return null;
            })
            .filter(Boolean);

            if (parsedData.length === 0) {
              throw new Error('No data found in CSV file.');
            }

          onDataUpload(parsedData as any[], uploadDataType);
        } catch (error) {
           toast({
            variant: "destructive",
            title: "Error parsing CSV",
            description: error instanceof Error ? error.message : "Could not parse the uploaded file.",
          });
        } finally {
          // Reset file input
          if(fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "Error reading file",
            description: "Could not read the uploaded file.",
          });
      };
      reader.readAsText(file);
    }
  };

  const handleFromDateSelect = (date: Date | undefined) => {
    setFilters((prev) => {
      const newRange: DateRange = { from: date, to: prev.dateRange?.to };
      if (date && prev.dateRange?.to && date > prev.dateRange.to) {
        newRange.to = date;
      }
      return { ...prev, dateRange: newRange };
    });
  };

  const handleToDateSelect = (date: Date | undefined) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { from: prev.dateRange?.from, to: date },
    }));
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Droplets className="size-8 text-accent" />
          <h1 className="text-2xl font-bold font-headline text-accent-foreground">EcoPulse</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
                        <a>
                            <BarChart />
                            <span>Overview</span>
                        </a>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/dashboard/datasets" legacyBehavior passHref>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard/datasets'}>
                        <a>
                            <Database />
                            <span>Raw Datasets</span>
                        </a>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator className="my-4" />
        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <div className="space-y-4 pt-2">
            <div>
              <label htmlFor="region-select" className="text-sm font-medium text-muted-foreground">
                Region
              </label>
              <Select
                value={filters.region}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, region: value }))}
              >
                <SelectTrigger id="region-select" className="w-full">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date Range
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-from"
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.dateRange?.from && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange?.from ? (
                        format(filters.dateRange.from, 'LLL dd, y')
                      ) : (
                        <span>From date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    {isClient ? (
                      <Calendar
                        mode="single"
                        selected={filters.dateRange?.from}
                        onSelect={handleFromDateSelect}
                        disabled={(date) =>
                          (maxDate && date > maxDate) || date < new Date('2000-01-01')
                        }
                        initialFocus
                      />
                    ) : (
                      <div className="p-3">
                        <Skeleton className="h-[298px] w-[284px]" />
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-to"
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.dateRange?.to && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange?.to ? (
                        format(filters.dateRange.to, 'LLL dd, y')
                      ) : (
                        <span>To date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    {isClient ? (
                      <Calendar
                        mode="single"
                        selected={filters.dateRange?.to}
                        onSelect={handleToDateSelect}
                        disabled={(date) =>
                          (maxDate && date > maxDate) || date < (filters.dateRange?.from || new Date('2000-01-01'))
                        }
                        initialFocus
                      />
                    ) : (
                      <div className="p-3">
                        <Skeleton className="h-[298px] w-[284px]" />
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </SidebarGroup>
        <SidebarSeparator className="my-4" />
        <AiInsightsPanel filters={filters} />
        <SidebarSeparator className="my-4" />
         <SidebarGroup>
          <SidebarGroupLabel>Manual Data Upload</SidebarGroupLabel>
          <div className="space-y-4 pt-2">
            <div>
              <label htmlFor="data-type-select" className="text-sm font-medium text-muted-foreground">
                Data Type
              </label>
              <Select
                value={uploadDataType}
                onValueChange={(value: 'temperature' | 'co2' | 'sea-level') => setUploadDataType(value)}
              >
                <SelectTrigger id="data-type-select" className="w-full">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="co2">CO₂</SelectItem>
                  <SelectItem value="sea-level">Sea Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUploadClick} className="w-full" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".csv"
            />
            <p className="text-xs text-muted-foreground">
              Upload a CSV with 'year' and 'value' columns.
            </p>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
         <Button onClick={handlePrint} className="w-full" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </SidebarFooter>
    </>
  );
}
