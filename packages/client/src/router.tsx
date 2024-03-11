import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { manufacturerAuthLoader, shopAuthLoader } from './loader';
import HomePage from './pages';
import ManufacturerLoginPage from './pages/manufacturer/login';
import ManufacturerProductListPage from './pages/manufacturer/products';
import ManufacturerHomePage from './pages/manufacturer';
import ManufacturerLayout from './pages/manufacturer/layout';
import ManufacturerOrderListPage from './pages/manufacturer/orders';
import ManufacturerOrderPage from './pages/manufacturer/order';
import ShopHomePage from './pages/shop';
import ShopLayout from './pages/shop/layout';
import ShopLoginPage from './pages/shop/login';
import ShopManufacturerListPage from './pages/shop/manufacturers';
import ShopManufacturerProductListPage from './pages/shop/manufacturer-products';
import ShopOrderListPage from './pages/shop/orders';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    element: <ManufacturerLayout />,
    children: [
      { path: '/manufacturer', element: <ManufacturerHomePage />, loader: manufacturerAuthLoader },
      { path: '/manufacturer/products', element: <ManufacturerProductListPage />, loader: manufacturerAuthLoader },
      { path: '/manufacturer/orders', element: <ManufacturerOrderListPage />, loader: manufacturerAuthLoader },
      { path: '/manufacturer/orders/:orderId', element: <ManufacturerOrderPage />, loader: manufacturerAuthLoader },
      { path: '/manufacturer/login', element: <ManufacturerLoginPage /> },
    ],
  },
  {
    element: <ShopLayout />,
    children: [
      { path: '/shop', element: <ShopHomePage />, loader: shopAuthLoader },
      { path: '/shop/login', element: <ShopLoginPage /> },
      { path: '/shop/manufacturers', element: <ShopManufacturerListPage />, loader: shopAuthLoader },
      {
        path: '/shop/manufacturers/:manufacturerId/products',
        element: <ShopManufacturerProductListPage />,
        loader: shopAuthLoader,
      },
      { path: '/shop/orders', element: <ShopOrderListPage />, loader: shopAuthLoader },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
