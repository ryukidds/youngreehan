/**
 * Cafe24 Admin API OAuth 2.0 Client Utilities
 * 
 * Mall ID: hypq
 * Base URL: https://hypq.cafe24api.com/api/v2
 */

import fs from "fs";
import path from "path";

const MALL_ID = process.env.NEXT_PUBLIC_CAFE24_MALL_ID || "hypq";
const CLIENT_ID = process.env.CAFE24_CLIENT_ID || "";
const CLIENT_SECRET = process.env.CAFE24_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_CAFE24_REDIRECT_URI || "";

const API_BASE = `https://${MALL_ID}.cafe24api.com/api/v2`;
const OAUTH_BASE = `https://${MALL_ID}.cafe24api.com/api/v2/oauth`;

// All scopes needed for the app
const SCOPES = [
  "mall.read_product",
  "mall.write_product",
  "mall.read_category",
  "mall.read_customer",
  "mall.write_customer",
  "mall.read_order",
  "mall.write_order",
  "mall.read_shipping",
  "mall.read_application",
  "mall.write_application",
].join(",");


/**
 * Generate the Cafe24 OAuth authorization URL
 */
export function getCafe24AuthUrl(state?: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    state: state || "cafe24_auth",
  });

  return `${OAUTH_BASE}/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access token + refresh token
 */
export async function exchangeCodeForToken(code: string) {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });

  const response = await fetch(`${OAUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("[Cafe24] Token exchange failed:", response.status, errorData);
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token as string,
    refreshToken: data.refresh_token as string,
    expiresIn: data.expires_in as number,
    issuedAt: Date.now(),
    scope: data.scopes as string[],
    mallId: data.mall_id as string,
  };
}

/**
 * Refresh an expired access token using a refresh token
 */
