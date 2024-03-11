import * as shopApi from '@/api/shop';

export type FetchHandlingProductsResponse = Awaited<ReturnType<typeof shopApi.fetchHandlingProducts>>;

export type ResolvedType<T> = T extends Promise<infer R> ? R : T;
export type ItemWithOrder = ResolvedType<ReturnType<typeof shopApi.fetchHandlingProducts>>['products'][number] & {
  quantity: number;
};

export type OrderItem = {
  productId: string;
  quantity: number;
};
