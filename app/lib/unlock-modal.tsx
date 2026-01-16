'use client';

import { useState } from 'react';

interface UnlockModalProps {
  tier: 'VIP' | 'PRO';
  title: string;
  description: string;
  features: string[];
  onClose: () => void;
}

export function UnlockModal({ tier, title, description, features, onClose }: UnlockModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg bg-[#0a0e14] border border-white/20 p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">解锁 {tier} 能力</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white/80">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-white/70 mb-4">{description}</p>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-white/80">
              <span className="text-cyan-400 mt-0.5">•</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Action */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/15 transition"
        >
          升级到 {tier}
        </button>
      </div>
    </div>
  );
}

interface UnlockTriggerProps {
  tier: 'VIP' | 'PRO';
  title: string;
  description: string;
  features: string[];
  children: React.ReactNode;
}

export function UnlockTrigger({ tier, title, description, features, children }: UnlockTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      {open && (
        <UnlockModal
          tier={tier}
          title={title}
          description={description}
          features={features}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