export async function refreshAccessToken(refreshToken: string) {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(`${OAUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("[Cafe24] Token refresh failed:", response.status, errorData);
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token as string,
    refreshToken: data.refresh_token as string,
    expiresIn: data.expires_in as number,
    issuedAt: Date.now(),
  };
}

/**
 * Make an authenticated request to the Cafe24 Admin API
 */
export async function cafe24AdminFetch(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}/admin${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Cafe24-Api-Version": "2026-03-01",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`[Cafe24] API Error ${response.status} on ${endpoint}:`, errorData);

    if (response.status === 401) {
      throw new Cafe24AuthError("Access token expired or invalid");
    }

    throw new Error(`Cafe24 API Error: ${response.status} - ${errorData}`);
  }

  return response.json();
}

/**
 * Custom error class for authentication failures (token expired)
 */
export class Cafe24AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Cafe24AuthError";
  }
}

/**
 * Helper: Get token from cookies in a request
 */
export function getTokenFromCookies(cookieHeader: string | null): {
  accessToken: string | null;
  refreshToken: string | null;
} {
  if (!cookieHeader) return { accessToken: null, refreshToken: null };

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...val] = c.trim().split("=");
      return [key, val.join("=")];
    })
  );

  return {
    accessToken: cookies["cafe24_access_token"] || null,
    refreshToken: cookies["cafe24_refresh_token"] || null,
  };
}

/**
 * Helper: Create Set-Cookie headers for token storage
 */
export function createTokenCookies(
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): string[] {
  const accessMaxAge = expiresIn;
  const refreshMaxAge = 60 * 60 * 24 * 14; // 14 days

  return [
    `cafe24_access_token=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${accessMaxAge}`,
    `cafe24_refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${refreshMaxAge}`,
  ];
}

const TOKEN_FILE_PATH = path.join(process.cwd(), "cafe24-tokens.json");

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  mallId?: string;
  issuedAt?: number;
}

export function saveTokensToFile(
  accessToken: string, 
  refreshToken: string, 
  expiresIn: number,
  mallId?: string
) {
  const tokenData: TokenData = {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + (expiresIn || 7200) * 1000, // Default to 2 hours if undefined
    mallId: mallId || "hypq",
    issuedAt: Date.now()
  };
  fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(tokenData, null, 2), "utf8");
  console.log("[Cafe24] Tokens saved to file:", TOKEN_FILE_PATH);
}

export function getTokensFromFile(): TokenData | null {
  try {
    if (!fs.existsSync(TOKEN_FILE_PATH)) return null;
    const content = fs.readFileSync(TOKEN_FILE_PATH, "utf8");
    return JSON.parse(content) as TokenData;
  } catch (error) {
    console.error("[Cafe24] Error reading tokens file:", error);
    return null;
  }
}

/**
 * Unified Cafe24 Admin Fetcher.
 * Automatically loads Admin tokens from server-side file storage,
 * checks for expiration, refreshes the token, and saves it.
 */
export async function cafe24Fetch(endpoint: string, options: RequestInit = {}) {
  let tokens = getTokensFromFile();

  if (!tokens) {
    throw new Cafe24AuthError("No Cafe24 tokens found. Admin must authenticate first.");
  }

  // Refresh if token will expire in 5 minutes
  const isExpired = Date.now() >= tokens.expiresAt - 5 * 60 * 1000;
  if (isExpired) {
    console.log("[Cafe24 Fetch] Access token expired or close to expiry. Refreshing...");
    try {
      const refreshed = await refreshAccessToken(tokens.refreshToken);
      saveTokensToFile(refreshed.accessToken, refreshed.refreshToken, refreshed.expiresIn, tokens.mallId);
      tokens = {
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        expiresAt: Date.now() + refreshed.expiresIn * 1000,
        mallId: tokens.mallId,
        issuedAt: Date.now()
      };
    } catch (err) {
      console.error("[Cafe24 Fetch] Automatic token refresh failed:", err);
      throw new Cafe24AuthError("Token refresh failed. Re-authentication required.");
    }
  }

  try {
    return await cafe24AdminFetch(endpoint, tokens.accessToken, options);
  } catch (err) {
    if (err instanceof Cafe24AuthError) {
      // Retry once after force refresh
      console.log("[Cafe24 Fetch] Received 401. Force refreshing token...");
      try {
        const refreshed = await refreshAccessToken(tokens.refreshToken);
        saveTokensToFile(refreshed.accessToken, refreshed.refreshToken, refreshed.expiresIn, tokens.mallId);
        return await cafe24AdminFetch(endpoint, refreshed.accessToken, options);
      } catch (refreshErr) {
        console.error("[Cafe24 Fetch] Force refresh retry failed:", refreshErr);
        throw new Cafe24AuthError("Invalid access token. Re-authentication required.");
      }
    }
    throw err;
  }
}


// ============================================================
// Legacy compatibility functions (used by existing routes)
// These will be fully replaced once Cafe24 OAuth is active
// ============================================================

const USERS_FILE_PATH = path.join(process.cwd(), "src/data/users.json");

interface LocalUser {
  member_id: string;
  name: string;
  email: string;
  password?: string;
  cellphone?: string;
  sms_agreement?: 'T' | 'F';
  news_mail_agreement?: 'T' | 'F';
  createdAt: string;
}

function getLocalUsers(): LocalUser[] {
  try {
    if (!fs.existsSync(USERS_FILE_PATH)) {
      const dir = path.dirname(USERS_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    const content = fs.readFileSync(USERS_FILE_PATH, "utf8");
    return JSON.parse(content) as LocalUser[];
  } catch (error) {
    console.error("[Cafe24 Local DB] Error reading local users:", error);
    return [];
  }
}

function saveLocalUser(user: LocalUser) {
  try {
    const users = getLocalUsers();
    const exists = users.some((u) => u.member_id === user.member_id);
    if (exists) {
      throw new Error("이미 등록된 회원 ID입니다.");
    }
    users.push(user);
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), "utf8");
  } catch (error: any) {
    console.error("[Cafe24 Local DB] Error saving local user:", error);
    throw error;
  }
}

/**
 * Legacy: Direct login stub
 * Used by /api/auth/login-direct
 */
export async function loginDirect(username: string, password?: string) {
  // 1. Check local users database first
  const users = getLocalUsers();
  const localUser = users.find((u) => u.member_id === username);

  if (localUser) {
    if (password && localUser.password !== password) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    return {
      user_id: localUser.member_id,
      name: localUser.name,
      email: localUser.email,
    };
  }

  // 2. Fallback to Cafe24 Admin API check for users created on the main site
  const customerData = await cafe24Fetch(`/customers?member_id=${encodeURIComponent(username)}`);
  const customers = customerData?.customers || [];

  if (customers.length === 0) {
    throw new Error("등록되지 않은 회원입니다.");
  }

  const customer = customers[0];
  return {
    user_id: customer.member_id,
    name: customer.name,
    email: customer.email,
  };
}

/**
 * Legacy: Direct register stub
 * Used by /api/auth/register-direct
 */
export async function registerDirect(
  username: string,
  name: string,
  email: string,
  password?: string,
  cellphone?: string,
  smsAgreement?: 'T' | 'F',
  newsMailAgreement?: 'T' | 'F'
) {
  // Check if username already exists in local DB
  const users = getLocalUsers();
  if (users.some((u) => u.member_id === username)) {
    throw new Error("이미 등록된 회원 ID입니다.");
  }

  // Check if username already exists in Cafe24
  try {
    const customerData = await cafe24Fetch(`/customers?member_id=${encodeURIComponent(username)}`);
    const customers = customerData?.customers || [];
    if (customers.length > 0) {
      throw new Error("이미 등록된 회원 ID입니다.");
    }
  } catch (err) {
    // If the Cafe24 check fails, we still allow local registration
    console.log("[registerDirect] Cafe24 duplication check error (ignored):", err);
  }

  const newLocalUser: LocalUser = {
    member_id: username,
    name,
    email,
    password: password || "tempPassword123!",
    cellphone,
    sms_agreement: smsAgreement,
    news_mail_agreement: newsMailAgreement,
    createdAt: new Date().toISOString()
  };

  saveLocalUser(newLocalUser);

  return {
    member_id: newLocalUser.member_id,
    name: newLocalUser.name,
    email: newLocalUser.email,
  };
}

/**
 * Create a Personal Payment Product on Cafe24 and return the direct surl purchase URL.
 * Falls back to local mock checkout page if Cafe24 API fails (e.g. no auth).
 */
export async function createPersonalPaymentLink(
  quoteId: string,
  totalPrice: number,
  description: string
): Promise<{ paymentUrl: string; productNo: number | null }> {
  try {
    const productPayload = {
      request: {
        shop_no: 1,
        product_name: `[영리한] 개인결제창 (견적 번호: ${quoteId})`,
        price: totalPrice,
        display: "T",
        selling: "T",
        description: `[영리한] 단체 의류 견적 확정 주문 건에 대한 결제창입니다. (견적 번호: ${quoteId})`,
        categories: [
          {
            category_no: 23 // 미진열 카테고리
          }
        ]
      }
    };

    console.log("[createPersonalPaymentLink] Registering product on Cafe24:", JSON.stringify(productPayload));
    const response = await cafe24Fetch("/products", {
      method: "POST",
      body: JSON.stringify(productPayload)
    });

    if (response && response.product && response.product.product_no) {
      const productNo = response.product.product_no;
      // Cafe24 direct purchase link format: https://{mall_id}.cafe24.com/surl/O/{product_no}
      const paymentUrl = `https://${MALL_ID}.cafe24.com/surl/O/${productNo}`;
      console.log(`[createPersonalPaymentLink] Product created successfully! No: ${productNo}, URL: ${paymentUrl}`);
      return { paymentUrl, productNo };
    }

    throw new Error("Invalid response from Cafe24 Product Creation API");
  } catch (error: any) {
    console.error("[createPersonalPaymentLink] Failed to create Cafe24 product, falling back to mock checkout:", error);
    const fallbackUrl = `/payment/mock-checkout?quoteId=${encodeURIComponent(quoteId)}&price=${totalPrice}&name=${encodeURIComponent(description)}`;
    return { paymentUrl: fallbackUrl, productNo: null };
  }
}



