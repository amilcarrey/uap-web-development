import { useAccount } from 'wagmi'
import { claimTokens, type ClaimResponse } from '../services/api';
import { useState } from 'react';

interface FaucetClaimProps {
    authToken: string | null;
    hasClaimed: boolean;
    onClaimSuccess: () => void;
}

export function FaucetClaim({ authToken, hasClaimed, onClaimSuccess }: FaucetClaimProps) {
    const { address } = useAccount();
    const [isClaiming, setIsClaiming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ClaimResponse | null>(null);

    const handleClaim = async () => {
        if (!authToken) {
            setError('You must be authenticated to claim tokens.');
            return;
        }

        try {
            setIsClaiming(true);
            setError(null);
            setResult(null);

            console.log('Claiming tokens with auth token:', authToken);
            const response = await claimTokens(authToken);

            setResult(response);
            console.log('Tokens claimed successfully:', response);

            onClaimSuccess?.();
        } catch (err: any) {
            console.error('Error claiming tokens:', err);
            setError(err.message || 'Failed to claim tokens. Please try again later.');
        } finally {
            setIsClaiming(false);
        }
    }

    // Verfificar si ya reclamó 
    // const { data: hasClaimed } = useReadContract({
    //     address: FAUCET_TOKEN_ADDRESS,
    //     abi: FAUCET_TOKEN_ABI,
    //     functionName: 'hasAddressClaimed',
    //     args: address ? [address] : undefined,
    //     query: { enabled: !!address },
    // });

    // // Obtener cantidad del faucet
    // const { data: faucetAmount } = useReadContract({
    //     address: FAUCET_TOKEN_ADDRESS,
    //     abi: FAUCET_TOKEN_ABI,
    //     functionName: 'getFaucetAmount',
    // });

    // // Hook para escribir al contrato
    // const {
    //     writeContract,
    //     data: hash,      
    //     isPending,
    //     error
    // } = useWriteContract();

    // //  Esperar confirmación de la transacción
    // const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    //     hash,
    // });

    // const handleClaim = async () => {
    //     try {
    //         writeContract({
    //             address: FAUCET_TOKEN_ADDRESS,
    //             abi: FAUCET_TOKEN_ABI,
    //             functionName: 'claimTokens',
    //         });
    //     } catch (error) {
    //         console.error('Error claiming tokens:', error);
    //     }
    // }

    if (!address || !authToken) {
        return null;
    }

    if (hasClaimed) {
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
            Tokens Already Claimed
            </h3>
            <p className="text-orange-700">
            You have already claimed your tokens from this faucet. Each address can only claim once.
            </p>
        </div>
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Claim Faucet Tokens</h3>
            
            <div className="mb-6">
                <p className="text-gray-700 mb-2">
                    You can claim <span className="font-bold text-green-600">1,000,000</span> FTK tokens for free!
                </p>
                <p className="text-sm text-gray-500">
                    Each address can only claim once. The backend will handle the transaction.
                </p>
            </div>

            <button
                onClick={handleClaim}
                disabled={isClaiming}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                isClaiming
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
            >
                {isClaiming ? '🔄 Claiming Tokens...' : '🎁 Claim Tokens'}
            </button>

            {result && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium mb-2">✅ Tokens claimed successfully!</p>
                    <a
                        href={`https://sepolia.etherscan.io/tx/${result.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                    >
                        View transaction: {result.txHash}
                    </a>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">❌ Error:</p>
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}   

