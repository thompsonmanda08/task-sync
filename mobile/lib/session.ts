import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

import { AUTH_SESSION, USER_SESSION, SESSION_TIME_STAMP } from '@/constants';
import { User } from '@/types';

const SESSION_EXPIRY_TIME = 24 * 60 * 60 * 1000;

export type SessionPayload = {
  user?: Partial<User> & {
    [x: string]: any;
  };
  accessToken: string;
  expiresAt?: Date;
};

export async function createAuthSession({
  accessToken,
  // user,
}: {
  accessToken: string;
}) {
  try {
    const timestamp = Date.now().toString();
    await SecureStore.setItemAsync(AUTH_SESSION, accessToken);
    // await SecureStore.setItemAsync(USER_SESSION, user);
    await SecureStore.setItemAsync(SESSION_TIME_STAMP, timestamp);
  } catch (error) {
    console.error('Failed to create session:', error);
  }
  return accessToken;
}

export async function verifySession(): Promise<{
  isAuthenticated: boolean;
  session: SessionPayload | null;
}> {
  const NOT_LOGGED_IN = {
    isAuthenticated: false,
    session: null,
  };

  try {
    const accessToken = await SecureStore.getItemAsync(AUTH_SESSION);
    const timestamp = await SecureStore.getItemAsync(SESSION_TIME_STAMP);

    if (!accessToken || !timestamp) return NOT_LOGGED_IN;

    // Check if session is expired
    const savedTime = parseInt(timestamp, 10);
    if (Date.now() - savedTime > SESSION_EXPIRY_TIME) {
      await deleteSession();
      return NOT_LOGGED_IN;
    }

    // const decoded = JWT.decode(accessToken);
    const config = jwtDecode(accessToken);

    console.log('CONFIG-JWT', config);

    return {
      isAuthenticated: true,
      session: {
        ...config,
        accessToken,
        expiresAt: new Date(Number(savedTime)),
      } as SessionPayload,
    };
  } catch (error) {
    console.error('Failed to retrieve session:', error);
    return NOT_LOGGED_IN;
  }
}

export async function deleteSession() {
  try {
    await SecureStore.deleteItemAsync(AUTH_SESSION);
    await SecureStore.deleteItemAsync(SESSION_TIME_STAMP);
    return true;
  } catch (error) {
    console.error('Failed to clear session:', error);
    return false;
  }
}
