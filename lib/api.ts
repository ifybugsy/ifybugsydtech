import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Log errors silently (only in development console if needed)
    if (error.response?.status === 401) {
      // Clear auth on unauthorized
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_session');
      window.location.href = '/login';
    } else if (error.response?.status === 500) {
      // Backend server error - this is expected in demo mode
      console.debug('[API] Backend service unavailable (expected in demo mode)');
    }
    return Promise.reject(error);
  }
);

// API endpoint wrappers
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const coursesAPI = {
  getAll: (filters?: { level?: string; search?: string }) =>
    api.get('/courses', { params: filters }),
  getById: (id: string) => api.get(`/courses/${id}`),
  create: (data: any) => api.post('/courses', data),
  enroll: (courseId: string) => api.post(`/courses/${courseId}/enroll`, {}),
  getEnrollments: () => api.get('/courses/my-enrollments'),
  getProgress: (courseId: string) =>
    api.get(`/courses/${courseId}/progress`),
};

export const productsAPI = {
  getAll: (filters?: { category?: string; search?: string }) =>
    api.get('/products', { params: filters }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
};

export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  getAll: () => api.get('/orders/my-orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

export const communityAPI = {
  getPosts: (filters?: { category?: string; search?: string }) =>
    api.get('/community', { params: filters }),
  getPostById: (id: string) => api.get(`/community/${id}`),
  createPost: (data: any) => api.post('/community', data),
  createReply: (postId: string, data: any) =>
    api.post(`/community/${postId}/replies`, data),
  likePost: (id: string) => api.post(`/community/${id}/like`, {}),
  markAsSolved: (id: string) => api.patch(`/community/${id}/solved`, {}),
};

export const blogAPI = {
  getAll: () => api.get('/blog'),
  getById: (id: string) => api.get(`/blog/${id}`),
  create: (data: any) => api.post('/blog', data),
};

export const paymentsAPI = {
  createPayment: (data: any) => api.post('/payments', data),
  verifyPayment: (transactionId: string) =>
    api.get(`/payments/verify/${transactionId}`),
  // Paystack integration
  initializePayment: (data: { email: string; amount: number; metadata?: any }) =>
    api.post('/payments/paystack/initialize', data),
  verifyPaystackPayment: (reference: string) =>
    api.get(`/payments/paystack/verify/${reference}`),
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.patch('/users/profile', data),
  getWishlist: () => api.get('/users/wishlist'),
  addToWishlist: (courseId: string) =>
    api.post('/users/wishlist', { courseId }),
  removeFromWishlist: (courseId: string) =>
    api.delete(`/users/wishlist/${courseId}`),
  getAllUsers: () => api.get('/users'),
  getUserById: (id: string) => api.get(`/users/${id}`),
  updateUserRole: (id: string, role: string) =>
    api.put(`/users/${id}/role`, { role }),
  deactivateUser: (id: string) =>
    api.put(`/users/${id}/deactivate`, {}),
};

export const enrollmentsAPI = {
  getMyEnrollments: () => api.get('/enrollments'),
  getEnrollmentById: (id: string) => api.get(`/enrollments/${id}`),
  enrollInCourse: (courseId: string, totalClassDays?: number) =>
    api.post('/enrollments', { courseId, totalClassDays }),
  updateProgress: (id: string, data: any) =>
    api.put(`/enrollments/${id}/progress`, data),
  completeEnrollment: (id: string) =>
    api.put(`/enrollments/${id}/complete`, {}),
  getAllEnrollments: () => api.get('/enrollments/admin/all'),
};

export const certificatesAPI = {
  getMyCertificates: () => api.get('/certificates'),
  getCertificateById: (id: string) => api.get(`/certificates/${id}`),
  verifyCertificate: (certificateNumber: string) =>
    api.get(`/certificates/verify/${certificateNumber}`),
  getAllCertificates: () => api.get('/certificates/admin/all'),
  generateCertificate: (enrollmentId: string) =>
    api.post('/certificates/admin/generate', { enrollmentId }),
};

export const statsAPI = {
  getDashboardStats: () => api.get('/stats/dashboard'),
  getUserStats: () => api.get('/stats/users'),
  getCourseStats: () => api.get('/stats/courses'),
  getEnrollmentStats: () => api.get('/stats/enrollments'),
};

export default api;
