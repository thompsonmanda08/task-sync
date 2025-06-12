import "server-only";

import { SignJWT, jwtVerify, decodeJwt } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_SESSION } from "./constants";

interface SessionPayload {
  user: unknown;
  accessToken: string;
  [key: string]: unknown;
}

interface UpdateSessionFields {
  [key: string]: unknown;
}

// 1. Get secret from environment variables (MUST be set)
const secretKey =
  process.env.NEXT_PUBLIC_AUTH_SECRET || process.env.AUTH_SECRET;

// 2. Validate the secret exists
if (!secretKey || secretKey.length < 32) {
  throw new Error(
    "JWT_SECRET or AUTH_SECRET environment variable must be at least 32 characters",
  );
}

// 3. Create the key properly
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be a non-empty object");
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(session) {
  if (!session || typeof session !== "string") {
    return {
      success: false,
      message: "No session token provided",
      data: null,
      status: 500,
      statusText: "UNAUTHENTICATED",
    };
  }

  const parts = session.split(".");

  if (parts.length !== 3) {
    return {
      success: false,
      message: "Invalid token format",
      data: null,
      status: 500,
      statusText: "INVALID_TOKEN_FORMAT",
    };
  }

  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
      clockTolerance: 15,
    });

    return payload;
  } catch (error: Error | any) {
    console.error(error);

    // Specific error handling
    if (error.code === "ERR_JWS_INVALID") {
      return {
        success: false,
        message: "Invalid token signature",
        data: null,
        status: 500,
        statusText: "INVALID_TOKEN_SIGNATURE",
      };
    }

    if (error.code === "ERR_JWT_EXPIRED") {
      return {
        success: false,
        message: "Token expired",
        data: null,
        status: 500,
        statusText: "TOKEN_EXPIRED",
      };
    }

    // return null;
    return {
      success: false,
      message: "Failed to verify session",
      data: null,
      status: 500,
      statusText: "TOKEN_VERIFICATION_FAILED",
    };
  }
}

export async function createAuthSession({ user, accessToken }) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 23); // AFTER 23 HOURS
  const session = await encrypt({
    user,
    accessToken: accessToken || "",
  });

  (await cookies()).set(AUTH_SESSION, session, {
    httpOnly: true,
    secure: false,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession() {
  const cookie = (await cookies()).get(AUTH_SESSION)?.value;

  if (!cookie) return { isAuthenticated: false, session: {} };

  const session = await decrypt(cookie);

  if (!session?.accessToken) {
    return { isAuthenticated: false, session: {} };
  }

  const { accessToken } = session || "";
  const config = decodeJwt(String(accessToken));

  return { isAuthenticated: true, session, config };
}

export async function updateSession(
  fields: UpdateSessionFields,
): Promise<void> {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 23); // AFTER 23 HOURS
  const { session: oldSession } = await verifySession();

  if (oldSession) {
    const session = await encrypt({
      ...(oldSession as SessionPayload),
      ...fields,
    });

    if (session) {
      (await cookies()).set(AUTH_SESSION, session, {
        httpOnly: true,
        secure: false,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
      });
    } else {
      throw new Error("Failed to update session token.");
    }
  }
}

export async function deleteSession() {
  (await cookies()).delete(AUTH_SESSION);

  redirect("/");
}
