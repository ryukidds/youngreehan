"use client";

import React, { useState, useMemo } from "react";
import { Quote } from "@/lib/db";
import styles from "./board.module.css";

interface EstimateBoardClientProps {
  initialQuotes: Quote[];
}

export default function EstimateBoardClient({ initialQuotes }: EstimateBoardClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPeriod, setSearchPeriod] = useState("전체"); // 전체, 일주일, 한달, 세달
  const [searchTarget, setSearchTarget] = useState("제목"); // 제목, 작성자
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 15;

  // 1. Filter quotes based on search inputs
  const filteredQuotes = useMemo(() => {
    return initialQuotes.filter((quote) => {
      // Period filter
      if (searchPeriod !== "전체") {
        const quoteDate = new Date(quote.createdAt);
        const now = new Date();
        let limitDate = new Date();
        if (searchPeriod === "일주일") {
          limitDate.setDate(now.getDate() - 7);
        } else if (searchPeriod === "한달") {
          limitDate.setMonth(now.getMonth() - 1);
        } else if (searchPeriod === "세달") {
          limitDate.setMonth(now.getMonth() - 3);
        }
        if (quoteDate < limitDate) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        if (searchTarget === "제목") {
          // Search in product name or requests
          const prodMatch = quote.productName?.toLowerCase().includes(query);
          const reqMatch = quote.requests?.toLowerCase().includes(query);
          if (!prodMatch && !reqMatch) return false;
        } else if (searchTarget === "작성자") {
          const writerMatch = (quote.writerName || quote.userId)?.toLowerCase().includes(query);
          if (!writerMatch) return false;
        }
      }

      return true;
    });
  }, [initialQuotes, searchQuery, searchPeriod, searchTarget]);

  // 2. Flatten filtered quotes and their admin replies into rows
  const boardRows = useMemo(() => {
    const list: Array<{
      id: string;
      quoteId: string;
      type: "quote" | "reply";
      writer: string;
      title: string;
      createdAt: string;
    }> = [];

    filteredQuotes.forEach((quote) => {
      // Add the quote row
      list.push({
        id: quote.id,
        quoteId: quote.id,
        type: "quote",
        writer: quote.writerName || quote.userId || "비회원",
        title: quote.title || `${quote.productName} 견적/시안문의 드립니다 :D`,
        createdAt: quote.createdAt,
      });

      // Add admin replies (comments by ADMIN) right underneath
      if (quote.comments) {
        quote.comments.forEach((comment) => {
          if (comment.sender === "ADMIN") {
            list.push({
              id: comment.id,
              quoteId: quote.id,
              type: "reply",
              writer: "UNILOOKS",
              title: "답변드립니다 :D",
              createdAt: comment.createdAt,
            });
          }
        });
      }
    });

    return list;
  }, [filteredQuotes]);

  // 3. Pagination calculation
  const totalRowsCount = boardRows.length;
  const totalPages = Math.ceil(totalRowsCount / ITEMS_PER_PAGE) || 1;
  
  // Keep page index within bounds if filtered list changes
  const activePage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return boardRows.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [boardRows, activePage]);

  const handleRowClick = (quoteId: string) => {
    window.location.href = `/quotes/${quoteId}`;
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return "-";
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header: Title + Description + Filters */}
      <header className={styles.boardHeader}>
        <div className={styles.headerTop}>
          <div className={styles.headerTitleGroup}>
            <h2 className={styles.boardTitle}>견적문의 내역</h2>
            <p className={styles.boardDesc}>
              견적 문의를 남겨주시면 빠르게 답변을 드리도록 하겠습니다.
            </p>
          </div>
          <button
            onClick={() => window.location.href = "/quotes"}
            className={styles.writeBtn}
          >
            빠른견적 작성하기
          </button>
        </div>

        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <select
              value={searchPeriod}
              onChange={(e) => {
                setSearchPeriod(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.selectInput}
            >
              <option value="전체">전체 기간</option>
              <option value="일주일">일주일</option>
              <option value="한달">한달</option>
              <option value="세달">세달</option>
            </select>

            <select
              value={searchTarget}
              onChange={(e) => {
                setSearchTarget(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.selectInput}
            >
              <option value="제목">제목</option>
              <option value="작성자">작성자</option>
            </select>
          </div>

          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.searchInput}
            />
          </div>
        </div>
      </header>

      {/* Table Section */}
      <main className={styles.mainContent}>
        <table className={styles.boardTable}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={`${styles.thCellCenter} ${styles.numberCol}`}>번호</th>
              <th className={`${styles.thCell} ${styles.writerCol}`}>작성자</th>
              <th className={styles.thCell}>제목</th>
              <th className={`${styles.thCellCenter} ${styles.dateCol}`}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyState}>
                  등록된 견적문의가 없습니다.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => {
                // Determine sequence number like 38590, 38589, etc.
                const globalIndex = (activePage - 1) * ITEMS_PER_PAGE + index;
                const rowSequenceNum = 38590 + totalRowsCount - globalIndex;

                if (row.type === "reply") {
                  return (
                    <tr
                      key={row.id}
                      onClick={() => handleRowClick(row.quoteId)}
                      className={styles.replyRow}
                    >
                      <td className={`${styles.replyCellCenter} ${styles.numberCol}`}>
                        <span style={{ opacity: 0.5, fontSize: "11px" }}>{rowSequenceNum}</span>
                      </td>
                      <td className={`${styles.replyCell} ${styles.writerCol}`}>
                        <span className={styles.writerNameAdmin}>{row.writer}</span>
                      </td>
                      <td className={styles.replyCell}>
                        <div className={`${styles.titleContainer} ${styles.replyIndent}`}>
                          <span className={styles.reBadge}>RE</span>
                          <span>{row.title}</span>
                        </div>
                      </td>
                      <td className={`${styles.replyCellCenter} ${styles.dateCol}`}>
                        {formatDate(row.createdAt)}
                      </td>
                    </tr>
                  );
                }

                // Normal main quote row
                return (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row.quoteId)}
                    className={styles.boardRow}
                  >
                    <td className={`${styles.rowCellCenter} ${styles.numberCol}`}>
                      <span style={{ fontWeight: 700 }}>{rowSequenceNum}</span>
                    </td>
                    <td className={`${styles.rowCell} ${styles.writerCol}`}>
                      <span className={styles.writerName}>
                        {row.writer}
                      </span>
                    </td>
                    <td className={styles.rowCell}>
                      <div className={styles.titleContainer}>
                        <span>{row.title}</span>
                      </div>
                    </td>
                    <td className={`${styles.rowCellCenter} ${styles.dateCol}`}>
                      {formatDate(row.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </main>

      {/* Pagination at the bottom */}
      <div className={styles.paginationBox}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={activePage === 1}
          className={styles.pageBtn}
          aria-label="Previous Page"
        >
          이전
        </button>
        <span className={styles.pageNum}>{activePage}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={activePage === totalPages}
          className={styles.pageBtn}
          aria-label="Next Page"
        >
          다음
        </button>
      </div>
    </div>
  );
}
