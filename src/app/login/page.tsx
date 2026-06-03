"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogIn, Search, User, Lock, FileText, X, Mail } from "lucide-react";
import styles from "./auth.module.css";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"member" | "guest">("member");
  
  // Member Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Guest Order Lookup States
  const [guestName, setGuestName] = useState("");
  const [guestOrderNumber, setGuestOrderNumber] = useState("");
  const [guestPassword, setGuestPassword] = useState("");

  // Find ID/PW Modal States
  const [findModal, setFindModal] = useState<"id" | "pw" | null>(null);
  const [findEmail, setFindEmail] = useState("");
  const [findName, setFindName] = useState("");

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`로그인되었습니다! (아이디: ${email}) (테스트 모드)`);
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
            <form onSubmit={handleMemberSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="email">이메일 주소</label>
                <div className={styles.inputWrapper}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="password">비밀번호</label>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="비밀번호를 입력하세요"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                로그인 <LogIn size={16} />
              </button>
            </form>

            {/* Social Logins */}
            <div className={styles.socialSection}>
              <div className={styles.socialDivider}>
                <span>또는 간편 로그인</span>
              </div>
              <div className={styles.socialButtons}>
                <button
                  type="button"
                  className={styles.kakaoBtn}
                  onClick={() => alert("카카오 간편 로그인 페이지로 이동합니다. (테스트)")}
                >
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.68 2.531-.777 2.94-.123.518.197.51.413.367.17-.113 2.709-1.854 3.793-2.593.435.061.884.093 1.341.093 4.97 0 9-3.186 9-7.115C21 6.185 16.97 3 12 3z"/>
                  </svg>
                  카카오 로그인
                </button>
                <button
                  type="button"
                  className={styles.naverBtn}
                  onClick={() => alert("네이버 간편 로그인 페이지로 이동합니다. (테스트)")}
                >
                  <span className={styles.naverIcon}>N</span>
                  네이버 로그인
                </button>
              </div>
            </div>

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
                  <User size={16} className={styles.inputIcon} />
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
                  <FileText size={16} className={styles.inputIcon} />
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
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    id="guestPassword"
                    type="password"
                    required
                    placeholder="주문 당시 설정한 비밀번호를 입력하세요"
                    className={styles.input}
                    value={guestPassword}
                    onChange={(e) => setGuestPassword(e.target.value)}
                  />
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
