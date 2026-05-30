import { createContext, useEffect, useState, useCallback } from 'react';
import { registerUser, loginUser, logoutUser, fetchProfile } from '../services/api';
import type { ProfileRow } from '../services/api';

interface AuthUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthState {
  user: AuthUser | null;
  session: any;
  profile: ProfileRow | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const p = await fetchProfile();
      setProfile(p);
      if (p) {
        setUser({
          id: p._id || p.id,
          _id: p._id || p.id,
          name: p.name,
          email: p.email,
          role: p.role,
          avatar: p.avatar,
        });
      }
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function signUp(email: string, password: string, name: string, role: string) {
    const data = await registerUser(name, email, password, role);
    setUser({
      id: data.user.id,
      _id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      avatar: data.user.avatar || '',
    });
    setProfile(data.user);
    await refreshProfile();
  }

  async function signIn(email: string, password: string) {
    const data = await loginUser(email, password);
    setUser({
      id: data.user.id,
      _id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      avatar: data.user.avatar || '',
    });
    setProfile(data.user);
  }

  async function signOut() {
    await logoutUser();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      session: null,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}