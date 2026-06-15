"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Quote } from "@/lib/db";
import { ArrowLeft, Download, CreditCard, Copy, RefreshCw, Send } from "lucide-react";
import styles from "../../admin.module.css";

interface QuoteDetailClientProps {
  quote: Quote;
}

export default function QuoteDetailClient({ quote: initialQuote }: QuoteDetailClientProps) {
  const [quote, setQuote] = useState<Quote>(initialQuote);
  const [finalPrice, setFinalPrice] = useState<number>(initialQuote.totalPrice);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_comment",
          comment: {
            sender: "ADMIN",
            senderId: "Admin Manager",
            message: newComment.trim(),
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.quote) {
        setQuote(data.quote);
        setNewComment("");
      } else {
        alert(`댓글 등록 실패: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
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

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", totalPrice: finalPrice }),
      });
      const data = await res.json();
      if (data.success) {
        setQuote(data.quote);
        alert("견적이 승인되고 Cafe24 결제창 링크가 발급되었습니다!");
      } else {
        alert(`승인 에러: ${data.error}`);
      }
    } catch (err: any) {
      console.error(err);
      alert("서버 연결에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("정말 이 견적을 반려 처리하시겠습니까?")) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });
      const data = await res.json();
      if (data.success) {
        setQuote(data.quote);
        alert("반려 처리가 완료되었습니다.");
      } else {
        alert(`반려 에러: ${data.error}`);
      }
    } catch (err: any) {
      console.error(err);
      alert("서버 연결에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncPayment = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/quotes/sync-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      
      if (data.success) {
        // Fetch updated quote details
        const quoteRes = await fetch(`/api/quotes/${quote.id}`);
        const quoteData = await quoteRes.json();
        
        if (quoteData.success) {
          setQuote(quoteData.quote);
          if (quoteData.quote.status === "PAID") {
            alert("결제가 완료된 주문임이 확인되어 결제완료 상태로 업데이트되었습니다!");
          } else {
            alert("카페24에 아직 입금/결제 내역이 확인되지 않습니다.");
          }
        } else {
          alert("업데이트된 견적서 정보를 불러오는 데 실패했습니다.");
        }
      } else {
        alert(`동기화 에러: ${data.message}`);
      }
    } catch (err: any) {
      console.error(err);
      alert("결제 상태 동기화 요청에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (quote.paymentUrl) {
      // Create absolute payment link for copying (relative vs absolute check)
      const absoluteUrl = quote.paymentUrl.startsWith("/")
        ? window.location.origin + quote.paymentUrl
        : quote.paymentUrl;
      navigator.clipboard.writeText(absoluteUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기 중";
      case "APPROVED":
        return "승인 완료 (결제창 생성됨)";
      case "PAID":
        return "결제 완료 (제작 중)";
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
          <h1>견적 상세 관리</h1>
          <p>
            견적번호: <strong>{quote.id}</strong> | 상태:{" "}
            <strong>{getStatusLabel(quote.status)}</strong>
          </p>
        </div>
        <Link href="/admin" className={styles.backBtn}>
          <ArrowLeft size={14} /> 대시보드로 돌아가기
        </Link>
      </div>

      <div className={styles.detailGrid}>
        {/* Left: Option Details */}
        <div className={styles.infoSection}>
          <h2>견적 내역서</h2>
          
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>고객 ID</span>
              <span className={styles.metaValue}>{quote.userId}</span>
            </div>
            
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>신청일</span>
              <span className={styles.metaValue}>
                {new Date(quote.createdAt).toLocaleString("ko-KR")}
              </span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>선택 품목</span>
              <span className={styles.metaValue}>{quote.productName} ({quote.colorName})</span>
            </div>

            <div className={styles.metaItem} style={{ gridColumn: "span 2" }}>
              <span className={styles.metaLabel}>사이즈 및 수량 상세</span>
              <div className={styles.metaValue} style={{ marginTop: 6 }}>
                {quote.colorQuantities ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {Object.entries(quote.colorQuantities).map(([color, sizes]) => {
                      const sizeStr = Object.entries(sizes)
                        .filter(([, qty]) => qty > 0)
                        .map(([size, qty]) => `${size}(${qty}개)`)
                        .join(", ");
                      return sizeStr ? (
                        <div key={color} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span className={styles.positionTag} style={{ margin: 0, padding: "2px 8px", fontSize: "11px", backgroundColor: "#f4f4f5", borderRadius: "6px", fontWeight: 700 }}>{color}</span>
                          <span>{sizeStr}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <span>
                    {Object.entries(quote.quantities)
                      .filter(([, qty]) => qty > 0)
                      .map(([size, qty]) => `${size}(${qty}개)`)
                      .join(", ")}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.metaItemFull} style={{ gridColumn: "span 2" }}>
              <span className={styles.metaLabel}>인쇄 부위 및 기법</span>
              <div className={styles.metaValue} style={{ marginTop: 8 }}>
                {quote.hasPrint ? (
                  <>
                    <div style={{ marginBottom: 8 }}>인쇄 기법: {quote.printMethods.join(", ")}</div>
                    <div className={styles.positionsList}>
                      {quote.selectedPositions.map((pos) => (
                        <span key={pos} className={styles.positionTag}>
                          {pos}. {getPositionName(pos)}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  "인쇄 옵션 없음"
                )}
              </div>
            </div>

            {quote.requests && (
              <div className={styles.metaItemFull} style={{ gridColumn: "span 2" }}>
                <span className={styles.metaLabel}>고객 요청 사항</span>
                <p className={styles.metaValue} style={{ fontWeight: 400, color: "#66666b", whiteSpace: "pre-wrap", marginTop: 6 }}>
                  {quote.requests}
                </p>
              </div>
            )}

            {/* Design File Section */}
            {quote.fileName && (
              <div className={styles.metaItemFull} style={{ gridColumn: "span 2" }}>
                <span className={styles.metaLabel}>도안 파일 (고객 첨부)</span>
                <div style={{ marginTop: 8 }}>
                  <div className={styles.fileCard}>
                    <span className={styles.fileName}>📁 {quote.fileName}</span>
                    <a
                      href={quote.fileUrl}
                      download={quote.fileName}
                      className={styles.downloadBtn}
                    >
                      <Download size={14} /> 파일 다운로드
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Admin-Customer Chat thread section */}
          <div className={styles.adminCommentsSection} style={{ marginTop: "40px", borderTop: "1px solid #000000", paddingTop: "32px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#000000", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              💬 고객 소통 게시판 ({quote.comments?.length || 0})
            </h3>

            <div className={styles.commentsList} style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "300px", overflowY: "auto", marginBottom: "20px", paddingRight: "4px" }}>
              {(!quote.comments || quote.comments.length === 0) ? (
                <div style={{ textAlign: "center", padding: "30px 10px", fontSize: "13px", color: "#a1a1aa" }}>
                  고객과의 댓글 소통 내역이 없습니다. 안내 댓글을 먼저 작성하실 수 있습니다.
                </div>
              ) : (
                quote.comments.map((comment) => {
                  const isAdmin = comment.sender === "ADMIN";
                  return (
                    <div
                      key={comment.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        width: "100%",
                        paddingBottom: "12px",
                        borderBottom: "1px solid #000000",
                        backgroundColor: "#ffffff",
                        border: isAdmin ? "1px solid #000000" : "none",
                        borderRadius: isAdmin ? "8px" : "0",
                        padding: isAdmin ? "12px" : "0 0 12px 0",
                        boxSizing: "border-box",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
                        <span style={{
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "9px",
                          backgroundColor: isAdmin ? "#000000" : "#ffffff",
                          color: isAdmin ? "#ffffff" : "#000000",
                          border: isAdmin ? "none" : "1px solid #000000"
                        }}>
                          {isAdmin ? "관리자" : "고객"}
                        </span>
                        <span style={{ fontWeight: 700, color: "#18181b" }}>{comment.senderId}</span>
                        <span style={{ color: "#a1a1aa" }}>
                          {new Date(comment.createdAt).toLocaleString("ko-KR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          lineHeight: "1.6",
                          color: "#3f3f46",
                          wordBreak: "break-all",
                          whiteSpace: "pre-wrap",
                          marginTop: "4px",
                        }}
                      >
                        {comment.message}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Comment write form */}
            <form onSubmit={handleAddComment} style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid #000000", paddingTop: "16px" }}>
              <textarea
                placeholder="고객에게 안내할 피드백이나 협의 사항을 작성해 주세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  height: "80px",
                  padding: "12px",
                  fontSize: "13px",
                  border: "1px solid #000000",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                  color: "#000000"
                }}
              />
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                style={{
                  alignSelf: "flex-end",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "12px",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "1px solid #000000",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                댓글 등록 <Send size={12} style={{ display: "inline-block", marginLeft: "2px" }} />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Actions form card */}
        <div className={styles.actionCard}>
          <h3>견적 승인 및 결제 관리</h3>
          
          <div className={styles.priceInputGroup}>
            <span className={styles.metaLabel}>최종 결제 금액 확정</span>
            <div className={styles.priceInputWrapper}>
              <span className={styles.currencySymbol}>₩</span>
              <input
                type="number"
                className={styles.priceInput}
                value={finalPrice}
                onChange={(e) => setFinalPrice(Number(e.target.value))}
                disabled={quote.status === "APPROVED" || quote.status === "PAID" || isSubmitting}
              />
            </div>
            <span style={{ fontSize: 11, color: "#a1a1aa", marginTop: 4 }}>
              * 기본 계산된 금액: ₩{quote.totalPrice.toLocaleString()}원
            </span>
          </div>

          {quote.status === "PENDING" && (
            <>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className={styles.approveBtn}
              >
                {isSubmitting ? "처리 중..." : "견적 승인 및 결제창 발급"}
              </button>
              
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className={styles.rejectBtn}
              >
                견적 반려 처리
              </button>
            </>
          )}

          {quote.status === "APPROVED" && (
            <div className={styles.linkBox}>
              <span className={styles.linkLabel}>생성된 Cafe24 결제 링크</span>
              <span className={styles.linkVal}>{quote.paymentUrl}</span>
              
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button onClick={handleCopyLink} className={styles.copyBtn} style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" }}>
                  <Copy size={12} /> {copied ? "✓ 복사" : "링크 복사"}
                </button>
                
                <button 
                  onClick={handleSyncPayment} 
                  disabled={isSubmitting} 
                  className={styles.copyBtn}
                  style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "4px", backgroundColor: "#0052ff", color: "#ffffff" }}
                >
                  <RefreshCw size={12} className={isSubmitting ? "animate-spin" : ""} /> 결제상태 확인
                </button>
              </div>

              {quote.productNo && (
                <div style={{ fontSize: 11, color: "#71717a", marginTop: "12px", borderTop: "1px solid #f4f4f5", paddingTop: "8px", textAlign: "left" }}>
                  <strong>카페24 상품번호:</strong> {quote.productNo}
                </div>
              )}

              <div style={{ fontSize: 11, color: "#a1a1aa", marginTop: 8 }}>
                고객 마이페이지에 자동 노출되며, 카카오톡 상담창에 복사해서 직접 전달하실 수도 있습니다.
              </div>
            </div>
          )}

          {quote.status === "PAID" && (
            <div className={styles.statusDesc} style={{ borderLeft: "4px solid #10b981", backgroundColor: "#f0fdf4" }}>
              <strong style={{ color: "#10b981", display: "block", marginBottom: 4 }}>결제 완료된 주문</strong>
              고객님이 최종 결제를 완료하여 제작 대기 단계입니다. 도안 파일을 내려받아 인쇄 가공을 진행해 주세요.
            </div>
          )}

          {quote.status === "REJECTED" && (
            <div className={styles.statusDesc} style={{ borderLeft: "4px solid #dc2626", backgroundColor: "#fef2f2" }}>
              <strong style={{ color: "#dc2626", display: "block", marginBottom: 4 }}>반려된 견적</strong>
              이 견적서는 반려 상태입니다. 가격 변경이나 도안 재협상이 필요할 경우 고객에게 카카오톡 채널 등으로 안내바랍니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
