"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import { products } from "@/data/products";

const heroImages = [
  "/images/hero/hero1.jpg",
  "/images/hero/hero2.jpg",
  "/images/hero/hero3.jpg",
  "/images/hero/hero4.jpg",
];

export default function Home() {
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA once we scroll past 50% of viewport height
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowFloatingCta(true);
      } else {
        setShowFloatingCta(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Map scroll progress [0, 1] to index 0, 1, 2, 3
    let index = Math.floor(latest * 4);
    if (index > 3) index = 3;
    if (index < 0) index = 0;
    setActiveImageIdx(index);
  });

  // Framer Motion Custom Transition
  const customTransition = {
    duration: 0.95,
    ease: [0.16, 1, 0.3, 1], // Cash App slick bezier ease-out
  } as const;

  return (
    <div className={styles.container}>
      {/* 3-Column Hero Section with Sticky Scroll */}
      <div className={styles.heroScrollContainer} ref={scrollContainerRef}>
        <section className={styles.hero}>
          <div className={styles.gridPattern} />

          <div className={styles.heroLayout}>
            {/* Left Column: Title */}
            <motion.div
              className={styles.heroLeft}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={customTransition}
            >
              <h1 className={styles.title}>
                복잡한 티셔츠 제작 <br />
                영리하게 원스톱으로
              </h1>
            </motion.div>

            {/* Center Column: Round image container with sequential scroll images */}
            <motion.div
              className={styles.heroCenter}
              initial={{ opacity: 0, y: 70, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...customTransition, delay: 0.1 }}
            >
              <div className={styles.imageBox}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIdx}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.heroImageWrapper}
                  >
                    <Image
                      src={heroImages[activeImageIdx]}
                      alt={`영리한 룩북 이미지 ${activeImageIdx + 1}`}
                      fill
                      sizes="320px"
                      priority
                      className={styles.heroCenterImage}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Right Column: Description & Inquire CTA */}
            <motion.div
              className={styles.heroRight}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...customTransition, delay: 0.2 }}
            >
              <p className={styles.subtitle}>
                제작부터 배송까지, 영리하게. 견적 비교하느라 시간 낭비하지 마세요.
                고품질 원단 선정, 고정밀 인쇄 기법, 문앞까지 배송까지 영리한 솔루션이 책임집니다.
              </p>
              <Link
                href="https://pf.kakao.com/_xbYwGX"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.heroCta}
              >
                <span>견적 문의하기</span>
                <ArrowRight className={styles.ctaArrow} size={16} />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Desktop-Only Feature Showcase Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresHeader}>
          <div className={styles.featuresTitleWrapper}>
            <h2 className={styles.featuresTitle}>필요할 때, 필요한 만큼 영리하게</h2>
            <p className={styles.featuresSubtitle}>
              디자인 구상부터 최종 배송까지, 가장 스마트하고 유연한 방식으로 단체티와 굿즈를 기획하세요.
            </p>
          </div>
          <Link href="/collections/all" className={styles.featuresLearnMore}>
            더 알아보기
          </Link>
        </div>

        <div className={styles.featuresGrid}>
          {/* Card 1: Cobalt Blue rounded card with "10장+" oval pill */}
          <div className={styles.featureCard}>
            <div className={`${styles.cardVisual} ${styles.visualBlue}`}>
              <div className={styles.ovalPill}>10장+</div>
            </div>
            <p className={styles.cardCaption}>
              소량 제작도 부담 없이 10장부터 시작하세요
            </p>
          </div>

          {/* Card 2: Minimalist T-shirt Pattern (SVG) */}
          <div className={styles.featureCard}>
            <div className={`${styles.cardVisual} ${styles.visualPattern}`}>
              <svg viewBox="0 0 200 200" className={styles.tshirtPatternSvg}>
                <pattern id="shirt-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 10,8 L 14,10 L 16,7 L 24,7 L 26,10 L 30,8 L 32,13 L 29,14 L 29,32 L 11,32 L 11,14 L 8,13 Z"
                    fill="none"
                    stroke="#a1a1aa"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#shirt-pattern)" />
              </svg>
            </div>
            <p className={styles.cardCaption}>
              단체복부터 다채로운 라이프스타일 굿즈 라인업 지원
            </p>
          </div>

          {/* Card 3: Product image fill (using tshirt mockup) */}
          <div className={styles.featureCard}>
            <div className={`${styles.cardVisual} ${styles.visualImage}`}>
              <Image
                src="/images/tshirt.png"
                alt="영리한 무지 티셔츠 샘플"
                width={300}
                height={300}
                className={styles.visualProductImg}
              />
            </div>
            <p className={styles.cardCaption}>
              고품질 친환경 코튼 원단과 탄탄한 이중 봉제 마감
            </p>
          </div>

          {/* Card 4: Gradient / cobalt blue backdrop with floating paycheck-style card */}
          <div className={styles.featureCard}>
            <div className={`${styles.cardVisual} ${styles.visualNotification}`}>
              <div className={styles.notificationBubble}>
                <div className={styles.notificationIcon}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className={styles.notificationText}>
                  <div className={styles.notificationTitle}>무료 배송 출발</div>
                  <div className={styles.notificationTime}>방금 전</div>
                </div>
              </div>
            </div>
            <p className={styles.cardCaption}>
              제작 완료 즉시 문앞까지 도달하는 실시간 배송 서비스
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className={styles.productsSection}>
        {/* Section Header */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className={styles.sectionTitle}>
            제작부터 배송까지 완료되는<br />
            주요 품목을 직접 확인하세요
          </h2>
          <div className={styles.sectionRight}>
            <Link href="/collections/all" className={styles.learnMoreBtn}>
              더 알아보기
            </Link>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {products.slice(0, 4).map((product, idx) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <motion.div
                className={styles.productWrapper}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ ...customTransition, delay: idx * 0.15 }}
              >
                {/* Square Card Box - Full image, no text overlays */}
                <div className={styles.productCard}>
                  <div className={styles.imageWrapper}>
                    {product.colors.length > 0 && product.colors[0].image ? (
                      <Image
                        src={product.colors[0].image}
                        alt={product.name}
                        width={500}
                        height={500}
                        className={styles.productImage}
                        priority={idx === 0}
                      />
                    ) : (
                      <div className={styles.noImagePlaceholderHome}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className={styles.noImageIconHome}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.9 2.9m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z"
                          />
                        </svg>
                        <span>NO IMAGE</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Caption placed OUTSIDE the card box */}
                <div className={styles.cardCaption}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productMeta}>
                    <span>{product.category}</span>
                    <span> &middot; </span>
                    <span>₩{product.basePrice.toLocaleString()}원부터</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mobile Floating CTA - Blue Large Button Style (Permanently Fixed on Mobile) */}
      <div className={styles.floatingCtaContainer}>
        <Link
          href="https://pf.kakao.com/_xbYwGX"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.floatingCta}
        >
          <span>견적 문의하기</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
