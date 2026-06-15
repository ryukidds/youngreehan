"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Quote, QuoteComment } from "@/lib/db";
import { getClientCurrentUser } from "@/lib/sessionClient";
import styles from "./post.module.css";

interface QuoteInquiryPostClientProps {
  quote: Quote;
}

export default function QuoteInquiryPostClient({ quote: initialQuote }: QuoteInquiryPostClientProps) {
  const [quote, setQuote] = useState<Quote>(initialQuote);
  const [comments, setComments] = useState<QuoteComment[]>(initialQuote.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [commentWriter, setCommentWriter] = useState("");
  
  // Password gate state
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(
    (initialQuote as any).isAuthorizedInitial ?? !(initialQuote as any).hasPassword
  );
  const [passwordError, setPasswordError] = useState(false);

  const commentEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getClientCurrentUser();
    setCurrentUser(user);
    if (user) {
      setCommentWriter(user);
      // Auto-authorize if user is admin or the quote's author
      if (user === "admin" || user.toLowerCase() === initialQuote.userId.toLowerCase()) {
        setIsAuthorized(true);
      }
    }
  }, [initialQuote.userId]);

  useEffect(() => {
    if (isAuthorized) {
      commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments, isAuthorized]);

  // Fetch full details if authorized but not loaded (e.g. after password check or auto-auth)
  useEffect(() => {
    if (isAuthorized && !quote.totalPrice) {
      const fetchDetails = async () => {
        try {
          const res = await fetch(`/api/quotes/${quote.id}`);
          const data = await res.json();
          if (data.success && data.quote) {
            setQuote(data.quote);
            setComments(data.quote.comments || []);
          }
        } catch (err) {
          console.error("Failed to fetch quote details:", err);
        }
      };
      fetchDetails();
    }
  }, [isAuthorized, quote.id, quote.totalPrice]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/quotes/${quote.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthorized(true);
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
    } catch (err) {
      console.error(err);
      setPasswordError(true);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!currentUser && !commentWriter.trim()) {
      alert("댓글 작성을 위해 닉네임을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const senderId = currentUser || commentWriter.trim();
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_comment",
          comment: {
            sender: "USER",
            senderId,
            message: newComment.trim(),
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.quote) {
        setQuote(data.quote);
        setComments(data.quote.comments || []);
        setNewComment("");
      } else {
        alert(`댓글 등록 실패: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("댓글 등록 도중 오류가 발생했습니다.");
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

  // Password Verification Gate View
  if (!isAuthorized) {
    return (
      <div className={styles.container} style={{ maxWidth: "480px", margin: "100px auto" }}>
        <Link href="/board/estimate" className={styles.backBtn}>
          &lt; 목록으로 돌아가기
        </Link>
        <div style={{
          border: "1px solid #e4e4e7",
          borderRadius: "12px",
          padding: "40px 30px",
          backgroundColor: "#ffffff",
          marginTop: "20px"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#18181b", marginBottom: "12px", textAlign: "center" }}>비밀번호 확인</h2>
          <p style={{ fontSize: "13px", color: "#71717a", marginBottom: "24px", lineHeight: "1.6", textAlign: "center" }}>
            이 글은 비회원 비밀글입니다. 견적 문의 신청 시 설정했던 숫자 비밀번호 4자리를 입력해 주세요.
          </p>
          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              type="password"
              maxLength={4}
              placeholder="비밀번호 4자리"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "14px",
                border: "1px solid #e4e4e7",
                borderRadius: "8px",
                boxSizing: "border-box",
                textAlign: "center",
                outline: "none",
              }}
            />
            {passwordError && (
              <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: 700, textAlign: "center" }}>
                비밀번호가 올바르지 않습니다. 다시 입력해 주세요.
              </span>
            )}
            <button
              type="submit"
              style={{
                backgroundColor: "#0052ff",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "background-color 0.15s ease",
              }}
            >
              확인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/board/estimate" className={styles.backBtn}>
        &lt; 목록으로 돌아가기
      </Link>

      <div className={styles.unifiedPostCard}>
        {/* Header Block */}
        <div className={styles.postHeader}>
          <div className={styles.titleRow}>
            <span className={getStatusBadgeClass(quote.status)}>
              {getStatusLabel(quote.status)}
            </span>
            <h1 className={styles.postTitle}>
              {quote.title || `[견적문의] ${quote.productName} 단체 문의`}
            </h1>
          </div>
          
          <div className={styles.postMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>작성자:</span>
              <span className={styles.metaVal}>{quote.writerName || quote.userId}</span>
            </div>
            <span className={styles.metaDivider}>|</span>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>작성일:</span>
              <span className={styles.metaVal}>
                {new Date(quote.createdAt).toLocaleString("ko-KR")}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Specs Block */}
        <div className={styles.postBody}>
          <h3 className={styles.bodySectionTitle}>선택 사양 명세서</h3>
          
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
              <span className={styles.specLabel}>사이즈별 수량</span>
              <span className={styles.specVal}>
                {quote.colorQuantities ? (
                  <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {Object.entries(quote.colorQuantities).map(([color, sizes]) => {
                      const sizeStr = Object.entries(sizes)
                        .filter(([, qty]) => qty > 0)
                        .map(([size, qty]) => `${size}(${qty}개)`)
                        .join(", ");
                      return sizeStr ? (
                        <span key={color} style={{ display: "block" }}>
                          <span className={styles.colorTag}>{color}</span>: {sizeStr}
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
              <span className={styles.specLabel}>인쇄 기법 및 부위</span>
              <span className={styles.specVal}>
                {quote.hasPrint ? (
                  <>
                    <div style={{ marginBottom: "6px" }}>기법: {quote.printMethods.join(", ")}</div>
                    <div className={styles.positionsList}>
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
                <span className={styles.specLabel}>도안 파일</span>
                <span className={styles.specVal}>
                  <div className={styles.fileCard}>
                    <span className={styles.fileName}>[파일] {quote.fileName}</span>
                    <a href={quote.fileUrl} download={quote.fileName} className={styles.downloadBtn}>
                      다운로드
                    </a>
                  </div>
                </span>
              </div>
            )}

            {quote.requests && (
              <div className={styles.specRow} style={{ borderBottom: "none" }}>
                <span className={styles.specLabel}>추가 요청 사항</span>
                <span className={styles.specVal} style={{ fontWeight: 400, color: "#4b5563", whiteSpace: "pre-wrap" }}>
                  {quote.requests}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Final Quote & Payment Block */}
        <div className={styles.checkoutSection}>
          <h3 className={styles.bodySectionTitle}>최종 견적 및 결제</h3>
          <div className={styles.checkoutRow}>
            <div className={styles.priceContainer}>
              <span className={styles.priceLabel}>총 견적 금액</span>
              <span className={styles.priceVal}>₩{quote.totalPrice.toLocaleString()}원</span>
            </div>
            
            <div className={styles.paymentActions}>
              {quote.status === "PENDING" && (
                <div className={styles.statusNoticeBox} style={{ borderLeft: "4px solid #f59e0b", backgroundColor: "#ffffff", margin: 0 }}>
                  <div>
                    <strong style={{ color: "#d97706", display: "block", marginBottom: "4px" }}>관리자 승인 대기 중</strong>
                    관리자가 사양 확인 후 최종 결제 가격을 검토하고 있습니다. 조율 사항이 있다면 아래 댓글창에 글을 남겨주세요.
                  </div>
                </div>
              )}

              {quote.status === "APPROVED" && quote.paymentUrl && (
                <div className={styles.approvedBox}>
                  <div className={styles.statusNoticeBox} style={{ borderLeft: "4px solid #2563eb", backgroundColor: "#ffffff", marginBottom: "16px", margin: 0 }}>
                    <div>
                      <strong style={{ color: "#2563eb", display: "block", marginBottom: "4px" }}>최종 견적 승인 완료</strong>
                      관리자가 사양을 승인하고 최종 단가를 확정했습니다. 아래 버튼을 눌러 결제를 완료해 주세요.
                    </div>
                  </div>
                  <a href={quote.paymentUrl} target="_blank" rel="noopener noreferrer" className={styles.payBtn}>
                    결제 진행하기
                  </a>
                </div>
              )}

              {quote.status === "PAID" && (
                <div className={styles.statusNoticeBox} style={{ borderLeft: "4px solid #10b981", backgroundColor: "#ffffff", margin: 0 }}>
                  <div>
                    <strong style={{ color: "#059669", display: "block", marginBottom: "4px" }}>결제 및 주문 완료</strong>
                    성공적으로 결제가 완료되었습니다. 공장 제작 공정 단계가 진행 중입니다.
                  </div>
                </div>
              )}

              {quote.status === "REJECTED" && (
                <div className={styles.statusNoticeBox} style={{ borderLeft: "4px solid #ef4444", backgroundColor: "#ffffff", margin: 0 }}>
                  <div>
                    <strong style={{ color: "#dc2626", display: "block", marginBottom: "4px" }}>반려된 견적 문의</strong>
                    해당 요청 건이 반려되었습니다. 댓글창의 협의 사유를 확인해 보시거나 관리자에게 상담을 진행해 주세요.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments Block */}
        <div className={styles.commentsSection}>
          <div className={styles.commentsHeader}>
            <span>답변 및 의견 소통 ({comments.length})</span>
          </div>

          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <div className={styles.noComments}>
                소통 댓글 내역이 없습니다. 가공 위치 변경, 단체 가격 협의 등을 위해 첫 댓글을 작성해보세요!
              </div>
            ) : (
              comments.map((comment) => {
                const isAdmin = comment.sender === "ADMIN";
                return (
                  <div
                    key={comment.id}
                    className={`${styles.commentWrapper} ${isAdmin ? styles.adminMsg : styles.userMsg}`}
                  >
                    <div className={styles.commentInfo}>
                      <span className={styles.senderBadge}>
                        {isAdmin ? "관리자" : "고객"}
                      </span>
                      <span className={styles.senderName}>{comment.senderId}</span>
                      <span className={styles.commentTime}>
                        {new Date(comment.createdAt).toLocaleString("ko-KR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <div className={styles.commentBubble}>
                      {comment.message}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={commentEndRef} />
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className={styles.commentForm}>
            {!currentUser && (
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#000000" }}>댓글 작성자명:</label>
                <input
                  type="text"
                  placeholder="닉네임 입력"
                  value={commentWriter}
                  onChange={(e) => setCommentWriter(e.target.value)}
                  required
                  style={{
                    padding: "6px 10px",
                    fontSize: "12px",
                    border: "1px solid #000000",
                    borderRadius: "6px",
                    outline: "none",
                    width: "120px",
                  }}
                />
              </div>
            )}
            <textarea
              placeholder="가공 도안이나 단가 협의 등 관리자에게 전할 말을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
              className={styles.textarea}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className={styles.commentSubmitBtn}
            >
              댓글 등록
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
