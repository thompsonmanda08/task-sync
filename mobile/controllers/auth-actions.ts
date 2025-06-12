import apiClient, { authenticatedService } from '@/lib/api-config';
import { createAuthSession } from '@/lib/session';
import { APIResponse, AuthFormData } from '@/types';

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
  phone,
  password,
}: Partial<AuthFormData>): Promise<APIResponse> {
  try {
    const res = await apiClient.post(`/login`, {
      phone,
      password,
    });

    const response = res.data;
    const user = response?.data?.user || {};
    const accessToken = response?.data?.token;

    await createAuthSession({ accessToken });

    return {
      success: true,
      message: response?.message,
      data: { user, accessToken },
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data,
      error,
    });
    return {
      success: false,
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Oops! Something went wrong',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Create and authenticate a user with their email and password by calling the API endpoint
 * and creates a user and also creates an authentication session upon successful creation of the user.
 *
 * @param {SignupDetails} param - An object containing sign details.
 * @param {string} param.firstName - The first name of the user.
 * @param {string} param.lastName - The last name of the user.
 * @param {string} param.role - The role of the user.
 * @param {string} param.email - The email of the user.
 * @param {string} param.phone - The phone number of the user.
 * @param {string} param.password - The password of the user.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */

export async function registerNewUser({
  name,
  email,
  password,
}: Partial<AuthFormData>): Promise<APIResponse> {
  try {
    const res = await apiClient.post(`/register`, {
      name,
      email,
      password,
    });

    const response = res.data;
    const user = response?.data?.user || {};
    const accessToken = response?.data?.token;

    await createAuthSession({ accessToken });

    return {
      success: true,
      message: response?.message,
      data: { user, accessToken },
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data,
    });
    return {
      success: false,
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Oops! Something went wrong',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * sends the verification code to the given email address
 *
 * @param {string} email - The users email address
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object confirming send status
 */
// export async function sendEmailResetVerificationCode(
//   email: string,
// ): Promise<APIResponse> {
//   try {
//     const res = await authenticatedService({
//       url: '/auth/forgot-password',
//       method: 'POST',
//       data: JSON.stringify({ email }),
//     });

//     return {
//       success: true,
//       message: res.data?.message,
//       data: res.data?.data,
//       status: res.status,
//     };
//   } catch (error: Error | any) {
//     console.error(
//       'Error sending the verification code : \n\n',
//       error?.response || error,
//     );
//     return {
//       success: false,
//       message:
//         error?.response?.data?.data?.error ||
//         error?.response?.data?.message ||
//         error?.message ||
//         'Oops! Something went wrong',
//       data: null,
//       status: error?.response?.status || 500,
//     };
//   }
// }

/**
 * verifies the verification code sent to the  email address
 *
 * @param {string} email - The users email address
 * @param {string} code - the verification code received via email
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object confirming verification.
 */
// export async function verifyVerificationCode(
//   email: string,
//   code: string,
// ): Promise<APIResponse> {
//   try {
//     const res = await authenticatedService({
//       url: '/auth/verify-reset-code',
//       method: 'POST',
//       data: JSON.stringify({ email, code }),
//     });

//     return {
//       success: true,
//       message: res.data?.message,
//       data: res.data?.data,
//       status: res.status,
//     };
//   } catch (error: Error | any) {
//     console.error(
//       'Error verifying the reset code : \n\n',
//       error?.response || error,
//     );
//     return {
//       success: false,
//       message:
//         error?.response?.data?.message || 'Failed to verify the reset code.',
//       data: null,
//       status: error?.response?.status || 500,
//     };
//   }
// }

/**
 * Changes the user's password.
 *
 * This function sends a new password to the server for updating the user's account.
 *
 * @param {string} newPassword - The new password to set for the user.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object
 * containing the result of the password change request.
 */
// export async function updatePassword(
//   newPassword: string,
// ): Promise<APIResponse> {
//   try {
//     const res = await authenticatedService({
//       url: '/auth/change-password',
//       method: 'POST',
//       data: JSON.stringify({ newPassword }),
//     });

//     return {
//       success: true,
//       message: res.data?.message,
//       data: res.data?.data,
//       status: res.status,
//     };
//   } catch (error: Error | any) {
//     console.error(
//       'Error changing the password : \n\n',
//       error?.response || error,
//     );
//     return {
//       success: false,
//       message:
//         error?.response?.data?.message || 'Failed to change the password.',
//       data: null,
//       status: error?.response?.status || 500,
//     };
//   }
// }
