"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import styles from "./auth.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("로그인되었습니다! (테스트 모드)");
  };

  return (
    <div className={styles.container}>
      <div className={styles.gridPattern} />
      
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            영리한<span className={styles.dot}>.</span>
          </Link>
          <h2 className={styles.title}>돌아오신 것을 환영합니다</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">이메일 주소</label>
            <div className={styles.inputWrapper}>
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

        <div className={styles.footer}>
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className={styles.switchLink}>
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
