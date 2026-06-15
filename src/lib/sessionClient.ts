/**
 * Client-side session checking helpers for Cafe24 storefront theme environment.
 */

export function getClientCurrentUser(): string | null {
  if (typeof window === "undefined") return null;

  // 1. Check Cafe24 storefront async methods (returns active member ID)
  try {
    const cappMethods = (window as any).CAPP_ASYNC_METHODS;
    if (cappMethods && typeof cappMethods.AppCommon?.getMemberInfo === "function") {
      const memberInfo = cappMethods.AppCommon.getMemberInfo();
      if (memberInfo && memberInfo.member_id) {
        return memberInfo.member_id;
      }
    }
  } catch (err) {
    console.warn("[SessionClient] CAPP_ASYNC_METHODS check failed:", err);
  }

  // 2. Check Cafe24 frontend external script variable presence
  try {
    const extVar = (window as any).EC_FRONT_EXTERNAL_SCRIPT_VARIABLE_DATA;
    if (extVar && extVar.common_member_id_crypt) {
      // common_member_id_crypt is present only when logged in
      return "cafe24_user";
    }
  } catch (err) {
    console.warn("[SessionClient] external variable check failed:", err);
  }

  // 3. Fallback: Check local development mock cookies
  try {
    const cookies = document.cookie.split(";").reduce((acc, c) => {
      const [key, val] = c.trim().split("=");
      if (key && val) {
        acc[key.trim()] = val.trim();
      }
      return acc;
    }, {} as Record<string, string>);

    if (cookies["cafe24_user"]) {
      return decodeURIComponent(cookies["cafe24_user"]);
    }
  } catch (err) {
    console.warn("[SessionClient] cookie parsing failed:", err);
  }

  return null;
}
