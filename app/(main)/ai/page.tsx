"use client";

import { Input } from "antd-mobile";
import { useState } from "react";

export default function AIPage() {
  const [input, setInput] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url(/bg-stars.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(80% 60% at 50% 40%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.95) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "16px 20px",
          maxWidth: 420,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ paddingTop: 12, paddingBottom: 24 }}>
          <div
            style={{
              fontSize: 13,
              opacity: 0.6,
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Market Status
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#4ADE80",
            }}
          >
            Moderate Risk
          </div>
        </div>

        {/* Risk Insight */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <div
            style={{
              fontSize: 18,
              lineHeight: 1.5,
              textAlign: "center",
              opacity: 0.9,
            }}
          >
            Volatility elevated. Consider reducing position sizes and setting tighter stops.
          </div>
        </div>

        {/* Input */}
        <div style={{ paddingBottom: 32 }}>
          <Input
            placeholder="Ask about market risk..."
            value={input}
            onChange={setInput}
            style={
              {
                "--background": "rgba(255,255,255,0.08)",
                "--border-radius": "12px",
                "--placeholder-color": "rgba(255,255,255,0.55)",
              } as React.CSSProperties
            }
          />
        </div>
      </div>
    </div>
  );
}
