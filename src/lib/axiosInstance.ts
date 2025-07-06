import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://dashboard-backend.up.railway.app/api', // Note: only one /api here
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;