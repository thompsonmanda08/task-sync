import apiClient, { authenticatedService } from '@/lib/api-config';
import { createAuthSession } from '@/lib/session';
import { APIResponse, AuthFormData, RegistrationFormData } from '@/types';

/**
 * Authenticates a user with their email and password by calling the API endpoint
 * and creates an authentication session upon successful login.
 *
 * @param {LoginDetails} param - An object containing login details.
 * @param {string} param.phone - The phone number of the user.
 * @param {string} param.password - The password of the user.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 *
 *
 */

export async function loginUser({
  email,
  password,
}: Partial<AuthFormData>): Promise<APIResponse> {
  const url = '/login';
  try {
    const res = await apiClient.post(url, {
      email,
      password,
    });

    const user = res.data?.data?.user || {};
    const accessToken = res.data?.data?.token;

    await createAuthSession({ accessToken, user });

    return res.data;
  } catch (error: Error | any) {
    console.error({
      route: 'AUTHENTICATE USER: ' + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'NoServerResponse',
      data: error?.response?.data,
      status: error?.response?.status,
    };
  }
}

/**
 * Create and authenticate a user with their email and password by calling the API endpoint
 * and creates a user and also creates an authentication session upon successful creation of the user.
 *
 * @param {SignupDetails} param - An object containing sign details.
 * @param {string} param.name - The last name of the user.
 * @param {string} param.email - The email of the user.
 * @param {string} param.password - The password of the user.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */

export async function registerNewUser({
  name,
  email,
  password,
}: RegistrationFormData): Promise<APIResponse> {
  const url = 'register';
  try {
    const res = await apiClient.post(url, {
      name,
      email,
      password,
    });
    const user = res.data?.data?.user || {};
    const accessToken = res.data?.data?.token;

    await createAuthSession({ accessToken, user });

    return res.data;
  } catch (error: Error | any) {
    console.error({
      route: 'REGISTER USER: ' + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'NoServerResponse',
      data: error?.response?.data,
      status: error?.response?.status,
    };
  }
}
