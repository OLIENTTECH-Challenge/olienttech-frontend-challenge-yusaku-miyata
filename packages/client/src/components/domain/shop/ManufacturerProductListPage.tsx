import { Column, Table } from '@/components/case/Table';
import { TextInput } from '@/components/base/TextInput';
import styles from './ManufacturerProductListPage.module.css';
import { Modal } from '@/components/base/Modal';
import { Button } from '@/components/base/Button';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as shopApi from '@/api/shop';
import { useAuthLoaderData } from '@/hooks/useAuthLoaderData';
import { toast } from 'react-hot-toast';

type FetchHandlingProductsResponse = Awaited<ReturnType<typeof shopApi.fetchHandlingProducts>>;

const useHandleProducts = (manufacturerId: string) => {
  const loaderData = useAuthLoaderData();
  const shopId = loaderData.id;
  const token = loaderData.token;

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

export const ManufacturerProductListPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const manufacturerId = params['manufacturerId'] ?? '';
  const { products, isLoading, error } = useHandleProducts(manufacturerId);
  const items = isLoading ? [] : products?.products ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  type ItemWithOrder = (typeof items)[number] & {
    order: number;
  };

  const InitialModalContent = () => <div></div>;

  const [ModalContent, setModalContent] = useState(() => InitialModalContent);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const orders: ItemWithOrder[] = items
      .map((item) => {
        const value = formData.get(`order_${item.id}`);
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          categories: item.categories,
          stock: item.stock,
          order: value ? Number(value) : 0,
        };
      })
      .filter((order) => order.order > 0);

    const NewModalContent =
      orders.length > 0
        ? () => <Table columns={modalColumns} data={orders} />
        : () => <div>選択されている商品がありません</div>;

    setModalContent(() => NewModalContent);
    openModal();

    return;
  };

  const columns: Column<(typeof items)[number]>[] = [
    {
      header: 'ID',
      accessor: (item) => item.id,
    },
    {
      header: '商品名',
      accessor: (item) => item.name,
    },
    {
      header: '商品説明',
      accessor: (item) => item.description,
    },
    {
      header: '商品カテゴリ',
      accessor: (item) => item.categories.map((category) => category.name).join('・'),
    },
    {
      header: '在庫',
      accessor: (item) => item.stock,
    },
    {
      header: '発注数',
      accessor: (item) => (
        <div className={styles.orderCell}>
          <TextInput
            type='number'
            min={0}
            max={item.stock}
            name={`order_${item.id}`}
            className={styles.orderInput}
            defaultValue={0}
            required
          />
        </div>
      ),
    },
  ];

  const modalColumns: Column<ItemWithOrder>[] = [
    {
      header: 'ID',
      accessor: (item) => item.id,
    },
    {
      header: '商品名',
      accessor: (item) => item.name,
    },
    {
      header: '商品説明',
      accessor: (item) => item.description,
    },
    {
      header: '商品カテゴリ',
      accessor: (item) => item.categories.map((category) => category.name).join('・'),
    },
    {
      header: '発注数',
      accessor: (item) => item.order,
    },
  ];

  useEffect(() => {
    if (error) {
      toast.error('データの取得に失敗しました');
      const timer = setTimeout(() => {
        navigate('/shop/manufacturers');
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [error, navigate]);

  if (items.length === 0 && !isLoading) {
    return <p>商品がありません</p>;
  }

  return isLoading ? (
    <>
      <p>読み込み中...</p>
    </>
  ) : (
    <form onSubmit={handleSubmit}>
      <div>
        <div className={styles.modalButton}>
          <Button variant='filled'>発注する</Button>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalContent />
        </Modal>
      </div>
      <Table columns={columns} data={items} />
    </form>
  );
};
