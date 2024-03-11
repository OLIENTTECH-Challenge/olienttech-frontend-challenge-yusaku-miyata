import { ItemWithOrder, OrderItem } from '../types/types';
import { toast } from 'react-hot-toast';
import * as shopApi from '@/api/shop';

export const postOrder = async (
  shopId: string,
  token: string,
  manufacturerId: string,
  orders: ItemWithOrder[],
): Promise<void> => {
  const items: OrderItem[] = orders.map((item) => ({ productId: item.id, quantity: item.quantity }));

  if (!items.length) {
    toast.error('発注商品を選択してください');
    return;
  }

  await shopApi.postOrder({ manufacturerId, items, shopId, token });
};
