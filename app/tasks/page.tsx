'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { useAuth } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';
import { TaskList } from '@/components/tasks/task-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TasksPage() {
  const { user } = useAuth();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              Create, manage, and track all your tasks.
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

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
              <TabsTrigger value="created">Created by Me</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="space-y-4">
            <TaskList type="assigned" userId={user.id} />
          </TabsContent>
          <TabsContent value="assigned" className="space-y-4">
            <TaskList type="assigned" userId={user.id} />
          </TabsContent>
          <TabsContent value="created" className="space-y-4">
            <TaskList type="created" userId={user.id} />
          </TabsContent>
          <TabsContent value="overdue" className="space-y-4">
            <TaskList type="overdue" userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>

      <CreateTaskDialog
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        userId={user.id}
      />
    </AppShell>
  );
}