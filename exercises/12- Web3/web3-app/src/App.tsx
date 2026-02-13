import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import { useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ActionButtonList } from './components/ActionButtonList'
import { SmartContractActionButtonList } from './components/SmartContractActionButtonList'
import { InfoList } from './components/InfoList'
import { projectId, metadata, networks, wagmiAdapter } from './config'

import "./App.css"
import OnboardingPanel from './components/OnboardingPanel'
import HelpModal from './components/HelpModal'
import { WalletInfo } from './components/WalletInfo'

import ClaimTokensButton from "./components/ClaimTokensButton"

const queryClient = new QueryClient()

const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: 'light' as const,
  themeVariables: {
    '--w3m-accent': '#000000',
  }
}

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export function App() {
  const [showHelp, setShowHelp] = useState(false)
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>(undefined);
  const [signedMsg, setSignedMsg] = useState('');
  const [balance, setBalance] = useState('');

  const receiveHash = (hash: `0x${string}`) => {
    setTransactionHash(hash); // Update the state with the transaction hash
  };

  const receiveSignedMsg = (signedMsg: string) => {
    setSignedMsg(signedMsg); // Update the state with the transaction hash
  };

  const receivebalance = (balance: string) => {
    setBalance(balance)
  }


  return (
    <div className={"pages"}>
      <header className="app-header">
        <img src="/reown.svg" alt="Reown" style={{ width: '120px', height: '120px' }} />
        <div>
          <h1>TP12 — Reclama tokens fácilmente</h1>
          <p className="subtitle">Interfaz para usuarios nuevos en blockchain</p>
        </div>
      </header>

      <OnboardingPanel onOpenHelp={() => setShowHelp(true)} />

      
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
            <appkit-button />
            <ClaimTokensButton />
            <ActionButtonList sendHash={receiveHash} sendSignMsg={receiveSignedMsg} sendBalance={receivebalance}/>
            <SmartContractActionButtonList />
            <div className="advice">
              <p>
                This projectId only works on localhost. <br/>
                Go to <a href="https://dashboard.reown.com" target="_blank" className="link-button" rel="Reown Dashboard">Reown Dashboard</a> to get your own.
              </p>
            </div>
            <WalletInfo />
            <InfoList hash={transactionHash} signedMsg={signedMsg} balance={balance}/>
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  )
}

export default App
