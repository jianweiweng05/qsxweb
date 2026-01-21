'use client';

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  const [language, setLanguage] = useState('en');

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* 顶部语言切换 */}
      <div className="absolute top-6 right-6">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors"
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* 标题和副标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Quantscope X
          </h1>
          <p className="text-lg text-white/70">
            QSX全市场风险引擎-定义交易风险边界
          </p>
        </div>

        {/* Clerk SignUp 组件 */}
        <div className="w-full max-w-md">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white/8 border border-white/10 rounded-lg",
              },
            }}
          />
        </div>

        {/* 登陆链接 */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            {language === 'zh' ? '已有账户？' : "Already have an account?"}{' '}
            <Link
              href="/sign-in"
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              {language === 'zh' ? '立即登陆' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
