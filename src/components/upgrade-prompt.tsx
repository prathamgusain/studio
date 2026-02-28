'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import Link from 'next/link';

export function UpgradePrompt() {
    return (
        <div className="flex items-center justify-center h-full pt-10">
            <Card className="m-4 text-center max-w-lg">
                <CardHeader>
                    <CardTitle className="flex justify-center items-center gap-2">
                        <Rocket className="size-6 text-primary" />
                        Upgrade to Pro
                    </CardTitle>
                    <CardDescription>
                        This feature is available exclusively for Pro subscribers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Unlock Raw Data access, Predictive Analysis, and more by upgrading your plan.
                    </p>
                    <Button asChild>
                        <Link href="/subscription">Upgrade to Pro</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
