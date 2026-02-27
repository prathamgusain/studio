'use client';

import React from 'react';
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
  SidebarSeparator
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Droplets, Download } from 'lucide-react';
import { format } from 'date-fns';
import type { FilterState } from '@/app/page';
import type { Dispatch, SetStateAction } from 'react';
import { AiInsightsPanel } from './ai-insights-panel';

interface SidebarNavProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
}

const regions = ['Global', 'North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];

export function SidebarNav({ filters, setFilters }: SidebarNavProps) {
  const handlePrint = () => {
    window.print();
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
              <label htmlFor="date-range-picker" className="text-sm font-medium text-muted-foreground">
                Date Range
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-range-picker"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !filters.dateRange && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, 'LLL dd, y')} -{' '}
                          {format(filters.dateRange.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(filters.dateRange.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={filters.dateRange}
                    onSelect={(range) => setFilters((prev) => ({ ...prev, dateRange: range }))}
                    initialFocus
                    numberOfMonths={1}
                    defaultMonth={filters.dateRange?.from}
                    disabled={(date) =>
                        date > new Date() || date < new Date("2000-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </SidebarGroup>
        <SidebarSeparator className="my-4" />
        <AiInsightsPanel filters={filters} />
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
