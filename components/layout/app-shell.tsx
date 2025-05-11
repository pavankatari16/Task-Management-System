'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-lg">Please log in to access this page</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}