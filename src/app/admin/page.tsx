import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getQuotes } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import { getTokens, cafe24Fetch } from "@/lib/cafe24";
import AdminDashboardClient from "./AdminDashboardClient";
import { isAdminUser } from "@/lib/session";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

interface AdminDashboardProps {
  searchParams: Promise<{
    auth_success?: string;
    auth_error?: string;
    sync_success?: string;
    sync_count?: string;
    sync_error?: string;
  }>;
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  const admin = await isAdminUser();
  if (!admin) {
    redirect("/login");
  }

  const params = await searchParams;
  const authSuccess = params.auth_success === "true";
  const authError = params.auth_error || null;
  const syncSuccess = params.sync_success === "true";
  const syncCount = params.sync_count || "0";
  const syncError = params.sync_error || null;

  const quotes = await getQuotes();

  // Check Cafe24 API connection status
  let isConnected = false;
  let connectionDetail = "";
  let tokens = null;
  try {
    tokens = await getTokens();
    if (tokens) {
      // Fetch a lightweight endpoint to verify validity
      await cafe24Fetch("/categories");
      isConnected = true;
      connectionDetail = "카페24 어드민 API와 성공적으로 연결되었습니다.";
    } else {
      connectionDetail = "인증 토큰 정보가 없습니다. 최초 1회 인증이 필요합니다.";
    }
  } catch (err: any) {
    isConnected = false;
    connectionDetail = err.message || "연동 토큰 만료 또는 연결 실패";
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.titleSection}>
          <h1>관리자 견적 어드민 대시보드</h1>
          <p>고객들로부터 신청받은 모든 단체 주문 견적서와 도안 파일을 관리합니다.</p>
        </div>
        <Link href="/" className={styles.backBtn}>
          <ArrowLeft size={14} /> 메인 홈페이지
        </Link>
      </div>

      <AdminDashboardClient
        initialQuotes={quotes}
        isConnected={isConnected}
        connectionDetail={connectionDetail}
        mallId={tokens?.mallId}
        issuedAt={tokens?.issuedAt}
        expiresAt={tokens?.expiresAt}
        authSuccess={authSuccess}
        authError={authError}
        syncSuccess={syncSuccess}
        syncCount={syncCount}
        syncError={syncError}
      />
    </div>
  );
}

