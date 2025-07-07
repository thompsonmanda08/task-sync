import apiClient, { authenticatedService } from '@/lib/api-config';
import { APIResponse } from '@/types';

export async function getUserGroupRoles(): Promise<APIResponse> {
  const url = '/roles';
  try {
    const res = await apiClient.get(url);

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'GET GROUP ROLES: ' + url,
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

export async function createNewGroup(data: {
  name: string;
  description?: string; // (Optional)
}): Promise<APIResponse> {
  const url = '/groups/new';
  try {
    const res = await authenticatedService({ url, data, method: 'POST' });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'CREATE GROUP: ' + url,
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

export async function updateGroup(data: {
  name: string;
  description?: string; // (Optional)
}): Promise<APIResponse> {
  const url = '/groups';
  try {
    const res = await authenticatedService({ url, data, method: 'PATCH' });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'UPDATE GROUP: ' + url,
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

export async function getUserGroups(): Promise<APIResponse> {
  const url = '/groups';
  try {
    const res = await authenticatedService({ url });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'GET GROUPS: ' + url,
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

export async function getGroup(groupId: string): Promise<APIResponse> {
  const url = `/groups/${groupId}`;
  try {
    const res = await authenticatedService({ url });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'GET GROUP: ' + url,
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

export async function deleteGroup(groupId: string): Promise<APIResponse> {
  const url = `/groups/${groupId}`;
  try {
    const res = await authenticatedService({ url, method: 'DELETE' });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'DELETE GROUP: ' + url,
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
