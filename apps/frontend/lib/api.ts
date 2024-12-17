import aspida from '@aspida/axios';
import api from '../api/$api';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
axiosInstance.interceptors.request.use(async (config) => {
  const discordId = document.cookie
    .split('; ')
    .find((row) => row.startsWith('X-Discord-ID='))
    ?.split('=')[1];

  console.log('Setting Discord ID:', discordId);

  config.headers = config.headers ?? {};
  if (discordId) {
    config.headers['X-Discord-ID'] = discordId;
  }
  return config;
});

// レスポンスインターセプター
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const client = api(aspida(axiosInstance));

export const immutableOption = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};
