import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getProducts = () => api.get('/product').then(res => res.data);
export const getOrders = () => api.get('/order').then(res => res.data);
export const getCustomers = () => api.get('/customer').then(res => res.data);
export const createOrder = (orderData: any) => api.post('/order', orderData).then(res => res.data);

// File uploads must use FormData, not JSON.
// axios automatically sets the correct Content-Type (multipart/form-data) when the body is FormData.
export const uploadProfilePhoto = (customerId: number, file: File) => {
  const formData = new FormData();
  formData.append('uploaded_file', file);
  return api.post(`/customer/profile-upload/${customerId}`, formData).then(res => res.data);
};

export const importProducts = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/product/import', formData).then(res => res.data);
};

export const importProductsXlsx = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/product/import-xlsx', formData).then(res => res.data);
};

export default api;
