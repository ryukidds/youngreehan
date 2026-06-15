import { cookies } from "next/headers";
import crypto from "crypto";

export async function getCurrentUser(): Promise<string | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("cafe24_user");
  return userCookie ? userCookie.value : null;
}

export async function isAdminUser(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");
  
  if (!adminToken) return false;
  
  // Dynamically derive security signature from SESSION_SECRET to prevent exposing secrets in git
  const sessionSecret = process.env.SESSION_SECRET || "fallback_local_secret";
  const secureSignature = crypto
    .createHash("sha256")
    .update(sessionSecret)
    .digest("hex");
    
  return adminToken.value === secureSignature;
}
