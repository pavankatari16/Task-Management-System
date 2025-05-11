'use client';

import { useState } from 'react';
import { useAuth } from './providers';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { ClipboardList } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [activeForm, setActiveForm] = useState<'login' | 'register'>('login');

  if (user) {
    return <DashboardPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="space-y-8 w-full max-w-md">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-primary text-primary-foreground p-3 rounded-full">
                <ClipboardList size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold">TaskFlow</h1>
            <p className="text-muted-foreground">
              Manage your team&apos;s tasks efficiently
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-8 space-y-6">
            <div className="flex space-x-2 mb-6">
              <Button
                variant={activeForm === 'login' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setActiveForm('login')}
              >
                Login
              </Button>
              <Button
                variant={activeForm === 'register' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setActiveForm('register')}
              >
                Register
              </Button>
            </div>

            {activeForm === 'login' ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </div>
  );
}