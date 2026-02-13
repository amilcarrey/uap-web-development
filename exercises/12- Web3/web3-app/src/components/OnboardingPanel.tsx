export function OnboardingPanel({ onOpenHelp }: { onOpenHelp?: () => void }) {
  return (
    <section className="onboarding card">
      <div className="onboarding-inner">
        <div className="onboarding-icon">i</div>
        <div className="onboarding-content">
          <h2>¿Nuevo en blockchain?</h2>
          <p className="muted">Sigue estos pasos para reclamar tokens del faucet Sepolia (red de prueba).</p>

          <ol className="steps">
            <li><strong>Paso 1:</strong> Conecta tu wallet (MetaMask o WalletConnect).</li>
            <li><strong>Paso 2:</strong> Haz clic en "Reclamar tokens" y confirma la transacción en tu wallet.</li>
            <li><strong>Paso 3:</strong> Espera la confirmación y revisa tu balance.</li>
          </ol>

          <div className="onboarding-actions">
            <button className="primary" onClick={onOpenHelp}>¿Necesitas ayuda?</button>
            <a className="learn-more" href="https://ethereum.org/en/developers/docs/" target="_blank" rel="noreferrer">Leer guía rápida</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OnboardingPanel