// Predefined color map for matching Korean color names to hex codes
const COLOR_HEX_MAP: Record<string, string> = {
  "화이트": "#ffffff", "white": "#ffffff", "흰색": "#ffffff", "아이보리": "#faf8f0", "오트밀": "#e2dbcd", "애쉬": "#e1e4e6",
  "블랙": "#1a1a1a", "black": "#1a1a1a", "검정": "#1a1a1a", "검은색": "#1a1a1a", "차콜": "#494b52", "charcoal": "#494b52",
  "그레이": "#808080", "gray": "#808080", "grey": "#808080", "회색": "#808080", "모쿠그레이": "#c6c8c9", "모쿠 그레이": "#c6c8c9", "실버": "#b8b6b9", "silver": "#b8b6b9",
  "레드": "#e6193c", "red": "#e6193c", "빨강": "#e6193c", "빨간색": "#e6193c", "버건디": "#731630", "burgundy": "#731630",
  "블루": "#054cb9", "blue": "#054cb9", "파랑": "#054cb9", "파란색": "#054cb9", "로얄블루": "#054cb9", "로얄 블루": "#054cb9", "아쿠아": "#00a2cc", "터코이즈": "#00a2cc",
  "네이비": "#0f1d35", "navy": "#0f1d35", "곤색": "#0f1d35", "인디고": "#182a47", "데님": "#536881",
  "그린": "#00874e", "green": "#00874e", "초록": "#00874e", "초록색": "#00874e", "아미그린": "#4a533c", "올리브": "#565d38", "틸그린": "#134e4d", "라이트세이지": "#9cb8a7",
  "옐로우": "#ffcc00", "yellow": "#ffcc00", "노랑": "#ffcc00", "노란색": "#ffcc00", "데이지": "#ffcc00", "스모크옐로우": "#d2b786",
  "핑크": "#f472b6", "pink": "#f472b6", "분홍": "#f472b6", "분홍색": "#f472b6", "핫핑크": "#e6006f", "라이트 핑크": "#ffccd5",
  "퍼플": "#48339b", "purple": "#48339b", "보라": "#48339b", "보라색": "#48339b", "라이트 퍼플": "#c3b2db",
  "오렌지": "#ff5f00", "orange": "#ff5f00", "주황": "#ff5f00", "주황색": "#ff5f00",
  "브라운": "#5a4540", "brown": "#5a4540", "갈색": "#5a4540", "코코아": "#5a4540", "코코아브라운": "#5a4540", "다크 브라운": "#3b2314",
  "베이지": "#eddabf", "beige": "#eddabf", "라이트 베이지": "#eddabf",
};

