const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface AuthMessage {
    message: string;
    address: string;
    nonce: string;
}

export interface AuthResponse {
    token: string;
    address: string;
    expiresAt: string;
}

export interface ClaimResponse {
    txHash: string;
    success: boolean;
    message?: string;
}

export interface FaucetStatus {
    hasClaimed: boolean;
    balance: string;
    users: string[];
    faucetAmount: string;
}

// GET Mensaje SIWE
export async function getAuthMessage(address: string): Promise<AuthMessage> {

    const response = await fetch(`${API_BASE_URL}/auth/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address })
    });

    if (!response.ok) {
        throw new Error('Failed to get auth message');
    }

    return response.json();
}

// POST firma para autenticación
export async function signIn(message: string, signature: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, signature })
    })

    if (!response.ok) {
        throw new Error('Failed to sign in');
    }

    return response.json();
}

// POST reclamar tokens (protegido)
export async function claimTokens(token: string): Promise<ClaimResponse> {
    const response = await fetch(`${API_BASE_URL}/faucet/claim`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to claim tokens');
    }

    return response.json();
}

// GET estado del faucet (protegido)
export async function getFaucetStatus(address: string, token: string): Promise<FaucetStatus> {
    const response = await fetch(`${API_BASE_URL}/faucet/status/${address}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get faucet status');
    }

    return response.json();
}

// GET informacion publica del faucet
export async function getFaucetInfo() {
    const response = await fetch(`${API_BASE_URL}/faucet/info`);

    if (!response.ok) {
        throw new Error('Failed to get faucet info');
    }

    return response.json();
}


