"use client";

import { Button, Space } from "antd-mobile";

export default function Page() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url(/bg-stars.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        padding: "24px 16px",
        color: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(80% 60% at 50% 40%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.95) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 390,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 28,
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: 0.2,
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          QuantscopeX
        </div>

        <div
          style={{
            fontSize: 14,
            opacity: 0.7,
            textAlign: "center",
            lineHeight: 1.35,
            marginBottom: 38,
            maxWidth: 260,
          }}
        >
          AI market risk intelligence,
          <br />
          built for daily decisions.
        </div>

        <div style={{ marginTop: 160 }} />

        <Space
          direction="horizontal"
          style={{
            width: "100%",
            justifyContent: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <Button
            size="large"
            fill="outline"
            style={{
              width: 164,
              height: 42,
              borderRadius: 18,
              color: "#fff",
              borderColor: "rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            Sign In
          </Button>

          <Button
            size="large"
            color="primary"
            style={{
              width: 164,
              height: 42,
              borderRadius: 18,
              background: "rgba(64,140,255,0.88)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            Sign Up
          </Button>
        </Space>

        <div style={{ fontSize: 12, opacity: 0.5 }}>Invite only</div>
      </div>
    </div>
  );
}