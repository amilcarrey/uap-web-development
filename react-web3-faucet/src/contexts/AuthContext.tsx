import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAccount, useChainId, useSignMessage } from 'wagmi';
import { ApiError, fetchSiweMessage, signInWithSiwe } from '../api/client';
import { SEPOLIA_CHAIN_ID } from '../utils';

interface AuthContextValue {
  token: string | null;
  address: string | null;
  isAuthenticated: boolean;
  isSigning: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

const STORAGE_KEY = 'faucet-auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address: walletAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const [token, setToken] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as { token?: string; address?: string };
      if (parsed?.token && parsed?.address) {
        setToken(parsed.token);
        setAddress(parsed.address.toLowerCase());
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setAddress(null);
    setError(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    if (!isConnected) {
      signOut();
    }
  }, [isConnected, signOut]);

  useEffect(() => {
    if (!walletAddress || !address) return;
    if (walletAddress.toLowerCase() !== address) {
      signOut();
    }
  }, [walletAddress, address, signOut]);

  const persistSession = useCallback((nextToken: string, nextAddress: string) => {
    setToken(nextToken);
    setAddress(nextAddress);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: nextToken, address: nextAddress })
      );
    }
  }, []);

  const signIn = useCallback(async () => {
    if (isSigning) return;
    if (!isConnected || !walletAddress) {
      throw new Error('Conecta tu wallet antes de autenticarte');
    }
    if (chainId !== SEPOLIA_CHAIN_ID) {
      throw new Error('Cambia a la red Sepolia para continuar');
    }

    setIsSigning(true);
    setError(null);

    try {
      const { token: nonce, message } = await fetchSiweMessage(walletAddress, chainId);
      const signature = await signMessageAsync({ message });
      const { token: jwtToken, address: serverAddress } = await signInWithSiwe(
        nonce,
        signature
      );
      persistSession(jwtToken, serverAddress.toLowerCase());
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('No se pudo completar la autenticacion');
      }
      throw err;
    } finally {
      setIsSigning(false);
    }
  }, [chainId, isConnected, isSigning, persistSession, signMessageAsync, walletAddress]);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    address,
    isAuthenticated: Boolean(token && address),
    isSigning,
    error,
    signIn,
    signOut,
    clearError
  }), [token, address, isSigning, error, signIn, signOut, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
