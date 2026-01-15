export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
};

async function request(path: string, options: RequestOptions = {}) {
  const { method = 'GET', body, token, signal } = options;
  const headers: Record<string, string> = {
    'Accept': 'application/json'
  };

  let payload: BodyInit | undefined;
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: payload,
    signal
  });

  let data: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'error' in data
        ? String((data as { error: unknown }).error)
        : `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, data);
  }

  return data;
}

export function fetchSiweMessage(address: string, chainId: number) {
  return request('/auth/message', {
    method: 'POST',
    body: { address, chainId }
  }) as Promise<{ token: string; address: string; message: string }>;
}

export function signInWithSiwe(token: string, signature: string) {
  return request('/auth/signin', {
    method: 'POST',
    body: { token, signature }
  }) as Promise<{ token: string; address: string }>;
}

export function claimFaucet(token: string) {
  return request('/faucet/claim', {
    method: 'POST',
    token
  }) as Promise<{ success: boolean; txHash?: string; error?: string }>;
}

export function getFaucetStatus(address: string, token: string) {
  return request(`/faucet/status/${address}`, {
    method: 'GET',
    token
  }) as Promise<{
    hasClaimed: boolean;
    balance: string;
    faucetAmount: string;
    users: string[];
  }>;
}

export function getFaucetInfo(token: string) {
  return request('/faucet/info', {
    method: 'GET',
    token
  }) as Promise<{
    name: string;
    symbol: string;
    decimals: number;
    faucetAmount: string;
  }>;
}
