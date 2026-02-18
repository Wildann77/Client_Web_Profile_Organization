import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setUser, setAuthenticated, setLoading } = useAuthStore();

  // Query for current user
  const { data, isLoading: isUserLoading, isSuccess, isError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: !!localStorage.getItem('accessToken'),
    retry: false,
  });

  // Update store when query finishes
  useEffect(() => {
    // Only update if we're not currently loading from the query's perspective
    if (!isUserLoading) {
      if (isSuccess && data) {
        setUser(data);
        setAuthenticated(true);
      } else if (isError) {
        setUser(null);
        setAuthenticated(false);
      }
      setLoading(false);
    }
  }, [data, isUserLoading, isSuccess, isError, setUser, setAuthenticated, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isUserLoading,
  };
};

export const useLogin = () => {
  const { setUser, setAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data.user);
      setAuthenticated(true);
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });
};

export const useLogout = () => {
  const { logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};
