const API_URL = 'http://localhost:3000/api';
const ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  BOOKS: `${API_URL}/books`,
  CATEGORIES: `${API_URL}/categories`
};

async function fetchAPI(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

const authAPI = {
  login: async (username, password) => {
    return await fetchAPI(ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  
  register: async (username, password) => {
    return await fetchAPI(ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }
};

const booksAPI = {
  getAll: async () => {
    return await fetchAPI(ENDPOINTS.BOOKS);
  },
  
  getById: async (id) => {
    return await fetchAPI(`${ENDPOINTS.BOOKS}/${id}`);
  },
  
  create: async (bookData) => {
    return await fetchAPI(ENDPOINTS.BOOKS, {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  },
  
  update: async (id, bookData) => {
    return await fetchAPI(`${ENDPOINTS.BOOKS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });
  },
  
  delete: async (id) => {
    return await fetchAPI(`${ENDPOINTS.BOOKS}/${id}`, {
      method: 'DELETE'
    });
  },
  
  borrow: async (id) => {
    return await fetchAPI(`${ENDPOINTS.BOOKS}/${id}/borrow`, {
      method: 'POST'
    });
  },
  
  return: async (id) => {
    return await fetchAPI(`${ENDPOINTS.BOOKS}/${id}/return`, {
      method: 'POST'
    });
  }
};

const categoriesAPI = {
  getAll: async () => {
    return await fetchAPI(ENDPOINTS.CATEGORIES);
  },
  
  create: async (name) => {
    return await fetchAPI(ENDPOINTS.CATEGORIES, {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  },
  
  delete: async (id) => {
    return await fetchAPI(`${ENDPOINTS.CATEGORIES}/${id}`, {
      method: 'DELETE'
    });
  }
};