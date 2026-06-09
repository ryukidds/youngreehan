"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, User, Mail, Lock } from "lucide-react";
import styles from "@/app/login/auth.module.css";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register-direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        alert("회원가입이 완료되었습니다!");
        window.location.href = "/mypage";
      } else {
        setErrorMsg(data.error || "회원가입에 실패했습니다.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("서버 통신 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.gridPattern} />
      
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            영리한<span className={styles.dot}>.</span>
          </Link>
          <h2 className={styles.title}>시작해 볼까요?</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
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
            <label className={styles.label} htmlFor="username">카페24 아이디</label>
            <div className={styles.inputWrapper}>
              <User size={16} className={styles.inputIcon} />
              <input
                id="username"
                type="text"
                required
                placeholder="희망하는 Cafe24 아이디를 입력하세요"
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="name">이름 / 회사명</label>
            <div className={styles.inputWrapper}>
              <User size={16} className={styles.inputIcon} style={{ opacity: 0.5 }} />
              <input
                id="name"
                type="text"
                required
                placeholder="이름 또는 단체명을 입력하세요"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

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
                disabled={isSubmitting}
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
                placeholder="6자리 이상 입력하세요"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? "가입 진행 중..." : "무료 회원가입"} <ArrowRight size={16} />
          </button>
        </form>

        <div className={styles.footer}>
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className={styles.switchLink}>
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
