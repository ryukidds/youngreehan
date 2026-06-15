import React from "react";
import { notFound, redirect } from "next/navigation";
import { getQuoteById } from "@/lib/db";
import QuoteDetailClient from "./QuoteDetailClient";
import { isAdminUser } from "@/lib/session";

interface AdminQuotePageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminQuotePage({ params }: AdminQuotePageProps) {
  const admin = await isAdminUser();
  if (!admin) {
    redirect("/login");
  }

  const { id } = await params;
  const quote = await getQuoteById(id);

  if (!quote) {
    notFound();
  }

  return <QuoteDetailClient quote={quote} />;
}
