import { Column, Table } from '@/components/case/Table';
import { useEffect, useState } from 'react';
import * as shopApi from '@/api/shop';
import { useAuthLoaderData } from '@/hooks/useAuthLoaderData';
import { useNavigate } from 'react-router-dom';

type Response = Awaited<ReturnType<typeof shopApi.fetchPartnerManufacturers>>;

const usePartnerManufacturers = () => {
  const loaderData = useAuthLoaderData();
  const shopId = loaderData.id;
  const token = loaderData.token;

  const [manufacturers, setManufacturers] = useState<Response>([]);

  useEffect(() => {
    void shopApi.fetchPartnerManufacturers({ shopId, token }).then((manufacturers) => {
      setManufacturers(manufacturers);
    });
  }, [shopId, token]);

  return { manufacturers };
};

export const ManufacturerListPage = () => {
  const navigate = useNavigate();
  const { manufacturers } = usePartnerManufacturers();

  const columns: Column<Response[number]>[] = [
    {
      header: 'ID',
      accessor: (item) => item.id,
    },
    {
      header: '会社名',
      accessor: (item) => item.name,
    },
    {
      header: '会社説明',
      accessor: (item) => item.description,
    },
  ];

  return (
    <Table
      columns={columns}
      data={manufacturers}
      onClick={(item) => {
        navigate(`/shop/manufacturers/${item.id}/products`);
      }}
    />
  );
};
