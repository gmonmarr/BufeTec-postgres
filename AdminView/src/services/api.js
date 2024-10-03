import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

export default api;
