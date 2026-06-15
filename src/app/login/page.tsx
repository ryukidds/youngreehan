"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogIn, Search, X, Eye, EyeOff } from "lucide-react";
import styles from "./auth.module.css";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"member" | "guest">("member");
  
  // Member Login States
  const [email, setEmail] = useState(""); // acts as Cafe24 ID/username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showGuestPassword, setShowGuestPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic actions/urls
  const [formAction, setFormAction] = useState("/exec/front/Member/login/");
  const [returnUrl, setReturnUrl] = useState("/mypage");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (isLocal) {
        setFormAction("https://hypq.cafe24.com/exec/front/Member/login/");
        setReturnUrl(`${window.location.origin}/mypage`);
      } else {
        setFormAction("/exec/front/Member/login/");
        setReturnUrl("/mypage");
      }
    }
  }, []);

  // Guest Order Lookup States
  const [guestName, setGuestName] = useState("");
  const [guestOrderNumber, setGuestOrderNumber] = useState("");
  const [guestPassword, setGuestPassword] = useState("");

  // Find ID/PW Modal States
  const [findModal, setFindModal] = useState<"id" | "pw" | null>(null);
  const [findEmail, setFindEmail] = useState("");
  const [findName, setFindName] = useState("");

  const handleMemberSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // 1. Admin Login (Handles both local & production securely via the backend API)
    if (email === "admin") {
      e.preventDefault();
      setIsSubmitting(true);
      setErrorMsg("");
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        });
        const data = await res.json();
        if (data.success) {
          window.location.href = "/admin";
        } else {
          setErrorMsg(data.error || "관리자 로그인에 실패했습니다.");
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error("Admin login failed:", err);
        setErrorMsg("로그인 처리 중 오류가 발생했습니다.");
        setIsSubmitting(false);
      }
      return;
    }

    // 2. Normal Customer Login
    if (typeof window !== "undefined") {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (isLocal) {
        e.preventDefault(); // Prevent native navigation which drops us on Cafe24 homepage
        setIsSubmitting(true);
        setErrorMsg("");

        try {
          const formData = new FormData(e.currentTarget);
          
          // Submit to Cafe24 directly via fetch with no-cors to bypass Next.js proxy stream issues
          await fetch("https://hypq.cafe24.com/exec/front/Member/login/", {
            method: "POST",
            mode: "no-cors",
            body: formData,
          });

          // Set local mock cookie for localhost session detection
          document.cookie = `cafe24_user=${encodeURIComponent(email)}; path=/; max-age=${3600 * 24 * 7}; SameSite=Lax`;
          window.location.href = "/mypage";
        } catch (err) {
          console.error("Local login failed:", err);
          setErrorMsg("로그인 처리 중 오류가 발생했습니다. (로컬 테스트)");
          setIsSubmitting(false);
        }
      } else {
        // Production: Let native form submit handle it
        setIsSubmitting(true);
      }
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `비회원 주문 조회 완료:\n주문자: ${guestName}님\n주문번호: ${guestOrderNumber}\n\n[주문상태: 제작 중] 영업일 기준 3일 이내에 출고 및 배송 예정입니다. (테스트 모드)`
    );
  };

  const handleFindSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (findModal === "id") {
      alert(`아이디 찾기 결과:\n${findName}님의 가입 이메일(아이디)은 ${findEmail} 입니다. (테스트 모드)`);
    } else {
      alert(`비밀번호 찾기 완료:\n${findEmail} 주소로 비밀번호 재설정 링크가 포함된 메일을 발송했습니다. (테스트 모드)`);
    }
    setFindModal(null);
    setFindEmail("");
    setFindName("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.gridPattern} />
      
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            영리한<span className={styles.dot}>.</span>
          </Link>
          <p className={styles.subtitle}>단체복 및 이커머스 상품 제작의 시작</p>
        </div>

        {/* Tab Control */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === "member" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("member")}
          >
            회원 로그인
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "guest" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("guest")}
          >
            비회원 주문 조회
          </button>
        </div>

        {activeTab === "member" ? (
          /* Member Login Form */
          <>
            <form
              action={formAction}
              method="POST"
              onSubmit={handleMemberSubmit}
              className={styles.form}
            >
              <input type="hidden" name="returnUrl" value={returnUrl} />
              <input type="hidden" name="forbidIpUrl" value="/" />
              <input type="hidden" name="certificationUrl" value="/intro/adult_certification.html" />
              <input type="hidden" name="sIsSnsCheckid" value="" />
              <input type="hidden" name="sProvider" value="" />
              <input type="hidden" name="ch_ref" value="" />
              <input type="hidden" name="checkoutToken" value="" />

              {errorMsg && (
                <div style={{
                  color: "#dc2626",
                  backgroundColor: "#fef2f2",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textAlign: "center"
                }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="email">아이디</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="email"
                    name="member_id"
                    type="text"
                    required
                    placeholder="아이디를 입력하세요"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="password">비밀번호</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="password"
                    name="member_passwd"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="비밀번호를 입력하세요"
                    className={`${styles.input} ${styles.inputWithAction}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggleBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "로그인 중..." : "로그인"} <LogIn size={16} />
              </button>
            </form>

            {/* Social Logins removed */}

            {/* Member Support Links */}
            <div className={styles.memberLinks}>
              <Link href="/signup" className={styles.memberLinkItem}>
                회원가입
              </Link>
              <span className={styles.linkDivider}>|</span>
              <button
                type="button"
                className={styles.memberLinkBtn}
                onClick={() => setFindModal("id")}
              >
                아이디 찾기
              </button>
              <span className={styles.linkDivider}>|</span>
              <button
                type="button"
                className={styles.memberLinkBtn}
                onClick={() => setFindModal("pw")}
              >
                비밀번호 찾기
              </button>
            </div>
          </>
        ) : (
          /* Guest Order Lookup Form */
          <>
            <div className={styles.guestInfoText}>
              비회원 고객님은 주문 당시 입력하셨던 <br />
              <strong>주문자명, 주문번호, 주문 비밀번호</strong>를 입력하여 조회하실 수 있습니다.
            </div>
            
            <form onSubmit={handleGuestSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="guestName">주문자명</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="guestName"
                    type="text"
                    required
                    placeholder="주문자 이름을 입력하세요"
                    className={styles.input}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="guestOrderNumber">주문번호</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="guestOrderNumber"
                    type="text"
                    required
                    placeholder="주문번호를 입력하세요 (예: YR-123456)"
                    className={styles.input}
                    value={guestOrderNumber}
                    onChange={(e) => setGuestOrderNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="guestPassword">주문 비밀번호</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="guestPassword"
                    type={showGuestPassword ? "text" : "password"}
                    required
                    placeholder="주문 당시 설정한 비밀번호를 입력하세요"
                    className={`${styles.input} ${styles.inputWithAction}`}
                    value={guestPassword}
                    onChange={(e) => setGuestPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggleBtn}
                    onClick={() => setShowGuestPassword(!showGuestPassword)}
                    title={showGuestPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showGuestPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                주문 조회 <Search size={16} />
              </button>
            </form>
          </>
        )}
      </div>

      {/* Find ID / PW Modal */}
      {findModal && (
        <div className={styles.modalOverlay} onClick={() => setFindModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setFindModal(null)}
            >
              <X size={20} />
            </button>
            
            <h3 className={styles.modalTitle}>
              {findModal === "id" ? "아이디 찾기" : "비밀번호 찾기"}
            </h3>
            
            <p className={styles.modalDesc}>
              {findModal === "id"
                ? "회원가입 시 등록했던 이름과 이메일을 입력하세요."
                : "가입 시 등록하신 이메일 주소를 입력해 주세요."}
            </p>

            <form onSubmit={handleFindSubmit} className={styles.modalForm}>
              {findModal === "id" && (
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="findName">이름</label>
                  <input
                    id="findName"
                    type="text"
                    required
                    placeholder="가입자 이름"
                    className={styles.input}
                    value={findName}
                    onChange={(e) => setFindName(e.target.value)}
                  />
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="findEmail">
                  {findModal === "id" ? "이메일" : "가입한 이메일 주소"}
                </label>
                <input
                  id="findEmail"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className={styles.input}
                  value={findEmail}
                  onChange={(e) => setFindEmail(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.modalSubmitBtn}>
                확인
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
