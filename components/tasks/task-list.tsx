'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/types';
import { TaskCard } from '@/components/tasks/task-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, SearchIcon, XCircle } from 'lucide-react';
import {
  getTasksByAssignee,
  getTasksByCreator,
  getOverdueTasks,
} from '@/lib/data';

interface TaskListProps {
  type: 'assigned' | 'created' | 'overdue';
  userId: string;
}

export function TaskList({ type, userId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        let data: Task[] = [];
        
        if (type === 'assigned') {
          data = await getTasksByAssignee(userId);
        } else if (type === 'created') {
          data = await getTasksByCreator(userId);
        } else if (type === 'overdue') {
          data = await getOverdueTasks(userId);
        }
        
        setTasks(data);
        setFilteredTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [type, userId]);

  useEffect(() => {
    // Apply filters
    let result = [...tasks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      result = result.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter) {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    setFilteredTasks(result);
  }, [searchQuery, statusFilter, priorityFilter, tasks]);

  const refreshTasks = async () => {
    setLoading(true);
    try {
      let data: Task[] = [];
      
      if (type === 'assigned') {
        data = await getTasksByAssignee(userId);
      } else if (type === 'created') {
        data = await getTasksByCreator(userId);
      } else if (type === 'overdue') {
        data = await getOverdueTasks(userId);
      }
      
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setPriorityFilter(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!filteredTasks.length) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">
          {tasks.length && (searchQuery || statusFilter || priorityFilter)
            ? 'No tasks match your filters'
            : `No ${type} tasks found`}
        </p>
        {tasks.length && (searchQuery || statusFilter || priorityFilter) ? (
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? null : v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter || 'all'} onValueChange={(v) => setPriorityFilter(v === 'all' ? null : v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onUpdate={refreshTasks}
            onDelete={refreshTasks}
          />
        ))}
      </div>
    </div>
  );
}