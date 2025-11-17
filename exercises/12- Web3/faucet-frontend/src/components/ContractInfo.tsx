import { useEffect, useState } from 'react';
import { getFaucetInfo } from '../services/api';

export function ContractInfo() {
    const [info, setInfo] = useState<any>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const data = await getFaucetInfo();
                setInfo(data);
            } catch (err) {
                console.error('Error fetching faucet info:', err);
            }
        }

        fetchInfo();
    }, []);


    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Faucet Token Contract</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm opacity-90">Tokens per Claim</p>
                    <p className="text-lg font-bold">
                        {info ? Number(info.faucetAmount).toLocaleString() : '1,000,000'} FTK
                    </p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm opacity-90">Total Claimers</p>
                    <p className="text-lg font-bold">{info?.totalUsers || 0}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm opacity-90">Network</p>
                    <p className="text-lg font-bold">Sepolia</p>
                </div>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm opacity-90 mb-1">Contract Address:</p>
                <div className="flex items-center justify-between">
                    <code className="text-xs break-all mr-2">{info?.contractAddress}</code>
                    <a
                        href={`https://sepolia.etherscan.io/address/${info?.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm"
                    >
                        View ↗
                    </a>
                </div>
            </div>
        </div>
    );
}