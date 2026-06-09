import React from "react";
import Link from "next/link";
import { getQuotes } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const quotes = await getQuotes();
  // Sort quotes newest first
  const sortedQuotes = [...quotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
          <h1>관리자 견적 어드민 대시보드</h1>
          <p>고객들로부터 신청받은 모든 단체 주문 견적서와 도안 파일을 관리합니다.</p>
        </div>
        <Link href="/" className={styles.backBtn}>
          <ArrowLeft size={14} /> 메인 홈페이지
        </Link>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>견적번호</th>
                <th>신청고객</th>
                <th>선택 상품</th>
                <th>합계 수량</th>
                <th>예상 가격</th>
                <th>첨부 도안</th>
                <th>신청일</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {sortedQuotes.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "40px" }}>
                    아직 신청된 견적이 존재하지 않습니다.
                  </td>
                </tr>
              ) : (
                sortedQuotes.map((quote) => {
                  const totalQty = Object.values(quote.quantities).reduce((a, b) => a + b, 0);
                  return (
                    <tr key={quote.id}>
                      <td>
                        <strong>{quote.id}</strong>
                      </td>
                      <td>{quote.userId}</td>
                      <td>
                        {quote.productName} ({quote.colorName})
                      </td>
                      <td>{totalQty}개</td>
                      <td>₩{quote.totalPrice.toLocaleString()}원</td>
                      <td>
                        {quote.fileName ? (
                          <span style={{ color: "#0052ff", fontWeight: 700 }}>
                            📁 {quote.fileName.substring(0, 15)}
                            {quote.fileName.length > 15 && "..."}
                          </span>
                        ) : (
                          <span style={{ color: "#a1a1aa" }}>없음</span>
                        )}
                      </td>
                      <td>{new Date(quote.createdAt).toLocaleDateString("ko-KR")}</td>
                      <td>
                        <span className={getStatusBadgeClass(quote.status)}>
                          {getStatusLabel(quote.status)}
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/quotes/${quote.id}`} className={styles.rowLink}>
                          상세보기
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
