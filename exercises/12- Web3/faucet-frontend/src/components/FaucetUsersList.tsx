import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getFaucetStatus } from "../services/api";


interface FaucetUsersListProps {
    authToken: string | null;
}

export function FaucetUsersList({ authToken }: FaucetUsersListProps) {
    const { address } = useAccount();
    const [users, setUsers] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect (() => {
        if (!address || !authToken) {
            setUsers(null);
            return;
        }

        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const data = await getFaucetStatus(address, authToken);
                setUsers(data.users);
            } catch (err: any) {
                setError(err);
                setUsers(null);
                console.error('Error fetching faucet users:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [address, authToken]);

    if (isLoading) {
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Faucet Users</h3>
            <div className="animate-pulse space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-200 h-4 rounded"></div>
                ))}
            </div>
        </div>
    }

    if (error) {
        return (
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Faucet Users</h3>
                <p className="text-red-600">Error loading users: {error}</p>
            </div>
        )
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
                Faucet Users ({users?.length || 0})
            </h3>
            
            {users && users.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                        {users.map((user: string, index: number) => (
                            <div 
                                key={user} 
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                        #{index + 1}
                                    </span>
                                    <span className="font-mono text-black text-sm break-all">
                                        {user}
                                    </span>
                                </div>
                                <a
                                href={`https://sepolia.etherscan.io/address/${user}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                View ↗
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-center py-8">
                    No users have claimed tokens yet.
                </p>
            )}
        </div>
    )
}