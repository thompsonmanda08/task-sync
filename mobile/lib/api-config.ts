import axiosClient from 'axios';

import { verifySession } from './session';

import { SERVER_URL } from '@/constants';

const apiClient = axiosClient.create({
  baseURL: process.env.SERVER_URL || process.env.BASE_URL || SERVER_URL,
});

export const authenticatedService = async (request: any) => {
  const { session } = await verifySession();
  return await apiClient({
    method: 'GET',
    headers: {
      'Content-type': request?.contentType
        ? request?.contentType
        : 'application/json',
      Authorization: `Bearer ${session?.accessToken}`,
      ...request?.headers,
    },
    withCredentials: true,
    ...request,
  });
};

export default apiClient;
