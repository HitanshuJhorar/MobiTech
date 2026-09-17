import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: admin, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.getCurrentAdmin,
    retry: false, // Don't retry on 401
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) => 
      authService.login(credentials.email, credentials.password),
    onSuccess: () => {
      // Invalidate and refetch immediately
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear admin state
      queryClient.setQueryData(['auth', 'me'], null);
      // Optional: Clear other admin-related caches
      queryClient.removeQueries({ queryKey: ['admin'] });
    },
  });

  return {
    admin: admin ?? null,
    isLoading,
    error,
    isAuthenticated: !!admin,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
};
