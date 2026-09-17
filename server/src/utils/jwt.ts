import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export function signToken(adminId: string): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
  const options: SignOptions = { expiresIn };
  return jwt.sign({ sub: adminId }, JWT_SECRET as string, options);
}

export function verifyToken(token: string): { sub: string } {
  return jwt.verify(token, JWT_SECRET as string) as { sub: string };
}
