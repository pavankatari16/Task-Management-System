'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTasks } from '@/lib/data';
import { Task } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, parseISO, isAfter, isBefore, subDays } from 'date-fns';

export default function ReportsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const allTasks = await getTasks();
        setTasks(allTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const statusData = [
    {
      name: 'To Do',
      count: tasks.filter((task) => task.status === 'todo').length,
      fill: 'hsl(var(--chart-1))',
    },
    {
      name: 'In Progress',
      count: tasks.filter((task) => task.status === 'in-progress').length,
      fill: 'hsl(var(--chart-2))',
    },
    {
      name: 'Done',
      count: tasks.filter((task) => task.status === 'done').length,
      fill: 'hsl(var(--chart-3))',
    },
    {
      name: 'Blocked',
      count: tasks.filter((task) => task.status === 'blocked').length,
      fill: 'hsl(var(--chart-4))',
    },
  ];

  const priorityData = [
    {
      name: 'High',
      count: tasks.filter((task) => task.priority === 'high').length,
      fill: 'hsl(var(--chart-1))',
    },
    {
      name: 'Medium',
      count: tasks.filter((task) => task.priority === 'medium').length,
      fill: 'hsl(var(--chart-2))',
    },
    {
      name: 'Low',
      count: tasks.filter((task) => task.priority === 'low').length,
      fill: 'hsl(var(--chart-3))',
    },
  ];

  // Prepare time-based data
  const today = new Date();
  const oneWeekAgo = subDays(today, 7);

  const createdLastWeek = tasks.filter((task) => {
    const createdDate = parseISO(task.createdAt);
    return isAfter(createdDate, oneWeekAgo) && isBefore(createdDate, today);
  });

  const completedLastWeek = tasks.filter((task) => {
    return (
      task.status === 'done' &&
      isAfter(parseISO(task.updatedAt), oneWeekAgo) &&
      isBefore(parseISO(task.updatedAt), today)
    );
  });

  // Group tasks by day for the time series
  const timeSeriesData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const created = createdLastWeek.filter(
      (task) => format(parseISO(task.createdAt), 'yyyy-MM-dd') === dateStr
    ).length;
    
    const completed = completedLastWeek.filter(
      (task) => format(parseISO(task.updatedAt), 'yyyy-MM-dd') === dateStr
    ).length;
    
    return {
      date: format(date, 'MMM dd'),
      created,
      completed,
    };
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex flex-col gap-8 p-4 md:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Analyze task performance and trends.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded-md w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-muted rounded-md"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Analyze task performance and trends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                      }}
                      formatter={(value) => [`${value} tasks`, null]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                      }}
                      formatter={(value) => [`${value} tasks`, null]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                      }}
                    />
                    <Legend />
                    <Bar
                      name="Created Tasks"
                      dataKey="created"
                      fill="hsl(var(--chart-2))"
                    />
                    <Bar
                      name="Completed Tasks"
                      dataKey="completed"
                      fill="hsl(var(--chart-3))"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}