import { Column, Table } from '@/components/case/Table';
import { TextInput } from '@/components/base/TextInput';
import styles from './ManufacturerProductListPage.module.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/components/base/Modal';
import { Button } from '@/components/base/Button';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthLoaderData } from '@/hooks/useAuthLoaderData';
import { toast } from 'react-hot-toast';
import { ItemWithOrder } from './types/types';
import { useHandleProducts } from './hooks/useHandleProducts';
import { postOrder } from './queries/orders';

export const ManufacturerProductListPage = () => {
  const loaderData = useAuthLoaderData();
  const shopId = loaderData.id;
  const token = loaderData.token;

  const navigate = useNavigate();
  const params = useParams();
  const manufacturerId = params['manufacturerId'] ?? '';
  const { products, isLoading, error } = useHandleProducts(shopId, token, manufacturerId);
  const items = isLoading ? [] : products?.products ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orders, setOrders] = useState<ItemWithOrder[]>([]);
  const InitialModalContent = () => <div></div>;
  const [ModalContent, setModalContent] = useState(() => InitialModalContent);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    if (!isOrdering) {
      setIsModalOpen(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const newOrders: ItemWithOrder[] = items
      .map((item) => {
        const value = formData.get(`order_${item.id}`);
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          categories: item.categories,
          stock: item.stock,
          quantity: value ? Number(value) : 0,
        };
      })
      .filter((order) => order.quantity > 0);

    setOrders(newOrders);

    const NewModalContent =
      newOrders.length > 0
        ? () => <Table columns={modalColumns} data={newOrders} />
        : () => <div>選択されている商品がありません</div>;

    setModalContent(() => NewModalContent);
    openModal();

    return;
  };

  const submitOrder = async (shopId: string, token: string, manufacturerId: string, orders: ItemWithOrder[]) => {
    setIsOrdering(true);
    try {
      await toast
        .promise(postOrder(shopId, token, manufacturerId, orders), {
          loading: '発注しています...',
          success: '発注に成功しました',
          error: '発注に失敗しました',
        })
        .then(() => {
          setTimeout(() => {
            setIsOrdering(false);
            navigate('/shop/manufacturers');
          }, 1000);
        });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('予期せぬエラーが発生しました');
      }
      setIsOrdering(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // NOTE: Enterキーが押された場合、フォームの送信を防止する
    if (e.key === 'Enter') {
      e.preventDefault();
    }
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
      accessor: (item) => item.quantity,
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
    <form onSubmit={handleFormSubmit} onKeyDown={handleKeyDown}>
      <div>
        <div className={styles.modalButton}>
          <Button variant='filled'>発注確認</Button>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalHeader>発注内容</ModalHeader>
          <ModalBody>
            <ModalContent />
          </ModalBody>
          <ModalFooter>
            <Button variant='outlined' onClick={closeModal}>
              閉じる
            </Button>
            {orders.length > 0 && (
              <Button
                variant='filled'
                isDisabled={isOrdering}
                onClick={() => {
                  submitOrder(shopId, token, manufacturerId, orders).catch((error: Error) => {
                    toast.error(error.message);
                  });
                }}
              >
                発注する
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </div>
      <Table columns={columns} data={items} />
    </form>
  );
};
