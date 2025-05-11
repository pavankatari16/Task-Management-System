'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { AppShell } from '@/components/layout/app-shell';
import { TaskList } from '@/components/tasks/task-list';
import { TasksOverview } from '@/components/dashboard/tasks-overview';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskStats } from '@/components/dashboard/task-stats';
import { PlusCircle } from 'lucide-react';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';

export function DashboardPage() {
  const { user } = useAuth();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}! Here's an overview of your tasks.
            </p>
          </div>
          <Button
            onClick={() => setCreateTaskOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>New Task</span>
          </Button>
        </div>

        <TaskStats userId={user.id} />

        <TasksOverview userId={user.id} />

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              Manage and track all your tasks in one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="assigned" className="w-full">
              <TabsList className="w-full md:w-auto grid grid-cols-3 mb-6">
                <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
                <TabsTrigger value="created">Created by Me</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
              <TabsContent value="assigned">
                <TaskList type="assigned" userId={user.id} />
              </TabsContent>
              <TabsContent value="created">
                <TaskList type="created" userId={user.id} />
              </TabsContent>
              <TabsContent value="overdue">
                <TaskList type="overdue" userId={user.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <CreateTaskDialog
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        userId={user.id}
      />
    </AppShell>
  );
}