import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../services/supabase';

// Permite completar el flujo de autenticación al volver del navegador
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isInstitutional: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signInWithGoogle: async () => ({ success: false }),
  signInWithPassword: async () => ({ success: false }),
  signOut: async () => {},
  isInstitutional: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obtener sesión persistida en el dispositivo
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Suscribirse a cambios de estado de autenticación (Login, Logout, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const redirectUrl = Linking.createURL('login');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent select_account',
          },
        },
      });

      if (error || !data?.url) {
        setLoading(false);
        return { success: false, error: error?.message || 'No se pudo iniciar el flujo de Google.' };
      }

      // Abrir navegador in-app para el login con Google
      const authResult = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (authResult.type === 'success' && authResult.url) {
        // Extraer tokens desde la URL de retorno
        const parsedUrl = Linking.parse(authResult.url);
        const fragment = authResult.url.split('#')[1];

        if (fragment) {
          const params = new URLSearchParams(fragment);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              setLoading(false);
              return { success: false, error: sessionError.message };
            }

            setSession(sessionData.session);
            setUser(sessionData.user);
            setLoading(false);
            return { success: true };
          }
        }
      }

      setLoading(false);
      return { success: false, error: 'Inicio de sesión cancelado o no completado.' };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err?.message || 'Error inesperado durante la autenticación.' };
    }
  };

  const signInWithPassword = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      setSession(data.session);
      setUser(data.user);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err?.message || 'Error al iniciar sesión con correo.' };
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setLoading(false);
  };

  const email = user?.email || '';
  const isInstitutional =
    email.endsWith('.edu') ||
    email.endsWith('.cl') ||
    email.includes('alumnos') ||
    email.includes('docentes');

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signInWithGoogle,
        signInWithPassword,
        signOut,
        isInstitutional,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

