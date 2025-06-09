'use client';

import Link from 'next/link';
import AppLogo from './AppLogo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, UserPlus, LogIn, LayoutDashboard, FileText } from 'lucide-react';

export default function Header() {
  const { user, logout, loading } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    ...(user ? [
      { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
      { href: '/apply', label: 'Apply', icon: <FileText className="mr-2 h-4 w-4" /> },
    ] : []),
  ];

  const authActions = user ? (
    <Button variant="ghost" onClick={logout} disabled={loading}>
      <LogOut className="mr-2 h-4 w-4" /> Logout
    </Button>
  ) : (
    <>
      <Button variant="ghost" asChild>
        <Link href="/login"><LogIn className="mr-2 h-4 w-4" />Login</Link>
      </Button>
      <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" />Sign Up</Link>
      </Button>
    </>
  );

  return (
    <header className="bg-card shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <AppLogo />
        <nav className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <Button key={link.href} variant="link" asChild className="text-foreground hover:text-primary">
              <Link href={link.href}>{link.icon}{link.label}</Link>
            </Button>
          ))}
          {authActions}
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                 <AppLogo />
                {navLinks.map((link) => (
                  <Button key={link.href} variant="ghost" asChild className="justify-start">
                    <Link href={link.href}>{link.icon}{link.label}</Link>
                  </Button>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t">
                    {authActions}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
