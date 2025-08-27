export const AUTH_COOKIE_NAME = "plavo_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type SessionPayload = {
  userId: number;
  email: string;
  iat: number;
  exp: number;
};

type JwtHeader = {
  alg: "HS256";
  typ: "JWT";
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }

  return secret;
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function encodeJson(value: unknown) {
  return base64UrlEncode(textEncoder.encode(JSON.stringify(value)));
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(getJwtSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(user: Pick<SessionPayload, "userId" | "email">) {
  const now = Math.floor(Date.now() / 1000);
  const header: JwtHeader = { alg: "HS256", typ: "JWT" };
  const payload: SessionPayload = {
    userId: user.userId,
    email: user.email,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };

  const signingInput = `${encodeJson(header)}.${encodeJson(payload)}`;
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getSigningKey(),
    textEncoder.encode(signingInput),
  );

  return `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");

    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      return null;
    }

    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const isValid = await crypto.subtle.verify(
      "HMAC",
      await getSigningKey(),
      base64UrlDecode(encodedSignature),
      textEncoder.encode(signingInput),
    );

    if (!isValid) {
      return null;
    }

    const payload = JSON.parse(textDecoder.decode(base64UrlDecode(encodedPayload))) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (!payload.userId || !payload.email || payload.exp <= now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
