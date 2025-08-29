import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function requireUserId() {
  const session = await verifySessionToken(cookies().get(AUTH_COOKIE_NAME)?.value);

  if (!session) {
    throw new UnauthorizedError();
  }

  return session.userId;
}

export function isUnauthorizedError(error: unknown) {
  return error instanceof UnauthorizedError;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
