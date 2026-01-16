import { getUserTier, hasMinTier, type UserTier } from "./entitlements";
import { LockedContentClient } from "./gate-client";

// 检查是否为 VIP 或更高
export function isVIP(): boolean {
  return hasMinTier("VIP");
}

// 检查是否为 Pro
export function isPro(): boolean {
  return hasMinTier("PRO");
}

// 统一锁定态组件
interface LockedContentProps {
  requiredTier: UserTier;
  message?: string;
  unlockConfig?: {
    title: string;
    description: string;
    features: string[];
  };
}

function LockedContent({ requiredTier, message, unlockConfig }: LockedContentProps) {
  const tierLabel = requiredTier === "VIP" ? "VIP" : "Pro";
  const defaultMsg = `${tierLabel} 内容已锁定`;

  if (unlockConfig) {
    return (
      <LockedContentClient
        tier={requiredTier === "VIP" ? "VIP" : "PRO"}
        message={message || defaultMsg}
        unlockConfig={unlockConfig}
      />
    );
  }

  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center py-6">
      <div className="text-white/50 mb-3">🔒 {message || defaultMsg}</div>
      <div className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white">
        升级到 {tierLabel}
      </div>
    </div>
  );
}

// 通用层级门禁组件
interface TierGateProps {
  requiredTier: UserTier;
  children: React.ReactNode;
  lockedMessage?: string;
  unlockConfig?: {
    title: string;
    description: string;
    features: string[];
  };
}

export function TierGate({ requiredTier, children, lockedMessage, unlockConfig }: TierGateProps) {
  if (hasMinTier(requiredTier)) {
    return <>{children}</>;
  }
  return <LockedContent requiredTier={requiredTier} message={lockedMessage} unlockConfig={unlockConfig} />;
}

// VIP 门禁（需要 VIP 或更高）
export function VIPGate({
  children,
  lockedMessage,
  unlockConfig
}: {
  children: React.ReactNode;
  lockedMessage?: string;
  unlockConfig?: {
    title: string;
    description: string;
    features: string[];
  };
}) {
  return (
    <TierGate requiredTier="VIP" lockedMessage={lockedMessage} unlockConfig={unlockConfig}>
      {children}
    </TierGate>
  );
}

// Pro 门禁（需要 Pro）
export function ProGate({
  children,
  lockedMessage,
  unlockConfig
}: {
  children: React.ReactNode;
  lockedMessage?: string;
  unlockConfig?: {
    title: string;
    description: string;
    features: string[];
  };
}) {
  return (
    <TierGate requiredTier="PRO" lockedMessage={lockedMessage} unlockConfig={unlockConfig}>
      {children}
    </TierGate>
  );
}

// 整页锁定组件（用于整个页面被锁定的情况）
interface PageGateProps {
  requiredTier: UserTier;
  title: string;
  children: React.ReactNode;
  unlockConfig?: {
    title: string;
    description: string;
    features: string[];
  };
}

export function PageGate({ requiredTier, title, children, unlockConfig }: PageGateProps) {
  if (hasMinTier(requiredTier)) {
    return <>{children}</>;
  }

  const tierLabel = requiredTier === "VIP" ? "VIP" : "Pro";

  if (unlockConfig) {
    return (
      <div className="p-4 text-white min-h-full bg-black/90">
        <h1 className="text-xl font-bold mb-4">{title}</h1>
        <LockedContentClient
          tier={requiredTier === "VIP" ? "VIP" : "PRO"}
          message={`此功能需要 ${tierLabel} 订阅`}
          unlockConfig={unlockConfig}
        />
      </div>
    );
  }

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <div className="p-6 rounded-lg bg-white/5 border border-white/10 text-center">
        <div className="text-white/50 mb-4">🔒 此功能需要 {tierLabel} 订阅</div>
        <div className="inline-block px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium">
          升级到 {tierLabel}
        </div>
      </div>
    </div>
  );
}
