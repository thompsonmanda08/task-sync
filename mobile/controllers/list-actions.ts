import { authenticatedService } from '@/lib/api-config';
import { APIResponse, TodoItem } from '@/types';

export async function getUserLists(): Promise<APIResponse> {
  const url = '/lists';
  try {
    const res = await authenticatedService({ url });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'GET TODOlISTS: ' + url,
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

export async function getList(listId: string): Promise<APIResponse> {
  const url = `/list/${listId}`;
  try {
    const res = await authenticatedService({ url });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'GET TODOlISTS: ' + url,
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

export async function createNewList(data: {
  name: string;
  description: string; // (Optional)
  color: string; // (Optional)
  group_id: string; // (Optional)
}): Promise<APIResponse> {
  const url = '/list';
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

export async function updateList(
  data: {
    name: string;
  },
  listId: string,
): Promise<APIResponse> {
  const url = `/list/${listId}`;
  try {
    const res = await authenticatedService({ url, data, method: 'POST' });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'UPDATE LIST INFO : ' + url,
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

export async function deleteList(listId: string): Promise<APIResponse> {
  const url = `/list/${listId}`;
  try {
    const res = await authenticatedService({ url, method: 'DELETE' });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'DELETE LIST : ' + url,
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

export async function createNewTask(
  listId: string,
  data: {
    task: string;
  },
): Promise<APIResponse> {
  const url = `/list/${listId}/todo`;
  try {
    const res = await authenticatedService({ url, data, method: 'POST' });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'CREATE NEW TASK: ' + url,
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
export async function updateTaskItem(
  listId: string,
  taskId: string,
  data: Partial<TodoItem>,
): Promise<APIResponse> {
  const url = `/list/${listId}/todo/${taskId}`;
  try {
    const res = await authenticatedService({ url, data, method: 'PATCH' });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'UPDATE TASK: ' + url,
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

export async function deleteListItem(
  listId: string,
  taskId: string,
): Promise<APIResponse> {
  const url = `/list/${listId}/todo/${taskId}`;
  try {
    const res = await authenticatedService({ url, method: 'DELETE' });

    return res.data as APIResponse;
  } catch (error: Error | any) {
    console.error({
      route: 'DELETE TASK ITEM : ' + url,
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
