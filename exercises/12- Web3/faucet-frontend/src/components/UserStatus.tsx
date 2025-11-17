import { useAccount } from 'wagmi';
import { getFaucetStatus, type FaucetStatus as FaucetStatusType } from '../services/api';
import { useEffect, useState } from 'react';

interface UserStatusProps {
    authToken: string | null;
}

export function UserStatus({ authToken }: UserStatusProps) {
    const { address } = useAccount();
    const [status, setStatus ] = useState<FaucetStatusType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!address || !authToken) {
            setStatus(null);
            return;
        }

        const fetchStatus = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getFaucetStatus(address, authToken);
                setStatus(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch faucet status');
                setStatus(null);
                console.error('Error fetching faucet status:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStatus();
    }, [address, authToken]);

    if (!address || !authToken || !status) {
        return null;
    }



    // Verificar si ya reclamó tokens
    // const { data: hasClaimed, isLoading: isLoadingClaimed } = useReadContract({
    //     address: FAUCET_TOKEN_ADDRESS,
    //     abi: FAUCET_TOKEN_ABI,
    //     functionName: 'hasAddressClaimed',
    //     args: address ? [address] : undefined,
    //     query: { enabled: !!address },
    // });

    // const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    //     address: FAUCET_TOKEN_ADDRESS,
    //     abi: FAUCET_TOKEN_ABI,
    //     functionName: 'balanceOf',
    //     args: address ? [address] : undefined,
    //     query: { enabled: !!address },
    // });

    // const formattedBalance = balance ? formatUnits(balance, 18) : '0';

    if (isLoading) {
        return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Your Token Status</h3>
            <div className="animate-pulse space-y-4">
                <div className="bg-gray-200 h-20 rounded"></div>
                <div className="bg-gray-200 h-20 rounded"></div>
            </div>
        </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-800">Error loading status: {error}</p>
            </div>
            );
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Your Token Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Token Balance:</p>
                    <p className="text-xl font-bold text-green-600">
                        {Number(status.balance).toLocaleString()} FTK
                    </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Claim Status:</p>
                    <p className={`text-xl font-bold ${
                        status.hasClaimed ? 'text-orange-600' : 'text-blue-600'
                    }`}>
                        {status.hasClaimed ? 'Already Claimed' : 'Available'}
                    </p>
                </div>
            </div>
        </div>
    )
}