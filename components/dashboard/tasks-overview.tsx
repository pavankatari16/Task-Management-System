'use client';

import { useEffect, useState } from 'react';
import { getTasksByUser } from '@/lib/data';
import { Task } from '@/types';
import { TaskCard } from '@/components/tasks/task-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface TasksOverviewProps {
  userId: string;
}

export function TasksOverview({ userId }: TasksOverviewProps) {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const allTasks = await getTasksByUser(userId);
        // Sort by most recently updated and get the top 5
        const sorted = [...allTasks].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ).slice(0, 5);
        setRecentTasks(sorted);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>
        </div>
        <div className="flex overflow-x-auto pb-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="min-w-[350px] h-[180px] rounded-md bg-muted animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (recentTasks.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Tasks</h2>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No tasks found. Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Tasks</h2>
        <Button variant="ghost" className="gap-1">
          <span>View all</span>
          <ChevronRight size={16} />
        </Button>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {recentTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              className="min-w-[350px] max-w-[350px] h-full"
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}