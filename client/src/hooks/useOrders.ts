import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, GetOrdersParams, OrderStatus } from '../services/orderService';

export const useAdminOrders = (params: GetOrdersParams = {}) => {
  return useQuery({
    queryKey: ['admin-orders', params],
    queryFn: () => orderService.listOrders(params),
  });
};

export const useAdminOrder = (id: string) => {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
    retry: false, // Don't retry 404s
  });
};

export const useOrderMutations = () => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboardOverview'] });
    },
  });

  return {
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};
