import { Container } from '@/components/case/Container';
import { HomeHeader } from '@/components/common/HomeHeader';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';
import { Breadcrumb } from '@/components/case/Breadcrumb';

export const ShopLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname == '/shop/login';
  const isManufacturerListPage = location.pathname == '/shop/manufacturers';
  const isManufacturerProductListPage =
    location.pathname.includes('/shop/manufacturers') && location.pathname.includes('products');

  let breadcrumbItems = [{ href: '/shop', title: '販売会社トップ' }];
  if (isLoginPage) {
    breadcrumbItems = [];
  }
  if (isManufacturerListPage) {
    breadcrumbItems = [...breadcrumbItems, { href: '/shop/manufacturers', title: '製造会社一覧' }];
  }
  if (isManufacturerProductListPage) {
    breadcrumbItems = [
      ...breadcrumbItems,
      { href: '/shop/manufacturers', title: '製造会社一覧' },
      { href: location.pathname, title: '取扱商品一覧' },
    ];
  }

  return (
    <>
      <HomeHeader />
      <Container>
        <div className={styles.container}>
          <Breadcrumb items={breadcrumbItems} />
          <Outlet />
        </div>
      </Container>
    </>
  );
};
