"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import styles from "./collections.module.css";
import ColorSwatches from "@/components/ColorSwatches";

export default function CollectionsAllPage() {
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [hoveredColors, setHoveredColors] = React.useState<Record<string, number | null>>({});

  // Get unique brands and product counts dynamically
  const uniqueBrands = React.useMemo(() => {
    const brands = products.map((p) => p.brand);
    return Array.from(new Set(brands)).sort();
  }, []);

  const brandCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, []);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = React.useMemo(() => {
    if (selectedBrands.length === 0) return products;
    return products.filter((p) => selectedBrands.includes(p.brand));
  }, [selectedBrands]);

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
            <h1 className={styles.pageTitle}>ALL PRODUCTS</h1>
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
                    {/* Card box containing the image cutout, centered on gray background */}
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
                              height={533} // Matches the 3:4 aspect ratio approximately
                              className={styles.productImage}
                              priority={idx < 3}
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

                    {/* Captions placed OUTSIDE the card box (Image -> Brand -> Product Name -> Price) */}
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
