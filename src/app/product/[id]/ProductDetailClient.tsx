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
  
  // Printing options state
  const [hasPrint, setHasPrint] = useState<boolean>(true); // Default: With Print
  const [printMethods, setPrintMethods] = useState<string[]>(["나염"]); // Default Screen Print
  const [selectedPositions, setSelectedPositions] = useState<number[]>([3]); // Default Front Center (3)
  const [requests, setRequests] = useState("");
  const [fileName, setFileName] = useState("");
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

  const handleCtaClick = (actionType: "주문" | "문의") => {
    const text = getQuoteText(actionType);
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      // Redirect to KakaoTalk channel
      setTimeout(() => {
        window.open("https://pf.kakao.com/_xbYwGX", "_blank");
      }, 1000);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
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
              <Image
                src={selectedColor.image}
                alt={`${product.name} - ${selectedColor.name}`}
                width={600}
                height={600}
                className={styles.mainImage}
                priority
              />
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
              disabled={totalQty === 0}
              style={{ opacity: totalQty === 0 ? 0.4 : 1, cursor: totalQty === 0 ? "not-allowed" : "pointer" }}
            >
              주문하기 <Send size={16} />
            </button>
            <button
              onClick={() => handleCtaClick("문의")}
              className={styles.inquiryBtn}
            >
              상세 견적 문의
            </button>
          </div>
        </div>
      </div>

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
