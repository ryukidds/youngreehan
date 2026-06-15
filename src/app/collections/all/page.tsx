"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { type Product } from "@/lib/types";
import styles from "./collections.module.css";
import ColorSwatches from "@/components/ColorSwatches";

function CollectionsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(initialCategory);
  const [hoveredColors, setHoveredColors] = React.useState<Record<string, number | null>>({});
  const [displayProducts, setDisplayProducts] = React.useState<Product[]>([]);

  // Sync category from URL on navigation
  React.useEffect(() => {
    const cat = searchParams.get("category") || "";
    setSelectedCategory(cat);
  }, [searchParams]);

  // Load products from Cafe24 API on mount
  React.useEffect(() => {
    async function loadCafe24Products() {
      try {
        const res = await fetch("/api/cafe24/products");
        if (!res.ok) throw new Error("API response error");
        const data = await res.json();
        
        if (data && data.products && data.products.length > 0) {
          console.log(`[Collections] Loaded ${data.products.length} products from Cafe24.`);
          setDisplayProducts(data.products);
        }
      } catch (err) {
        console.warn("[Collections] Failed to load Cafe24 products, using static fallback:", err);
      }
    }
    loadCafe24Products();
  }, []);

  // Get unique brands and product counts dynamically
  const uniqueBrands = React.useMemo(() => {
    const brands = displayProducts.map((p) => p.brand);
    return Array.from(new Set(brands)).sort();
  }, [displayProducts]);

  const brandCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    displayProducts.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, [displayProducts]);

  // Get unique categories
  const uniqueCategories = React.useMemo(() => {
    const categories = displayProducts.map((p) => p.category);
    return Array.from(new Set(categories));
  }, [displayProducts]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? "" : category));
  };

  const filteredProducts = React.useMemo(() => {
    let result = displayProducts;
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    return result;
  }, [displayProducts, selectedBrands, selectedCategory]);

  // Framer Motion Custom Transition
  const customTransition = {
    duration: 0.85,
    ease: [0.16, 1, 0.3, 1],
  } as const;

  return (
    <div className={styles.container}>
      <div className={styles.mainLayout}>
        {/* Left Column: Sidebar Filters */}
        <aside className={styles.sidebar}>
          {/* Category Filter */}
          <div className={styles.filterHeader}>
            <span>카테고리</span>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.categoryPills}>
              {uniqueCategories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.categoryPill} ${selectedCategory === cat ? styles.categoryPillActive : ""}`}
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className={styles.filterHeader}>
            <span>브랜드 필터</span>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.checkboxList}>
              {uniqueBrands.map((brand) => (
                <label key={brand} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  <span className={styles.brandNameText}>
                    {brand} <span className={styles.brandCount}>({brandCounts[brand]})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Column: Main Content Area */}
        <main className={styles.contentArea}>
          <div className={styles.galleryHeader}>
            <h1 className={styles.pageTitle}>
              {selectedCategory || "ALL PRODUCTS"}
            </h1>
          </div>

          <div className={styles.productGrid}>
            {filteredProducts.length === 0 ? (
              <div className={styles.noProducts}>
                조건에 맞는 상품이 없습니다.
              </div>
            ) : (
              filteredProducts.map((product, idx) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <motion.div
                    className={styles.productWrapper}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ ...customTransition, delay: idx * 0.05 }}
                  >
                    <div className={styles.productCard}>
                      <div className={styles.imageWrapper}>
                        {(() => {
                          const hoveredColorIdx = hoveredColors[product.id];
                          let imageSrc = product.colors.length > 0 && product.colors[0].image ? product.colors[0].image : "";
                          
                          if (hoveredColorIdx !== undefined && hoveredColorIdx !== null && product.colors[hoveredColorIdx]) {
                            imageSrc = product.colors[hoveredColorIdx].image;
                          }

                          return imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={product.name}
                              width={400}
                              height={533}
                              className={styles.productImage}
                              priority={idx < 3}
                              unoptimized={true}
                            />
                          ) : (
                            <div className={styles.noImagePlaceholder}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={styles.noImageIcon}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.9 2.9m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z"
                                />
                              </svg>
                              <span>NO IMAGE</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className={styles.cardCaption}>
                      <span className={styles.brandLabel}>{product.brand}</span>
                      <h3 className={styles.productName}>{product.name}</h3>
                      
                      <div className={styles.swatchArea}>
                        <ColorSwatches
                          colors={product.colors}
                          onHoverColor={(colorIdx) => {
                            setHoveredColors((prev) => ({
                              ...prev,
                              [product.id]: colorIdx,
                            }));
                          }}
                        />
                      </div>

                      <span className={styles.priceLabel}>
                        {product.basePrice.toLocaleString()}원
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CollectionsAllPage() {
  return (
    <Suspense>
      <CollectionsContent />
    </Suspense>
  );
}
