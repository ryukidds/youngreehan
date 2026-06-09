"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Minus, Send, Check, Upload } from "lucide-react";
import { Product } from "@/data/products";
import GarmentHotspots from "@/components/GarmentHotspots";
import styles from "./product.module.css";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    product.sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
  );
  
  const [activeTab, setActiveTab] = useState("detail");

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-140px 0px -50% 0px", // Offset to adjust sticky header height
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const sections = ["detail", "info", "guide"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getSizeSpecs = (size: string) => {
    const specs: Record<string, { chest: number; length: number; shoulder: number; sleeve: number }> = {
      "110": { chest: 34, length: 44, shoulder: 29, sleeve: 13 },
      "120": { chest: 36, length: 48, shoulder: 31, sleeve: 14 },
      "130": { chest: 38, length: 52, shoulder: 33, sleeve: 15 },
      "140": { chest: 40, length: 56, shoulder: 35, sleeve: 16 },
      "150": { chest: 43, length: 60, shoulder: 38, sleeve: 17 },
      "160": { chest: 46, length: 63, shoulder: 41, sleeve: 18 },
      "XS":  { chest: 46, length: 63, shoulder: 41, sleeve: 18 },
      "S":   { chest: 49, length: 66, shoulder: 44, sleeve: 19 },
      "M":   { chest: 52, length: 70, shoulder: 47, sleeve: 20 },
      "L":   { chest: 55, length: 74, shoulder: 50, sleeve: 22 },
      "XL":  { chest: 58, length: 78, shoulder: 53, sleeve: 24 },
      "2XL": { chest: 61, length: 82, shoulder: 56, sleeve: 26 },
      "3XL": { chest: 64, length: 84, shoulder: 59, sleeve: 26 },
      "4XL": { chest: 67, length: 85, shoulder: 62, sleeve: 27 },
      "5XL": { chest: 70, length: 86, shoulder: 65, sleeve: 27 },
    };
    return specs[size.toUpperCase()] || { chest: 50, length: 70, shoulder: 45, sleeve: 20 };
  };
  
  // Printing options state
  const [hasPrint, setHasPrint] = useState<boolean>(true); // Default: With Print
  const [printMethods, setPrintMethods] = useState<string[]>(["나염"]); // Default Screen Print
  const [selectedPositions, setSelectedPositions] = useState<number[]>([3]); // Default Front Center (3)
  const [requests, setRequests] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleQtyChange = (size: string, increment: number) => {
    setQuantities((prev) => ({
      ...prev,
      [size]: Math.max(0, prev[size] + increment),
    }));
  };

  const handleToggleMethod = (method: string) => {
    setPrintMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleTogglePosition = (id: number) => {
    setSelectedPositions((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  // Option text converters
  const getPositionName = (id: number) => {
    const names: Record<number, string> = {
      1: "오른가슴",
      2: "왼가슴",
      3: "앞중앙",
      4: "등중앙",
      5: "등하단",
      6: "왼팔뚝",
      7: "오른팔뚝",
      8: "등목밑",
      9: "앞하단"
    };
    return names[id] || `위치 ${id}`;
  };

  // Pricing calculations
  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);

  // Subtotal with size modifiers
  const subtotal = Object.entries(quantities).reduce((acc, [size, qty]) => {
    const sizeModifier = product.sizeUpcharges?.[size] || 0;
    return acc + qty * (product.basePrice + sizeModifier);
  }, 0);

  // Bulk discount rate
  let discountRate = 0;
  if (totalQty >= 100) discountRate = 0.25;
  else if (totalQty >= 50) discountRate = 0.15;
  else if (totalQty >= 30) discountRate = 0.10;
  else if (totalQty >= 10) discountRate = 0.05;

  const discountAmount = subtotal * discountRate;

  // Print fee calculation:
  // Base printing fee of ₩1,500 per unit if print is selected
  // Each additional position adds ₩500 per unit
  // Embroidery (자수) adds an extra ₩1,000 per unit
  let printFeePerUnit = 0;
  if (hasPrint && totalQty > 0) {
    const baseFee = 1500;
    const additionalPositionFee = Math.max(0, selectedPositions.length - 1) * 500;
    const embroideryExtra = printMethods.includes("자수") ? 1000 : 0;
    printFeePerUnit = baseFee + additionalPositionFee + embroideryExtra;
  }
  const printFee = totalQty * printFeePerUnit;

  const finalTotal = subtotal - discountAmount + printFee;

  const getQuoteText = (actionType: "주문" | "문의") => {
    const sizeDetails = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([size, qty]) => {
        const upcharge = product.sizeUpcharges?.[size] || 0;
        const extra = upcharge > 0 ? ` (+₩${upcharge.toLocaleString()})` : "";
        return `- ${size}${extra} 사이즈: ${qty}개`;
      })
      .join("\n");

    const positionsText = selectedPositions
      .map((id) => `${id}. ${getPositionName(id)}`)
      .join(", ");

    const discountText = discountRate > 0 ? ` (${(discountRate * 100)}% 단체 할인 적용)` : "";

    return `[영리한 - ${actionType} 접수 안내]
--------------------------------
■ 요청 품목: ${product.name}
■ 선택 색상: ${selectedColor.name}
■ 상세 수량:
${sizeDetails || "- 선택된 수량 없음 (카카오톡 채팅으로 수량 조율)"}
■ 프린팅 정보:
- 인쇄 여부: ${hasPrint ? "인쇄있음" : "인쇄없음"}
${hasPrint ? `- 인쇄 방법: ${printMethods.join(", ") || "선택없음"}` : ""}
${hasPrint ? `- 인쇄 위치: ${positionsText || "선택없음"}` : ""}
■ 첨부 파일: ${fileName || "없음"}
■ 기타 요청: ${requests || "없음"}
--------------------------------
■ 총 주문 수량: ${totalQty}개
■ 총 예상 견적: ₩${finalTotal.toLocaleString()}원${discountText}
--------------------------------
※ 견적을 복사하여 카카오톡 채널에 전달해주시면 빠르게 안내해 드리겠습니다.`;
  };

  const handleCtaClick = async (actionType: "주문" | "문의") => {
    if (totalQty === 0) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("productId", product.id);
      formData.append("productName", product.name);
      formData.append("colorName", selectedColor.name);
      formData.append("quantities", JSON.stringify(quantities));
      formData.append("hasPrint", String(hasPrint));
      formData.append("printMethods", JSON.stringify(hasPrint ? printMethods : []));
      formData.append("selectedPositions", JSON.stringify(hasPrint ? selectedPositions : []));
      formData.append("requests", requests);
      formData.append("subtotal", String(subtotal));
      formData.append("discountAmount", String(discountAmount));
      formData.append("printFee", String(printFee));
      formData.append("totalPrice", String(finalTotal));

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetch("/api/quotes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // Copy to clipboard as a helpful helper
        const text = getQuoteText(actionType);
        await navigator.clipboard.writeText(text);

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Redirect to mypage
        setTimeout(() => {
          window.location.href = "/mypage";
        }, 1500);
      } else {
        alert(`견적 제출 실패: ${data.error || "알 수 없는 에러"}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`견적 접수 중 에러가 발생했습니다: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backBtn}>
        <ArrowLeft size={16} /> 메인으로 돌아가기
      </Link>

      <div className={styles.layout}>
        {/* Left: Product Images & Position SVG Map */}
        <div className={styles.imageSection}>
          <div className={styles.imageFrame}>
            <motion.div
              key={selectedColor.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={styles.mainImage}
            >
              {selectedColor.image ? (
                <Image
                  src={selectedColor.image}
                  alt={`${product.name} - ${selectedColor.name}`}
                  width={600}
                  height={600}
                  className={styles.mainImage}
                  priority
                />
              ) : (
                <div className={styles.noImagePlaceholderLarge}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className={styles.noImageIconLarge}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.9 2.9m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z"
                    />
                  </svg>
                  <span>상품 이미지가 준비되지 않았습니다</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Interactive Garment Position Selector */}
          {hasPrint && (
            <div className={styles.optionGroup}>
              <div className={styles.optionHeader}>
                <span className={styles.optionLabel}>인쇄 위치 시각화</span>
                <span className={styles.helpText}>아래 그림의 원형 번호를 클릭하여 부위를 선택하세요.</span>
              </div>
              <GarmentHotspots
                productId={product.id}
                selectedPositions={selectedPositions}
                onTogglePosition={handleTogglePosition}
              />
            </div>
          )}
        </div>

        {/* Right: Product Details & Options */}
        <div className={styles.detailsSection}>
          <div className={styles.headerInfo}>
            <span className={styles.brand}>{product.brand}</span>
            <h1 className={styles.title}>{product.name}</h1>
            <div className={styles.priceRow}>
              <span className={styles.priceUnit}>1개당</span>
              <span className={styles.priceVal}>₩{product.basePrice.toLocaleString()}원</span>
            </div>
            <div className={styles.ratingRow}>
              <span className={styles.ratingStar}>★</span>
              <span>4.9</span>
              <span className={styles.divider}>|</span>
              <span className={styles.reviewsCount}>리뷰 3,795개</span>
            </div>
            <p className={styles.description}>{product.description}</p>
          </div>

          {/* Color Picker */}
          <div className={styles.optionGroup}>
            <div className={styles.optionHeader}>
              <span className={styles.optionLabel}>색상</span>
              <span className={styles.optionValue}>{selectedColor.name}</span>
            </div>
            <div className={styles.colorPicker}>
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`${styles.colorDotBtn} ${
                    selectedColor.name === color.name ? styles.active : ""
                  }`}
                  title={color.name}
                >
                  <span
                    className={styles.colorInner}
                    style={{
                      backgroundColor: color.hex,
                      border: color.hex.toLowerCase() === "#ffffff" ? "1.5px solid #e4e4e7" : "none"
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Picker (Grid style) */}
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>사이즈 선택 및 추가 수량</span>
            <div className={styles.sizeGrid}>
              {product.sizes.map((size) => {
                const upcharge = product.sizeUpcharges?.[size] || 0;
                const isExtraPrice = upcharge > 0;
                const isSelected = quantities[size] > 0;
                return (
                  <button
                    key={size}
                    onClick={() => handleQtyChange(size, quantities[size] === 0 ? 1 : 0)}
                    className={`${styles.sizeBox} ${isSelected ? styles.active : ""}`}
                  >
                    <span className={styles.sizeName}>{size}</span>
                    {isExtraPrice && <span className={styles.sizePriceText}>+₩{upcharge.toLocaleString()}</span>}
                  </button>
                );
              })}
            </div>

            {/* Steppers for active sizes */}
            {Object.entries(quantities).some(([, qty]) => qty > 0) && (
              <div className={styles.selectedSizesList}>
                {Object.entries(quantities)
                  .filter(([, qty]) => qty > 0)
                  .map(([size, qty]) => (
                    <div key={size} className={styles.selectedSizeRow}>
                      <span className={styles.selectedSizeLabel}>{size} 사이즈</span>
                      <div className={styles.stepper}>
                        <button
                          onClick={() => handleQtyChange(size, -1)}
                          className={styles.stepBtn}
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.stepCount}>{qty}</span>
                        <button
                          onClick={() => handleQtyChange(size, 1)}
                          className={styles.stepBtn}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Printing Option Toggle */}
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>프린팅 옵션</span>
            <div className={styles.printOptionToggleGrid}>
              <button
                onClick={() => setHasPrint(false)}
                className={`${styles.toggleBtn} ${!hasPrint ? styles.active : ""}`}
              >
                인쇄없음
              </button>
              <button
                onClick={() => setHasPrint(true)}
                className={`${styles.toggleBtn} ${hasPrint ? styles.active : ""}`}
              >
                인쇄있음
              </button>
            </div>
          </div>

          {/* Printing Details (methods and location checklists) */}
          {hasPrint && (
            <>
              {/* Print Methods */}
              <div className={styles.optionGroup}>
                <div className={styles.optionHeader}>
                  <span className={styles.optionLabel}>프린팅 방법</span>
                  <span className={styles.helpText}>중복 선택이 가능합니다.</span>
                </div>
                <div className={styles.checkGrid}>
                  {["나염", "전사", "자수", "전문가추천"].map((method) => {
                    const isActive = printMethods.includes(method);
                    return (
                      <button
                        key={method}
                        onClick={() => handleToggleMethod(method)}
                        className={`${styles.checkBtn} ${isActive ? styles.active : ""}`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Print Positions Buttons (Sync with SVG hotspots) */}
              <div className={styles.optionGroup}>
                <div className={styles.optionHeader}>
                  <span className={styles.optionLabel}>프린팅 부위 선택</span>
                  <span className={styles.helpText}>중복 선택이 가능합니다.</span>
                </div>
                <div className={styles.checkGridPosition}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => {
                    const isActive = selectedPositions.includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() => handleTogglePosition(id)}
                        className={`${styles.checkBtn} ${isActive ? styles.active : ""}`}
                      >
                        {id}. {getPositionName(id)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* File Upload mock box */}
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>인쇄 파일 첨부</span>
            <label className={styles.attachmentBox}>
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".ai,.psd,.pdf,.png,.jpg,.zip"
              />
              <Upload size={24} className={styles.attachIcon} />
              <span className={styles.attachLabel}>
                {fileName ? `첨부 완료: ${fileName}` : "컴퓨터에서 파일 선택"}
              </span>
              <span className={styles.attachHelpText}>
                ※ 고화질 인쇄를 위해 인쇄 파일(AI, PSD, PDF, PNG)과 견적서를 첨부해주세요.
              </span>
            </label>
          </div>

          {/* Custom Requests textarea */}
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>요청사항</span>
            <textarea
              className={styles.textarea}
              placeholder="기타 도안 크기나 인쇄 위치 등 세부사항을 입력해주세요."
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
            />
          </div>

          {/* Dynamic Quote Calculator */}
          <div className={styles.calcBox}>
            <span className={styles.optionLabel}>실시간 예상 견적</span>
            <div className={styles.calcRow}>
              <span>기본 상품 합계 ({totalQty}개)</span>
              <span>₩{subtotal.toLocaleString()}원</span>
            </div>
            
            {discountRate > 0 && (
              <div className={styles.calcRow}>
                <span className={styles.discountBadge}>
                  단체 할인 ({(discountRate * 100)}% 적용)
                </span>
                <span className={styles.discountBadge}>
                  -₩{discountAmount.toLocaleString()}원
                </span>
              </div>
            )}

            <div className={styles.calcRow}>
              <span>정밀 인쇄/가공 비용 {hasPrint && `(부위수: ${selectedPositions.length}개)`}</span>
              <span>{printFee > 0 ? `₩${printFee.toLocaleString()}원` : "₩0원"}</span>
            </div>

            <div className={styles.calcTotal}>
              <span className={styles.calcTotalLabel}>예상 총 가격</span>
              <span className={styles.calcTotalVal}>
                ₩{finalTotal.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* Action CTAs - Bold solid Primary Blue and Solid Grey Secondary ghost button */}
          <div className={styles.actionRow}>
            <button
              onClick={() => handleCtaClick("주문")}
              className={styles.orderBtn}
              disabled={totalQty === 0 || isSubmitting}
              style={{ opacity: (totalQty === 0 || isSubmitting) ? 0.4 : 1, cursor: (totalQty === 0 || isSubmitting) ? "not-allowed" : "pointer" }}
            >
              {isSubmitting ? "제출 중..." : "주문하기"} <Send size={16} />
            </button>
            <button
              onClick={() => handleCtaClick("문의")}
              className={styles.inquiryBtn}
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
            >
              {isSubmitting ? "처리 중..." : "상세 견적 문의"}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className={styles.tabContainer}>
        <div className={styles.tabBar}>
          <button
            onClick={() => scrollToSection("detail")}
            className={`${styles.tabBtn} ${activeTab === "detail" ? styles.tabActive : ""}`}
          >
            상세페이지
          </button>
          <button
            onClick={() => scrollToSection("info")}
            className={`${styles.tabBtn} ${activeTab === "info" ? styles.tabActive : ""}`}
          >
            상품정보
          </button>
          <button
            onClick={() => scrollToSection("guide")}
            className={`${styles.tabBtn} ${activeTab === "guide" ? styles.tabActive : ""}`}
          >
            제작가이드
          </button>
        </div>
      </div>

      {/* 1. 상세페이지 섹션 */}
      <section id="detail" className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>PRODUCT DETAIL</h2>
        <p className={styles.sectionSub}>프리미엄 핏과 내구성을 경험해 보세요.</p>
        
        <div className={styles.detailCard}>
          <div className={styles.detailTextContent}>
            <h3>{product.name}</h3>
            <p className={styles.detailTagline}>{product.tagline}</p>
            <p className={styles.detailDesc}>{product.description}</p>
            <div className={styles.detailBadgeRow}>
              <span>정밀 넥라인 리브 마감</span>
              <span>100% 고밀도 프리미엄 원사</span>
              <span>비침 방지 및 형태 안정 가공</span>
            </div>
          </div>
          
          {/* Big Showcase Image Grid */}
          <div className={styles.detailImageGrid}>
            {product.colors.slice(0, 2).map((color, cIdx) => (
              <div key={cIdx} className={styles.detailImageWrapper}>
                {color.image && (
                  <Image
                    src={color.image}
                    alt={`${product.name} - ${color.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.detailShowcaseImg}
                  />
                )}
                <span className={styles.imageColorBadge}>{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 상품정보 섹션 */}
      <section id="info" className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>INFORMATION</h2>
        <p className={styles.sectionSub}>상품 스펙 및 상세 치수를 확인하세요.</p>
        
        <div className={styles.infoGrid}>
          {/* Specification Sheet */}
          <div className={styles.specSheet}>
            <h3>원단 및 스펙 세부정보</h3>
            <table className={styles.specTable}>
              <tbody>
                <tr>
                  <th>브랜드</th>
                  <td>{product.brand}</td>
                </tr>
                <tr>
                  <th>제품 카테고리</th>
                  <td>{product.category}</td>
                </tr>
                <tr>
                  <th>소재 혼용률</th>
                  <td>순면 100% (일부 멜란지/그레이 색상 면/폴리 혼방)</td>
                </tr>
                <tr>
                  <th>두께 및 중량</th>
                  <td>{product.name.includes("17수") ? "5.6온스 (헤비웨이트)" : product.name.includes("20수") ? "5.0온스 (스탠다드)" : "4.0온스~7.4온스 (고유 스펙)"}</td>
                </tr>
                <tr>
                  <th>신축성</th>
                  <td>보통 (활동이 편안한 리브 편직 조직)</td>
                </tr>
                <tr>
                  <th>비침 여부</th>
                  <td>거의 없음 (화이트 계열 미세 비침 가능)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Size Dimension Table */}
          <div className={styles.specSheet}>
            <h3>상세 실측 치수 조견표 (cm)</h3>
            <div className={styles.tableResponsive}>
              <table className={styles.sizeTable}>
                <thead>
                  <tr>
                    <th>사이즈</th>
                    <th>총장</th>
                    <th>가슴단면</th>
                    <th>어깨너비</th>
                    <th>소매길이</th>
                  </tr>
                </thead>
                <tbody>
                  {product.sizes.map((size) => {
                    const spec = getSizeSpecs(size);
                    return (
                      <tr key={size}>
                        <td><strong>{size}</strong></td>
                        <td>{spec.length}</td>
                        <td>{spec.chest}</td>
                        <td>{spec.shoulder}</td>
                        <td>{spec.sleeve}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <span className={styles.tableNotice}>
              ※ 실측 사이즈는 측정 방법이나 리뉴얼 시점에 따라 1~2cm 내외의 오차가 발생할 수 있습니다.
            </span>
          </div>
        </div>
      </section>

      {/* 3. 제작가이드 섹션 */}
      <section id="guide" className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>PRODUCTION GUIDE</h2>
        <p className={styles.sectionSub}>영리한 티셔츠 제작 프로세스와 인쇄 팁을 확인하세요.</p>
        
        <div className={styles.guideContainer}>
          {/* Guide Card 1 */}
          <div className={styles.guideCard}>
            <div className={styles.guideIconBox}>🎨</div>
            <h4>인쇄 파일 첨부 요령</h4>
            <p>
              가장 깨끗하고 고화질의 정밀 인쇄물을 얻기 위해 디자인 파일은 <strong>일러스트레이터(AI, 벡터 형식)</strong> 파일로 접수해 주시는 것을 적극 권장합니다.
            </p>
            <p>
              JPG/PNG 이미지 파일의 경우 해상도가 <strong>300dpi 이상</strong>이어야 깨짐 현상 없이 선명하게 고화질 인쇄가 가능합니다.
            </p>
          </div>

          {/* Guide Card 2 */}
          <div className={styles.guideCard}>
            <div className={styles.guideIconBox}>⚙️</div>
            <h4>인쇄 기법 가이드</h4>
            <ul>
              <li>
                <strong>나염인쇄 (스크린 프린트)</strong>: 클래식하고 오래가는 인쇄 기법으로, 30장 이상 대량 제작 시 최고의 가성비와 선명함을 제공합니다.
              </li>
              <li>
                <strong>전사/디지털인쇄 (DTF)</strong>: 풀컬러나 얇은 선, 그라데이션이 들어간 사진형 도안을 고정밀 디지털 필름으로 열 압착 인쇄합니다.
              </li>
              <li>
                <strong>자수 (Embroidery)</strong>: 도톰한 입체감과 뛰어난 내구성이 특징으로, 워크웨어 및 맨투맨, 아우터의 소형 로고 포인트로 적극 추천합니다.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Copy notification popup */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className={styles.toast}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={18} />
            <span>견적서 내용 복사 완료! 채널 문의창으로 이동합니다.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
