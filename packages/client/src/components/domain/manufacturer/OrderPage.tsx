import { useAuthLoaderData } from '@/hooks/useAuthLoaderData';
import { useState, useEffect } from 'react';
import * as manufacturerApi from '@/api/manufacturer';
import { Column, Table } from '@/components/case/Table';
import { useParams } from 'react-router-dom';
import styles from './OrderPage.module.css';
import { formatMoney, formatDate } from '@/libs/utils';

type Response = Awaited<ReturnType<typeof manufacturerApi.fetchOrder>>;

const useOrder = (orderId: string) => {
  const loaderData = useAuthLoaderData();
  const manufacturerId = loaderData.id;
  const token = loaderData.token;

  const [order, setOrders] = useState<Response | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    void manufacturerApi
      .fetchOrder({ manufacturerId, orderId, token })
      .then((orders) => {
        setOrders(orders);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [manufacturerId, orderId, token]);

  return { order, isLoading };
};

export const OrderPage = () => {
  const params = useParams();
  const orderId = params['orderId'];

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { order, isLoading } = useOrder(orderId!);
  const items = order?.items ?? [];

  const columns: Column<(typeof items)[number]>[] = [
    {
      header: '商品ID',
      accessor: (item) => item.product.id,
      width: '30%',
    },
    {
      header: '商品名',
      accessor: (item) => item.product.name,
      width: '15%',
    },
    {
      header: '商品説明',
      accessor: (item) => item.product.description,
      width: '35%',
    },
    {
      header: '在庫数',
      accessor: (item) => item.stock,
      width: '5%',
    },
    {
      header: '発注数',
      accessor: (item) => item.quantity,
      width: '5%',
    },
    {
      header: '単価',
      accessor: (item) => <p className={styles.priceCell}>{`${formatMoney(item.price)}円`}</p>,
      width: '10%',
    },
  ];

  if (order === null) {
    return <p>請求書が見つかりません</p>;
  }

  return (
    <div className={styles.main}>
      <div>
        <p>発注元: {order.shop.name}</p>
        <p>発注日: {formatDate(order.orderAt)}</p>
        <p>発注金額: {formatMoney(order.totalPrice)}円</p>
      </div>
      <Table columns={columns} data={items} isLoading={isLoading} />
    </div>
  );
};
