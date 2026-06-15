"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Quote } from "@/lib/db";
import { 
  Search, 
  Download, 
  RefreshCw, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import styles from "./admin.module.css";

interface AdminDashboardClientProps {
  initialQuotes: Quote[];
  isConnected: boolean;
  connectionDetail: string;
  mallId?: string;
  issuedAt?: number;
  expiresAt?: number;
  authSuccess: boolean;
  authError: string | null;
  syncSuccess: boolean;
  syncCount: string;
  syncError: string | null;
}

export default function AdminDashboardClient({
  initialQuotes,
  isConnected,
  connectionDetail,
  mallId,
  issuedAt,
  expiresAt,
  authSuccess,
  authError,
  syncSuccess,
  syncCount,
  syncError,
}: AdminDashboardClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "PAID" | "REJECTED">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "price_desc" | "price_asc" | "qty_desc">("newest");
  const [isPending, startTransition] = useTransition();

  // Mapped print position helper
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

  // KPI calculations
  const totalQuotes = initialQuotes.length;
  const pendingCount = initialQuotes.filter((q) => q.status === "PENDING").length;
  const approvedCount = initialQuotes.filter((q) => q.status === "APPROVED").length;
  const paidCount = initialQuotes.filter((q) => q.status === "PAID").length;

  // Formatting dates helper
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  // Status badges helper
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

  // Quotes filter & sort logic
  const filteredQuotes = initialQuotes
    .filter((q) => {
      // 1. Search term filter
      const term = searchTerm.toLowerCase().trim();
      if (term !== "") {
        const matchesId = q.id.toLowerCase().includes(term);
        const matchesUser = q.userId.toLowerCase().includes(term);
        const matchesProduct = q.productName.toLowerCase().includes(term);
        if (!matchesId && !matchesUser && !matchesProduct) return false;
      }

      // 2. Status tab filter
      if (activeTab !== "ALL" && q.status !== activeTab) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // 3. Sorting logic
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "price_desc") {
        return b.totalPrice - a.totalPrice;
      }
      if (sortBy === "price_asc") {
        return a.totalPrice - b.totalPrice;
      }
      if (sortBy === "qty_desc") {
        const qtyA = Object.values(a.quantities).reduce((sum, val) => sum + val, 0);
        const qtyB = Object.values(b.quantities).reduce((sum, val) => sum + val, 0);
        return qtyB - qtyA;
      }
      return 0;
    });

  return (
    <div>
      {/* Alert Banners */}
      {authSuccess && (
        <div className={`${styles.alertBanner} ${styles.alertSuccess}`}>
          <CheckCircle size={18} />
          <span>카페24 API 연동 인증이 성공적으로 완료되었습니다!</span>
        </div>
      )}
      {authError && (
        <div className={`${styles.alertBanner} ${styles.alertError}`}>
          <XCircle size={18} />
          <span>카페24 인증 중 오류가 발생했습니다: {decodeURIComponent(authError)}</span>
        </div>
      )}
      {syncSuccess && (
        <div className={`${styles.alertBanner} ${styles.alertSuccess}`}>
          <CheckCircle size={18} />
          <span>결제 내역 동기화 완료! 총 {syncCount}개의 견적이 결제 완료 상태로 업데이트되었습니다.</span>
        </div>
      )}
      {syncError && (
        <div className={`${styles.alertBanner} ${styles.alertError}`}>
          <XCircle size={18} />
          <span>동기화 중 오류가 발생했습니다: {decodeURIComponent(syncError)}</span>
        </div>
      )}

      {/* Connection Banner & Session Info */}
      <div className={styles.connectionBanner}>
        <div className={styles.statusIndicator}>
          <div className={isConnected ? styles.connectedDot : styles.disconnectedDot} />
          <div>
            <div className={styles.statusText}>
              카페24 API 연동 상태: {isConnected ? "연결 완료" : "인증 필요"}
            </div>
            <div className={styles.statusDesc}>{connectionDetail}</div>
            
            {isConnected && (
              <div className={styles.adminInfoTable}>
                <span className={styles.adminInfoLabel}>연동 쇼핑몰 ID:</span>
                <span className={styles.adminInfoVal}>{mallId}</span>
                <span className={styles.adminInfoLabel}>토큰 발급 일시:</span>
                <span className={styles.adminInfoVal}>{formatDate(issuedAt)}</span>
                <span className={styles.adminInfoLabel}>토큰 만료 예정:</span>
                <span className={styles.adminInfoVal}>{formatDate(expiresAt)}</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.actionButtons}>
          <a href="/api/auth/cafe24/login" className={styles.connectBtn}>
            <ExternalLink size={14} /> 카페24 어드민 인증
          </a>
          <form action="/api/admin/quotes/sync-payments" method="POST" style={{ margin: 0 }}>
            <button type="submit" disabled={!isConnected} className={styles.syncBtn}>
              <RefreshCw size={14} /> 결제 상태 동기화
            </button>
          </form>
        </div>
      </div>

      {/* Dynamic Summary Cards (No Revenue) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "32px",
        textAlign: "left"
      }}>
        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "16px", border: "1px solid #e4e4e7" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#71717a", textTransform: "uppercase" }}>총 접수 견적</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#000000", marginTop: "8px" }}>{totalQuotes}건</div>
        </div>
        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "16px", border: "1px solid #e4e4e7" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#d97706", textTransform: "uppercase" }}>검토 대기중</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#d97706", marginTop: "8px" }}>{pendingCount}건</div>
        </div>
        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "16px", border: "1px solid #e4e4e7" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>결제 대기중</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#2563eb", marginTop: "8px" }}>{approvedCount}건</div>
        </div>
        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "16px", border: "1px solid #e4e4e7" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#059669", textTransform: "uppercase" }}>결제 및 입금 완료</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#059669", marginTop: "8px" }}>{paidCount}건</div>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className={styles.filterSection}>
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="고객 ID 또는 상품명 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterControls}>
          <div className={styles.filterTabs}>
            <button
              onClick={() => setActiveTab("ALL")}
              className={`${styles.tabButton} ${activeTab === "ALL" ? styles.activeTab : ""}`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveTab("PENDING")}
              className={`${styles.tabButton} ${activeTab === "PENDING" ? styles.activeTab : ""}`}
            >
              대기 중
            </button>
            <button
              onClick={() => setActiveTab("APPROVED")}
              className={`${styles.tabButton} ${activeTab === "APPROVED" ? styles.activeTab : ""}`}
            >
              승인됨
            </button>
            <button
              onClick={() => setActiveTab("PAID")}
              className={`${styles.tabButton} ${activeTab === "PAID" ? styles.activeTab : ""}`}
            >
              완료
            </button>
            <button
              onClick={() => setActiveTab("REJECTED")}
              className={`${styles.tabButton} ${activeTab === "REJECTED" ? styles.activeTab : ""}`}
            >
              반려
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={styles.sortSelect}
          >
            <option value="newest">최신 등록순</option>
            <option value="price_desc">금액 높은순</option>
            <option value="price_asc">금액 낮은순</option>
            <option value="qty_desc">수량 많은순</option>
          </select>
        </div>
      </div>

      {/* Card Grid View */}
      {filteredQuotes.length === 0 ? (
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "60px 20px",
          border: "1px solid #e4e4e7",
          textAlign: "center",
          color: "#71717a"
        }}>
          조건에 부합하는 견적서가 없습니다.
        </div>
      ) : (
        <div className={styles.quoteGrid}>
          {filteredQuotes.map((quote) => {
            const totalQty = Object.values(quote.quantities).reduce((a, b) => a + b, 0);
            
            // Print method and position mapping
            const printSummary = quote.printMethods && quote.printMethods.length > 0 
              ? `${quote.printMethods.join(", ")} (${quote.selectedPositions.map(getPositionName).join(", ")})`
              : "인쇄 없음";

            return (
              <div key={quote.id} className={styles.quoteCard}>
                
                {/* Card Header */}
                <div className={styles.quoteCardHeader}>
                  <div className={styles.quoteIdGroup}>
                    <span className={styles.quoteIdText}>{quote.id}</span>
                    <span className={styles.userIdText}>신청 고객 ID: <strong>{quote.userId}</strong></span>
                  </div>
                  <span className={getStatusBadgeClass(quote.status)}>
                    {getStatusLabel(quote.status)}
                  </span>
                </div>

                {/* Card Body */}
                <div className={styles.quoteCardBody}>
                  {/* Product Title */}
                  <div className={styles.cardProductTitle}>
                    {quote.productName}
                    <span className={styles.colorPill}>{quote.colorName}</span>
                  </div>

                  {/* Size breakdown badges */}
                  {quote.colorQuantities ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start", width: "100%" }}>
                      {Object.entries(quote.colorQuantities).map(([color, sizes]) => {
                        const hasSizes = Object.values(sizes).some(qty => qty > 0);
                        if (!hasSizes) return null;
                        return (
                          <div key={color} style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                            <span className={styles.colorPill} style={{ margin: 0, padding: "2px 8px", fontSize: "11px", backgroundColor: "#f4f4f5", fontWeight: 700 }}>{color}</span>
                            {Object.entries(sizes).map(([size, qty]) => {
                              if (qty === 0) return null;
                              return (
                                <span key={size} className={`${styles.sizeBadge} ${styles.sizeBadgeActive}`} style={{ fontSize: "11px", padding: "2px 6px" }}>
                                  {size}: {qty}개
                                </span>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={styles.sizeBadgesGroup}>
                      {Object.entries(quote.quantities).map(([size, qty]) => {
                        if (qty === 0) return null;
                        return (
                          <span key={size} className={`${styles.sizeBadge} ${styles.sizeBadgeActive}`}>
                            {size}: {qty}개
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Print Spec */}
                  {quote.hasPrint && (
                    <div className={styles.printInfo}>
                      <span className={styles.printInfoTitle}>
                        🎨 인쇄 스펙
                      </span>
                      <span>{printSummary}</span>
                    </div>
                  )}

                  {/* Customer requests */}
                  {quote.requests ? (
                    <div className={styles.requestBox}>
                      "{quote.requests}"
                    </div>
                  ) : (
                    <div style={{ fontSize: "12px", color: "#a1a1aa", fontStyle: "italic", textAlign: "left" }}>
                      작성된 고객 요청사항 없음
                    </div>
                  )}

                  {/* Attachment Direct Download Button */}
                  {quote.fileName ? (
                    <div className={styles.cardAttachment}>
                      <span className={styles.attachmentLabel} title={quote.fileName}>
                        📁 {quote.fileName}
                      </span>
                      <a 
                        href={quote.fileUrl} 
                        download={quote.fileName}
                        className={styles.cardDownloadBtn}
                      >
                        <Download size={12} /> 도안 다운로드
                      </a>
                    </div>
                  ) : (
                    <div style={{ fontSize: "12px", color: "#d4d4d8", textAlign: "left" }}>
                      첨부된 도안 파일 없음
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className={styles.quoteCardFooter}>
                  <div className={styles.priceDisplay}>
                    <span className={styles.priceLabel}>총 수량 {totalQty}개 합산가</span>
                    <span className={styles.priceAmount}>₩{quote.totalPrice.toLocaleString()}원</span>
                  </div>
                  
                  <Link href={`/admin/quotes/${quote.id}`} className={styles.detailBtn}>
                    상세관리 <ChevronRight size={12} style={{ display: "inline-block", verticalAlign: "middle" }} />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
