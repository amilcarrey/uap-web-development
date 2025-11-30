import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getNonce = async () => {
    const response = await api.post('/auth/message');
    return response.data;
};

export const signIn = async (message: string, signature: string) => {
    const response = await api.post('/auth/signin', { message, signature });
    return response.data;
};

export const getStatus = async (address: string) => {
    const response = await api.get(`/faucet/status/${address}`);
    return response.data;
};

export const claimTokens = async () => {
    const response = await api.post('/faucet/claim');
    return response.data;
};
