"use client";

const AUTH_ORIGIN = process.env.NEXT_PUBLIC_QSX_AUTH_ORIGIN || "";

export default function LandingClient() {
  const handleSignIn = () => {
    const currentOrigin = window.location.origin;
    const redirectUrl = encodeURIComponent(currentOrigin + "/today");
    window.location.href = `${AUTH_ORIGIN}/sign-in?redirect_url=${redirectUrl}`;
  };

  const handleSignUp = () => {
    const currentOrigin = window.location.origin;
    const redirectUrl = encodeURIComponent(currentOrigin + "/today");
    window.location.href = `${AUTH_ORIGIN}/sign-up?redirect_url=${redirectUrl}`;
  };

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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

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
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-1px",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          QSX 全市场风险引擎
        </div>

        <div
          style={{
            fontSize: 18,
            opacity: 0.9,
            textAlign: "center",
            lineHeight: 1.5,
            marginBottom: 8,
            maxWidth: 400,
            fontWeight: 500,
          }}
        >
          QSX —— 定义交易的风险边界。
        </div>

        <div
          style={{
            fontSize: 14,
            opacity: 0.6,
            textAlign: "center",
            lineHeight: 1.4,
            marginBottom: 16,
            maxWidth: 400,
            fontWeight: 400,
          }}
        >
          QSX - Quantifying the Edge of Market Risk.
        </div>

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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 12,
              width: "100%",
              maxWidth: 340,
            }}
          >
            <button
              onClick={handleSignIn}
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

            <button
              onClick={handleSignUp}
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

          <div style={{ fontSize: 14, opacity: 0.5, fontWeight: 500 }}>
            Invite only
          </div>
        </div>
      </div>

      {/* 教育/转化区 */}
      <div style={{ position: "relative", width: "100%", maxWidth: 1200, padding: "80px 24px", display: "flex", flexDirection: "column", gap: 64 }}>
        {/* 1. 为什么用 QSX */}
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 32, textAlign: "center", color: "#fff" }}>为什么用 QSX</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <div style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#00e5ff", marginBottom: 12 }}>量化风险边界</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>不预测涨跌，只量化当前市场的风险暴露度与结构性拐点</div>
            </div>
            <div style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#00e5ff", marginBottom: 12 }}>机构级数据引擎</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>整合流动性、衍生品、链上资金流等多维度数据，提供专业分析</div>
            </div>
            <div style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#00e5ff", marginBottom: 12 }}>实时风险报警</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>市场异常波动、杠杆堆积、流动性枯竭时第一时间推送预警</div>
            </div>
          </div>
        </div>

        {/* 2. 3步上手 */}
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 32, textAlign: "center", color: "#fff" }}>3 步开始使用</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#00e5ff", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>1</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.8)" }}>免费注册账号，无需信用卡</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#00e5ff", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>2</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.8)" }}>查看今日市场风险评分与仓位建议</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#00e5ff", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>3</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.8)" }}>升级 VIP/PRO 解锁完整数据与 AI 分析</div>
            </div>
          </div>
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <button onClick={handleSignUp} style={{ padding: "14px 40px", borderRadius: 12, background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)", border: "none", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(59, 130, 246, 0.35)" }}>
              免费注册
            </button>
          </div>
        </div>

        {/* 3. 轻量对比 */}
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 32, textAlign: "center", color: "#fff" }}>QSX 与传统工具的区别</h2>
          <div style={{ maxWidth: 700, margin: "0 auto", background: "rgba(30, 41, 59, 0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ padding: 16, fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>传统分析工具</div>
              <div style={{ padding: 16, fontWeight: 600, fontSize: 14, color: "#00e5ff", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>QSX</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ padding: 16, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>预测价格涨跌</div>
              <div style={{ padding: 16, fontSize: 13, color: "rgba(255,255,255,0.8)", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>量化风险边界</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ padding: 16, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>单一指标分析</div>
              <div style={{ padding: 16, fontSize: 13, color: "rgba(255,255,255,0.8)", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>多维度数据融合</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ padding: 16, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>滞后的历史数据</div>
              <div style={{ padding: 16, fontSize: 13, color: "rgba(255,255,255,0.8)", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>实时市场结构监控</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: 16, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>需要自己解读</div>
              <div style={{ padding: 16, fontSize: 13, color: "rgba(255,255,255,0.8)", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>AI 直接给出建议</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
