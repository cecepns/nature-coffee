const API_BASE_URL = 'https://api-inventory.isavralabel.com/nature-coffee/api';

class ApiService {
  // Generic API call method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add token if available
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    login: (credentials) => this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    logout: () => {
      localStorage.removeItem('adminToken');
      return Promise.resolve();
    },
  };

  // Menu endpoints
  menu = {
    getAll: (page = 1, limit = 10) => this.request(`/menu?page=${page}&limit=${limit}`),
    getAllPublic: (limit = 6) => this.request(`/menu/public?limit=${limit}`),
    getById: (id) => this.request(`/menu/${id}`),
    create: (data) => this.request('/menu', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => this.request(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => this.request(`/menu/${id}`, { method: 'DELETE' }),
    uploadImage: (formData) => this.request('/menu/upload', {
      method: 'POST',
      headers: {},
      body: formData,
    }),
  };

  // Coffee beans endpoints
  coffeeBeans = {
    getAll: (page = 1, limit = 10) => this.request(`/coffee-beans?page=${page}&limit=${limit}`),
    getAllPublic: (limit = 6) => this.request(`/coffee-beans/public?limit=${limit}`),
    getById: (id) => this.request(`/coffee-beans/${id}`),
    create: (data) => this.request('/coffee-beans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => this.request(`/coffee-beans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => this.request(`/coffee-beans/${id}`, { method: 'DELETE' }),
    uploadImage: (formData) => this.request('/coffee-beans/upload', {
      method: 'POST',
      headers: {},
      body: formData,
    }),
  };

  // Gallery endpoints
  gallery = {
    getAll: (page = 1, limit = 10) => this.request(`/gallery?page=${page}&limit=${limit}`),
    getAllPublic: () => this.request('/gallery/public'),
    getById: (id) => this.request(`/gallery/${id}`),
    create: (data) => this.request('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => this.request(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => this.request(`/gallery/${id}`, { method: 'DELETE' }),
    uploadImage: (formData) => this.request('/gallery/upload', {
      method: 'POST',
      headers: {},
      body: formData,
    }),
  };

  // Reservations endpoints
  reservations = {
    getAll: (page = 1, limit = 10) => this.request(`/reservations?page=${page}&limit=${limit}`),
    getById: (id) => this.request(`/reservations/${id}`),
    create: (data) => this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => this.request(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => this.request(`/reservations/${id}`, { method: 'DELETE' }),
  };

  // Settings endpoints
  settings = {
    get: () => this.request('/settings'),
    update: (data) => this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  };

  // Dashboard stats
  dashboard = {
    getStats: () => this.request('/dashboard/stats'),
  };
}

export default new ApiService();