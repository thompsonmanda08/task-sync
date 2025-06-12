import { authenticatedService } from '@/lib/api-config';
import { APIResponse, Delivery, PaymentDetails, ShipmentRecord } from '@/types';

/**
 * Fetches available deliveries for a given city and page number.
 *
 * @param {string} city - The city to fetch deliveries for.
 * @param {number} [page=1] - The page number to fetch deliveries for.
 * @param {number} [size=10] - The number of deliveries to fetch per page.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the available deliveries.
 */
export async function getAvailableDeliveries(
  city: string,
  page: number = 1,
  size: number = 10,
): Promise<APIResponse> {
  if (!city || city == '')
    return {
      success: false,
      message: 'City is required',
      data: [],
      status: 500,
    };

  try {
    const res = await authenticatedService({
      url: `/deliveries?city=${city}&page=${page}&size=${size}`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
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
        'Error! See Console for more details!',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Fetches deliveries for the currently logged in user.
 *
 * @param {number} [page=1] - The page number to fetch deliveries for.
 * @param {number} [size=10] - The number of deliveries to fetch per page.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the user's deliveries.
 */
export async function getUserDeliveries(
  page: number = 1,
  size: number = 10,
): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      url: `/user/deliveries?page=${page}&size=${size}`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
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
        'Error! See Console for more details!',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

export async function getUserPaidDeliveries(
  enabled = false,
  page: number = 1,
  size: number = 10,
): Promise<APIResponse> {
  if (!enabled) {
    return {
      success: false,
      message: 'NOT ALLOWED!',
      data: [],
      status: 500,
    };
  }

  try {
    const res = await authenticatedService({
      url: `/user/deliveries/paid?page=${page}&size=${size}`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
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
        'Error! See Console for more details!',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Creates a new delivery on the server.
 *
 * @param {Delivery} data - The delivery data to be sent to the server.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the result of the delivery creation request.
 */
export async function createNewDelivery(data: Delivery): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      method: 'POST',
      url: '/deliveries',
      data,
    });

    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data || null,
      status: res.status,
    };
  } catch (error: any) {
    console.error({
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
        'Error! See Console for more details!',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

export async function publishCargoListing(
  data: PaymentDetails,
  deliveryId: string,
): Promise<APIResponse> {
  if (!deliveryId) {
    return {
      success: false,
      message: 'Delivery ID is required',
      data: null,
      status: 500,
    };
  }
  try {
    const res = await authenticatedService({
      method: 'POST',
      url: `/deliveries/${deliveryId}/publish`,
      data,
    });

    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data || null,
      status: res.status,
    };
  } catch (error: any) {
    console.error({
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
        'Error! See Console for more details!',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Initiates a payment transaction to unlock and view the contact details associated with a delivery.
 * Sends a POST request to the server with the payment details and delivery ID.
 *
 * @param {PaymentDetails} data - An object containing the payment-related information.
 * @param {string} deliveryId - The ID of the delivery for which contact details are being accessed.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing
 * the result of the payment transaction or error details.
 */

export async function payToSeeContacts(
  data: PaymentDetails,
  deliveryId: string,
): Promise<APIResponse> {
  if (!deliveryId) {
    return {
      success: false,
      message: 'Delivery ID is required',
      data: null,
      status: 500,
    };
  }
  try {
    const res = await authenticatedService({
      method: 'POST',
      url: `/transactions/pay/${deliveryId}`,
      data,
    });

    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data || null,
      status: res.status,
    };
  } catch (error: any) {
    console.error({
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
        'Error! See Console for more details',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Fetches a delivery by its ID.
 *
 * @param {string} deliveryId - The ID of the delivery to fetch.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the delivery details or error details.
 */
export async function getDeliveryDetails(
  deliveryId: string,
): Promise<APIResponse> {
  if (!deliveryId) {
    return {
      success: false,
      message: 'Delivery ID is required',
      data: null,
      status: 500,
    };
  }
  try {
    const res = await authenticatedService({
      url: `/deliveries/${deliveryId}`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
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
        'Error! See Console for more details',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Updates the delivery details for a specific delivery.
 * Sends a PATCH request to the server with the updated delivery data.
 *
 * @param {string} deliveryId - The ID of the delivery to be updated.
 * @param {Partial<Delivery>} data - An object containing the delivery fields to update.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing
 * the result of the update operation or error details.
 */

export async function updateDeliveryDetails(
  deliveryId: string,
  data: Partial<ShipmentRecord>,
): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      method: 'PATCH',
      url: `/deliveries/${deliveryId}`,
      data,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
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
        'Error! See Console for more details',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Deletes a delivery with the specified delivery ID.
 *
 * @param {string} deliveryId - The ID of the delivery to be deleted.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the result
 * of the delete operation or error details.
 */

export async function cancelDelivery(deliveryId: string): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      url: `/deliveries/${deliveryId}/cancel`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
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
        'Error! See Console for more details',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Deletes a delivery with the specified delivery ID.
 *
 * @param {string} deliveryId - The ID of the delivery to be deleted.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the result
 * of the delete operation or error details.
 */

export async function deleteDelivery(deliveryId: string): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      method: 'DELETE',
      url: `/deliveries/${deliveryId}`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
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
        'Error! See Console for more details',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Marks a delivery as picked up.
 *
 * @param {string} deliveryId - The ID of the delivery to pick up.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the result of the pick up operation or error details.
 */
export async function pickUpDelivery(deliveryId: string): Promise<APIResponse> {
  if (!deliveryId) {
    return {
      success: false,
      message: 'Delivery ID is Required!',
      data: null,
      status: 400,
    };
  }
  try {
    const res = await authenticatedService({
      url: `/deliveries/${deliveryId}/pickup`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
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
        'Error! See Console for more details',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Starts a delivery.
 *
 * @param {string} deliveryId - The ID of the delivery to start.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the result of the start operation or error details.
 */
export async function startDelivery(deliveryId: string): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      url: `/deliveries/${deliveryId}/start`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
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
        'Error! See Console for more details',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

export async function finishDelivery(deliveryId: string): Promise<APIResponse> {
  if (!deliveryId) {
    return {
      success: false,
      message: 'Delivery ID is Required!',
      data: null,
      status: 400,
    };
  }
  try {
    const res = await authenticatedService({
      url: `/deliveries/${deliveryId}/finish`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
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
        'Error! See Console for more details',
      data: null,
      status: error?.response?.status || 500,
    };
  }
}
