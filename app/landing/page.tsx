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
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          QuantscopeX
        </div>

        <div
          style={{
            fontSize: 15,
            opacity: 0.85,
            textAlign: "center",
            lineHeight: 1.4,
            marginBottom: 38,
            maxWidth: 280,
          }}
        >
          AI market risk intelligence,
          <br />
          built for daily decisions.
        </div>

        <div style={{ marginTop: 170 }} />

        <Space
          direction="horizontal"
          style={{
            width: "100%",
            justifyContent: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <Button
            size="large"
            style={{
              width: 164,
              height: 48,
              borderRadius: 12,
              color: "#fff",
              background: "#1E293B",
              border: "none",
              fontWeight: 600,
            }}
          >
            Sign In
          </Button>

          <Button
            size="large"
            color="primary"
            style={{
              width: 164,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
              border: "none",
              fontWeight: 600,
            }}
          >
            Sign Up
          </Button>
        </Space>

        <div style={{ fontSize: 13, opacity: 0.6, fontWeight: 500 }}>
          Invite only
        </div>
      </div>
    </div>
  );
}
