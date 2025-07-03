import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface User {
  id: number;
  email: string;
  name: string;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);

  const { data: currentUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/api/auth/me', { withCredentials: true });
      setUser(response.data.user);
      return response.data.user;
    },
    retry: false,
    enabled: !user,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await axios.post('http://localhost:3000/api/auth/login', credentials, { withCredentials: true });
      setUser(response.data.user);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; name: string }) => {
      const response = await axios.post('http://localhost:3000/api/auth/register', data, { withCredentials: true });
      setUser(response.data.user);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  });

  return {
    user: currentUser || user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
  };
};