export function getHexColor(colorName: string): string {
  const cleanName = colorName.trim().toLowerCase();
  if (COLOR_HEX_MAP[cleanName]) return COLOR_HEX_MAP[cleanName];
  for (const [key, value] of Object.entries(COLOR_HEX_MAP)) {
    if (cleanName.includes(key)) return value;
  }
  return "#e4e4e7"; // default to light grey
}

/**
 * Maps Cafe24 brand_code to brand name with product name keyword fallback.
 */
export function getBrandFromCode(brandCode?: string, productName?: string): string {
  if (productName) {
    const lowerName = productName.toLowerCase();
    if (lowerName.includes("길단") || lowerName.includes("gildan")) return "길단";
    if (lowerName.includes("글리머") || lowerName.includes("glimmer")) return "글리머";
    if (lowerName.includes("프린트스타") || lowerName.includes("printstar")) return "프린트스타";
  }
  if (!brandCode) return "프린트스타";
  const code = brandCode.trim().toUpperCase();
  switch (code) {
    case "B000000B":
      return "프린트스타";
    case "B000000D":
      return "글리머";
    case "B000000C":
    case "B000000F":
      return "길단";
    default:
      return "프린트스타";
  }
}

/**
 * Maps Category Name or Product Name keywords to Tees, Activewear, Sweatshirts.
 */
