'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Task } from '@/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BarChart, User } from 'lucide-react';
import { UpdateTaskDialog } from '@/components/tasks/update-task-dialog';
import { TaskActions } from '@/components/tasks/task-actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getUserById } from '@/lib/data';

interface TaskCardProps {
  task: Task;
  className?: string;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export function TaskCard({
  task,
  className,
  onUpdate,
  onDelete,
}: TaskCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignee, setAssignee] = useState<string | null>(null);

  // Load assignee name
  useState(() => {
    if (task.assignedTo) {
      getUserById(task.assignedTo)
        .then((user) => {
          setAssignee(user.name);
        })
        .catch((error) => {
          console.error('Error fetching assignee:', error);
        });
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 border-rose-200 dark:border-rose-900';
      case 'medium':
        return 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 border-amber-200 dark:border-amber-900';
      case 'low':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950 border-green-200 dark:border-green-900';
      case 'in-progress':
        return 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 border-blue-200 dark:border-blue-900';
      case 'blocked':
        return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950 border-red-200 dark:border-red-900';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formattedDueDate = format(new Date(task.dueDate), 'MMM d, yyyy');
  
  const isOverdue = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      new Date(task.dueDate) < today && 
      task.status !== 'done'
    );
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleTaskUpdated = () => {
    setEditDialogOpen(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleTaskDeleted = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const assigneeInitials = assignee
    ? assignee
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : null;

  return (
    <>
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
          <div className="space-y-2 w-full">
            <div className="flex justify-between items-start w-full">
              <div className="flex-1 pr-4">
                <h3 className="font-semibold leading-tight">{task.title}</h3>
              </div>
              <TaskActions
                task={task}
                onEdit={handleEditClick}
                onDelete={handleTaskDeleted}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                <BarChart className="h-3 w-3 mr-1" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <Badge variant="outline" className={getStatusColor(task.status)}>
                {task.status === 'in-progress'
                  ? 'In Progress'
                  : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
              {isOverdue() && (
                <Badge variant="destructive">Overdue</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {task.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formattedDueDate}
          </div>
          {assignee ? (
            <div className="flex items-center text-xs">
              <Avatar className="h-6 w-6 mr-1">
                <AvatarFallback className="text-xs">
                  {assigneeInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">{assignee}</span>
            </div>
          ) : (
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="h-3 w-3 mr-1" />
              <span>Unassigned</span>
            </div>
          )}
        </CardFooter>
      </Card>

      <UpdateTaskDialog
        task={task}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleTaskUpdated}
      />
    </>
  );
}