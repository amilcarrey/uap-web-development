import { Faucet } from './components/Faucet';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Web3 Faucet
        </h1>
        <w3m-button />
      </header>
      <main className="container mx-auto px-4 py-8">
        <Faucet />
      </main>
    </div>
  );
}

export default App;
