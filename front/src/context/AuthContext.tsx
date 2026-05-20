import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loginRequest } from '../api/authApi';
import type { LoginCredentials, AuthResponse } from '../api/authApi';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'aifront_token';
const USER_KEY  = 'aifront_user';

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser]    = useState<AuthResponse | null>(null);
    const [token, setToken]   = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]   = useState<string | null>(null);

    // Restore session from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser  = localStorage.getItem(USER_KEY);
        if (storedToken && storedUser) {
            if (isTokenExpired(storedToken)) {
                // Si el token ha expirado, limpiar el almacenamiento y no restaurar la sesión
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
                setToken(null);
                setUser(null);
            } else {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setError(null);
        setIsLoading(true);
        try {
            const { data } = await loginRequest(credentials);
            setToken(data.token);
            setUser(data);
            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(data));
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                ?? 'Credenciales no válidas';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    };

    // Función auxiliar para verificar la expiración del JWT
    function isTokenExpired(token: string): boolean {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return true;

            // Decodificar payload (segunda sección del JWT)
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );

            const payload = JSON.parse(jsonPayload);
            if (payload && typeof payload.exp === 'number') {
            const now = Math.floor(Date.now() / 1000);
            return payload.exp < now;
            }
            return false;
        } catch (error) {
            return true; // Si falla la decodificación, se asume expirado/inválido
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                error,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
