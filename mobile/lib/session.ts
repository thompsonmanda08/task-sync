import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

import { AUTH_SESSION, USER_SESSION, SESSION_TIME_STAMP } from '@/constants';
import { User } from '@/types';

const SESSION_EXPIRY_TIME = 24 * 60 * 60 * 1000;

export type SessionPayload = {
  user?: any;
  accessToken: string;
  expiresAt?: Date;
};

export async function createAuthSession({ accessToken, user }: SessionPayload) {
  try {
    const timestamp = Date.now().toString();

    await SecureStore.setItemAsync(AUTH_SESSION, accessToken);
    await SecureStore.setItemAsync(USER_SESSION, JSON.stringify(user));
    await SecureStore.setItemAsync(SESSION_TIME_STAMP, timestamp);
  } catch (error) {
    console.error('Failed to create session:', error);
  }
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
    const [accessToken, timestamp, userString] = await Promise.all([
      SecureStore.getItemAsync(AUTH_SESSION),
      SecureStore.getItemAsync(SESSION_TIME_STAMP),
      SecureStore.getItemAsync(USER_SESSION),
    ]);

    const user = JSON.parse(String(userString)) as User;

    if (!accessToken || !timestamp) return NOT_LOGGED_IN;

    // Check if session is expired
    const savedTime = parseInt(timestamp, 10);
    if (Date.now() - savedTime > SESSION_EXPIRY_TIME) {
      await deleteSession();
      return NOT_LOGGED_IN;
    }

    // const decoded = JWT.decode(accessToken);
    const config = jwtDecode(accessToken);

    return {
      isAuthenticated: true,
      session: {
        ...config,
        user,
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
    await SecureStore.deleteItemAsync(USER_SESSION);
    return true;
  } catch (error) {
    console.error('Failed to clear session:', error);
    return false;
  }
}
