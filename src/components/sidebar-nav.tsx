
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Droplets, Download, Upload, BarChart, Database, Info, TrendingUp, GitMerge, Lock } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import type { FilterState } from '@/app/dashboard/layout';
import type { Dispatch, SetStateAction } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDashboard } from '@/app/dashboard/layout';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface SidebarNavProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  onDataUpload: (data: any[], dataType: 'temperature' | 'co2' | 'sea-level' | 'arctic-ice' | 'extreme-weather') => void;
}

const regions = ['Global', 'North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];

export function SidebarNav({ filters, setFilters, onDataUpload }: SidebarNavProps) {
  const pathname = usePathname();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadDataType, setUploadDataType] = useState<'temperature' | 'co2' | 'sea-level' | 'arctic-ice' | 'extreme-weather'>('temperature');

  const { userProfile } = useDashboard();
  const isPro = userProfile?.role === 'pro';

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    if (filters.dateRange?.from) {
      setFromDate(format(filters.dateRange.from, 'dd-MM-yyyy'));
    } else {
      setFromDate('');
    }
    if (filters.dateRange?.to) {
      setToDate(format(filters.dateRange.to, 'dd-MM-yyyy'));
    } else {
      setToDate('');
    }
  }, [filters.dateRange]);

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

  const handleDateChange = (value: string, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromDate(value);
    } else {
      setToDate(value);
    }

    if (value.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const parsedDate = parse(value, 'dd-MM-yyyy', new Date());
        if (isValid(parsedDate)) {
            setFilters((prev) => {
                const newRange = { ...prev.dateRange, [type]: parsedDate };
                if (type === 'from' && newRange.to && parsedDate > newRange.to) {
                    newRange.to = parsedDate;
                    setToDate(format(parsedDate, 'dd-MM-yyyy'));
                }
                 if (type === 'to' && newRange.from && parsedDate < newRange.from) {
                    toast({
                        variant: 'destructive',
                        title: 'Invalid Date Range',
                        description: '"To" date cannot be earlier than "From" date.',
                    });
                    return prev;
                }
                return { ...prev, dateRange: {from: newRange.from, to: newRange.to} };
            });
        }
    }
  }

  const ProFeature = ({ href, isActive, icon, label }: { href: string, isActive: boolean, icon: React.ReactNode, label: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuButton asChild isActive={isActive && isPro}>
            <Link href={!isPro ? '/subscription' : href}>
              {icon}
              <span>{label}</span>
              {!isPro && <Lock className="ml-auto" />}
            </Link>
          </SidebarMenuButton>
        </TooltipTrigger>
        {!isPro && (
          <TooltipContent side="right" align="center">
            <p>Upgrade to Pro to access this feature.</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );


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
                <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
                    <Link href="/dashboard">
                        <BarChart />
                        <span>Overview</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <ProFeature 
                  href="/dashboard/datasets"
                  isActive={pathname === '/dashboard/datasets'}
                  icon={<Database />}
                  label="Raw Datasets"
                />
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/dashboard/summary'}>
                    <Link href="/dashboard/summary">
                        <Info />
                        <span>Data Summary</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <ProFeature 
                  href="/dashboard/predictions"
                  isActive={pathname === '/dashboard/predictions'}
                  icon={<TrendingUp />}
                  label="Predictive Analysis"
                />
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/dashboard/correlation'}>
                    <Link href="/dashboard/correlation">
                        <GitMerge />
                        <span>Correlation Analysis</span>
                    </Link>
                </SidebarMenuButton>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Date Range
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <Input
                    id="date-from"
                    placeholder="dd-mm-yyyy"
                    value={fromDate}
                    onChange={(e) => handleDateChange(e.target.value, 'from')}
                  />
                  <p className="text-xs text-muted-foreground mt-1">From date</p>
                </div>
                 <div>
                  <Input
                    id="date-to"
                    placeholder="dd-mm-yyyy"
                    value={toDate}
                    onChange={(e) => handleDateChange(e.target.value, 'to')}
                  />
                  <p className="text-xs text-muted-foreground mt-1">To date</p>
                </div>
              </div>
            </div>
          </div>
        </SidebarGroup>
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
                onValueChange={(value: 'temperature' | 'co2' | 'sea-level' | 'arctic-ice' | 'extreme-weather') => setUploadDataType(value)}
              >
                <SelectTrigger id="data-type-select" className="w-full">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="co2">CO₂</SelectItem>
                  <SelectItem value="sea-level">Sea Level</SelectItem>
                  <SelectItem value="arctic-ice">Arctic Ice Extent</SelectItem>
                  <SelectItem value="extreme-weather">Extreme Weather</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isPro ? (
               <Button onClick={handleUploadClick} className="w-full" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="w-full">
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/subscription">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload CSV
                            <Lock className="ml-auto" />
                        </Link>
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center">
                      <p>Upgrade to Pro to upload data.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".csv"
            />
            <p className="text-xs text-muted-foreground">
              {isPro ? "Upload a CSV with 'year' and 'value' columns." : "Upgrade to Pro to upload data."}
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