export function getCategoryFromName(rawCategoryName: string, productName?: string): string {
  const name = (rawCategoryName || "").trim().toLowerCase();
  const prodName = (productName || "").trim().toLowerCase();

  // 1. Check product name keywords
  if (
    prodName.includes("맨투맨") ||
    prodName.includes("후드") ||
    prodName.includes("스웨트") ||
    prodName.includes("스웻") ||
    prodName.includes("sweatshirt") ||
    prodName.includes("hoodie") ||
    prodName.includes("pullover")
  ) {
    return "스웻셔츠";
  }

  if (
    prodName.includes("드라이") ||
    prodName.includes("쿨") ||
    prodName.includes("기능성") ||
    prodName.includes("스포츠") ||
    prodName.includes("트레이닝") ||
    prodName.includes("액티브") ||
    prodName.includes("dry") ||
    prodName.includes("cool") ||
    prodName.includes("active")
  ) {
    return "액티브웨어";
  }

  if (
    prodName.includes("티셔츠") ||
    prodName.includes("티") ||
    prodName.includes("t-shirt") ||
    prodName.includes("tee")
  ) {
    return "티셔츠";
  }

  // 2. Check category name keywords
  if (
    name.includes("맨투맨") ||
    name.includes("후드") ||
    name.includes("스웨트") ||
    name.includes("스웻") ||
    name.includes("sweatshirt") ||
    name.includes("hood")
  ) {
    return "스웻셔츠";
  }

  if (
    name.includes("드라이") ||
    name.includes("쿨") ||
    name.includes("기능성") ||
    name.includes("스포츠") ||
    name.includes("트레이닝") ||
    name.includes("액티브") ||
    name.includes("active")
  ) {
    return "액티브웨어";
  }

  if (
    name.includes("티셔츠") ||
    name.includes("t-shirt") ||
    name.includes("tee")
  ) {
    return "티셔츠";
  }

  return "티셔츠";
}

/**
 * Maps a Cafe24 product object to the local Product interface.
 */
export function mapCafe24Product(p: any, categoryMap: Record<number, string> = {}, optionsList: any[] = []): any {
  // Extract images
  const images = [];
  if (p.detail_image) images.push(p.detail_image);
  if (p.list_image) images.push(p.list_image);
  if (p.tiny_image) images.push(p.tiny_image);
  if (p.small_image) images.push(p.small_image);

  // Determine category
  let categoryName = "티셔츠"; // Default fallback
  if (p.categories && p.categories.length > 0) {
    for (const cat of p.categories) {
      if (categoryMap[cat.category_no]) {
        categoryName = getCategoryFromName(categoryMap[cat.category_no], p.product_name);
        break;
      }
    }
  } else {
    categoryName = getCategoryFromName("", p.product_name);
  }

  // Parse options for colors and sizes
  const colorOptions: string[] = [];
  const sizeOptions: string[] = [];

  if (optionsList && optionsList.length > 0) {
    optionsList.forEach((opt: any) => {
      const name = opt.option_name;
      const values = opt.option_value || [];
      if (name.includes("색상") || name.toLowerCase().includes("color")) {
        values.forEach((v: any) => {
          const colorName = v.option_text;
          if (!colorOptions.includes(colorName)) {
            colorOptions.push(colorName);
          }
        });
      } else if (name.includes("사이즈") || name.toLowerCase().includes("size")) {
        values.forEach((v: any) => {
          const sizeName = v.option_text;
          if (!sizeOptions.includes(sizeName)) {
            sizeOptions.push(sizeName);
          }
        });
      }
    });
  }

  // Construct colors array
  const colors: any[] = [];
  if (colorOptions.length > 0) {
    const colorOptObj = optionsList.find((opt: any) => 
      opt.option_name.includes("색상") || opt.option_name.toLowerCase().includes("color")
    );
    
    colorOptions.forEach((colorName) => {
      const valueEntry = colorOptObj?.option_value?.find(
        (v: any) => v.option_text === colorName
      );
      
      const image = valueEntry && (valueEntry.option_link_image || valueEntry.option_image_file)
        ? (valueEntry.option_link_image || valueEntry.option_image_file)
        : (p.detail_image || p.list_image || "");
        
      colors.push({
        name: colorName,
        hex: (valueEntry?.option_color && valueEntry.option_color !== "") ? valueEntry.option_color : getHexColor(colorName),
        image: image
      });
    });
  } else {
    // Fallback if no colors found
    colors.push({
      name: "기본",
      hex: "#ffffff",
      image: p.detail_image || p.list_image || ""
    });
  }

  // Add additional images as extra cuts to colors to let users click and preview
  if (p.additionalimages && p.additionalimages.length > 0) {
    p.additionalimages.forEach((img: any, index: number) => {
      const imageUrl = img.additional_image;
      if (imageUrl && !colors.some(c => c.image === imageUrl)) {
        colors.push({
          name: `상세컷 ${index + 1}`,
          hex: "#d1d5db",
          image: imageUrl
        });
      }
    });
  }

  return {
    id: p.product_no.toString(),
    name: p.product_name,
    brand: getBrandFromCode(p.brand_code, p.product_name),
    category: categoryName,
    tagline: p.summary_description || p.simple_description || p.product_name,
    description: p.description || p.product_name,
    basePrice: Math.round(parseFloat(p.price || p.retail_price || "0")),
    colors,
    sizes: sizeOptions.length > 0 ? sizeOptions : ["S", "M", "L", "XL", "2XL"],
    sizeUpcharges: {}
  };
}

