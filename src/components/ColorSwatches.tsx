import React from "react";
import styles from "./ColorSwatches.module.css";
import { ProductColor } from "@/data/products";

interface ColorSwatchesProps {
  colors: ProductColor[];
  onHoverColor?: (colorIdx: number | null) => void;
}

export default function ColorSwatches({ colors, onHoverColor }: ColorSwatchesProps) {
  if (!colors || colors.length === 0) return null;

  const visibleColors = colors.slice(0, 15);
  const hasMore = colors.length > 15;

  return (
    <div className={styles.container} onMouseLeave={() => onHoverColor?.(null)}>
      <div className={styles.swatchList}>
        {visibleColors.map((color, idx) => {
          // Adjust borderline for white/very light colors to make them visible against white background
          const isWhite = color.hex.toLowerCase() === "#ffffff" || color.hex.toLowerCase() === "#faf8f0";
          return (
            <div
              key={idx}
              className={styles.swatchWrapper}
              onMouseEnter={() => onHoverColor?.(idx)}
            >
              <span
                className={`${styles.swatch} ${isWhite ? styles.whiteBorder : ""}`}
                style={{ backgroundColor: color.hex }}
              />
              <span className={styles.tooltip}>{color.name}</span>
            </div>
          );
        })}
        {hasMore && (
          <div className={styles.moreBadge} title={`총 ${colors.length}개 색상 지원`}>
            +
          </div>
        )}
      </div>
    </div>
  );
}
