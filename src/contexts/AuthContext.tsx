import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  role: 'owner' | 'driver' | 'admin' | 'superadmin';
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  logout: () => void;
  loginAs: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        mapSupabaseUser(session.user);
      }
      setLoading(false);
    };

    checkSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        mapSupabaseUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = (sbUser: SupabaseUser): User => {
    const role = sbUser.user_metadata?.role || deriveRole(sbUser.email || '');
    const name = sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Unknown User';

    const mappedUser: User = {
      id: sbUser.id,
      email: sbUser.email || '',
      role: role as any,
      name: name
    };
    
    setUser(mappedUser);
    return mappedUser;
  };

  const deriveRole = (email: string): string => {
    if (email === 'admin@test.com') return 'superadmin';
    if (email === 'regular_admin@test.com') return 'admin';
    if (email.includes('owner')) return 'owner';
    if (email.includes('driver')) return 'driver';
    return 'driver'; // Default
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.user) {
        const mappedUser = mapSupabaseUser(data.user);
        return { success: true, user: mappedUser };
      }
      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    sessionStorage.removeItem('admin_impersonating');
  };

  const loginAs = (targetUser: User) => {
    setUser(targetUser);
    // Note: This is for simulation, won't update Supabase session
    sessionStorage.setItem('admin_impersonating', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loginAs }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}