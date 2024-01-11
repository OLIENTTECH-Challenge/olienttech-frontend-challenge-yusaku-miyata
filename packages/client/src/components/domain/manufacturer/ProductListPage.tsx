import { TextInput } from '@/components/base/input/TextInput';
import { Column, Table } from '@/components/case/table/Table';
import { HomeHeader } from '@/components/common/home-header/home-header';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ProductListPage.module.css';
import { FlexibleContainer } from '@/components/case/container/flexible-container';
import ActionButton from '@/components/base/button/action-button/action-button';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import * as manufacturerApi from '@/api/manufacturer';
import { HandleProduct } from '@/api/model';

const useHandleProducts = () => {
  const manufacturerId = 'a5b5da89-b124-4c6f-8937-f308fed6c577';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE1YjVkYTg5LWIxMjQtNGM2Zi04OTM3LWYzMDhmZWQ2YzU3NyIsInJvbGUiOiJtYW51ZmFjdHVyZXIifQ.wEGQL5Ra8Eo8g4Dr6NZX4Dg-C98e9h9hsEW0qB6MfQU';

  const [products, setProducts] = useState<HandleProduct[]>([]);

  useEffect(() => {
    void manufacturerApi.fetchHandlingProducts({ manufacturerId, token }).then((products) => {
      setProducts(products);
    });
  }, []);

  const mutateUpdateStock = useCallback(async (productId: string, stock: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await manufacturerApi.updateHandlingProductStock({ manufacturerId, productId, token, stock });
  }, []);

  return { products, mutateUpdateStock };
};

export const ProductListPage = () => {
  const targetProductId = useRef<string | null>(null);

  const { products, mutateUpdateStock } = useHandleProducts();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const productId = targetProductId.current;
    if (productId == null) {
      toast.error('商品IDが存在しません');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const stock = formData.get(`stock_${productId}`);

    const product = products.find((product) => product.id === productId) ?? null;
    if (product === null) {
      toast.error('対象の商品が存在しません');
      return;
    }

    if (typeof stock !== 'string') {
      toast.error('在庫数は数値で入力してください');
      return;
    }

    void toast.promise(mutateUpdateStock(productId, Number(stock)), {
      loading: `${product.name}の在庫数を更新中です`,
      success: `${product.name}の在庫数を更新しました`,
      error: `${product.name}の在庫数の更新に失敗しました`,
    });
    return;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // NOTE: Enterキーが押された場合、フォームの送信を防止する
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const columns: Column<HandleProduct>[] = [
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
      accessor: (item) => (
        <div className={styles.stockCell}>
          <TextInput
            type='number'
            min={0}
            name={`stock_${item.id}`}
            className={styles.stockInput}
            defaultValue={item.stock}
            required
          />
          <ActionButton variant='outlined' onClick={() => (targetProductId.current = item.id)}>
            <Check />
          </ActionButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <HomeHeader />
      <FlexibleContainer>
        <form className={styles.main} onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <Table columns={columns} data={products} />
        </form>
      </FlexibleContainer>
    </>
  );
};
