import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ this is the root of all API requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
