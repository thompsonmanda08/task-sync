import {
  getCountries,
  getRoomTypes,
  getSystemActions,
  getUniversities,
  getUserRoles,
} from "@/app/_actions/config-actions";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export const useCountries = () =>
  useQuery({
    queryKey: [QUERY_KEYS.COUNTRIES],
    queryFn: async () => await getCountries(),
    staleTime: Infinity,
  });

export const useUserRoles = () =>
  useQuery({
    queryKey: [QUERY_KEYS.ROLES],
    queryFn: async () => await getUserRoles(),
    staleTime: Infinity,
  });

export const useUniversities = () =>
  useQuery({
    queryKey: [QUERY_KEYS.UNIVERSITIES],
    queryFn: async () => await getUniversities(),
    staleTime: Infinity,
  });

export const useRoomTypes = () =>
  useQuery({
    queryKey: [QUERY_KEYS.ROOM_TYPES],
    queryFn: async () => await getRoomTypes(),
    staleTime: Infinity,
  });

export const useSystemActions = () =>
  useQuery({
    queryKey: [QUERY_KEYS.SYSTEM_ACTIONS],
    queryFn: async () => await getSystemActions(),
    staleTime: Infinity,
  });
