import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.infoRow}>
          <span>하이퍼콰이엇</span>
          <span>대표: 류승민</span>
          <span>사업자등록번호: 195-15-02111</span>
          <span>주소: 서울특별시 구로구 경인로 343, 106동 501호</span>
        </div>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Hyperquiet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
