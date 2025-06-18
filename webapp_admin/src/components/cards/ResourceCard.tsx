// components/cards/ResourceCard.tsx
import React from 'react';
import MiniChart from './MiniChart';

interface Props {
    title: string;
    percentage: number;
    used?: number;
    total?: number;
    unit?: string;
    icon: string;
    data: number[];
    isUpdating: boolean;
}

const getUsageColor = (percent: number) => {
    if (percent < 50) return 'from-emerald-400 via-cyan-400 to-blue-400';
    if (percent < 80) return 'from-yellow-400 via-orange-400 to-pink-400';
    return 'from-red-400 via-pink-400 to-purple-400';
};

const ResourceCard: React.FC<Props> = ({ title, percentage, used, total, unit, icon, data, isUpdating }) => (
    <div className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-600/30 backdrop-blur-sm transition-all duration-500 hover:border-cyan-500/50 ${isUpdating ? 'animate-pulse-subtle' : ''}`}>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
                <span className="text-2xl">{icon}</span>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <div className="text-2xl font-bold text-cyan-400">{percentage.toFixed(1)}%</div>
        </div>
        <div className="mb-4 h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${getUsageColor(percentage)} rounded-full animate-progress-wave`} style={{ width: `${percentage}%` }}></div>
        </div>
        {used && total && <div className="text-sm text-slate-400 mb-4">{used.toFixed(0)} / {total.toFixed(0)} {unit}</div>}
        <div className="flex justify-center">
            <MiniChart data={data} color={getUsageColor(percentage)} />
        </div>
    </div>
);

export default ResourceCard;
