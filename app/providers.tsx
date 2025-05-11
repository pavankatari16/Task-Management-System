'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

// Auth context to manage user state throughout the app
type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock login for now - will be replaced with Supabase auth
      setTimeout(() => {
        setUser({
          id: '1',
          email,
          name: email.split('@')[0],
          role: 'user',
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Mock registration for now - will be replaced with Supabase auth
      setTimeout(() => {
        setUser({
          id: '1',
          email,
          name,
          role: 'user',
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}