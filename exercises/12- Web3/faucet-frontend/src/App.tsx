import { WalletConnection } from './components/WalletConnection';
import { ContractInfo } from './components/ContractInfo';
import { UserStatus } from './components/UserStatus';
import { FaucetClaim } from './components/FaucetClaim';
import { FaucetUsersList } from './components/FaucetUsersList';
import { useAccount } from 'wagmi';
import { NetworkChecker } from './components/NetworkChecker';
import { useState } from 'react';


function App() {
  const { isConnected } = useAccount();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [hasClaimed, setHasClaimed] = useState(false);

  const handleAuthSuccess = (token: string, _address: string) => {
    setAuthToken(token);
  }

  const handleClaimSuccess = () => {
    setHasClaimed(true);
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <WalletConnection onAuthSuccess={handleAuthSuccess} />
        
        {isConnected && authToken && (
          <>
            <NetworkChecker />
            <ContractInfo />
            <UserStatus authToken={authToken} />
            <FaucetClaim 
              authToken={authToken} 
              hasClaimed={hasClaimed} 
              onClaimSuccess={handleClaimSuccess} 
            />
            <FaucetUsersList authToken={authToken} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
