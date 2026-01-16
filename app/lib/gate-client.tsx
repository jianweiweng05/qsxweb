'use client';

import { UnlockTrigger } from "./unlock-modal";

interface LockedContentProps {
  tier: 'VIP' | 'PRO';
  message?: string;
  unlockConfig: {
    title: string;
    description: string;
    features: string[];
  };
}

export function LockedContentClient({ tier, message, unlockConfig }: LockedContentProps) {
  const tierLabel = tier === "VIP" ? "VIP" : "Pro";
  const defaultMsg = `${tierLabel} 内容已锁定`;

  return (
    <UnlockTrigger
      tier={tier}
      title={unlockConfig.title}
      description={unlockConfig.description}
      features={unlockConfig.features}
    >
      <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center py-6">
        <div className="text-white/50 mb-3">🔒 {message || defaultMsg}</div>
        <div className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white hover:bg-white/15 transition">
          升级到 {tierLabel}
        </div>
      </div>
    </UnlockTrigger>
  );
}
