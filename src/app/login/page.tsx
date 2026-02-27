'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplets, LogIn } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import {
  initiateEmailSignIn,
  initiateEmailSignUp,
} from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleEmailSignIn = () => {
    if (!email || !password) {
      toast({ variant: 'destructive', title: 'Error', description: 'Email and password cannot be empty.' });
      return;
    }
    initiateEmailSignIn(auth, email, password);
  };

  const handleEmailSignUp = () => {
    if (!email || !password) {
        toast({ variant: 'destructive', title: 'Error', description: 'Email and password cannot be empty.' });
        return;
    }
    initiateEmailSignUp(auth, email, password);
  };

  if (isUserLoading || user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center items-center gap-2">
            <Droplets className="size-8 text-accent" />
            <h1 className="text-3xl font-bold font-headline text-accent-foreground">EcoPulse</h1>
          </div>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Sign in to access your climate dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleEmailSignIn}><LogIn className="mr-2 h-4 w-4" /> Sign In</Button>
              <Button onClick={handleEmailSignUp} variant="outline">Sign Up</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
