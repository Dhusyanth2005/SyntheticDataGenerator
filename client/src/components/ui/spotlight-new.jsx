"use client";
import React, { useEffect, useRef, useState } from "react";

export const Spotlight = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        opacity: visible ? 1 : 0,
        transition: "opacity 1.2s ease",
      }}
    >
      {/* Base dark background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#0a0a0a",
        }}
      />

      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Top-center soft glow — no line, just a bloom */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      {/* Indigo top-left accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "50%",
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(99,102,241,0.12) 0%, transparent 60%)",
          filter: "blur(8px)",
        }}
      />

      {/* Indigo bottom-right accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "50%",
          height: "50%",
          background:
            "radial-gradient(ellipse at 100% 100%, rgba(99,102,241,0.09) 0%, transparent 60%)",
          filter: "blur(8px)",
        }}
      />

      {/* Vignette — dark edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </div>
  );
};
