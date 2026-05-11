import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import ProductList from '@/pages/products/ProductList';
import OrderList from '@/pages/orders/OrderList';
import CreateOrderPage from '@/pages/orders/CreateOrderPage';
import CustomerList from '@/pages/customers/CustomerList';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/orders" replace />} />
            <Route path="products" element={<ProductList />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/create" element={<CreateOrderPage />} />
            <Route path="customers" element={<CustomerList />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
