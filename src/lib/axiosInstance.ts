import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend-nhtd.onrender.com/api', // Note: only one /api here
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;