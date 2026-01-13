"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

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
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
      }}
    >
      {/* 暗化遮罩 - 更暗的渐变 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* 内容区 - 标题更靠上 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 140,
          paddingLeft: 24,
          paddingRight: 24,
          flex: 1,
        }}
      >
        {/* 标题 - 更大、更靠上 */}
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-1px",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          QuantscopeX
        </div>

        {/* 副标题 - 更紧凑 */}
        <div
          style={{
            fontSize: 16,
            opacity: 0.75,
            textAlign: "center",
            lineHeight: 1.4,
            marginBottom: 16,
            maxWidth: 280,
            fontWeight: 400,
          }}
        >
          AI market risk intelligence,
          <br />
          built for daily decisions.
        </div>

        {/* 底部按钮区域 - 固定在底部附近 */}
        <div
          style={{
            marginTop: "auto",
            marginBottom: 48,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* 双按钮行 */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 12,
              width: "100%",
              maxWidth: 340,
            }}
          >
            {/* Sign In - 灰玻璃效果 */}
            <button
              onClick={() => router.push("/sign-in")}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 16,
                background: "rgba(30, 41, 59, 0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontSize: 17,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Sign In
            </button>

            {/* Sign Up - 蓝渐变 */}
            <button
              onClick={() => router.push("/sign-up")}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 16,
                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                border: "none",
                color: "#fff",
                fontSize: 17,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(59, 130, 246, 0.35)",
                transition: "all 0.2s",
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Invite only 文字 */}
          <div style={{ fontSize: 14, opacity: 0.5, fontWeight: 500 }}>
            Invite only
          </div>
        </div>
      </div>
    </div>
  );
}
