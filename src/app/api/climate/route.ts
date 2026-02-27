import { NextResponse } from 'next/server';
import { temperatureData, co2Data, seaLevelData, arcticIceData, extremeWeatherEventsData } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dataType = searchParams.get('type');
  const region = searchParams.get('region') || 'Global';
  const fromYear = searchParams.get('from');
  const toYear = searchParams.get('to');

  let sourceData;
  if (dataType === 'temperature') {
    sourceData = temperatureData;
  } else if (dataType === 'co2') {
    sourceData = co2Data;
  } else if (dataType === 'sea-level') {
    sourceData = seaLevelData;
  } else if (dataType === 'arctic-ice') {
    sourceData = arcticIceData;
  } else if (dataType === 'extreme-weather') {
    sourceData = extremeWeatherEventsData;
  } else {
    return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
  }

  let filteredByDate = sourceData;
  if (fromYear && toYear) {
    filteredByDate = sourceData.filter(d => parseInt(d.year, 10) >= parseInt(fromYear, 10) && parseInt(d.year, 10) <= parseInt(toYear, 10));
  }
  
  const regionKey = region.replace(/ /g, '');

  const transformedData = filteredByDate.map(d => {
    const value = d[regionKey as keyof typeof d];
    return {
      year: d.year,
      value: typeof value === 'number' ? value : null
    }
  });

  return NextResponse.json(transformedData);
}
