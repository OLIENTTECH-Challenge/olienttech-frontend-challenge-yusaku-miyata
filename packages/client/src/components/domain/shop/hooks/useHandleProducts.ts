import { useState, useEffect } from 'react';
import * as shopApi from '@/api/shop';
import { FetchHandlingProductsResponse } from '../types/types';

export const useHandleProducts = (shopId: string, token: string, manufacturerId: string) => {
  const [products, setProducts] = useState<FetchHandlingProductsResponse | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    shopApi
      .fetchHandlingProducts({ shopId, manufacturerId, token })
      .then((products) => {
        setProducts(products);
        setError(null);
      })
      .catch((error: Error) => {
        setError(error);
        setProducts(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [shopId, manufacturerId, token]);

  return { products, isLoading, error };
};
