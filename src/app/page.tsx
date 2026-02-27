'use client';

import { useState, useEffect } from 'react';
import type { DateRange } from 'react-day-picker';
import { Dashboard } from '@/components/dashboard';
import { SidebarNav } from '@/components/sidebar-nav';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';

export type FilterState = {
  region: string;
  dateRange: DateRange | undefined;
};

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    region: 'Global',
    dateRange: {
      from: new Date(new Date().setFullYear(new Date().getFullYear() - 20)),
      to: new Date(),
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [tempData, setTempData] = useState<any[]>([]);
  const [co2Data, setCo2Data] = useState<any[]>([]);
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
  }, [filters, toast]);

  const handleDataUpload = (data: any[], dataType: 'temperature' | 'co2') => {
    if (dataType === 'temperature') {
      setTempData(data);
    } else {
      setCo2Data(data);
    }
    toast({
        title: 'Data uploaded successfully',
        description: `The ${dataType} chart has been updated. To see API data again, please change the filters.`,
    });
  };


  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar className="no-print" collapsible="icon">
          <SidebarNav filters={filters} setFilters={setFilters} onDataUpload={handleDataUpload} />
        </Sidebar>
        <SidebarInset className="print-container">
          <Dashboard filters={filters} tempData={tempData} co2Data={co2Data} loading={loading} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
