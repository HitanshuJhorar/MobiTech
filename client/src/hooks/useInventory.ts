import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService, GetInventoryParams } from '../services/inventoryService';

export const useInventory = (params: GetInventoryParams = {}) => {
  return useQuery({
    queryKey: ['inventory', params],
    queryFn: () => inventoryService.getInventory(params),
  });
};

export const useLowStock = (threshold = 5) => {
  return useQuery({
    queryKey: ['inventory', 'low-stock', threshold],
    queryFn: () => inventoryService.getLowStock(threshold),
  });
};

export const useInventoryMutations = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['inventory'] });
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboardOverview'] });
  };

  const setStockMutation = useMutation({
    mutationFn: ({ productId, stockQuantity }: { productId: string; stockQuantity: number }) =>
      inventoryService.setStock(productId, stockQuantity),
    onSuccess: invalidateAll,
  });

  const adjustStockMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      inventoryService.adjustStock(productId, quantity),
    onSuccess: invalidateAll,
  });

  return {
    setStock: setStockMutation.mutateAsync,
    isSettingStock: setStockMutation.isPending,
    adjustStock: adjustStockMutation.mutateAsync,
    isAdjustingStock: adjustStockMutation.isPending,
  };
};
