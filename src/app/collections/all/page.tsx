"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import styles from "./collections.module.css";

export default function CollectionsAllPage() {
  // Framer Motion Custom Transition
  const customTransition = {
    duration: 0.85,
    ease: [0.16, 1, 0.3, 1],
  } as const;

  return (
    <div className={styles.container}>
      <div className={styles.mainLayout}>
        {/* Left Column: Kept empty for spacing layout consistency */}
        <aside className={styles.sidebar}>
          {/* Empty space as requested by the user */}
        </aside>

        {/* Right Column: Main Content Area */}
        <main className={styles.contentArea}>
          <div className={styles.galleryHeader}>
            <h1 className={styles.pageTitle}>ALL PRODUCTS</h1>
          </div>

          <div className={styles.productGrid}>
            {products.length === 0 ? (
              <div className={styles.noProducts}>
                등록된 상품이 없습니다.
              </div>
            ) : (
              products.map((product, idx) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <motion.div
                    className={styles.productWrapper}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ ...customTransition, delay: idx * 0.08 }}
                  >
                    {/* Card box containing the image cutout, centered on gray background */}
                    <div className={styles.productCard}>
                      <div className={styles.imageWrapper}>
                        <Image
                          src={product.colors[0].image}
                          alt={product.name}
                          width={400}
                          height={533} // Matches the 3:4 aspect ratio approximately
                          className={styles.productImage}
                          priority={idx < 3}
                        />
                      </div>
                    </div>

                    {/* Captions placed OUTSIDE the card box (Image -> Brand -> Product Name -> Price) */}
                    <div className={styles.cardCaption}>
                      <span className={styles.brandLabel}>{product.brand}</span>
                      <h3 className={styles.productName}>{product.name}</h3>
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
