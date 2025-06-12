import apiClient from '@/lib/api-config';
import { APIResponse, OptionItem } from '@/types';

/**
 * Fetches a list of cities from the API.
 *
 * @param {number} [size=72] - The number of cities to fetch.
 * @param {number} [page=1] - The page number of cities to fetch.
 * @returns {Promise<APIResponse|OptionItem[]>} A promise that resolves to an APIResponse object containing the fetched cities or an array of OptionItem objects.
 */
export async function getCities(
  size: number = 72,
  page: number = 1,
): Promise<APIResponse | OptionItem[]> {
  try {
    const res = await apiClient.get(`/data/districts?size=${size}`, {});

    const response = res.data?.data?.districts || res.data?.data?.provinces;

    return [...response] as OptionItem[] | [];
  } catch (error: Error | any) {
    console.error(error?.response);
    return [];
  }
}
