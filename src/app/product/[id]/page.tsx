import React from "react";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { fetchMappedProductById } from "@/lib/cafe24";

// Force dynamic rendering since we pull real-time options/data from Cafe24
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  
  let product = null;
  try {
    product = await fetchMappedProductById(id);
  } catch (err) {
    console.error(`[Product Page] Failed to fetch product ${id} from Cafe24:`, err);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

