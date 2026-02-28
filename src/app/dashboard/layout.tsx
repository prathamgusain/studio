'use client';

import React, { useState, useEffect, type ReactNode, createContext, useContext } from 'react';
import type { DateRange } from 'react-day-picker';
import { SidebarNav } from '@/components/sidebar-nav';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export type FilterState = {
  region: string;
  dateRange: DateRange | undefined;
};

interface DashboardContextType {
    filters: FilterState;
    tempData: any[];
    co2Data: any[];
    seaLevelData: any[];
    arcticIceData: any[];
    extremeWeatherEventsData: any[];
    loading: boolean;
    userProfile: any | null;
    isProfileLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardLayout');
    }
    return context;
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, userProfile, isUserLoading, isProfileLoading } = useUser();
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    region: 'Global',
    dateRange: undefined,
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    setFilters(prev => ({
        ...prev,
        dateRange: {
            from: new Date(new Date().setFullYear(new Date().getFullYear() - 20)),
            to: new Date(),
        },
    }));
  }, []);
  
  const [loading, setLoading] = useState(true);
  const [tempData, setTempData] = useState<any[]>([]);
  const [co2Data, setCo2Data] = useState<any[]>([]);
  const [seaLevelData, setSeaLevelData] = useState<any[]>([]);
  const [arcticIceData, setArcticIceData] = useState<any[]>([]);
  const [extremeWeatherEventsData, setExtremeWeatherEventsData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      if (!filters.dateRange?.from || !filters.dateRange?.to) {
        return;
      }
      
      setLoading(true);
      
      const fromYear = filters.dateRange.from.getFullYear();
      const toYear = filters.dateRange.to.getFullYear();
      const region = filters.region;
      
      try {
        const [tempRes, co2Res, seaLevelRes, arcticIceRes, extremeWeatherRes] = await Promise.all([
          fetch(`/api/climate?type=temperature&region=${encodeURIComponent(region)}&from=${fromYear}&to=${toYear}`),
          fetch(`/api/climate?type=co2&region=${encodeURIComponent(region)}&from=${fromYear}&to=${toYear}`),
          fetch(`/api/climate?type=sea-level&region=${encodeURIComponent(region)}&from=${fromYear}&to=${toYear}`),
          fetch(`/api/climate?type=arctic-ice&region=${encodeURIComponent(region)}&from=${fromYear}&to=${toYear}`),
          fetch(`/api/climate?type=extreme-weather&region=${encodeURIComponent(region)}&from=${fromYear}&to=${toYear}`),
        ]);
        
        if (!tempRes.ok || !co2Res.ok || !seaLevelRes.ok || !arcticIceRes.ok || !extremeWeatherRes.ok) {
            throw new Error('Failed to fetch climate data');
        }

        const tempDataJson = await tempRes.json();
        const co2DataJson = await co2Res.json();
        const seaLevelDataJson = await seaLevelRes.json();
        const arcticIceDataJson = await arcticIceRes.json();
        const extremeWeatherEventsDataJson = await extremeWeatherRes.json();
        
        setTempData(tempDataJson);
        setCo2Data(co2DataJson);
        setSeaLevelData(seaLevelDataJson);
        setArcticIceData(arcticIceDataJson);
        setExtremeWeatherEventsData(extremeWeatherEventsDataJson);
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
  }, [filters, toast, user]);

  const handleDataUpload = (data: any[], dataType: 'temperature' | 'co2' | 'sea-level' | 'arctic-ice' | 'extreme-weather') => {
    if (dataType === 'temperature') {
      setTempData(data);
    } else if (dataType === 'co2') {
      setCo2Data(data);
    } else if (dataType === 'arctic-ice') {
      setArcticIceData(data);
    } else if (dataType === 'extreme-weather') {
      setExtremeWeatherEventsData(data);
    } else {
      setSeaLevelData(data);
    }
    toast({
        title: 'Data uploaded successfully',
        description: `The ${dataType} chart has been updated. To see API data again, please change the filters.`,
    });
  };

  if (isUserLoading || !user || isProfileLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

    const contextValue = {
      filters,
      tempData,
      co2Data,
      seaLevelData,
      arcticIceData,
      extremeWeatherEventsData,
      loading,
      userProfile,
      isProfileLoading
  };

  return (
    <DashboardContext.Provider value={contextValue}>
        <SidebarProvider>
        <div className="flex min-h-screen bg-background">
            <Sidebar className="no-print" collapsible="icon">
            <SidebarNav filters={filters} setFilters={setFilters} onDataUpload={handleDataUpload} />
            </Sidebar>
            <SidebarInset className="print-container">
            {children}
            </SidebarInset>
        </div>
        </SidebarProvider>
    </DashboardContext.Provider>
  );
}
