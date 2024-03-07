import styles from './HomePage.module.css';
import { useAuthLoaderData } from '@/hooks/useAuthLoaderData';
import { useEffect, useState } from 'react';
import * as shopApi from '@/api/shop';
import { Button } from '@/components/base/Button';

type Response = Awaited<ReturnType<typeof shopApi.fetchShop>>;

const useShop = () => {
  const lodaerData = useAuthLoaderData();
  const id = lodaerData.id;
  const token = lodaerData.token;

  const [shop, setShop] = useState<Response | null>(null);

  useEffect(() => {
    void shopApi.fetchShop({ shopId: id, token }).then((res) => {
      setShop(res);
    });
  }, [id, token]);

  return { shop };
};

export const ShopHomePage = () => {
  const { shop } = useShop();

  const logout = () => {
    document.cookie = 'token=; max-age=0';
    location.reload();
  };

  return (
    <>
      <div className={styles.container}>
        {shop && (
          <div>
            <h3>{shop.name}</h3>
            <p>{shop.description}</p>
            <div className={styles.logoutButton}>
              <Button variant='outlined' onClick={logout}>
                ログアウト
              </Button>
            </div>
          </div>
        )}
        <div className={styles.linkList}>
          {
            // to-do
            // main app
          }
        </div>
      </div>
    </>
  );
};
