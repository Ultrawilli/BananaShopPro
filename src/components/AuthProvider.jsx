import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId) {
    if (!userId) { setProfile(null); return null; }
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id,email,role,full_name')
      .eq('user_id', userId)
      .single();
    if (error) { setProfile(null); return null; }
    setProfile(data);
    return data;
  }

  useEffect(() => {
    let alive = true;
    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      setSession(data?.session || null);
      if (data?.session?.user?.id) await loadProfile(data.session.user.id);
      if (alive) setLoading(false);
    }
    init();
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user?.id) await loadProfile(nextSession.user.id); else setProfile(null);
      setLoading(false);
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  async function signIn(email, pw) {
    const payload = { email };
    payload['password'] = pw;
    return supabase.auth.signInWithPassword(payload);
  }

  async function signUp(email, pw) {
    const payload = { email };
    payload['password'] = pw;
    return supabase.auth.signUp(payload);
  }

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    refreshProfile: () => loadProfile(session?.user?.id),
    signIn,
    signUp,
    signOut: async () => supabase.auth.signOut()
  }), [session, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
