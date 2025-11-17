import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useEffect, useState } from 'react';
import { getAuthMessage, signIn } from '../services/api';

interface WalletConnectionProps {
    onAuthSuccess: (token: string, address: string) => void;
}

export function WalletConnection({ onAuthSuccess }: WalletConnectionProps) {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { open } = useWeb3Modal();
    const { signMessageAsync } = useSignMessage();

    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedAddress = localStorage.getItem('auth_address');

        if (savedToken && savedAddress && address?.toLowerCase() === savedAddress.toLowerCase()) {
            setAuthToken(savedToken);
            setIsAuthenticated(true);
            onAuthSuccess?.(savedToken, address);
        } else {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_address');
            setIsAuthenticated(false);
            setAuthToken(null);
        }

    }, [address, onAuthSuccess]);

    const handleSignIn = async () => {
        if (!address) {
            console.error('No address found for authentication');
            return;
        }
        console.log('Starting authentication for address:', address);

        try {
            setIsAuthenticating(true);
            setError(null)

            // 1. Obtener el mensaje SIWE del backend
            console.log('Requesting auth message for address:', address);
            const { message } = await getAuthMessage(address);

            // 2. Solicitar al usuario que firme el mensaje
            console.log('Signing message:', message);
            const signature = await signMessageAsync({ message });

            // 3. Enviar el mensaje firmado al backend para autenticación
            console.log('Authenticating with message and signature');
            const authResponse = await signIn(message, signature);

            console.log('Authentication successful, received token:', authResponse.token);

            // 4. Guardar el token y actualizar el estado
            localStorage.setItem('auth_token', authResponse.token);
            localStorage.setItem('auth_address', authResponse.address);

            setAuthToken(authResponse.token);
            setIsAuthenticated(true);
            onAuthSuccess?.(authResponse.token, address);
        } catch (err: any) {
            console.error('Authentication failed:', err);
            setError(err?.message || 'Authentication failed');
            setIsAuthenticated(false);
            setAuthToken(null);
        } finally {
            setIsAuthenticating(false);
        }
    }

    const handleDisconnect = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_address');
        setIsAuthenticated(false);
        setAuthToken(null);
        disconnect();
    }


    
    
    if (!isConnected) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Faucet Token DApp</h2>
                <p className="mb-6 text-gray-600">
                Connect your wallet to claim tokens from the faucet.
                </p>
                <button
                onClick={() => open()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg"
                >
                Connect Wallet
                </button>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Connected:</p>
                <p className="font-mono text-sm break-all">{address}</p>
            </div>

            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium mb-2">🔐 Authentication Required</p>
                <p className="text-yellow-700 text-sm">
                    You need to sign a message to authenticate with the backend.
                </p>
            </div>

            {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
            </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={handleSignIn}
                    disabled={isAuthenticating}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                >
                    {isAuthenticating ? '🔄 Authenticating...' : '✍️ Sign Message'}
                </button>
                <button
                    onClick={handleDisconnect}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Disconnect
                </button>
            </div>
        </div>
        );
    }

    return (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-green-800">✅</span>
                    <p className="text-sm text-green-800 font-medium">Authenticated</p>
                </div>
                    <button
                        onClick={handleDisconnect}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                        Disconnect
                    </button>
            </div>
            <p className="font-mono text-sm break-all text-gray-700">{address}</p>
        </div>
    )

}