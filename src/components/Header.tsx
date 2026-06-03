"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "상품", href: "/collections/all" },
    { name: "견적문의", href: "https://pf.kakao.com/_xbYwGX" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            영리한<span className={styles.dot}>.</span>
          </Link>

          <nav className={styles.desktopNav}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link href="/login" className={styles.loginBtn}>
              로그인
            </Link>
            <Link href="/signup" className={styles.signUpBtn}>
              회원가입 <ArrowUpRight size={14} className={styles.arrow} />
            </Link>
            <button
              className={styles.menuBtn}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className={styles.mobileOverlay}>
          <div className={styles.mobileNav}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={handleLinkClick}
              >
                {link.name}
              </Link>
            ))}
            <div className={styles.mobileActions}>
              <Link href="/login" className={styles.mobileLoginBtn} onClick={handleLinkClick}>
                로그인
              </Link>
              <Link href="/signup" className={styles.mobileSignUpBtn} onClick={handleLinkClick}>
                회원가입 <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
