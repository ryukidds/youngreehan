"use client";

import React from "react";
import styles from "./GarmentHotspots.module.css";

interface GarmentHotspotsProps {
  productId: string; // "tshirt" | "hoodie"
  selectedPositions: number[]; // e.g. [1, 3]
  onTogglePosition: (id: number) => void;
}

interface Hotspot {
  id: number;
  label: string;
  x: number;
  y: number;
  view: "front" | "back";
}

export default function GarmentHotspots({
  productId,
  selectedPositions,
  onTogglePosition,
}: GarmentHotspotsProps) {
  const isHoodie = productId === "hoodie";

  // Hotspots definitions with coordinate weights (on a 200x240 SVG viewbox)
  const hotspots: Hotspot[] = [
    { id: 1, label: "오른가슴", x: 70, y: 75, view: "front" },
    { id: 2, label: "왼가슴", x: 130, y: 75, view: "front" },
    { id: 3, label: "앞중앙", x: 100, y: 100, view: "front" },
    { id: 6, label: "왼팔뚝", x: 175, y: 80, view: "front" },
    { id: 7, label: "오른팔뚝", x: 25, y: 80, view: "front" },
    { id: 9, label: "앞하단", x: 100, y: 180, view: "front" },
    { id: 4, label: "등중앙", x: 100, y: 110, view: "back" },
    { id: 5, label: "등하단", x: 100, y: 180, view: "back" },
    { id: 8, label: "등목밑", x: 100, y: 55, view: "back" },
  ];

  const renderGarmentSVG = (view: "front" | "back") => {
    // Shared outline coordinates adapted to make a beautiful minimal vector
    return (
      <svg
        viewBox="0 0 200 240"
        className={styles.garmentSvg}
        width="100%"
        height="100%"
      >
        {/* Garment outline shape */}
        {isHoodie ? (
          // HOODIE OUTLINE PATHS
          <g className={styles.garmentBody}>
            {/* Main body & sleeves */}
            <path
              d="M 45 60 L 25 75 L 10 110 L 25 125 L 45 95 L 45 200 L 155 200 L 155 95 L 175 125 L 190 110 L 175 75 L 155 60 Z"
              fill="#f8f8fa"
              stroke="#e4e4e7"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Hood outline */}
            {view === "front" ? (
              <>
                {/* Front hood */}
                <path
                  d="M 75 60 C 75 15, 125 15, 125 60 C 115 50, 85 50, 75 60 Z"
                  fill="#f0f0f3"
                  stroke="#e4e4e7"
                  strokeWidth="2"
                />
                {/* Pocket */}
                <path
                  d="M 60 145 L 75 125 L 125 125 L 140 145 L 140 190 L 60 190 Z"
                  fill="#f0f0f3"
                  stroke="#e4e4e7"
                  strokeWidth="1.5"
                />
                {/* Drawstrings */}
                <path d="M 95 62 L 95 85" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" />
                <path d="M 105 62 L 105 90" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              // Back hood
              <path
                d="M 75 60 C 75 10, 125 10, 125 60 Z"
                fill="#f0f0f3"
                stroke="#e4e4e7"
                strokeWidth="2"
              />
            )}
            {/* Ribbing cuffs and hem */}
            <line x1="45" y1="200" x2="155" y2="200" stroke="#d4d4d8" strokeWidth="4" />
            <line x1="10" y1="110" x2="25" y2="125" stroke="#d4d4d8" strokeWidth="3" />
            <line x1="190" y1="110" x2="175" y2="125" stroke="#d4d4d8" strokeWidth="3" />
          </g>
        ) : (
          // T-SHIRT OUTLINE PATHS
          <g className={styles.garmentBody}>
            {/* Front collar seam */}
            <path
              d="M 45 50 L 20 62 L 5 95 L 35 110 L 45 95 L 45 205 L 155 205 L 155 95 L 165 110 L 195 95 L 180 62 L 155 50 Z"
              fill="#f8f8fa"
              stroke="#e4e4e7"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {view === "front" ? (
              <path
                d="M 75 50 C 75 65, 125 65, 125 50 C 115 56, 85 56, 75 50 Z"
                fill="#e4e4e7"
                stroke="#d4d4d8"
                strokeWidth="1.5"
              />
            ) : (
              <path
                d="M 75 50 C 85 45, 115 45, 125 50 Z"
                fill="#e4e4e7"
                stroke="#d4d4d8"
                strokeWidth="1.5"
              />
            )}
            {/* Ribbing cuffs and hem */}
            <line x1="45" y1="205" x2="155" y2="205" stroke="#d4d4d8" strokeWidth="4" />
          </g>
        )}

        {/* Hotspots Render */}
        {hotspots
          .filter((hs) => hs.view === view)
          .map((hs) => {
            const isSelected = selectedPositions.includes(hs.id);
            return (
              <g
                key={hs.id}
                className={`${styles.hotspotGroup} ${isSelected ? styles.active : ""}`}
                onClick={() => onTogglePosition(hs.id)}
              >
                {/* Pulsing glow ring when active */}
                {isSelected && (
                  <circle
                    cx={hs.x}
                    cy={hs.y}
                    r="15"
                    className={styles.pulseRing}
                  />
                )}
                {/* Base clickable target circle */}
                <circle
                  cx={hs.x}
                  cy={hs.y}
                  r="9"
                  className={styles.hotspotCircle}
                />
                {/* Position number */}
                <text
                  x={hs.x}
                  y={hs.y + 4}
                  textAnchor="middle"
                  className={styles.hotspotText}
                >
                  {hs.id}
                </text>
              </g>
            );
          })}
      </svg>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.viewsContainer}>
        <div className={styles.viewPanel}>
          <span className={styles.viewLabel}>앞면 (FRONT)</span>
          <div className={styles.garmentFrame}>{renderGarmentSVG("front")}</div>
        </div>
        <div className={styles.viewPanel}>
          <span className={styles.viewLabel}>뒷면 (BACK)</span>
          <div className={styles.garmentFrame}>{renderGarmentSVG("back")}</div>
        </div>
      </div>
    </div>
  );
}
