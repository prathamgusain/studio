'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Droplets, BarChart, UploadCloud, WandSparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Droplets className="size-8 text-accent" />
          <span className="text-xl font-bold font-headline text-accent-foreground">EcoPulse</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Understand Our Climate, Shape Our Future
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    EcoPulse provides an intuitive dashboard to visualize climate data, generate AI-powered insights, and empower policymakers and researchers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg">Explore the Dashboard</Button>
                  </Link>
                </div>
              </div>
              <Image
                alt="Planet Earth from space"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                height="550"
                src="https://picsum.photos/seed/climate-hero/550/550"
                width="550"
                data-ai-hint="climate environment"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Actionable Climate Intelligence</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is built to provide clear, concise, and powerful tools for climate data analysis.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <div className="grid gap-1 text-center">
                 <div className="mx-auto p-4 bg-background rounded-full w-fit">
                  <BarChart className="size-10 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Visualize Data</h3>
                <p className="text-sm text-muted-foreground">
                  Interactively explore key climate indicators like temperature, CO2 levels, and sea-level rise.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                 <div className="mx-auto p-4 bg-background rounded-full w-fit">
                  <WandSparkles className="size-10 text-primary" />
                </div>
                <h3 className="text-lg font-bold">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Leverage generative AI to automatically identify trends, anomalies, and future impacts from complex datasets.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                 <div className="mx-auto p-4 bg-background rounded-full w-fit">
                  <UploadCloud className="size-10 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Upload Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Bring your own datasets. Upload CSV files to visualize and analyze your specific data within the dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 EcoPulse. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
