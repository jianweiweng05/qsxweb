import Link from "next/link";
import { getUserTier, hasMinTier, type UserTier } from "./entitlements";

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
}

function LockedContent({ requiredTier, message }: LockedContentProps) {
  const tierLabel = requiredTier === "VIP" ? "VIP" : "Pro";
  const defaultMsg = `${tierLabel} 内容已锁定`;
  
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center py-6">
      <div className="text-white/50 mb-3">🔒 {message || defaultMsg}</div>
      <Link 
        href="/pricing" 
        className="inline-block px-4 py-2 bg-blue-600 rounded-lg text-sm text-white"
      >
        升级到 {tierLabel}
      </Link>
    </div>
  );
}

// 通用层级门禁组件
interface TierGateProps {
  requiredTier: UserTier;
  children: React.ReactNode;
  lockedMessage?: string;
}

export function TierGate({ requiredTier, children, lockedMessage }: TierGateProps) {
  if (hasMinTier(requiredTier)) {
    return <>{children}</>;
  }
  return <LockedContent requiredTier={requiredTier} message={lockedMessage} />;
}

// VIP 门禁（需要 VIP 或更高）
export function VIPGate({ children, lockedMessage }: { children: React.ReactNode; lockedMessage?: string }) {
  return (
    <TierGate requiredTier="VIP" lockedMessage={lockedMessage}>
      {children}
    </TierGate>
  );
}

// Pro 门禁（需要 Pro）
export function ProGate({ children, lockedMessage }: { children: React.ReactNode; lockedMessage?: string }) {
  return (
    <TierGate requiredTier="PRO" lockedMessage={lockedMessage}>
      {children}
    </TierGate>
  );
}

// 整页锁定组件（用于整个页面被锁定的情况）
interface PageGateProps {
  requiredTier: UserTier;
  title: string;
  children: React.ReactNode;
}

export function PageGate({ requiredTier, title, children }: PageGateProps) {
  if (hasMinTier(requiredTier)) {
    return <>{children}</>;
  }
  
  const tierLabel = requiredTier === "VIP" ? "VIP" : "Pro";
  
  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <div className="p-6 rounded-lg bg-white/5 border border-white/10 text-center">
        <div className="text-white/50 mb-4">🔒 此功能需要 {tierLabel} 订阅</div>
        <Link 
          href="/pricing" 
          className="inline-block px-6 py-3 bg-blue-600 rounded-lg text-white font-medium"
        >
          升级到 {tierLabel}
        </Link>
      </div>
    </div>
  );
}
