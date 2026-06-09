"use client";

import React, { useState, use, useEffect } from "react";
import { CreditCard, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";

interface MockCheckoutPageProps {
  searchParams: Promise<{ quoteId: string; price: string; name: string }>;
}

export default function MockCheckoutPage({ searchParams }: MockCheckoutPageProps) {
  const params = use(searchParams);
  const quoteId = params.quoteId || "";
  const price = Number(params.price || 0);
  const productName = decodeURIComponent(params.name || "주문 상품");

  const [paymentStep, setPaymentStep] = useState<"checkout" | "success">("checkout");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");

  const handlePay = async () => {
    setIsProcessing(true);
    
    // Simulate PG bank transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // Call API route to update status to PAID
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });
      const data = await res.json();
      
      if (data.success) {
        setPaymentStep("success");
      } else {
        alert("결제 처리 중 서버 에러 발생: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("결제 처리에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (paymentStep === "success") {
      const timer = setTimeout(() => {
        window.location.href = "/mypage";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentStep]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f4f4f5",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        padding: "40px",
        width: "100%",
        maxWidth: "460px",
        boxSizing: "border-box",
        textAlign: "center",
        boxShadow: "0 10px 40px rgba(0,0,0,0.04)"
      }}>
        
        {paymentStep === "checkout" ? (
          <>
            <div style={{
              display: "inline-flex",
              backgroundColor: "rgba(0, 82, 255, 0.08)",
              color: "#0052ff",
              padding: "16px",
              borderRadius: "50%",
              marginBottom: "24px"
            }}>
              <CreditCard size={32} />
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 8px", color: "#000000" }}>
              CAFE24 결제 데모
            </h2>
            <p style={{ fontSize: "14px", color: "#66666b", margin: "0 0 32px" }}>
              안전한 결제 대행창을 통해 카드 결제를 완료합니다.
            </p>

            {/* Bill details */}
            <div style={{
              backgroundColor: "#f4f4f5",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "left",
              marginBottom: "32px"
            }}>
              <div style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: "#66666b", fontWeight: 700, textTransform: "uppercase" }}>주문 상품명</span>
                <span style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#000000", marginTop: "4px" }}>
                  {productName}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "12px" }}>
                <span style={{ fontSize: "14px", color: "#66666b", fontWeight: 600 }}>총 결제 금액</span>
                <span style={{ fontSize: "18px", fontWeight: 800, color: "#0052ff" }}>
                  ₩{price.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Methods */}
            <div style={{ textAlign: "left", marginBottom: "32px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#000000", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
                결제수단 선택
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <button
                  onClick={() => setSelectedMethod("card")}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: selectedMethod === "card" ? "2px solid #0052ff" : "1px solid #e4e4e7",
                    backgroundColor: selectedMethod === "card" ? "rgba(0, 82, 255, 0.03)" : "#ffffff",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: selectedMethod === "card" ? "#0052ff" : "#000000",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  💳 신용카드
                </button>
                <button
                  onClick={() => setSelectedMethod("transfer")}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: selectedMethod === "transfer" ? "2px solid #0052ff" : "1px solid #e4e4e7",
                    backgroundColor: selectedMethod === "transfer" ? "rgba(0, 82, 255, 0.03)" : "#ffffff",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: selectedMethod === "transfer" ? "#0052ff" : "#000000",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  🏦 계좌이체
                </button>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessing}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#000000",
                color: "#ffffff",
                border: "none",
                borderRadius: "40px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: isProcessing ? "not-allowed" : "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                opacity: isProcessing ? 0.7 : 1,
                transition: "background-color 0.2s"
              }}
            >
              {isProcessing ? "결제 승인 중..." : "결제 완료하기"} <ArrowRight size={16} />
            </button>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", color: "#10b981", fontSize: "12px", fontWeight: 600, marginTop: "24px" }}>
              <ShieldCheck size={16} /> 안전한 256비트 암호화 결제 보호 적용
            </div>
          </>
        ) : (
          <>
            <div style={{
              display: "inline-flex",
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              color: "#10b981",
              padding: "20px",
              borderRadius: "50%",
              marginBottom: "24px"
            }}>
              <CheckCircle size={48} />
            </div>

            <h2 style={{ fontSize: "26px", fontWeight: 800, margin: "0 0 12px", color: "#000000" }}>
              결제 완료!
            </h2>
            <p style={{ fontSize: "15px", color: "#66666b", lineHeight: "1.6", margin: "0 0 24px" }}>
              성공적으로 결제가 승인되었습니다.<br />
              단체 의류 인쇄 및 제작 프로세스에 들어갑니다.
            </p>

            <div style={{ fontSize: "12px", color: "#a1a1aa" }}>
              잠시 후 자동으로 마이페이지로 이동합니다...
            </div>
          </>
        )}

      </div>
    </div>
  );
}
