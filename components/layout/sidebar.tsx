'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ClipboardList, Home, Users, BarChart3, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    icon: <Home className="mr-2 h-4 w-4" />,
    href: '/',
  },
  {
    title: 'Tasks',
    icon: <ClipboardList className="mr-2 h-4 w-4" />,
    href: '/tasks',
  },
  {
    title: 'Team',
    icon: <Users className="mr-2 h-4 w-4" />,
    href: '/team',
  },
  {
    title: 'Reports',
    icon: <BarChart3 className="mr-2 h-4 w-4" />,
    href: '/reports',
  },
];

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0">
          <div className="flex h-16 items-center border-b px-4">
            <div className="flex items-center">
              <ClipboardList className="h-6 w-6 mr-2" />
              <h2 className="text-lg font-semibold">TaskFlow</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => onOpenChange?.(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="p-4">
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <Link href={item.href} key={item.href}>
                    <Button
                      variant={pathname === item.href ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => onOpenChange?.(false)}
                    >
                      {item.icon}
                      {item.title}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-background h-screen md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center">
            <ClipboardList className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold">TaskFlow</h2>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <Link href={item.href} key={item.href}>
                  <Button
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}