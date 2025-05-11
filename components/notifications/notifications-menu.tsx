'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from '@/types';
import { useAuth } from '@/app/providers';
import { getNotificationsByUser, markNotificationAsRead } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export function NotificationsMenu() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const data = await getNotificationsByUser(user.id);
          setNotifications(data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [user]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const handleNotificationClick = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="px-1 h-5 min-w-[1.25rem] absolute -top-1 -right-1 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup>
            {loading ? (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Loading notifications...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={cn(
                    'flex flex-col items-start p-4 cursor-pointer transition-colors',
                    !notification.read && 'bg-muted/40'
                  )}
                >
                  <div className="space-y-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            )}
          </DropdownMenuGroup>
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="outline" className="w-full text-xs">
            Mark all as read
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { cn } from '@/lib/utils';