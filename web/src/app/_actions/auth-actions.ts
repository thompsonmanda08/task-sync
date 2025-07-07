"use server";

import { authenticatedService, apiClient } from "@/app/_actions/api-config";
import { createAuthSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "./config-actions";
import { cache } from "react";
import { User } from "@/types/auth";

/**
 * Authenticates a user with their email and password by calling the API endpoint
 * and creates an authentication session upon successful login.
 *
 * @param {Object} param - An object containing login details.
 * @param {string} param.email - The email of the user.
 * @param {string} param.password - The password of the user.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */
export async function logUserIn({ email, password }) {
  try {
    const res = await apiClient.post(`auth/login`, {
      email,
      password,
    });

    const response = res.data;
    const user = null;
    const accessToken = response?.data?.token;
    const isVerifiedEmail = response?.data?.isVerifiedEmail;

    await createAuthSession({ user, accessToken });

    return {
      success: true,
      message: response?.message,
      data: { accessToken, isVerifiedEmail },
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: `POST ~ /auth/login`,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: error?.response?.data?.data,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Create and authenticate a user with their email and password by calling the API endpoint
 * and creates a user and also creates an authentication session upon successful creation of the user.
 *
 * @param {Object} newUser - An object containing sign details.
 * @param {string} newUser.firstName - The first name of the user.
 * @param {string} newUser.lastName - The last name of the user.
 * @param {string} newUser.email - The email of the user.
 * @param {string} newUser.phone - The phone number of the user.
 * @param {string} newUser.password - The password of the user.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */

export async function registerNewUser(newUser) {
  try {
    const res = await apiClient.post(`/auth/register`, newUser);

    return {
      success: true,
      message: res?.data?.message,
      data: null,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: `POST ~ /auth/register`,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * GET ~ Gets a user profile object from the API and saves a static version in the cookies.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */

export const getUserProfile = cache(async  (enabled: boolean) => {


  if (!enabled) {
    return {
      success: false,
      message: "User not logged in",
      data: null,
      status: 401,
    };
  }

  try {
    const res = await authenticatedService({ url: `/user` });

    const user = res?.data?.data?.profile;

    return {
      success: true,
      message: res?.data?.message,
      data: user,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: `GET ~ /user`,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    // console.error(error);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
})

/**
 * PATCH ~ Updates the user details of the currently logged in user
 * 
 * @param {Object} formData - An object containing user profile details.
 * @param {string} formData.firstName - The first name of the user.
 * @param {string} formData.lastName - The last name of the user.
 * @param {string} formData.email - The email of the user.
 * @param {string} formData.phone - The phone number of the user.
 * @param {string} formData.universtyId - Id of the university the user belongs
 * @param {string} formData.dob - Date of birth of the user 
 * @param {string} formData.isStudent - Indicator for whether the user is a student or not 

 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */
export async function updateProfileDetails(formdata: Partial<User>) {
  try {
    const res = await authenticatedService({
      method: "PATCH",
      url: `/user`,
      data: formdata,
    });

    revalidatePath("/dashboard/profile", "page");

    return {
      success: true,
      message: res?.data?.message,
      data: null,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: `PATCH ~ /user `,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * PATCH ~ Update user profile Image of the currently logged in user

 * @param {FormData} formData - A FormData object containing a file of the image to be uploaded.
 * @param {File} formData.photo - File of the image to be uploaded.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */
export async function updateProfileImage(fileFormData) {
  const formData = new FormData();
  formData.append("photo", fileFormData.get("photo"));

  try {
    const res = await authenticatedService({
      method: "PATCH",
      url: `/user/profile-picture`,
      data: formData,
      contentType: "multipart/form-data",
    });

    revalidatePath("/dashboard/profile", "page");
    revalidatePath("/", "layout");

    return {
      success: true,
      message: res?.data?.message,
      data: null,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: `PATCH ~/user/profile-picture`,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/* ************************************************************************************ */
/* ***************************** PASSWORD RESET ACTIONS ******************************* */
/* ************************************************************************************ */

/**
 * POST ~ Reset User password, if a user has forgotten their password

 * @param {Object} formData - A FormData object containing the email address of the user to reset the password for.
 * @param {string} formData.email - The email address of the user to reset the password for.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */
export async function initiatePasswordReset(formData) {
  try {
    const res = await apiClient.post(`/auth/forgot-password`, formData);

    return {
      success: true,
      message: res?.data?.message,
      data: res?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: `/auth/forgot-password`,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * POST ~ Reset Password of the in user if the user has forgotten their password

 * @param {Object} formData - A FormData object containing the email address  and passcode of the user to reset the password for.
 * @param {string} formData.email - The email address of the user to reset the password for.
 * @param {string} formData.code - The code sent to the user's email address.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */
export async function validateOTPCode(formData) {
  try {
    const res = await apiClient.post(`/auth/verify-reset-code`, formData);

    return {
      success: true,
      message: res?.data?.message,
      data: res?.data?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: `/auth/verify-reset-code`,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * POST ~ Change User Password, if a user has forgotten their password

 * @param {Object} formData - A FormData object containing the email address  and passcode of the user to reset the password for.
* @param {string} formData.newPassword - The new password for the user.
 * @param {string} formData.token - The token generated by the server to validate the user's email address.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */
export async function resetPassword(formData) {
  const { session } = getAuthSession();
  const token = formData?.token || session?.accessToken;
  try {
    const res = await apiClient.post(
      `/auth/change-password?token=${token}`,
      formData,
    );

    return {
      success: true,
      message: res?.data?.message,
      data: res?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: `/auth/change-password`,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/* ************************************************************************************ */

/* ************************************************************************************ */
/* ******************************** EMAIL VERIFICATION ******************************** */
/* ************************************************************************************ */
/**
 * POST ~ Verify a users email address

 * @param {Object} formData - A FormData object containing the email address of the user to reset the password for.
 * @param {string} formData.email - The email address of the user to be verified
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */
export async function requestEmailVerification(formData) {
  try {
    const res = await apiClient.post(
      `/auth/register/email/request-code`,
      formData,
    );

    return {
      success: true,
      message: res?.data?.message,
      data: res?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: `/auth/register/email/request-code`,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * POST ~ Email Verification with passcode 

 * @param {Object} formData - A FormData object containing the email address  and passcode of the user to verify.
 * @param {string} formData.email - The email address of the user
 * @param {string} formData.code - The code sent to the user's email address.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */
export async function verifyEmailAddress(formData) {
  try {
    const res = await apiClient.post(`/auth/register/email/verify`, formData);

    return {
      success: true,
      message: res?.data?.message,
      data: res?.data?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: `/auth/register/email/verify`,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/* ************************************************************************************************** */
