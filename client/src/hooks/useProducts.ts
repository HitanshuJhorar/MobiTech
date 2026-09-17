import { useQuery } from '@tanstack/react-query';
import { productService, GetProductsParams } from '../services/productService';

export const useProducts = (params: GetProductsParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productService.getFeaturedProducts,
  });
};

export const useTrendingProducts = () => {
  return useQuery({
    queryKey: ['products', 'trending'],
    queryFn: productService.getTrendingProducts,
  });
};

export const useBestSellerProducts = () => {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: productService.getBestSellerProducts,
  });
};
