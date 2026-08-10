/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConnected = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder_anon_key'
  );
};

// Supabase Auth Helper Functions
export const signInWithSupabase = async (email: string, password: string) => {
  if (!isSupabaseConnected()) {
    throw new Error('Supabase client not connected. Check VITE_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOutSupabase = async () => {
  if (!isSupabaseConnected()) return;
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error signing out:', error);
};

export const getSupabaseSession = async () => {
  if (!isSupabaseConnected()) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
};

// RLS Query Helpers - Scoped strictly to partner_id
export const fetchPartnerBookingsRLS = async (partnerId: string) => {
  if (!isSupabaseConnected()) return [];

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('partner_id', partnerId);

  if (error) {
    console.warn('RLS fetch error for bookings:', error.message);
    return [];
  }
  return data || [];
};

export const fetchPartnerProfileRLS = async (partnerId: string) => {
  if (!isSupabaseConnected()) return null;

  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', partnerId)
    .single();

  if (error) {
    console.warn('RLS fetch error for partner profile:', error.message);
    return null;
  }
  return data;
};
