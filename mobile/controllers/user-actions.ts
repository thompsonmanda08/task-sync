import { authenticatedService } from '@/lib/api-config';
import { APIResponse } from '@/types';

export async function getUserProfile(): Promise<APIResponse> {
  const url = '/user';
  try {
    const res = await authenticatedService({
      url,
    });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'GET PROFILE: ' + url,
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

export async function updateProfilePicture(data: {
  profile_picture: string;
}): Promise<APIResponse> {
  const url = `/user/profile-picture`;
  try {
    const res = await authenticatedService({ url, data, method: 'PATCH' });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'PATCH PROFILE PICTURE: ' + url,
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

export async function updateUserProfile(params: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}): Promise<APIResponse> {
  const url = `/user`;
  try {
    const updateData = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined),
    );

    const res = await authenticatedService({
      method: 'PATCH',
      url,
      data: updateData,
    });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'PATCH PROFILE: ' + url,
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
