import React from "react";
import { notFound } from "next/navigation";
import { getQuoteById } from "@/lib/db";
import QuoteInquiryPostClient from "./QuoteInquiryPostClient";
import { getCurrentUser, isAdminUser } from "@/lib/session";
import { cookies } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function QuoteInquiryPostPage({ params }: PageProps) {
  const { id } = await params;
  const quote = await getQuoteById(id);

  if (!quote) {
    notFound();
  }

  // Security Gate checks on Server-side render
  const isAdmin = await isAdminUser();
  const currentUser = await getCurrentUser();
  const isOwner = currentUser && quote.userId && currentUser.toLowerCase() === quote.userId.toLowerCase();
  
  const cookieStore = await cookies();
  const isAuthorizedByCookie = cookieStore.get(`authorized_quote_${id}`)?.value === "true";

  const hasPassword = !!quote.password;
  const isAuthorized = !hasPassword || isAdmin || isOwner || isAuthorizedByCookie;

  if (!isAuthorized) {
    // Return a stripped-down version of the quote for the password gate
    const strippedQuote = {
      id: quote.id,
      userId: quote.userId,
      writerName: quote.writerName,
      title: quote.title,
      productName: quote.productName,
      createdAt: quote.createdAt,
      hasPassword: true,
      isAuthorizedInitial: false,
    };
    return <QuoteInquiryPostClient quote={strippedQuote as any} />;
  }

  // Authorized: strip only the password field
  const { password: _, ...quoteWithoutPassword } = quote;
  const authorizedQuote = {
    ...quoteWithoutPassword,
    hasPassword,
    isAuthorizedInitial: true,
  };

  return <QuoteInquiryPostClient quote={authorizedQuote as any} />;
}
