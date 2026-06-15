"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Minus, Send, Check, Upload } from "lucide-react";
import { Product } from "@/lib/types";
import GarmentHotspots from "@/components/GarmentHotspots";
import { getClientCurrentUser } from "@/lib/sessionClient";
import styles from "./product.module.css";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [colorQuantities, setColorQuantities] = useState<Record<string, Record<string, number>>>(() => ({
    [product.colors[0].name]: product.sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
  }));
  
  // Printing options state
  const [hasPrint, setHasPrint] = useState<boolean>(true); // Default: With Print
  const [printMethods, setPrintMethods] = useState<string[]>(["나염"]); // Default Screen Print
  const [selectedPositions, setSelectedPositions] = useState<number[]>([3]); // Default Front Center (3)
  const [requests, setRequests] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [writerName, setWriterName] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showGuestModal, setShowGuestModal] = useState(false);

  React.useEffect(() => {
    const user = getClientCurrentUser();
    if (user) {
      setCurrentUser(user);
      setWriterName(user);
    }
  }, []);

  const handleColorSelect = (color: typeof product.colors[0]) => {
    setSelectedColor(color);
    setColorQuantities((prev) => {
      const next = { ...prev };
      if (next[color.name]) {
        // Deselect color
        delete next[color.name];
        
        // If there's still another color selected, set it as active preview
        const remainingKeys = Object.keys(next);
        if (remainingKeys.length > 0) {
          const firstRemaining = product.colors.find(c => c.name === remainingKeys[0]);
          if (firstRemaining) {
            setSelectedColor(firstRemaining);
          }
        }
        return next;
      } else {
        // Select color
        return {
          ...prev,
          [color.name]: product.sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
        };
      }
    });
  };

  const handleColorQtyChange = (colorName: string, size: string, increment: number) => {
    setColorQuantities((prev) => {
      const colorMap = prev[colorName] || product.sizes.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
      return {
        ...prev,
        [colorName]: {
          ...colorMap,
          [size]: Math.max(0, (colorMap[size] || 0) + increment),
        },
      };
    });
  };

  const handleRemoveColor = (colorName: string) => {
    setColorQuantities((prev) => {
      const next = { ...prev };
      delete next[colorName];
      if (Object.keys(next).length === 0) {
        return {
          [product.colors[0].name]: product.sizes.reduce((acc, s) => ({ ...acc, [s]: 0 }), {})
        };
      }
      return next;
    });
  };

  const quantities = React.useMemo(() => {
    const sum: Record<string, number> = {};
    product.sizes.forEach(size => {
      sum[size] = 0;
    });
    Object.values(colorQuantities).forEach(sizesMap => {
      Object.entries(sizesMap).forEach(([size, qty]) => {
        sum[size] = (sum[size] || 0) + qty;
      });
    });
    return sum;
  }, [colorQuantities, product.sizes]);

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
    const sizeDetails = Object.entries(colorQuantities)
      .map(([colorName, sizesMap]) => {
        const detailStr = Object.entries(sizesMap)
          .filter(([, qty]) => qty > 0)
          .map(([size, qty]) => {
            const upcharge = product.sizeUpcharges?.[size] || 0;
            const extra = upcharge > 0 ? `(+₩${upcharge.toLocaleString()})` : "";
            return `${size}${extra}: ${qty}개`;
          })
          .join(", ");
        return detailStr ? `- ${colorName} 색상: ${detailStr}` : null;
      })
      .filter(Boolean)
      .join("\n");

    const positionsText = selectedPositions
      .map((id) => `${id}. ${getPositionName(id)}`)
      .join(", ");

    const discountText = discountRate > 0 ? ` (${(discountRate * 100)}% 단체 할인 적용)` : "";

    return `[영리한 - ${actionType} 접수 안내]
--------------------------------
■ 요청 품목: ${product.name}
■ 선택 색상: ${Object.keys(colorQuantities).join(", ")}
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

  const executeSubmit = async (wName: string, wPass: string) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("productId", product.id);
      formData.append("productName", product.name);
      formData.append("writerName", wName);
      formData.append("password", wPass);
      formData.append("title", `${wName || "비회원"}님의 시안/견적 문의`);
      formData.append("colorName", Object.keys(colorQuantities).join(", "));
      formData.append("quantities", JSON.stringify(quantities));
      formData.append("colorQuantities", JSON.stringify(colorQuantities));
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
        const text = getQuoteText("문의");
        await navigator.clipboard.writeText(text);

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Redirect to the newly created quote post board thread
        setTimeout(() => {
          window.location.href = `/quotes/${data.quote.id}`;
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

  const handleCtaClick = async (actionType: "주문" | "문의") => {
    if (totalQty === 0) return;
    
    if (!currentUser) {
      setShowGuestModal(true);
      return;
    }

    await executeSubmit(currentUser, "");
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writerName.trim()) {
      alert("비회원 문의를 위해 작성자명을 입력해 주세요.");
      return;
    }
    if (!password.trim()) {
      alert("비회원 문의를 위해 비밀번호를 입력해 주세요.");
      return;
    }
    if (password.trim().length !== 4 || isNaN(Number(password))) {
      alert("비밀번호는 숫자 4자리로 입력해 주세요.");
      return;
    }
    setShowGuestModal(false);
    await executeSubmit(writerName.trim(), password.trim());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleAddToCart = () => {
    if (totalQty === 0) {
      alert("수량을 최소 1개 이상 입력해 주세요.");
      return;
    }
    try {
      const cartItem = {
        id: `CART-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: product.id,
        productName: product.name,
        colorName: Object.keys(colorQuantities).join(", "),
        colorQuantities: colorQuantities,
        quantities: quantities,
        hasPrint: hasPrint,
        printMethods: hasPrint ? printMethods : [],
        selectedPositions: hasPrint ? selectedPositions : [],
        fileName: fileName,
        requests: requests,
        subtotal: subtotal,
        discountAmount: discountAmount,
        printFee: printFee,
        totalPrice: finalTotal,
      };

      const existingCartJson = localStorage.getItem("youngreehan_cart");
      const cart = existingCartJson ? JSON.parse(existingCartJson) : [];
      cart.push(cartItem);
      localStorage.setItem("youngreehan_cart", JSON.stringify(cart));

      alert("장바구니에 상품이 담겼습니다. 마이페이지에서 확인하실 수 있습니다.");
    } catch (err) {
      console.error(err);
      alert("장바구니 담기에 실패했습니다.");
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
                  unoptimized={true}
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

            <p className={styles.description}>{product.tagline || product.description}</p>
          </div>

          {/* Color Picker */}
          <div className={styles.optionGroup}>
            <div className={styles.optionHeader}>
              <span className={styles.optionLabel}>색상 선택 (여러 개 선택 가능)</span>
              <span className={styles.optionValue}>
                선택됨: {Object.keys(colorQuantities).join(", ")}
              </span>
            </div>
            <div className={styles.colorPicker}>
              {product.colors.map((color) => {
                const isSelected = !!colorQuantities[color.name];
                const isPreviewing = selectedColor.name === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className={`${styles.colorDotBtn} ${
                      isSelected ? styles.active : ""
                    } ${isPreviewing ? styles.previewing : ""}`}
                    title={`${color.name} (${isSelected ? "선택됨" : "미선택"}) - 클릭 시 미리보기`}
                  >
                    <span
                      className={styles.colorInner}
                      style={{
                        backgroundColor: color.hex,
                        border: color.hex.toLowerCase() === "#ffffff" ? "1.5px solid #e4e4e7" : "none"
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color & Size Quantity Cards */}
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>색상별 사이즈 수량 입력</span>
            <div className={styles.colorQuantitiesContainer}>
              {Object.entries(colorQuantities).map(([colorName, sizesMap]) => {
                const colorObj = product.colors.find(c => c.name === colorName) || product.colors[0];
                return (
                  <div key={colorName} className={styles.colorQuantityCard}>
                    <div className={styles.colorCardHeader}>
                      <div className={styles.colorInfo}>
                        <span 
                          className={styles.colorDot} 
                          style={{ 
                            backgroundColor: colorObj.hex,
                            border: colorObj.hex.toLowerCase() === "#ffffff" ? "1px solid #e4e4e7" : "none"
                          }} 
                        />
                        <span className={styles.colorCardTitle}>{colorName} 색상</span>
                      </div>
                      {Object.keys(colorQuantities).length > 1 && (
                        <button
                          type="button"
                          className={styles.removeColorBtn}
                          onClick={() => handleRemoveColor(colorName)}
                        >
                          삭제
                        </button>
                      )}
                    </div>

                    <div className={styles.sizeList}>
                      {product.sizes.map((size) => {
                        const qty = sizesMap[size] || 0;
                        const upcharge = product.sizeUpcharges?.[size] || 0;
                        return (
                          <div key={size} className={styles.sizeRowItem}>
                            <div className={styles.sizeInfoLeft}>
                              <span className={styles.sizeLabel}>{size} 사이즈</span>
                              {upcharge > 0 && <span className={styles.sizeUpchargeText}>+₩{upcharge.toLocaleString()}</span>}
                            </div>
                            <div className={styles.stepperControl}>
                              <button
                                type="button"
                                onClick={() => handleColorQtyChange(colorName, size, -1)}
                                className={styles.stepperBtn}
                                disabled={qty === 0}
                              >
                                <Minus size={12} />
                              </button>
                              <span className={styles.stepperVal}>{qty}</span>
                              <button
                                type="button"
                                onClick={() => handleColorQtyChange(colorName, size, 1)}
                                className={styles.stepperBtn}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
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
              type="button"
              onClick={handleAddToCart}
              className={styles.cartBtn}
              disabled={totalQty === 0 || isSubmitting}
              style={{ opacity: (totalQty === 0 || isSubmitting) ? 0.4 : 1, cursor: (totalQty === 0 || isSubmitting) ? "not-allowed" : "pointer" }}
            >
              장바구니 담기
            </button>
            <button
              type="button"
              onClick={() => handleCtaClick("문의")}
              className={styles.orderBtn}
              disabled={totalQty === 0 || isSubmitting}
              style={{ opacity: (totalQty === 0 || isSubmitting) ? 0.4 : 1, cursor: (totalQty === 0 || isSubmitting) ? "not-allowed" : "pointer" }}
            >
              {isSubmitting ? "제출 중..." : "견적 문의하기"} <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      {product.description && (
        <div className={styles.descriptionContainer}>
          {product.description.includes("<") || product.description.includes(">") ? (
            <div 
              className={styles.detailDescHtml} 
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />
          ) : (
            <p className={styles.detailDesc}>{product.description}</p>
          )}
        </div>
      )}

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

      {/* Guest Credentials Collection Modal */}
      {showGuestModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e4e4e7",
            borderRadius: "12px",
            padding: "30px",
            width: "100%",
            maxWidth: "400px",
            boxSizing: "border-box",
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#18181b", marginBottom: "12px", textAlign: "center" }}>
              비회원 견적 문의 정보
            </h2>
            <p style={{ fontSize: "13px", color: "#71717a", marginBottom: "20px", textAlign: "center", lineHeight: "1.5" }}>
              문의 내역 조회 및 답변 확인을 위해 작성자명과 비밀번호를 설정해 주세요.
            </p>
            <form onSubmit={handleGuestSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4b5563", marginBottom: "4px" }}>작성자명</label>
                <input
                  type="text"
                  placeholder="예: 김동희"
                  value={writerName}
                  onChange={(e) => setWriterName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4b5563", marginBottom: "4px" }}>비밀번호 (숫자 4자리)</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="숫자 4자리"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowGuestModal(false)}
                  style={{
                    flex: 1,
                    backgroundColor: "#ffffff",
                    color: "#71717a",
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                    padding: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: "#0052ff",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  제출하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
