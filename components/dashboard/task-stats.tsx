'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getTasksByUser } from '@/lib/data';
import { Task } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface TaskStatsProps {
  userId: string;
}

export function TaskStats({ userId }: TaskStatsProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userTasks = await getTasksByUser(userId);
        setTasks(userTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const todoTasks = tasks.filter((task) => task.status === 'todo').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress').length;
  const doneTasks = tasks.filter((task) => task.status === 'done').length;
  const blockedTasks = tasks.filter((task) => task.status === 'blocked').length;

  const highPriorityTasks = tasks.filter((task) => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter((task) => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter((task) => task.priority === 'low').length;

  const statusData = [
    { name: 'To Do', value: todoTasks, fill: 'hsl(var(--chart-3))' },
    { name: 'In Progress', value: inProgressTasks, fill: 'hsl(var(--chart-4))' },
    { name: 'Done', value: doneTasks, fill: 'hsl(var(--chart-2))' },
    { name: 'Blocked', value: blockedTasks, fill: 'hsl(var(--chart-5))' },
  ];

  const priorityData = [
    { name: 'High', value: highPriorityTasks, fill: 'hsl(var(--chart-1))' },
    { name: 'Medium', value: mediumPriorityTasks, fill: 'hsl(var(--chart-3))' },
    { name: 'Low', value: lowPriorityTasks, fill: 'hsl(var(--chart-2))' },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded-md w-1/3"></div>
            <div className="h-4 bg-muted rounded-md w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-muted rounded-md"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded-md w-1/3"></div>
            <div className="h-4 bg-muted rounded-md w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-muted rounded-md"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Status</CardTitle>
          <CardDescription>Distribution of tasks based on their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="value" nameKey="name" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Priority</CardTitle>
          <CardDescription>Distribution of tasks based on their priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="value" nameKey="name" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}