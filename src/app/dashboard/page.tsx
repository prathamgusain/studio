'use client';

import { Dashboard } from '@/components/dashboard';
import { useDashboard } from './layout';

export default function DashboardPage() {
  const { filters, tempData, co2Data, seaLevelData, loading } = useDashboard();

  return (
    <Dashboard
      filters={filters}
      tempData={tempData}
      co2Data={co2Data}
      seaLevelData={seaLevelData}
      loading={loading}
    />
  );
}
