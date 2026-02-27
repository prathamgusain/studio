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
  initiateAnonymousSignIn,
  initiateEmailSignIn,
  initiateEmailSignUp,
  initiateGoogleSignIn,
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

  const handleGoogleSignIn = () => {
    initiateGoogleSignIn(auth);
  };
  
  const handleAnonymousSignIn = () => {
    initiateAnonymousSignIn(auth);
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
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
             <Button onClick={handleGoogleSignIn} variant="outline">
              <svg className="mr-2 h-4 w-4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.83 0-6.94-2.9-6.94-6.5s3.11-6.5 6.94-6.5c2.03 0 3.53.79 4.49 1.69l2.78-2.78C19.02 2.62 16.25 1.5 12.48 1.5c-5.48 0-9.94 4.13-9.94 9.5s4.46 9.5 9.94 9.5c5.03 0 8.24-3.37 8.24-8.58 0-.57-.05-1.12-.14-1.62z"/></svg>
              Sign in with Google
            </Button>
            <Button onClick={handleAnonymousSignIn} variant="secondary">Sign in Anonymously</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
