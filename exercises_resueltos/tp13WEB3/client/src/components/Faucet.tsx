import React, { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { createSiweMessage } from 'viem/siwe';
import { getNonce, signIn, getStatus, claimTokens } from '../services/api';
import { formatEther } from 'viem';

export const Faucet = () => {
    const { address, isConnected, chainId } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isConnected && address && token) {
            fetchStatus();
        }
    }, [isConnected, address, token]);

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            const nonce = await getNonce();
            const message = createSiweMessage({
                address: address as `0x${string}`,
                chainId: chainId || 11155111,
                domain: window.location.host,
                nonce,
                uri: window.location.origin,
                version: '1',
                statement: 'Sign in to Web3 Faucet',
            });

            const signature = await signMessageAsync({ message });
            const data = await signIn(message, signature);

            localStorage.setItem('token', data.token);
            setToken(data.token);
            setSuccess('Logged in successfully!');
        } catch (err: any) {
            console.error(err);
            setError('Login failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatus = async () => {
        if (!address) return;
        try {
            const data = await getStatus(address);
            setStatus(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleClaim = async () => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');
            const res = await claimTokens();
            setSuccess(`Tokens claimed! Tx: ${res.txHash}`);
            fetchStatus();
        } catch (err: any) {
            console.error(err);
            setError('Claim failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected) {
        return <div className="text-center p-10">Please connect your wallet first.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-xl shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-6">Faucet Token</h2>

            {!token ? (
                <div className="text-center">
                    <p className="mb-4">You need to sign in to interact with the faucet.</p>
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In with Ethereum'}
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Status</p>
                            <p className="text-xl font-bold">
                                {status?.hasClaimed ? 'Claimed' : 'Available'}
                            </p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Balance</p>
                            <p className="text-xl font-bold">
                                {status ? formatEther(status.balance) : '0'} TKN
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleClaim}
                        disabled={loading || status?.hasClaimed}
                        className={`w-full py-3 rounded-lg font-bold transition ${status?.hasClaimed
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {loading ? 'Processing...' : status?.hasClaimed ? 'Already Claimed' : 'Claim Tokens'}
                    </button>

                    {status?.users && (
                        <div className="mt-6">
                            <h3 className="font-bold mb-2">Recent Users</h3>
                            <div className="bg-gray-900 p-4 rounded-lg text-sm font-mono max-h-40 overflow-y-auto">
                                {status.users.map((u: string, i: number) => (
                                    <div key={i} className="truncate py-1 border-b border-gray-800 last:border-0">
                                        {u}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && <div className="mt-4 p-3 bg-red-900/50 text-red-200 rounded-lg">{error}</div>}
            {success && <div className="mt-4 p-3 bg-green-900/50 text-green-200 rounded-lg break-all">{success}</div>}
        </div>
    );
};
