// Signed session tokens (HS256 JWT). Used by the proxy for a fast check and by
// the data access layer for the full check. No database access here.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "tally_session";
export const SESSION_DAYS = 30;

const DEV_SECRET = "tally-local-development-secret-change-me-0123456789";

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set to at least 32 characters in production.");
    }
    return new TextEncoder().encode(DEV_SECRET);
  }
  return new TextEncoder().encode(secret);
}

export type SessionClaims = { pv: string };

export async function signSession(claims: SessionClaims): Promise<string> {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("owner")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (payload.sub !== "owner" || typeof payload.pv !== "string") return null;
    return { pv: payload.pv };
  } catch {
    return null;
  }
}
