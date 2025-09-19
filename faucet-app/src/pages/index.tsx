const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">FaucetToken dApp</h1>
      <p className="text-lg text-gray-700">Conectá tu wallet para empezar</p>
      <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Conectar Wallet
      </button>
    </div>
  )
}

export default Home
