import { useEffect } from 'react'
import {
    useAppKitState,
    useAppKitTheme,
    useAppKitEvents,
    useAppKitAccount
     } from '@reown/appkit/react'
import { useWaitForTransactionReceipt } from 'wagmi'

interface InfoListProps {
    hash: `0x${string}` | undefined;
    signedMsg: string;
    balance: string;
}

export const InfoList = ({ hash, signedMsg, balance }: InfoListProps) => {
    const kitTheme = useAppKitTheme(); // AppKit hook to get the theme information and theme actions 
    const state = useAppKitState(); // AppKit hook to get the state
    const {address, isConnected } = useAppKitAccount(); // AppKit hook to get the account information
    const events = useAppKitEvents() // AppKit hook to get the events
    // wallet info available via appkit hooks if needed

    const { data: receipt } = useWaitForTransactionReceipt({ hash, confirmations: 2,  // Wait for at least 2 confirmation
        timeout: 300000,    // Timeout in milliseconds (5 minutes)
        pollingInterval: 1000,  })

    useEffect(() => {
        console.log("Events: ", events);
    }, [events]);

    // embedded wallet details removed from display to keep UI simple

    return (
        <div className="info-grid" aria-live="polite">
            {balance && (
                <div className="info-card">
                    <h4>Balance</h4>
                    <p className="large">{balance}</p>
                </div>
            )}

            {hash && (
                <div className="info-card">
                    <h4>Transacción</h4>
                    <p className="small">Hash: {hash}</p>
                    <p className="small">Estado: {receipt?.status?.toString() ?? 'Pendiente'}</p>
                </div>
            )}

            {signedMsg && (
                <div className="info-card">
                    <h4>Firma</h4>
                    <pre className="tiny">{signedMsg}</pre>
                </div>
            )}

            <div className="info-card">
                <h4>Cuenta</h4>
                <p className="tiny">Address: {address}</p>
                <p className="tiny">Connected: {isConnected.toString()}</p>
            </div>

            <div className="info-card">
                <h4>Theme</h4>
                <p className="tiny">{kitTheme.themeMode}</p>
            </div>

            <div className="info-card">
                <h4>Estado AppKit</h4>
                <p className="tiny">activeChain: {state.activeChain}</p>
                <p className="tiny">loading: {state.loading.toString()}</p>
            </div>
        </div>
    )
}
