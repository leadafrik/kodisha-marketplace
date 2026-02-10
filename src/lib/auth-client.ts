'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClient;
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
) => {
  const supabase = getSupabaseClient();

  try {
    // Sign up user with email and password
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      user: data.user,
      message: 'Signup successful! Check your email to confirm your account.',
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Signup failed');
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
      message: 'Signed in successfully!',
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Sign in failed');
  }
};

export const signInWithGoogle = async () => {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: 'Redirecting to Google...' };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Google sign in failed');
  }
};

export const signInWithFacebook = async () => {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: 'Redirecting to Facebook...' };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Facebook sign in failed');
  }
};

export const resetPassword = async (email: string) => {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'Password reset link sent to your email!',
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Password reset failed');
  }
};

export const updatePassword = async (newPassword: string) => {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'Password updated successfully!',
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Password update failed');
  }
};

export const signOut = async () => {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'Signed out successfully!',
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Sign out failed');
  }
};

export const getCurrentUser = async () => {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to get user');
  }
};

export const getSession = async () => {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      session: data.session,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to get session');
  }
};
