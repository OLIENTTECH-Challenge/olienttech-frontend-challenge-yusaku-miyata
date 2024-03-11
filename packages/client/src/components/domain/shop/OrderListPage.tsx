import { Column, Table } from '@/components/case/Table';
import { useAuthLoaderData } from '@/hooks/useAuthLoaderData';
import { useEffect, useState } from 'react';
import * as shopApi from '@/api/shop';

type Response = Awaited<ReturnType<typeof shopApi.fetchOrders>>;

const useOrders = () => {
  const loaderData = useAuthLoaderData();
  const shopId = loaderData.id;
  const token = loaderData.token;

  const [orders, setOrders] = useState<Response>([]);

  useEffect(() => {
    void shopApi.fetchOrders({ shopId, token }).then((orders) => {
      setOrders(orders);
    });
  }, [shopId, token]);

  return { orders };
};

export const OrderListPage = () => {
  const { orders } = useOrders();

  const columns: Column<Response[number]>[] = [
    {
      header: '注文書ID',
      accessor: (item) => item.id,
    },
    {
      header: '注文先',
      accessor: (item) => item.manufacturer.name,
    },
    {
      header: '承認状況',
      accessor: (item) => (item.approved ? '承認済' : '未承認'),
    },
    {
      header: '注文日時',
      accessor: (item) => item.orderAt,
    },
  ];

  return (
    <>
      <Table columns={columns} data={orders} />
    </>
  );
};
