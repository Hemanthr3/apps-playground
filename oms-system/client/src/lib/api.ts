import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getProducts = () => api.get('/product').then(res => res.data);
export const getOrders = () => api.get('/order').then(res => res.data);
export const getCustomers = () => api.get('/customer').then(res => res.data);
export const createOrder = (orderData: any) => api.post('/order', orderData).then(res => res.data);

export default api;
