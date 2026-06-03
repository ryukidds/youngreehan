"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, User, Mail, Lock } from "lucide-react";
import styles from "@/app/login/auth.module.css";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("회원가입 신청이 완료되었습니다! (테스트 모드)");
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
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="name">이름 / 회사명</label>
            <div className={styles.inputWrapper}>
              <User size={16} className={styles.inputIcon} />
              <input
                id="name"
                type="text"
                required
                placeholder="이름 또는 단체명을 입력하세요"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            무료 회원가입 <ArrowRight size={16} />
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
