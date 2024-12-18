import aspida from '@aspida/axios';
import axios, { InternalAxiosRequestConfig } from 'axios';
import type { ApiInstance } from '../api/$api';
import api from '../api/$api';

const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const discordId = getCookie('discord_id');
  if (discordId && config.headers) {
    config.headers['x-discord-id'] = discordId;
  }
  return config;
});

export const client = api(aspida(axiosInstance));

export const immutableOption = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};
