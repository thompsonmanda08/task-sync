import { getUserProfile } from "@/app/_actions/auth-actions";
import { getSystemActions } from "@/app/_actions/config-actions";

import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";


export const useUserProfile = (enabled:boolean) =>
  useQuery({
    queryKey: [QUERY_KEYS.USER, enabled],
    queryFn: async () => await getUserProfile(enabled),
    staleTime: Infinity,
  });


export const useSystemActions = () =>
  useQuery({
    queryKey: [QUERY_KEYS.SYSTEM_ACTIONS],
    queryFn: async () => await getSystemActions(),
    staleTime: Infinity,
  });

