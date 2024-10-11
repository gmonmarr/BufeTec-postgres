import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Función para registrar un nuevo usuario
export const registerUser = (userData) => {
  return api.post('/usuarios/register', userData);
};

// Función para agregar un abogado (una vez el usuario esté registrado)
export const addLawyer = (lawyerData) => {
  return api.post('/abogados', lawyerData);
};

// Función para agregar un cliente
export const addClient = (clientData) => {
  return api.post('/clientes', clientData);
};

// Función para obtener todos los abogados
export const getLawyers = () => {
  return api.get('/abogados');
};

// Función para obtener todos los clientes
export const getClients = () => {
  return api.get('/clientes');
};

export const getUsers = () => {
  return api.get('/usuarios');
}

export const modifyUserRole = (id, data) => {
  return api.put(`/usuarios/${id}/role`, data);
};

// Función para obtener archivos de un usuario por su ID
export const getUserFiles = (userId) => {
  return api.get(`/files/userFiles/${userId}`);
};

// Función para eliminar un archivo por su ID
export const deleteFile = (id) => {
  return api.delete(`/files/delete/${id}`);
};


export default api;
