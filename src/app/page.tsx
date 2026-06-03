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
                {heroImages.map((src, index) => (
                  <motion.div
                    key={index}
                    className={styles.heroImageWrapper}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: index === activeImageIdx ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={src}
                      alt={`영리한 룩북 이미지 ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 320px, 480px"
                      priority={index === 0}
                      className={styles.heroCenterImage}
                    />
                  </motion.div>
                ))}
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

          {/* Card 2: Gradient background */}
          <div className={styles.featureCard}>
            <div className={`${styles.cardVisual} ${styles.visualPattern}`}>
              {/* Plain gradient wave background with no floating elements */}
            </div>
            <p className={styles.cardCaption}>
              팀의 개성을 돋보이게 할 다채로운 라이프스타일 웨어 제안
            </p>
          </div>

          {/* Card 3: Instant Quote Widget */}
          <div className={styles.featureCard}>
            <div className={`${styles.cardVisual} ${styles.visualImage}`}>
              <div className={styles.offersMockup}>
                {/* Mock Search Bar */}
                <div className={styles.mockSearchBar}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#a1a1aa" strokeWidth="2.5" className={styles.searchIcon}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <div className={styles.mockSearchTextPlaceholder} />
                </div>
                
                {/* Grid Layout */}
                <div className={styles.offersGrid}>
                  {/* Left Column */}
                  <div className={styles.offersLeftCol}>
                    <div className={styles.greenCard}>
                      <div className={styles.greenCardLine1} />
                      <div className={styles.greenCardLine2} />
                    </div>
                    <div className={styles.smallOfferCard}>
                      <div className={styles.blackCircleIcon}>
                        {/* Car / Taxi Icon */}
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#ffffff" strokeWidth="2.5">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <div className={styles.mockTextLine} />
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className={styles.offersRightCol}>
                    <div className={styles.smallOfferCard}>
                      <div className={styles.blackCircleIcon}>
                        {/* Coffee Cup Icon */}
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#ffffff" strokeWidth="2.5">
                          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
                          <line x1="6" y1="2" x2="6" y2="4" />
                          <line x1="10" y1="2" x2="10" y2="4" />
                          <line x1="14" y1="2" x2="14" y2="4" />
                        </svg>
                      </div>
                      <div className={styles.mockTextLine} />
                    </div>
                    
                    <div className={styles.tallOfferCard}>
                      <div className={styles.iconContainerWithCheck}>
                        <div className={styles.blackCircleIcon}>
                          {/* Clothing / Shirt Icon */}
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#ffffff" strokeWidth="2.5">
                            <path d="M20.38 3.46L16 6a2 2 0 01-2-2V2H10v2a2 2 0 01-2 2L3.62 3.46a2 2 0 00-2.54.85l-1 1.73a2 2 0 00.75 2.74L4 10.27V19a2 2 0 002 2h12a2 2 0 002-2v-8.73l3.17-1.49a2 2 0 00.75-2.74l-1-1.73a2 2 0 00-2.54-.85z" />
                          </svg>
                        </div>
                        <div className={styles.checkBadge}>
                          <svg viewBox="0 0 24 24" width="6" height="6" fill="none" stroke="#00d632" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      </div>
                      <div className={styles.mockTextLineLong} />
                      <div className={styles.mockTextLineShort} />
                    </div>
                  </div>
                </div>

                {/* Categories Divider Line */}
                <div className={styles.categoriesHeaderMock} />

                {/* Categories Grid */}
                <div className={styles.categoriesGrid}>
                  <div className={styles.categoryCard}>
                    {/* Glasses Icon */}
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#000000" strokeWidth="2.5">
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="12" r="3" />
                      <path d="M9 12h6" />
                      <path d="M3 12a9 9 0 0 1 18 0" />
                    </svg>
                    <div className={styles.mockCategoryText} />
                  </div>
                  <div className={styles.categoryCard}>
                    {/* Shirt Icon */}
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#000000" strokeWidth="2.5">
                      <path d="M20.38 3.46L16 6a2 2 0 01-2-2V2H10v2a2 2 0 01-2 2L3.62 3.46a2 2 0 00-2.54.85l-1 1.73a2 2 0 00.75 2.74L4 10.27V19a2 2 0 002 2h12a2 2 0 002-2v-8.73l3.17-1.49a2 2 0 00.75-2.74l-1-1.73a2 2 0 00-2.54-.85z" />
                    </svg>
                    <div className={styles.mockCategoryText} />
                  </div>
                </div>
              </div>
            </div>
            <p className={styles.cardCaption}>
              누구나 쉽고 편리하게 확인하는 실시간 견적
            </p>
          </div>

          {/* Card 4: Delivery Timeline Tracker */}
          <div className={styles.featureCard}>
            <div className={`${styles.cardVisual} ${styles.visualNotification}`}>
              <div className={styles.deliveryContainer}>
                <div className={styles.deliveryCard}>
                  <div className={styles.deliveryStatus}>
                    <span className={styles.deliveryPulse} />
                    <span className={styles.deliveryStatusText}>다이렉트 당일 배송 중</span>
                  </div>
                  <div className={styles.deliveryTimeline}>
                    <div className={`${styles.timelineStep} ${styles.stepDone}`}>
                      <div className={styles.stepCircle}>✓</div>
                      <span className={styles.stepLabel}>제작 완료</span>
                    </div>
                    <div className={styles.timelineLine} />
                    <div className={`${styles.timelineStep} ${styles.stepActive}`}>
                      <div className={styles.stepCircle}>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="1" y="3" width="15" height="13" />
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                          <circle cx="5.5" cy="18.5" r="2.5" />
                          <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                      </div>
                      <span className={styles.stepLabel}>직출고 배송</span>
                    </div>
                    <div className={styles.timelineLine} />
                    <div className={styles.timelineStep}>
                      <div className={styles.stepCircle} />
                      <span className={styles.stepLabel}>당일 도착</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className={styles.cardCaption}>
              기다림을 최소화한 빠르고 안전한 다이렉트 배송 시스템
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
          <div className={`${styles.sectionRight} ${styles.desktopOnly}`}>
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

        {/* Mobile-Only Learn More Button at the bottom */}
        <div className={`${styles.mobileOnly} ${styles.learnMoreBtnMobileWrapper}`}>
          <Link href="/collections/all" className={styles.learnMoreBtn}>
            더 알아보기
          </Link>
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
