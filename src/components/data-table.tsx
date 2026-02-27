'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataTableProps {
  data: { year: string; value: number | null }[];
  caption: string;
}

export function DataTable({ data, caption }: DataTableProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[250px] text-muted-foreground">No data available.</div>
  }
  return (
    <ScrollArea className="h-[250px] rounded-md border">
      <Table>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.year}</TableCell>
              <TableCell className="text-right">{item.value?.toFixed(2) ?? 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
