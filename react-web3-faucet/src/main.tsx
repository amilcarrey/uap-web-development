import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi';
import { config } from './wagmi';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

const WC_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
if (WC_PROJECT_ID) {
  createWeb3Modal({
    wagmiConfig: config,
    projectId: WC_PROJECT_ID,
    enableAnalytics: false,
    enableOnramp: false,
    themeMode: 'light'
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
