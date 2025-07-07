import axios from "axios";
import { getAuthSession } from "@/app/_actions/config-actions";
import { redirect } from "next/navigation";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.SERVER_URL ||
  process.env.NEXT_PUBLIC_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const authenticatedService = async (request: any) => {
  const { session } = await getAuthSession();

  const response = await apiClient({
    method: "GET",
    headers: {
      "Content-type": request.contentType
        ? request.contentType
        : "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    // withCredentials: true,
    ...request,
  });

  return response;
};
