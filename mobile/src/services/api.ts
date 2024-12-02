import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:5000', // This points to localhost:5000 in Android emulator
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (username: string, password: string) => 
  api.post('/auth/login', { username, password });

export const register = async (username: string, password: string) => {
  const response = await api.post('/auth/register', {
    username,
    password,
  });
  return response.data;
};

// Todo APIs
export const getTodos = () => 
  api.get('/todos');

export const createTodo = (title: string, description?: string, priority: string = 'medium') => 
  api.post('/todos', { title, description, priority });

export const updateTodo = (id: string, updates: any) => 
  api.put(`/todos/${id}`, updates);

export const deleteTodo = (id: string) => 
  api.delete(`/todos/${id}`);

export default api;
