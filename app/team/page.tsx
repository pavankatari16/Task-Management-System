'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SearchIcon, XCircle } from 'lucide-react';
import { getUsers } from '@/lib/data';
import { User } from '@/types';

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            View and manage your team members.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Directory</CardTitle>
            <CardDescription>
              All users who have access to your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or role..."
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

            {loading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-muted rounded-md mb-2"></div>
                <div className="h-10 bg-muted rounded-md mb-2"></div>
                <div className="h-10 bg-muted rounded-md"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No team members found</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const initials = user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase();

                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{initials}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                              {user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}