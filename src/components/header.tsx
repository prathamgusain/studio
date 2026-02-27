'use client';

import { SidebarTrigger } from './ui/sidebar';

export function Header({ region }: { region: string }) {
  return (
    <>
      <SidebarTrigger className="sm:hidden" />
      <div className="w-full flex-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl font-headline">
          Climate Dashboard
        </h1>
        <p className="text-muted-foreground">
          Visualizing key climate indicators for <span className="font-semibold text-foreground">{region}</span>.
        </p>
      </div>
    </>
  );
}
