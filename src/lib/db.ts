import fs from "fs/promises";
import path from "path";

export interface Quote {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  colorName: string;
  quantities: Record<string, number>;
  colorQuantities?: Record<string, Record<string, number>>;
  hasPrint: boolean;
  printMethods: string[];
  selectedPositions: number[];
  fileName: string;
  fileUrl: string;
  requests: string;
  subtotal: number;
  discountAmount: number;
  printFee: number;
  totalPrice: number;
  status: "PENDING" | "APPROVED" | "PAID" | "REJECTED";
  paymentUrl?: string;
  productNo?: number | null;
  comments?: QuoteComment[];
  writerName?: string;
  password?: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteComment {
  id: string;
  sender: "USER" | "ADMIN";
  senderId: string;
  message: string;
  createdAt: string;
}

const DB_PATH = path.join(process.cwd(), "src/data/quotes.json");

// Helper to guarantee the JSON file exists
async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    // If file doesn't exist, create it with an empty array
    const dir = path.dirname(DB_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify([], null, 2), "utf-8");
  }
}

export async function getQuotes(): Promise<Quote[]> {
  await ensureDb();
  const data = await fs.readFile(DB_PATH, "utf-8");
  try {
    return JSON.parse(data) as Quote[];
  } catch {
    return [];
  }
}

export async function getQuoteById(id: string): Promise<Quote | undefined> {
  const quotes = await getQuotes();
  return quotes.find((q) => q.id === id);
}

export async function saveQuote(quote: Omit<Quote, "id" | "createdAt" | "updatedAt" | "status">): Promise<Quote> {
  const quotes = await getQuotes();
  
  const newQuote: Quote = {
    ...quote,
    id: `Q-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  quotes.push(newQuote);
  await fs.writeFile(DB_PATH, JSON.stringify(quotes, null, 2), "utf-8");
  return newQuote;
}

export async function updateQuote(id: string, updates: Partial<Omit<Quote, "id" | "createdAt">>): Promise<Quote | undefined> {
  const quotes = await getQuotes();
  const index = quotes.findIndex((q) => q.id === id);
  if (index === -1) return undefined;

  const updatedQuote: Quote = {
    ...quotes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  quotes[index] = updatedQuote;
  await fs.writeFile(DB_PATH, JSON.stringify(quotes, null, 2), "utf-8");
  return updatedQuote;
}
