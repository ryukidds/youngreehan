import React from "react";
import { notFound } from "next/navigation";
import { getQuoteById } from "@/lib/db";
import QuoteDetailClient from "./QuoteDetailClient";

interface AdminQuotePageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminQuotePage({ params }: AdminQuotePageProps) {
  const { id } = await params;
  const quote = await getQuoteById(id);

  if (!quote) {
    notFound();
  }

  return <QuoteDetailClient quote={quote} />;
}
