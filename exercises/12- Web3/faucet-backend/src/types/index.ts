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

export interface SignInRequest {
    message: string;
    signature: string;
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

export interface JWTPayload {
    address: string;
    iat: number;
    exp: number;
}