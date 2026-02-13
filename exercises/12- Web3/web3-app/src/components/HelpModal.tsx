export function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal card">
        <header className="modal-header">
          <h3>Ayuda rápida — conceptos clave</h3>
          <button className="close" onClick={onClose} aria-label="Cerrar">✕</button>
        </header>
        <div className="modal-body">
          <h4>¿Qué es una transacción?</h4>
          <p>Una acción que se publica en la blockchain — por ejemplo reclamar tokens. Confirmarás desde tu wallet.</p>

          <h4>¿Qué es el gas?</h4>
          <p>Pequeña comisión necesaria para ejecutar la transacción. En Sepolia se usa ETH de prueba.</p>

          <h4>Seguridad</h4>
          <p>No compartas tu clave privada. Esta app sólo solicita firmas para acciones normales.</p>
        </div>
        <footer className="modal-footer">
          <button className="primary" onClick={onClose}>Cerrar</button>
        </footer>
      </div>
    </div>
  )
}

export default HelpModal
