"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Minus, Send, Check, Upload, ArrowRight, RefreshCw } from "lucide-react";
import { Product, ProductColor } from "@/lib/types";
import GarmentHotspots from "@/components/GarmentHotspots";
import { getClientCurrentUser } from "@/lib/sessionClient";
import styles from "./quotes.module.css";

export default function QuotesClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [colorQuantities, setColorQuantities] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);

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
  const [title, setTitle] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showGuestModal, setShowGuestModal] = useState(false);

  useEffect(() => {
    const user = getClientCurrentUser();
    if (user) {
      setCurrentUser(user);
      setWriterName(user);
    }
  }, []);

  // Load products list from Cafe24 API on mount
  useEffect(() => {
    fetch("/api/cafe24/products")
      .then((res) => res.json())
      .then((data) => {
        const productList = data.products || [];
        setProducts(productList);
        if (productList.length > 0) {
          handleProductSelect(productList[0]);
        }
      })
      .catch((err) => {
        console.error("[Quotes Page] Failed to fetch products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors[0] || null);
    const firstColorName = product.colors[0]?.name || "기본";
    setColorQuantities({
      [firstColorName]: product.sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
    });
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      handleProductSelect(prod);
    }
  };

  const handleColorSelect = (color: ProductColor) => {
    setSelectedColor(color);
    if (!selectedProduct) return;
    setColorQuantities((prev) => {
      const next = { ...prev };
      if (next[color.name]) {
        // Deselect color
        delete next[color.name];
        
        // If there's still another color selected, set it as active preview
        const remainingKeys = Object.keys(next);
        if (remainingKeys.length > 0) {
          const firstRemaining = selectedProduct.colors.find(c => c.name === remainingKeys[0]);
          if (firstRemaining) {
            setSelectedColor(firstRemaining);
          }
        }
        return next;
      } else {
        // Select color
        return {
          ...prev,
          [color.name]: selectedProduct.sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
        };
      }
    });
  };

  const handleColorQtyChange = (colorName: string, size: string, increment: number) => {
    if (!selectedProduct) return;
    setColorQuantities((prev) => {
      const colorMap = prev[colorName] || selectedProduct.sizes.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
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
    if (!selectedProduct) return;
    setColorQuantities((prev) => {
      const next = { ...prev };
      delete next[colorName];
      if (Object.keys(next).length === 0) {
        const firstColorName = selectedProduct.colors[0]?.name || "기본";
        return {
          [firstColorName]: selectedProduct.sizes.reduce((acc, s) => ({ ...acc, [s]: 0 }), {})
        };
      }
      return next;
    });
  };

  const quantities = React.useMemo(() => {
    if (!selectedProduct) return {};
    const sum: Record<string, number> = {};
    selectedProduct.sizes.forEach(size => {
      sum[size] = 0;
    });
    Object.values(colorQuantities).forEach(sizesMap => {
      Object.entries(sizesMap).forEach(([size, qty]) => {
        sum[size] = (sum[size] || 0) + qty;
      });
    });
    return sum;
  }, [colorQuantities, selectedProduct]);

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
      9: "앞하단",
    };
    return names[id] || `위치 ${id}`;
  };

  // Pricing calculations (reusing logic from ProductDetailClient.tsx)
  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);

  const subtotal = selectedProduct
    ? Object.entries(quantities).reduce((acc, [size, qty]) => {
        const sizeModifier = selectedProduct.sizeUpcharges?.[size] || 0;
        return acc + qty * (selectedProduct.basePrice + sizeModifier);
      }, 0)
    : 0;

  // Bulk discount rate
  let discountRate = 0;
  if (totalQty >= 100) discountRate = 0.25;
  else if (totalQty >= 50) discountRate = 0.15;
  else if (totalQty >= 30) discountRate = 0.10;
  else if (totalQty >= 10) discountRate = 0.05;

  const discountAmount = subtotal * discountRate;

  // Print fee calculation
  let printFeePerUnit = 0;
  if (hasPrint && totalQty > 0) {
    const baseFee = 1500;
    const additionalPositionFee = Math.max(0, selectedPositions.length - 1) * 500;
    const embroideryExtra = printMethods.includes("자수") ? 1000 : 0;
    printFeePerUnit = baseFee + additionalPositionFee + embroideryExtra;
  }
  const printFee = totalQty * printFeePerUnit;

  const finalTotal = subtotal - discountAmount + printFee;

  const getQuoteText = () => {
    if (!selectedProduct) return "";

    const sizeDetails = Object.entries(colorQuantities)
      .map(([colorName, sizesMap]) => {
        const detailStr = Object.entries(sizesMap)
          .filter(([, qty]) => qty > 0)
          .map(([size, qty]) => {
            const upcharge = selectedProduct.sizeUpcharges?.[size] || 0;
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

    const discountText = discountRate > 0 ? ` (${discountRate * 100}% 단체 할인 적용)` : "";

    return `[영리한 - 견적 문의 접수 안내]
--------------------------------
■ 요청 품목: ${selectedProduct.name}
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
    if (!selectedProduct) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("productId", selectedProduct.id);
      formData.append("productName", selectedProduct.name);
      formData.append("writerName", wName);
      formData.append("password", wPass);
      formData.append("title", title.trim() || `${wName || "비회원"}님의 시안/견적 문의`);
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
        // Copy summary text to clipboard
        const text = getQuoteText();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalQty === 0) {
      alert("사이즈 수량을 최소 1개 이상 입력해 주세요.");
      return;
    }
    if (!selectedProduct) return;

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

  const handleRemoveFile = () => {
    setFileName("");
    setSelectedFile(null);
  };

  const handleAddToCart = () => {
    if (totalQty === 0) {
      alert("수량을 최소 1개 이상 입력해 주세요.");
      return;
    }
    if (!selectedProduct) return;
    try {
      const cartItem = {
        id: `CART-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
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

  // Loading indicator
  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "160px 20px" }}>
        <RefreshCw className="animate-spin" size={48} style={{ color: "#0052ff", margin: "0 auto 16px" }} />
        <p style={{ fontWeight: 700, color: "#71717a" }}>카페24에서 실시간 옷 상품 목록을 불러오는 중...</p>
      </div>
    );
  }

  const isHoodie = selectedProduct
    ? selectedProduct.id.toLowerCase().includes("hood") ||
      selectedProduct.name.includes("후드") ||
      selectedProduct.id === "272"
    : false;

  return (
    <div className={styles.container}>
      {/* Toast alert */}
      {showToast && (
        <div className={styles.toast}>
          ✓ 견적이 임시 접수되었으며 안내 요약이 복사되었습니다! 마이페이지로 이동합니다.
        </div>
      )}

      {/* Header */}
      <div className={styles.titleSection}>
        <h1>견적 시뮬레이터</h1>
        <p>원하는 의류 품목과 디자인 사양을 설정하여 즉석에서 실시간 견적을 미리 조회하고 신청할 수 있습니다.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Product Selection */}
        <div className={styles.productSelectCard}>
          <label className={styles.label} htmlFor="product-selector">1. 견적 문의할 상품 선택</label>
          <select
            id="product-selector"
            className={styles.select}
            value={selectedProduct?.id || ""}
            onChange={handleProductChange}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.brand}] {p.name} — (기본 단가: ₩{p.basePrice.toLocaleString()}원)
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && selectedColor && (
          <div className={styles.grid}>
            {/* Left: Custom Options */}
            <div className={styles.leftSection}>
              
              {/* Color Picker */}
              <div className={styles.optionGroup}>
                <div className={styles.optionHeader}>
                  <span className={styles.optionLabel}>2. 의류 색상 선택 (여러 개 선택 가능)</span>
                  <span className={styles.optionValue}>
                    선택됨: {Object.keys(colorQuantities).join(", ")}
                  </span>
                </div>
                <div className={styles.colorPicker}>
                  {selectedProduct.colors.map((color) => {
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
                <span className={styles.optionLabel}>3. 색상별 사이즈 수량 입력</span>
                <div className={styles.colorQuantitiesContainer}>
                  {Object.entries(colorQuantities).map(([colorName, sizesMap]) => {
                    const colorObj = selectedProduct.colors.find(c => c.name === colorName) || selectedProduct.colors[0];
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
                          {selectedProduct.sizes.map((size) => {
                            const qty = sizesMap[size] || 0;
                            const upcharge = selectedProduct.sizeUpcharges?.[size] || 0;
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

              {/* Printing options toggle */}
              <div className={styles.optionGroup}>
                <div className={styles.toggleRow}>
                  <span className={styles.optionLabel}>4. 로고 인쇄 여부</span>
                  <div className={styles.toggleSwitch}>
                    <button
                      type="button"
                      onClick={() => setHasPrint(true)}
                      className={`${styles.toggleBtn} ${hasPrint ? styles.active : ""}`}
                    >
                      인쇄 있음
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasPrint(false)}
                      className={`${styles.toggleBtn} ${!hasPrint ? styles.active : ""}`}
                    >
                      인쇄 없음
                    </button>
                  </div>
                </div>

                {hasPrint && (
                  <div className={styles.subOptions}>
                    {/* Print methods */}
                    <div className={styles.checkboxGroup}>
                      <span className={styles.checkboxLabel}>인쇄 방식 (중복 선택 가능)</span>
                      <div className={styles.checkboxes}>
                        {["나염", "자수", "실사/전사", "플로피"].map((method) => {
                          const isActive = printMethods.includes(method);
                          return (
                            <button
                              key={method}
                              type="button"
                              onClick={() => handleToggleMethod(method)}
                              className={`${styles.checkBtn} ${isActive ? styles.active : ""}`}
                            >
                              {isActive && <Check size={12} />} {method}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hotspot garment visual */}
                    <div className={styles.checkboxGroup}>
                      <span className={styles.checkboxLabel}>인쇄 위치 시각화</span>
                      <span style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "-6px", marginBottom: "8px" }}>
                        옷 도안의 번호 노드 단추를 클릭하여 인쇄할 위치를 선택하세요.
                      </span>
                      <GarmentHotspots
                        productId={isHoodie ? "hoodie" : "tshirt"}
                        selectedPositions={selectedPositions}
                        onTogglePosition={handleTogglePosition}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* File upload attachment */}
              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>5. 도안 이미지 파일 첨부</span>
                {fileName ? (
                  <div className={styles.uploadedFileRow}>
                    <span className={styles.fileName}>📁 {fileName}</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className={styles.removeFileBtn}
                    >
                      제거
                    </button>
                  </div>
                ) : (
                  <div className={styles.fileUploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={styles.fileInput}
                    />
                    <Upload size={24} className={styles.uploadIcon} />
                    <div className={styles.uploadLabel}>여기를 눌러 도안 파일을 첨부하세요</div>
                    <div className={styles.uploadHelp}>PNG, JPG, PDF 등 (최대 10MB)</div>
                  </div>
                )}
              </div>

              {/* Title Input */}
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel} htmlFor="title-input">6. 문의 글 제목</label>
                <input
                  type="text"
                  id="title-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`${writerName || "비회원"}님의 시안/견적 문의`}
                  className={styles.select}
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>

              {/* Detailed custom requests */}
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel} htmlFor="requests-textarea">7. 추가 요구사항 (인쇄 크기, 포장 등)</label>
                <textarea
                  id="requests-textarea"
                  value={requests}
                  onChange={(e) => setRequests(e.target.value)}
                  placeholder="예: 앞중앙 로고 가로 25cm 나염 인쇄 희망하며, 개별 폴리백 포장 요청합니다."
                  className={styles.textarea}
                />
              </div>

            </div>

            {/* Right: Invoice Receipt */}
            <div className={styles.rightSection}>
              <h3 className={styles.billTitle}>빠른 견적 상세서</h3>
              
              <div className={styles.billRow}>
                <span className={styles.billRowLabel}>선택 품목</span>
                <span className={styles.billRowValue} style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedProduct.name}
                </span>
              </div>
              <div className={styles.billRow}>
                <span className={styles.billRowLabel}>선택 색상</span>
                <span className={styles.billRowValue}>{selectedColor.name}</span>
              </div>
              <div className={styles.billRow}>
                <span className={styles.billRowLabel}>총 신청 수량</span>
                <span className={styles.billRowValue}>{totalQty}개</span>
              </div>

              <div className={styles.billDivider} />

              <div className={styles.billRow}>
                <span className={styles.billRowLabel}>의류 공급가</span>
                <span className={styles.billRowValue}>₩{subtotal.toLocaleString()}원</span>
              </div>

              {discountRate > 0 && (
                <div className={styles.billRow}>
                  <span className={styles.billRowLabel} style={{ color: "#ef4444" }}>
                    단체 할인 ({(discountRate * 100)}%)
                  </span>
                  <span className={`${styles.billRowValue} ${styles.discountValue}`}>
                    -₩{discountAmount.toLocaleString()}원
                  </span>
                </div>
              )}

              <div className={styles.billRow}>
                <span className={styles.billRowLabel}>인쇄 총 비용</span>
                <span className={styles.billRowValue}>₩{printFee.toLocaleString()}원</span>
              </div>

              <div className={styles.billDivider} />

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>총 빠른 견적가</span>
                <span className={styles.totalAmount}>₩{finalTotal.toLocaleString()}원</span>
              </div>

              <div className={styles.actionButtonsRow}>
                <button
                  type="submit"
                  disabled={totalQty === 0 || isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? "견적 접수 중..." : "견적 문의하기"} <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  disabled={totalQty === 0 || isSubmitting}
                  onClick={handleAddToCart}
                  className={styles.cartBtn}
                >
                  장바구니 담기
                </button>
              </div>

              <p className={styles.infoHint}>
                * 이 단가는 예상 요금이며, 관리자가 제출된 도안과 수량을 검토한 뒤 실 결제 단가로 최종 승인해 드립니다.
              </p>
            </div>
          </div>
        )}
      </form>

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
