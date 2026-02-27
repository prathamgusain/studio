'use client';

import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Dashboard } from '@/components/dashboard';
import { SidebarNav } from '@/components/sidebar-nav';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';

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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar className="no-print" collapsible="icon">
          <SidebarNav filters={filters} setFilters={setFilters} />
        </Sidebar>
        <SidebarInset className="print-container">
          <Dashboard filters={filters} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
