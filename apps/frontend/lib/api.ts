import aspida from '@aspida/axios';
import axios from 'axios';
import api from '../apis/$api';
import { dateUtils } from './dateUtils';
import { logger } from './logger';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const discordId = localStorage.getItem('discord_id');
  const discordToken = localStorage.getItem('discord_token');

  if (discordId && discordToken && config.headers) {
    config.headers['X-Discord-Id'] = discordId;
    config.headers['X-Discord-Token'] = discordToken;
    logger.log('Adding Discord auth headers:', { discordId });
  } else {
    logger.error('Missing Discord credentials');
    if (
      typeof window !== 'undefined' &&
      window.location.pathname !== '/login'
    ) {
      window.location.href = '/login';
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logger.error('Authentication error:', error.response?.data);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// APIリクエスト時の日付変換を一元管理
const transformRequest = (config: any) => {
  if (config.body?.date) {
    config.body.date = dateUtils.toUTCString(config.body.date);
  }
  return config;
};

// APIレスポンスの日付変換を一元管理
const transformResponse = (response: any) => {
  if (response.date) {
    response.displayDate = dateUtils.fromUTC(response.date);
  }
  return response;
};

export const client = api(aspida(axiosInstance));

export const immutableOption = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};