/**
 * Fetches all products from Cafe24 and maps them to the Product interface.
 */
export async function fetchMappedProducts() {
  try {
    // 1. Fetch categories to build the map
    const categoryData = await cafe24Fetch("/categories");
    const categoryMap: Record<number, string> = {};
    if (categoryData && categoryData.categories) {
      categoryData.categories.forEach((cat: any) => {
        categoryMap[cat.category_no] = cat.category_name;
      });
    }

    // 2. Fetch products with embedded additionalimages
    const productData = await cafe24Fetch("/products?limit=100&embed=additionalimages");
    const productsList = productData?.products || [];

    // 3. Fetch options for each product concurrently
    const productsMapped = await Promise.all(
      productsList.map(async (p: any) => {
        try {
          const optionsData = await cafe24Fetch(`/products/${p.product_no}/options`);
          return mapCafe24Product(p, categoryMap, optionsData?.option?.options || []);
        } catch (err) {
          console.warn(`[Cafe24] Failed to fetch options for product ${p.product_no}:`, err);
          return mapCafe24Product(p, categoryMap, []);
        }
      })
    );

    return productsMapped;
  } catch (error) {
    console.error("[Cafe24] Error fetching/mapping products:", error);
    return [];
  }
}

/**
 * Fetches a single product details by product_no and maps it.
 */
export async function fetchMappedProductById(id: string) {
  try {
    // 1. Fetch categories to build the map
    const categoryData = await cafe24Fetch("/categories");
    const categoryMap: Record<number, string> = {};
    if (categoryData && categoryData.categories) {
      categoryData.categories.forEach((cat: any) => {
        categoryMap[cat.category_no] = cat.category_name;
      });
    }

    // 2. Fetch product details with embedded additionalimages
    const productData = await cafe24Fetch(`/products/${id}?embed=additionalimages`);
    const product = productData?.product;

    if (!product) return null;

    // 3. Fetch product options
    let optionsList: any[] = [];
    try {
      const optionsData = await cafe24Fetch(`/products/${id}/options`);
      optionsList = optionsData?.option?.options || [];
    } catch (err) {
      console.warn(`[Cafe24] Failed to fetch options for product ${id}:`, err);
    }

    // 4. Map product
    return mapCafe24Product(product, categoryMap, optionsList);
  } catch (error) {
    console.error(`[Cafe24] Error fetching product ${id}:`, error);
    return null;
  }
}
