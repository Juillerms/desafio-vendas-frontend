import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Se você implementou autenticação JWT, você precisará adicionar o token aqui
    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  },
});

// Interceptor para lidar com erros da API de forma global (opcional, mas bom)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchVendas = async (params) => {
  try {
    // Se sua API /vendas aceitar filtros por data, produto, etc., passe-os aqui
    // Exemplo: /vendas?dataInicio=2023-01-01&dataFim=2023-01-31
    const response = await apiClient.get('/vendas', { params });
    return response.data; // Espera-se que a API retorne um array de vendas
  } catch (error) {
    // O interceptor já logou, mas podemos relançar para tratamento específico
    throw error;
  }
};

// Se você tiver um endpoint de login para obter o token JWT
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials); // Certifique-se que o endpoint é /auth/login
    if (response.data && response.data.token) { // Ajuste conforme a estrutura da sua resposta de login
      localStorage.setItem('authToken', response.data.token);
      // Não precisa mais setar o header default aqui se você usa o interceptor de request
    }
    return response.data;
  } catch (error) {
    localStorage.removeItem('authToken'); // Limpa token em caso de falha no login
    throw error;
  }
};

export const logout = () => {
    localStorage.removeItem('authToken');
    // Você pode querer deletar o header do axios também, ou apenas confiar no interceptor
    // delete apiClient.defaults.headers.common['Authorization'];
};

export default apiClient;