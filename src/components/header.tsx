'use client';

import { SidebarTrigger } from './ui/sidebar';
import { useUser, useAuth, initiateSignOut, useFirestore } from '@/firebase';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOut } from 'lucide-react';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export function Header({ region }: { region: string }) {
  const { user, userProfile } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const handleLogout = () => {
    initiateSignOut(auth);
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'A';
    const names = name.split(' ');
    if (names.length > 1) {
        return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  }

  const handleRoleChange = (role: 'free' | 'pro') => {
    if (user && userProfile && userProfile.role !== role) {
        const userProfileRef = doc(firestore, 'userProfiles', user.uid);
        updateDocumentNonBlocking(userProfileRef, { role: role, updatedAt: new Date().toISOString() });
    }
  };

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
      {user && (
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Avatar>
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback>{user.isAnonymous ? 'A' : getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user.isAnonymous ? 'Anonymous User' : (user.displayName || user.email)}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
             {userProfile && (
              <>
                <DropdownMenuLabel className="font-normal text-xs text-muted-foreground pt-0 -mb-2">Subscription Plan</DropdownMenuLabel>
                <div className="px-2 py-2">
                    <Select value={userProfile.role} onValueChange={handleRoleChange}>
                        <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
