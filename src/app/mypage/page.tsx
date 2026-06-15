"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getClientCurrentUser } from "@/lib/sessionClient";
import { CreditCard, CheckCircle, Clock, LogOut, ArrowRight, XCircle } from "lucide-react";
import styles from "./mypage.module.css";

// Interface for quote mapping client-side
interface Quote {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  colorName: string;
  quantities: Record<string, number>;
  colorQuantities?: Record<string, Record<string, number>>;
  hasPrint: boolean;
  printMethods: string[];
  selectedPositions: number[];
  fileName: string;
  fileUrl: string;
  requests: string;
  subtotal: number;
  discountAmount: number;
  printFee: number;
  totalPrice: number;
  status: "PENDING" | "APPROVED" | "PAID" | "REJECTED";
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userQuotes, setUserQuotes] = useState<Quote[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"cart" | "quotes" | "orders">("cart");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUserId = getClientCurrentUser();
        setUserId(currentUserId);

        if (currentUserId) {
          const res = await fetch("/api/quotes");
          const data = await res.json();
          if (data.success && data.quotes) {
            const filtered = data.quotes
              .filter((q: Quote) => q.userId.toLowerCase() === currentUserId.toLowerCase())
              .sort((a: Quote, b: Quote) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setUserQuotes(filtered);
          }
        }

        // Load cart items from localStorage
        if (typeof window !== "undefined") {
          const cartJson = localStorage.getItem("youngreehan_cart");
          if (cartJson) {
            setCartItems(JSON.parse(cartJson));
          }
        }
      } catch (err) {
        console.error("Failed to load MyPage data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = () => {
    // Clear local mock cookie
    document.cookie = "cafe24_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
  };

  const handleDeleteCartItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("youngreehan_cart", JSON.stringify(updated));
  };

  const handleSubmitCartItem = async (item: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("productId", item.productId);
      formData.append("productName", item.productName);
      formData.append("colorName", item.colorName);
      formData.append("quantities", JSON.stringify(item.quantities));
      formData.append("colorQuantities", JSON.stringify(item.colorQuantities));
      formData.append("hasPrint", String(item.hasPrint));
      formData.append("printMethods", JSON.stringify(item.printMethods));
      formData.append("selectedPositions", JSON.stringify(item.selectedPositions));
      formData.append("requests", item.requests);
      formData.append("subtotal", String(item.subtotal));
      formData.append("discountAmount", String(item.discountAmount));
      formData.append("printFee", String(item.printFee));
      formData.append("totalPrice", String(item.totalPrice));

      if (item.fileName) {
        formData.append("requests", `[장바구니 도안: ${item.fileName}] ${item.requests}`);
      }

      const currentUserId = getClientCurrentUser() || "guest";
      formData.append("writerName", currentUserId);
      formData.append("password", "");

      const res = await fetch("/api/quotes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // Remove item from cart state & localStorage
        const updated = cartItems.filter((i) => i.id !== item.id);
        setCartItems(updated);
        localStorage.setItem("youngreehan_cart", JSON.stringify(updated));

        // Reload quotes
        const currentUserId = getClientCurrentUser();
        if (currentUserId) {
          const resQuotes = await fetch("/api/quotes");
          const dataQuotes = await resQuotes.json();
          if (dataQuotes.success && dataQuotes.quotes) {
            const filtered = dataQuotes.quotes
              .filter((q: Quote) => q.userId.toLowerCase() === currentUserId.toLowerCase())
              .sort((a: Quote, b: Quote) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setUserQuotes(filtered);
          }
        }
        alert(`"${item.productName}" 견적 문의 접수가 완료되었습니다! 견적 소통 게시글로 이동합니다.`);
        window.location.href = `/quotes/${data.quote.id}`;
      } else {
        alert(`견적 제출 실패: ${data.error || "알 수 없는 에러"}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`견적 접수 중 에러가 발생했습니다: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return `${styles.badge} ${styles.pending}`;
      case "APPROVED":
        return `${styles.badge} ${styles.approved}`;
      case "PAID":
        return `${styles.badge} ${styles.paid}`;
      case "REJECTED":
        return `${styles.badge} ${styles.rejected}`;
      default:
        return styles.badge;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기 중";
      case "APPROVED":
        return "승인 완료";
      case "PAID":
        return "결제 완료";
      case "REJECTED":
        return "반려됨";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "80px 0", color: "#666" }}>
          로딩 중...
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPromptCard}>
          <div className={styles.loginPromptIcon}>🔒</div>
          <h2>로그인이 필요합니다</h2>
          <p>
            로그인 연동을 통해 신청하신 견적 목록과 결제창 링크를 안전하게 확인하고 결제를 완료하실 수 있습니다.
          </p>
          <Link href="/login" className={styles.payBtn}>
            로그인하기 <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Filter lists based on tab
  const quotesList = userQuotes.filter((q) => q.status !== "PAID");
  const ordersList = userQuotes.filter((q) => q.status === "PAID");

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.titleSection}>
          <h1>마이페이지</h1>
          <p>
            회원정보: <strong>{userId}</strong>
          </p>
        </div>
        <a href="/api/auth/logout" onClick={handleLogout} className={styles.logoutBtn}>
          로그아웃 <LogOut size={14} style={{ marginLeft: 6 }} />
        </a>
      </div>

      {/* Tabs Menu */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === "cart" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("cart")}
        >
          장바구니 ({cartItems.length})
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "quotes" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("quotes")}
        >
          견적 승인 내역 ({quotesList.length})
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "orders" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          주문 내역 ({ordersList.length})
        </button>
      </div>

      {/* Cart Tab Content */}
      {activeTab === "cart" && (
        cartItems.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>장바구니가 비어 있습니다</div>
            <p className={styles.emptyDesc}>
              시뮬레이터나 상품 상세페이지에서 원하는 사양을 맞춰 장바구니에 상품을 담아보세요.
            </p>
            <Link href="/collections/all" className={styles.shopBtn}>
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className={styles.quoteGrid}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.quoteCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.quoteIdRow}>
                    <span className={styles.quoteId}>임시 견적서 ({item.productName})</span>
                    <span className={styles.quoteDate}>선택 사양 검토용</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCartItem(item.id)}
                    className={styles.deleteCartBtn}
                  >
                    삭제
                  </button>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.specsList}>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>선택 품목</span>
                      <span className={styles.specVal}>{item.productName}</span>
                    </div>

                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>선택 색상</span>
                      <span className={styles.specVal}>{item.colorName}</span>
                    </div>

                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>상세 수량</span>
                      <span className={styles.specVal}>
                        {item.colorQuantities ? (
                          <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {Object.entries(item.colorQuantities).map(([color, sizes]) => {
                              const sizeStr = Object.entries(sizes as Record<string, number>)
                                .filter(([, qty]) => qty > 0)
                                .map(([size, qty]) => `${size}(${qty}개)`)
                                .join(", ");
                              return sizeStr ? (
                                <span key={color} style={{ display: "block" }}>
                                  <strong>{color}</strong>: {sizeStr}
                                </span>
                              ) : null;
                            })}
                          </span>
                        ) : (
                          Object.entries(item.quantities as Record<string, number>)
                            .filter(([, qty]) => qty > 0)
                            .map(([size, qty]) => `${size}(${qty}개)`)
                            .join(", ")
                        )}
                      </span>
                    </div>

                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>프린팅 정보</span>
                      <span className={styles.specVal}>
                        {item.hasPrint ? (
                          <>
                            <div>기법: {item.printMethods.join(", ")}</div>
                            <div className={styles.positionsList}>
                              부위:{" "}
                              {item.selectedPositions.map((pos: number) => (
                                <span key={pos} className={styles.positionTag}>
                                  {pos}. {getPositionName(pos)}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          "인쇄 없음"
                        )}
                      </span>
                    </div>

                    {item.fileName && (
                      <div className={styles.specRow}>
                        <span className={styles.specLabel}>첨부 파일</span>
                        <span className={styles.specVal} style={{ color: "#0052ff" }}>
                          📁 {item.fileName}
                        </span>
                      </div>
                    )}

                    {item.requests && (
                      <div className={styles.specRow}>
                        <span className={styles.specLabel}>추가 요구사항</span>
                        <span className={styles.specVal} style={{ fontWeight: 400, color: "#66666b" }}>
                          {item.requests}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={styles.actionArea}>
                    <div className={styles.priceDisplay}>
                      <span className={styles.priceLabel}>예상 총 견적액</span>
                      <span className={styles.priceVal}>₩{item.totalPrice.toLocaleString()}원</span>
                    </div>

                    <button
                      onClick={() => handleSubmitCartItem(item)}
                      className={styles.payBtn}
                      style={{ backgroundColor: "#000000" }}
                    >
                      이 견적으로 문의 신청 <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Quotes Tab Content */}
      {activeTab === "quotes" && (
        quotesList.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>대기/승인된 견적서가 없습니다</div>
            <p className={styles.emptyDesc}>
              장바구니의 상품을 견적 문의 접수하거나, 상품 상세 페이지에서 직접 접수를 완료해주세요.
            </p>
          </div>
        ) : (
          <div className={styles.quoteGrid}>
            {quotesList.map((quote) => (
              <div key={quote.id} className={styles.quoteCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.quoteIdRow}>
                    <span className={styles.quoteId}>{quote.id}</span>
                    <span className={styles.quoteDate}>
                      신청일: {new Date(quote.createdAt).toLocaleString("ko-KR")}
                    </span>
                  </div>
                  <span className={getStatusBadgeClass(quote.status)}>
                    {getStatusLabel(quote.status)}
                  </span>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.specsList}>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>선택 품목</span>
                      <span className={styles.specVal}>{quote.productName}</span>
                    </div>

                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>선택 색상</span>
                      <span className={styles.specVal}>{quote.colorName}</span>
                    </div>

                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>사이즈 및 수량</span>
                      <span className={styles.specVal}>
                        {quote.colorQuantities ? (
                          <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {Object.entries(quote.colorQuantities).map(([color, sizes]) => {
                              const sizeStr = Object.entries(sizes)
                                .filter(([, qty]) => qty > 0)
                                .map(([size, qty]) => `${size}(${qty}개)`)
                                .join(", ");
                              return sizeStr ? (
                                <span key={color} style={{ display: "block" }}>
                                  <strong>{color}</strong>: {sizeStr}
                                </span>
                              ) : null;
                            })}
                          </span>
                        ) : (
                          Object.entries(quote.quantities)
                            .filter(([, qty]) => qty > 0)
                            .map(([size, qty]) => `${size}(${qty}개)`)
                            .join(", ")
                        )}
                      </span>
                    </div>

                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>프린팅 정보</span>
                      <span className={styles.specVal}>
                        {quote.hasPrint ? (
                          <>
                            <div>기법: {quote.printMethods.join(", ")}</div>
                            <div className={styles.positionsList}>
                              부위:{" "}
                              {quote.selectedPositions.map((pos) => (
                                <span key={pos} className={styles.positionTag}>
                                  {pos}. {getPositionName(pos)}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          "인쇄 없음"
                        )}
                      </span>
                    </div>

                    {quote.fileName && (
                      <div className={styles.specRow}>
                        <span className={styles.specLabel}>첨부 파일</span>
                        <span className={styles.specVal} style={{ color: "#0052ff" }}>
                          📁 {quote.fileName}
                        </span>
                      </div>
                    )}

                    {quote.requests && (
                      <div className={styles.specRow}>
                        <span className={styles.specLabel}>추가 요구사항</span>
                        <span className={styles.specVal} style={{ fontWeight: 400, color: "#66666b" }}>
                          {quote.requests}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={styles.actionArea}>
                    <div className={styles.priceDisplay}>
                      <span className={styles.priceLabel}>최종 산정 가격</span>
                      <span className={styles.priceVal}>₩{quote.totalPrice.toLocaleString()}원</span>
                    </div>

                    <Link
                      href={`/quotes/${quote.id}`}
                      className={styles.payBtn}
                      style={{
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        textAlign: "center",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      문의글 보기 및 소통하기 <ArrowRight size={14} />
                    </Link>

                    {quote.status === "APPROVED" && quote.paymentUrl && (
                      <a
                        href={quote.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.payBtn}
                        style={{ marginTop: "8px" }}
                      >
                        <CreditCard size={16} /> 결제 진행하기 <ArrowRight size={16} />
                      </a>
                    )}

                    {quote.status === "PENDING" && (
                      <div className={styles.pendingBox}>
                        <Clock size={16} style={{ verticalAlign: "middle", marginRight: 4, display: "inline" }} />
                        관리자가 도안 검토 및 할인을 책정 중입니다. 완료 시 결제 버튼이 생성됩니다.
                      </div>
                    )}

                    {quote.status === "REJECTED" && (
                      <div className={styles.pendingBox} style={{ color: "#dc2626" }}>
                        <XCircle size={16} style={{ verticalAlign: "middle", marginRight: 4, display: "inline" }} />
                        견적이 반려되었습니다. 카카오톡 문의로 견적 번호({quote.id})를 남겨주세요.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Orders Tab Content */}
      {activeTab === "orders" && (
        ordersList.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>결제 완료된 주문 내역이 없습니다</div>
            <p className={styles.emptyDesc}>
              승인 완료된 견적서를 결제하시면 제작 및 공정 진행 상황이 여기에 표기됩니다.
            </p>
          </div>
        ) : (
          <div className={styles.quoteGrid}>
            {ordersList.map((quote) => (
              <div key={quote.id} className={styles.quoteCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.quoteIdRow}>
                    <span className={styles.quoteId}>{quote.id}</span>
                    <span className={styles.quoteDate}>
                      결제 완료일: {new Date(quote.updatedAt).toLocaleString("ko-KR")}
                    </span>
                  </div>
                  <span className={getStatusBadgeClass(quote.status)}>
                    {getStatusLabel(quote.status)}
                  </span>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.specsList}>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>선택 품목</span>
                      <span className={quote.productName}>{quote.productName}</span>
                    </div>

                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>선택 색상</span>
                      <span className={quote.colorName}>{quote.colorName}</span>
                    </div>

                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>주문 수량</span>
                      <span className={styles.specVal}>
                        {quote.colorQuantities ? (
                          <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {Object.entries(quote.colorQuantities).map(([color, sizes]) => {
                              const sizeStr = Object.entries(sizes)
                                .filter(([, qty]) => qty > 0)
                                .map(([size, qty]) => `${size}(${qty}개)`)
                                .join(", ");
                              return sizeStr ? (
                                <span key={color} style={{ display: "block" }}>
                                  <strong>{color}</strong>: {sizeStr}
                                </span>
                              ) : null;
                            })}
                          </span>
                        ) : (
                          Object.entries(quote.quantities)
                            .filter(([, qty]) => qty > 0)
                            .map(([size, qty]) => `${size}(${qty}개)`)
                            .join(", ")
                        )}
                      </span>
                    </div>

                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>인쇄 사양</span>
                      <span className={styles.specVal}>
                        {quote.hasPrint ? (
                          <>
                            <div>기법: {quote.printMethods.join(", ")}</div>
                            <div className={styles.positionsList}>
                              부위:{" "}
                              {quote.selectedPositions.map((pos) => (
                                <span key={pos} className={styles.positionTag}>
                                  {pos}. {getPositionName(pos)}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          "인쇄 없음"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className={styles.actionArea}>
                    <div className={styles.priceDisplay}>
                      <span className={styles.priceLabel}>결제 가격</span>
                      <span className={styles.priceVal}>₩{quote.totalPrice.toLocaleString()}원</span>
                    </div>

                    <Link
                      href={`/quotes/${quote.id}`}
                      className={styles.payBtn}
                      style={{
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        textAlign: "center",
                        justifyContent: "center",
                        width: "100%",
                        marginBottom: "12px",
                      }}
                    >
                      문의글 보기 및 소통하기 <ArrowRight size={14} />
                    </Link>

                    <div className={styles.paidStatusBox}>
                      <CheckCircle size={18} /> 결제 확인 (제작 진행 중)
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
