import { cookies } from "next/headers";

export async function getCurrentUser(): Promise<string | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("cafe24_user");
  return userCookie ? userCookie.value : null;
}
export async function isAdminUser(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin_logged_in");
  return adminCookie?.value === "true";
}
