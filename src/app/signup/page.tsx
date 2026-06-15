"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import styles from "@/app/login/auth.module.css";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Cellphone components
  const [mobile1, setMobile1] = useState("010");
  const [mobile2, setMobile2] = useState("");
  const [mobile3, setMobile3] = useState("");

  // Agreement states
  const [agreeToS, setAgreeToS] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeSMS, setAgreeSMS] = useState(false);
  const [agreeEmail, setAgreeEmail] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic actions/urls
  const [formAction, setFormAction] = useState("/exec/front/Member/join/");
  const [returnUrl, setReturnUrl] = useState("/mypage");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (isLocal) {
        setFormAction("https://hypq.cafe24.com/exec/front/Member/join/");
        setReturnUrl(`${window.location.origin}/mypage`);
      } else {
        setFormAction("/exec/front/Member/join/");
        setReturnUrl("/mypage");
      }
    }
  }, []);

  // Helper: Digit-only handler for phone inputs
  const handleDigitChange = (value: string, setter: (val: string) => void, maxLength: number) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= maxLength) {
      setter(digits);
    }
  };

  // Helper: Toggle all agreements
  const handleAgreeAllChange = (checked: boolean) => {
    setAgreeToS(checked);
    setAgreePrivacy(checked);
    setAgreeSMS(checked);
    setAgreeEmail(checked);
  };

  // Helper: Toggle marketing options together
  const handleMarketingChange = (checked: boolean) => {
    setAgreeSMS(checked);
    setAgreeEmail(checked);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Always prevent native HTML form submit to bypass Next.js rewrites body stream bugs
    setErrorMsg("");

    // Frontend Validations
    if (password !== confirmPassword) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!agreeToS || !agreePrivacy) {
      setErrorMsg("필수 약관에 동의하셔야 회원가입이 가능합니다.");
      return;
    }

    if (mobile2.length < 3 || mobile3.length !== 4) {
      setErrorMsg("올바른 휴대전화 번호를 입력하세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const phone = `${mobile1}-${mobile2}-${mobile3}`;
      const res = await fetch("/api/cafe24/customers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_id: username,
          name,
          email,
          password,
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "회원가입에 실패했습니다.");
      }

      // Set cookie for session detection (used by getCurrentUser and getClientCurrentUser)
      document.cookie = `cafe24_user=${encodeURIComponent(username)}; path=/; max-age=${3600 * 24 * 7}; SameSite=Lax`;
      
      // Redirect locally or production to mypage
      window.location.href = "/mypage";
    } catch (err: any) {
      console.error("Signup failed:", err);
      setErrorMsg(err.message || "회원가입 처리 중 오류가 발생했습니다.");
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

        <form
          action={formAction}
          method="POST"
          onSubmit={handleSubmit}
          className={styles.form}
        >
          {/* Cafe24 Hidden Fields */}
          <input type="hidden" name="useSimpleSignin" value="T" />
          <input type="hidden" name="passwd_type" value="C" />
          <input type="hidden" name="returnUrl" value={returnUrl} />
          <input type="hidden" name="is_use_checking_join_info" value="F" />
          <input type="hidden" name="member_name_cert_flag" value="F" />
          <input type="hidden" name="is_name_auth_use" value="F" />
          <input type="hidden" name="is_ipin_auth_use" value="F" />
          <input type="hidden" name="is_mobile_auth_use" value="F" />
          <input type="hidden" name="is_email_auth_use" value="F" />
          <input type="hidden" name="default_auth_reg_page_flag" value="E" />
          <input type="hidden" name="realNameEncrypt" value="" />
          <input type="hidden" name="is_display_register_foreign" value="T" />
          <input type="hidden" name="login_id_type" value="id" />
          <input type="hidden" name="sUseCountryNumberFlag" value="T" />
          <input type="hidden" name="sUseSeparationNameFlag" value="F" />
          <input type="hidden" name="ch_ref" value="" />
          <input type="hidden" name="checkoutToken" value="" />

          {/* Email split inputs - computed directly in JSX */}
          <input type="hidden" name="email1" value={email.split("@")[0] || ""} />
          <input type="hidden" name="email2" value={email.split("@")[1] || ""} />

          {/* Mobile phone split inputs */}
          <input type="hidden" name="mobile[]" value={mobile1} />
          <input type="hidden" name="mobile[]" value={mobile2} />
          <input type="hidden" name="mobile[]" value={mobile3} />

          {/* Agreements hidden inputs */}
          <input type="hidden" name="is_sms" value={agreeSMS ? "T" : "F"} />
          <input type="hidden" name="is_news_mail" value={agreeEmail ? "T" : "F"} />
          <input type="hidden" name="marketing_consent_check" value={(agreeSMS || agreeEmail) ? "T" : "F"} />

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
            <label className={styles.label} htmlFor="username">아이디</label>
            <div className={styles.inputWrapper}>
              <input
                id="username"
                name="member_id"
                type="text"
                required
                placeholder="아이디를 입력하세요"
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
              <input
                id="name"
                name="name"
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
            <label className={styles.label}>휴대전화</label>
            <div className={styles.phoneGroup}>
              <select
                className={styles.phoneSelect}
                value={mobile1}
                onChange={(e) => setMobile1(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span className={styles.phoneSeparator}>-</span>
              <input
                type="text"
                required
                className={styles.phoneInput}
                value={mobile2}
                onChange={(e) => handleDigitChange(e.target.value, setMobile2, 4)}
                disabled={isSubmitting}
                placeholder="0000"
              />
              <span className={styles.phoneSeparator}>-</span>
              <input
                type="text"
                required
                className={styles.phoneInput}
                value={mobile3}
                onChange={(e) => handleDigitChange(e.target.value, setMobile3, 4)}
                disabled={isSubmitting}
                placeholder="0000"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">비밀번호</label>
            <div className={styles.inputWrapper}>
              <input
                id="password"
                name="passwd"
                type={showPassword ? "text" : "password"}
                required
                placeholder="6자리 이상 입력하세요"
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

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="confirmPassword">비밀번호 확인</label>
            <div className={styles.inputWrapper}>
              <input
                id="confirmPassword"
                name="user_passwd_confirm"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="비밀번호를 한번 더 입력하세요"
                className={`${styles.input} ${styles.inputWithAction}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className={styles.passwordToggleBtn}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms and Agreements Checkbox checklist */}
          <div className={styles.agreementContainer}>
            <div className={`${styles.agreementItem} ${styles.agreementHeader}`}>
              <input
                type="checkbox"
                id="agreeAll"
                className={styles.checkboxInput}
                checked={agreeToS && agreePrivacy && agreeSMS && agreeEmail}
                onChange={(e) => handleAgreeAllChange(e.target.checked)}
                disabled={isSubmitting}
              />
              <label htmlFor="agreeAll" className={styles.checkboxLabel}>
                모든 약관을 확인하고 전체 동의합니다.
              </label>
            </div>
            
            <div className={styles.agreementItem}>
              <input
                type="checkbox"
                id="agreeToS"
                name="agree_service_check[]"
                value="1"
                className={styles.checkboxInput}
                checked={agreeToS}
                onChange={(e) => setAgreeToS(e.target.checked)}
                disabled={isSubmitting}
              />
              <label htmlFor="agreeToS" className={styles.checkboxLabel}>
                이용약관 동의 <span style={{ color: "#ef4444" }}>(필수)</span>
              </label>
              <a
                href="https://hypq.cafe24.com/member/mall_agreement.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "auto", fontSize: "12px", color: "#6b7280", textDecoration: "underline" }}
              >
                보기
              </a>
            </div>
            
            <div className={styles.agreementItem}>
              <input
                type="checkbox"
                id="agreePrivacy"
                name="agree_privacy_check[]"
                value="1"
                className={styles.checkboxInput}
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                disabled={isSubmitting}
              />
              <label htmlFor="agreePrivacy" className={styles.checkboxLabel}>
                개인정보 수집 및 이용 동의 <span style={{ color: "#ef4444" }}>(필수)</span>
              </label>
              <a
                href="https://hypq.cafe24.com/member/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "auto", fontSize: "12px", color: "#6b7280", textDecoration: "underline" }}
              >
                보기
              </a>
            </div>
            
            <div className={styles.agreementItem}>
              <input
                type="checkbox"
                id="agreeMarketing"
                className={styles.checkboxInput}
                checked={agreeSMS && agreeEmail}
                onChange={(e) => handleMarketingChange(e.target.checked)}
                disabled={isSubmitting}
              />
              <label htmlFor="agreeMarketing" className={styles.checkboxLabelOptional}>
                쇼핑정보 수신 동의 <span style={{ color: "#71717a" }}>(선택)</span>
              </label>
            </div>
            
            <div className={styles.subAgreements}>
              <div className={styles.agreementItem}>
                <input
                  type="checkbox"
                  id="agreeSMS"
                  className={styles.checkboxInput}
                  checked={agreeSMS}
                  onChange={(e) => setAgreeSMS(e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor="agreeSMS" className={styles.checkboxLabelOptional}>
                  모바일 메시지 수신 동의 <span style={{ color: "#71717a" }}>(선택)</span>
                </label>
              </div>
              
              <div className={styles.agreementItem}>
                <input
                  type="checkbox"
                  id="agreeEmail"
                  className={styles.checkboxInput}
                  checked={agreeEmail}
                  onChange={(e) => setAgreeEmail(e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor="agreeEmail" className={styles.checkboxLabelOptional}>
                  이메일 수신 동의 <span style={{ color: "#71717a" }}>(선택)</span>
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? "가입 진행 중..." : "회원가입"} <ArrowRight size={16} />
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
