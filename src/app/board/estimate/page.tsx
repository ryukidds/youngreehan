import React from "react";
import { getQuotes } from "@/lib/db";
import EstimateBoardClient from "./EstimateBoardClient";

export const dynamic = "force-dynamic";

export default async function EstimateBoardPage() {
  const quotes = await getQuotes();
  // Sort quotes by date descending
  const sortedQuotes = quotes.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Strip all sensitive fields from quotes to prevent information disclosure in list views
  const strippedQuotes = sortedQuotes.map((q) => {
    // Only return fields required for list rendering, searching, and checking admin replies
    return {
      id: q.id,
      userId: q.userId,
      writerName: q.writerName,
      title: q.title,
      productName: q.productName,
      createdAt: q.createdAt,
      comments: q.comments
        ? q.comments
            .filter((c) => c.sender === "ADMIN")
            .map((c) => ({
              id: c.id,
              sender: c.sender,
              createdAt: c.createdAt,
            }))
        : [],
    };
  });

  return <EstimateBoardClient initialQuotes={strippedQuotes as any} />;
}
