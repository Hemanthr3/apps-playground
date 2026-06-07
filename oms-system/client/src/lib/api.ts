import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  // Required for cookies to be sent cross-origin (frontend 5173 → backend 8000)
  withCredentials: true,
});

// If any request gets a 401, redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then(res => res.data);

export const logout = () =>
  api.post('/auth/logout').then(res => res.data);

export const getMe = () =>
  api.get('/auth/me').then(res => res.data);

export const getProducts = () => api.get('/product').then(res => res.data);
export const getOrders = () => api.get('/order').then(res => res.data);
export const getCustomers = () => api.get('/customer').then(res => res.data);
export const createOrder = (orderData: any) => api.post('/order', orderData).then(res => res.data);

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

export const getJobStatus = (jobId: string) =>
  api.get(`/product/import-xlsx/status/${jobId}`).then(res => res.data);

export default api;
