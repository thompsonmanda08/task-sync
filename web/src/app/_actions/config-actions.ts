"use server";

import { apiClient } from "@/app/_actions/api-config";
import { deleteSession, updateSession, verifySession } from "@/lib/session";
import { APIResponse, OptionItem } from "@/types";

import { redirect } from "next/navigation";

/**
 * Retrieves the current authentication session.
 *
 * @returns {Promise<any>} A promise that resolves to the session object if the session is valid.
 */

export const getAuthSession = async () => await verifySession();
export const updateAuthSession = async (fields) => await updateSession(fields);

/**
 * Revokes the current authentication session by deleting it.
 *
 * @returns {Promise<void>} A promise that resolves when the session is deleted.
 */
export const revokeAccessToken = async () => deleteSession();

/**
 * Checks if the user is authenticated. If not, redirects to the home page.
 *
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the authentication status.
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { isAuthenticated } = await getAuthSession();
  if (!isAuthenticated) redirect("/");
  return isAuthenticated;
};

/**
 * Fetches a list of universities.
 *
 * @returns {Promise<OptionItem[]>} A promise that resolves to an array of universities or an APIResponse object in case of failure.
 */
export async function getUniversities() {
  try {
    const res = await apiClient.get(`data/universities`);
    return res.data?.data?.universities;
  } catch (error: Error | any) {
    console.error({
      endpoint: `/data/universities`,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    return [];
  }
}

/**
 * Fetches a list of user roles.
 *
 * @returns {Promise<OptionItem[]>} A promise that resolves to an array of user roles or an APIResponse object in case of failure.
 */
export async function getUserRoles() {
  try {
    const res = await apiClient.get(`data/roles`);
    return res.data?.data?.roles;
  } catch (error: Error | any) {
    console.error({
      endpoint: `/data/roles`,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    return [];
  }
}

/**
 * ~ GET - Fetches a list of system actions.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the system actions data or an error message.
 *
 * @throws {Error} Logs an error to the console if the API call fails.
 */

export async function getSystemActions() {
  try {
    const res = await apiClient.get("/data/system-actions");
    const systemActions = res.data?.data?.actions;
    await updateSession({ systemActions });

    return systemActions;
  } catch (error: Error | any) {
    const err = {
      endpoint: "/data/system-actions",
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    };
    console.error(err);
    return {
      success: false,
      message: "Something went wrong!",
      data: err,
      status: err?.status,
    };
  }
}

/**
 * Fetches a list of room types.
 *
 * @returns {Promise<APIResponse | OptionItem[]>} A promise that resolves to an array of room types or an APIResponse object in case of failure.
 */
export async function getRoomTypes(): Promise<APIResponse | OptionItem[]> {
  try {
    const res = await apiClient.get(`data/rooms`);
    return res.data?.data?.roomTypes || [];
  } catch (error: Error | any) {
    console.error(error?.response);
    return [];
  }
}

/**
 * Fetches a filtered list of countries, optionally by page.
 *
 * @param {number} [page=2] - The page number for fetching countries.
 * @returns {Promise<APIResponse | OptionItem[]>} A promise that resolves to an array of countries or an APIResponse object in case of failure.
 */
export async function getCountries(
  page: number = 2,
): Promise<APIResponse | OptionItem[]> {
  try {
    const res = await apiClient.get(`data/countries?page=${page}`);

    const response = res.data?.data?.countries.filter((country: any) => {
      return country.name.toLowerCase().includes("zambia");
    });

    return response as OptionItem[];
  } catch (error: Error | any) {
    console.error(error?.response);
    return [];
  }
}
