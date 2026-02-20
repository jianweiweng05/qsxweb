'use client';

interface GuardData {
  death_score: number;
  position_cap: number;
  allow_add: boolean;
  allow_trade: boolean;
  guard_state: 'normal' | 'warning' | 'block';
}

interface GuardDashboardProps {
  data: GuardData;
}

export default function GuardDashboard({ data }: GuardDashboardProps) {
  const getStateConfig = (state: string) => {
    switch (state) {
      case 'normal':
        return {
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/50',
          icon: '🟢',
          label: '监控中 - 安全',
          description: 'Normal monitoring - Safe'
        };
      case 'warning':
        return {
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/50',
          icon: '🟡',
          label: '高危震荡 - 降杠杆',
          description: 'High volatility - Reduce leverage'
        };
      case 'block':
        return {
          color: 'from-red-500 to-rose-600',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/50',
          icon: '🔴',
          label: '单边极值 - 熔断拦截',
          description: 'Extreme movement - Circuit breaker active'
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/50',
          icon: '⚪',
          label: '未知状态',
          description: 'Unknown state'
        };
    }
  };

  const getDeathScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-400';
    if (score <= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDeathScoreZone = (score: number) => {
    if (score <= 30) return '安全区';
    if (score <= 70) return '警告区';
    return '爆仓区';
  };

  const stateConfig = getStateConfig(data.guard_state);

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 p-8 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-white flex items-center gap-3">
            🛡️ QSX GridGuard
            <span className="text-lg font-normal text-gray-400">| 中性策略防爆仓雷达</span>
          </h2>
          <p className="text-sm text-gray-400">Neutral Strategy Risk Control System</p>
        </div>
      </div>

      {/* Main Status Indicator */}
      <div className={`mb-8 rounded-xl border ${stateConfig.borderColor} ${stateConfig.bgColor} p-6`}>
        <div className="flex items-center gap-4">
          <div className="text-4xl animate-pulse">{stateConfig.icon}</div>
          <div className="flex-1">
            <div className="mb-1 text-sm text-gray-400">当前状态 Current Status</div>
            <div className={`text-2xl font-bold bg-gradient-to-r ${stateConfig.color} bg-clip-text text-transparent`}>
              {stateConfig.label}
            </div>
            <div className="mt-1 text-sm text-gray-500">{stateConfig.description}</div>
          </div>
        </div>
        {data.guard_state === 'block' && (
          <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300">
            ⚠️ 系统检测到单边异动，已接管您的网格/马丁权限
          </div>
        )}
      </div>

      {/* Core Metrics Grid */}
      <div className="mb-6 text-lg font-semibold text-white border-b border-white/10 pb-3">
        核心风控仪表 Core Risk Metrics
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Death Score Gauge */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">💀 爆仓指数 Death Score</div>
            <div className={`text-xs px-2 py-1 rounded ${
              data.death_score <= 30 ? 'bg-green-500/20 text-green-400' :
              data.death_score <= 70 ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {getDeathScoreZone(data.death_score)}
            </div>
          </div>

          {/* Gauge Visual */}
          <div className="relative mb-4">
            <div className="flex items-end justify-center h-32">
              <div className="relative w-full max-w-[200px]">
                {/* Background arc */}
                <svg viewBox="0 0 200 100" className="w-full">
                  {/* Green zone */}
                  <path
                    d="M 20 90 A 80 80 0 0 1 66.67 30"
                    fill="none"
                    stroke="rgb(34 197 94)"
                    strokeWidth="12"
                    opacity="0.3"
                  />
                  {/* Yellow zone */}
                  <path
                    d="M 66.67 30 A 80 80 0 0 1 133.33 30"
                    fill="none"
                    stroke="rgb(234 179 8)"
                    strokeWidth="12"
                    opacity="0.3"
                  />
                  {/* Red zone */}
                  <path
                    d="M 133.33 30 A 80 80 0 0 1 180 90"
                    fill="none"
                    stroke="rgb(239 68 68)"
                    strokeWidth="12"
                    opacity="0.3"
                  />
                  {/* Needle */}
                  <line
                    x1="100"
                    y1="90"
                    x2={100 + 70 * Math.cos((180 - data.death_score * 1.8) * Math.PI / 180)}
                    y2={90 - 70 * Math.sin((180 - data.death_score * 1.8) * Math.PI / 180)}
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="90" r="6" fill="white" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`text-center text-5xl font-bold ${getDeathScoreColor(data.death_score)}`}>
            {data.death_score}
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">/ 100</div>
        </div>

        {/* Position Cap */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 text-sm text-gray-400">🚧 仓位上限锁 Position Cap</div>

          <div className="mb-6">
            <div className="relative h-8 rounded-full bg-white/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                style={{ width: `${data.position_cap * 100}%` }}
              />
              <div
                className="absolute inset-y-0 border-r-2 border-red-500 border-dashed"
                style={{ left: `${data.position_cap * 100}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span className="text-red-400 font-semibold">{(data.position_cap * 100).toFixed(0)}% 锁定</span>
              <span>100%</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {(data.position_cap * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">
              系统级仓位锁：强管控于 {(data.position_cap * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Engine Controls */}
      <div className="mb-6 text-lg font-semibold text-white border-b border-white/10 pb-3">
        引擎执行指令 Engine Control Status
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Allow Add */}
        <div className={`rounded-xl border p-6 ${
          data.allow_add
            ? 'border-green-500/50 bg-green-500/10'
            : 'border-red-500/50 bg-red-500/10'
        }`}>
          <div className="flex items-center gap-4">
            <div className="text-3xl">
              {data.allow_add ? '🔓' : '🔒'}
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-400 mb-1">危险加仓 Allow Add</div>
              <div className={`text-xl font-bold ${
                data.allow_add ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.allow_add ? '允许 (OPEN)' : '强行熔断 (LOCKED)'}
              </div>
            </div>
          </div>
        </div>

        {/* Allow Trade */}
        <div className={`rounded-xl border p-6 ${
          data.allow_trade
            ? 'border-green-500/50 bg-green-500/10'
            : 'border-red-500/50 bg-red-500/10'
        }`}>
          <div className="flex items-center gap-4">
            <div className="text-3xl">
              {data.allow_trade ? '🟢' : '🔴'}
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-400 mb-1">平仓/交易 Allow Trade</div>
              <div className={`text-xl font-bold ${
                data.allow_trade ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.allow_trade ? '保持开启 (ACTIVE)' : '已禁用 (DISABLED)'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
