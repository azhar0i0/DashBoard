import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://dashboard-backend.up.railway.app/api',
  withCredentials: false,
});

export default axiosInstance;
