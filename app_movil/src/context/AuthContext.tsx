import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../services/supabase';
import { mapSupabaseAuthError } from '../utils/authErrors';

// Permite completar el flujo de autenticación al volver del navegador
WebBrowser.maybeCompleteAuthSession();

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  /** loading: Solo true durante el arranque inicial de la app mientras verifica credenciales guardadas */
  loading: boolean;
  /** isRecovering: true mientras el usuario está en el flujo forgot → verify-otp → reset-password */
  isRecovering: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; isEmailNotConfirmed?: boolean }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ success: boolean; error?: string; session?: Session | null }>;
  verifySignupOtp: (
    email: string,
    token: string
  ) => Promise<{ success: boolean; error?: string }>;
  resendSignupOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  sendPasswordResetOtp: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  verifyRecoveryOtp: (
    email: string,
    token: string
  ) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isInstitutional: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: false,
  isRecovering: false,
  signInWithGoogle: async () => ({ success: false }),
  signInWithPassword: async () => ({ success: false }),
  signUpWithEmail: async () => ({ success: false }),
  verifySignupOtp: async () => ({ success: false }),
  resendSignupOtp: async () => ({ success: false }),
  sendPasswordResetOtp: async () => ({ success: false }),
  verifyRecoveryOtp: async () => ({ success: false }),
  updatePassword: async () => ({ success: false }),
  signOut: async () => {},
  isInstitutional: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  // loading solo representa la comprobación inicial al abrir la app.
  // NUNCA debe alternarse durante acciones del usuario (login, registro, recuperación)
  // para evitar que RootNavigator desmonte el árbol de navegación.
  const [loading, setLoading] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    // Timeout de seguridad: asegura que loading pase a false en máx 1s
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // 1. Obtener sesión persistida en el dispositivo
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        clearTimeout(timeout);
      })
      .catch(() => {
        setLoading(false);
        clearTimeout(timeout);
      });

    // 2. Suscribirse a cambios de estado de autenticación (Login, Logout, Token Refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
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
        return {
          success: false,
          error: mapSupabaseAuthError(error?.message || 'No se pudo iniciar el flujo de Google.'),
        };
      }

      // Abrir navegador in-app para el login con Google
      const authResult = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (authResult.type === 'success' && authResult.url) {
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
              return { success: false, error: mapSupabaseAuthError(sessionError.message) };
            }

            setSession(sessionData.session);
            setUser(sessionData.user);
            return { success: true };
          }
        }
      }

      return { success: false, error: 'Inicio de sesión cancelado o no completado.' };
    } catch (err: any) {
      return {
        success: false,
        error: mapSupabaseAuthError(err?.message || 'Error inesperado durante la autenticación.'),
      };
    }
  };

  const signInWithPassword = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; isEmailNotConfirmed?: boolean }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        const isEmailNotConfirmed = error.message.toLowerCase().includes('email not confirmed');
        return {
          success: false,
          error: mapSupabaseAuthError(error.message),
          isEmailNotConfirmed,
        };
      }

      setSession(data.session);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: mapSupabaseAuthError(err?.message || 'Error al iniciar sesión con correo.'),
      };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string; session?: Session | null }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            name: fullName.trim(),
          },
        },
      });

      if (error) {
        return { success: false, error: mapSupabaseAuthError(error.message) };
      }

      // Si el email ya está confirmado o no requiere confirmación, la sesión viene en data.session
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
      }

      return { success: true, session: data.session };
    } catch (err: any) {
      return {
        success: false,
        error: mapSupabaseAuthError(err?.message || 'Error al procesar el registro.'),
      };
    }
  };

  const verifySignupOtp = async (
    email: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanToken = token.trim();

      const { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: 'signup',
      });

      if (error) {
        // En algunas configuraciones de Supabase puede ser 'email' en vez de 'signup'
        const fallback = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: 'email',
        });

        if (fallback.error) {
          return { success: false, error: mapSupabaseAuthError(fallback.error.message) };
        }

        setSession(fallback.data.session);
        setUser(fallback.data.user);
        return { success: true };
      }

      setSession(data.session);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: mapSupabaseAuthError(err?.message || 'Error al verificar el código OTP.'),
      };
    }
  };

  const resendSignupOtp = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: cleanEmail,
      });

      if (error) {
        return { success: false, error: mapSupabaseAuthError(error.message) };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: mapSupabaseAuthError(err?.message || 'Error al reenviar el código.'),
      };
    }
  };

  const sendPasswordResetOtp = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);

      if (error) {
        return { success: false, error: mapSupabaseAuthError(error.message) };
      }

      // Marcar inicio de flujo de recuperación para proteger la navegación
      setIsRecovering(true);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: mapSupabaseAuthError(err?.message || 'Error al enviar código de recuperación.'),
      };
    }
  };

  const verifyRecoveryOtp = async (
    email: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanToken = token.trim();

      const { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: 'recovery',
      });

      if (error) {
        return { success: false, error: mapSupabaseAuthError(error.message) };
      }

      // Al verificar recovery, el usuario queda autenticado en sesión de recuperación
      // isRecovering permanece true hasta que updatePassword finalice
      setSession(data.session);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: mapSupabaseAuthError(err?.message || 'Error al verificar código de recuperación.'),
      };
    }
  };

  const updatePassword = async (
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: mapSupabaseAuthError(error.message) };
      }

      // Finalizar el flujo de recuperación: el guardián del (app)/_layout.tsx puede operar normal
      setIsRecovering(false);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: mapSupabaseAuthError(err?.message || 'Error al actualizar contraseña.'),
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
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
        isRecovering,
        signInWithGoogle,
        signInWithPassword,
        signUpWithEmail,
        verifySignupOtp,
        resendSignupOtp,
        sendPasswordResetOtp,
        verifyRecoveryOtp,
        updatePassword,
        signOut,
        isInstitutional,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
