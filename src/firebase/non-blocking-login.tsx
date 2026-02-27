'use client';
import {
  Auth, // Import Auth type for type hinting
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type AuthError,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(authInstance, email, password)
    .then(() => {
        // success is handled by onAuthStateChanged
    })
    .catch((error: AuthError) => {
        let description = "An unexpected error occurred during sign-up.";
        switch (error.code) {
            case 'auth/email-already-in-use':
                description = 'This email address is already in use.';
                break;
            case 'auth/invalid-email':
                description = 'Please enter a valid email address.';
                break;
            case 'auth/weak-password':
                description = 'The password must be at least 6 characters long.';
                break;
            default:
                description = "Could not create account. Please try again.";
        }
        toast({
            variant: 'destructive',
            title: 'Sign Up Failed',
            description,
        });
        throw error;
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(authInstance, email, password)
    .then(() => {
        // success is handled by onAuthStateChanged
    })
    .catch((error: AuthError) => {
        let description = "An unexpected error occurred. Please try again.";
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                description = 'Invalid email or password.';
                break;
            case 'auth/invalid-email':
                description = 'Please enter a valid email address.';
                break;
            case 'auth/user-disabled':
                description = 'This user account has been disabled.';
                break;
            case 'auth/too-many-requests':
                description = 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
                break;
            default:
                description = "Could not sign in. Please try again.";
        }
        toast({
            variant: 'destructive',
            title: 'Sign In Failed',
            description,
        });
        throw error;
    });
}

/** Initiate sign-out (non-blocking). */
export function initiateSignOut(authInstance: Auth): void {
  signOut(authInstance).catch((error: AuthError) => {
    toast({
      variant: 'destructive',
      title: 'Sign Out Failed',
      description: 'Could not sign out. Please try again.',
    });
  });
}
