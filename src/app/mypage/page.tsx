import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getQuotes } from "@/lib/db";
import { CreditCard, CheckCircle, Clock, LogOut, ArrowRight, XCircle } from "lucide-react";
import styles from "./mypage.module.css";

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const userId = await getCurrentUser();
  
  if (!userId) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPromptCard}>
          <div className={styles.loginPromptIcon}>🔒</div>
          <h2>로그인이 필요합니다</h2>
          <p>
            카페24 로그인 연동을 통해 신청하신 견적 목록과 결제창 링크를 안전하게 확인하고 결제를 완료하실 수 있습니다.
          </p>
          <Link href="/api/auth/login" className={styles.payBtn}>
            카페24 아이디로 로그인 <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const allQuotes = await getQuotes();
  // Filter quotes belonging to the logged-in Cafe24 user (case-insensitive)
  const userQuotes = allQuotes
    .filter((q) => q.userId.toLowerCase() === userId.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.titleSection}>
          <h1>마이페이지</h1>
          <p>
            회원정보: <strong>{userId}</strong> (카페24 연동 계정)
          </p>
        </div>
        <Link href="/api/auth/logout" className={styles.logoutBtn}>
          로그아웃 <LogOut size={14} style={{ marginLeft: 6 }} />
        </Link>
      </div>

      {userQuotes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>신청된 견적이 없습니다</div>
          <p className={styles.emptyDesc}>
            원하시는 상품 상세페이지에서 수량과 옵션을 선택하여 견적 문의 또는 주문하기를 접수해 주세요.
          </p>
          <Link href="/collections/all" className={styles.shopBtn}>
            상품 목록 보러가기
          </Link>
        </div>
      ) : (
        <div className={styles.quoteGrid}>
          {userQuotes.map((quote) => (
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
                    <span className={styles.specVal}>{quote.productName} ({quote.colorName})</span>
                  </div>

                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>사이즈 및 수량</span>
                    <span className={styles.specVal}>
                      {Object.entries(quote.quantities)
                        .filter(([, qty]) => qty > 0)
                        .map(([size, qty]) => `${size}(${qty}개)`)
                        .join(", ")}
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
                      <span className={styles.specLabel}>첨부 도안</span>
                      <span className={styles.specVal} style={{ color: "#0052ff" }}>
                        📁 {quote.fileName}
                      </span>
                    </div>
                  )}

                  {quote.requests && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>요청 사항</span>
                      <span className={styles.specVal} style={{ fontWeight: 400, color: "#66666b" }}>
                        {quote.requests}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.actionArea}>
                  <div className={styles.priceDisplay}>
                    <span className={styles.priceLabel}>실시간 산정 금액</span>
                    <span className={styles.priceVal}>₩{quote.totalPrice.toLocaleString()}원</span>
                  </div>

                  {quote.status === "APPROVED" && quote.paymentUrl && (
                    <a
                      href={quote.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.payBtn}
                    >
                      <CreditCard size={16} /> 카페24 결제하기 <ArrowRight size={16} />
                    </a>
                  )}

                  {quote.status === "PAID" && (
                    <div className={styles.paidStatusBox}>
                      <CheckCircle size={18} /> 결제 완료 (제작 진행 중)
                    </div>
                  )}

                  {quote.status === "PENDING" && (
                    <div className={styles.pendingBox}>
                      <Clock size={16} style={{ verticalAlign: "middle", marginRight: 4, display: "inline" }} />
                      관리자가 도안 및 단체 수량 단가를 검토하고 있습니다. 승인이 완료되면 결제 버튼이 나타납니다.
                    </div>
                  )}

                  {quote.status === "REJECTED" && (
                    <div className={styles.pendingBox} style={{ color: "#dc2626" }}>
                      <XCircle size={16} style={{ verticalAlign: "middle", marginRight: 4, display: "inline" }} />
                      해당 견적이 반려되었습니다. 자세한 사항은 카카오톡 상담창에 견적 번호({quote.id})를 남겨주세요.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
