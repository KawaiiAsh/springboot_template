import React from 'react';

export interface StatusInfo {
    status: string;
    latency?: number;
    error?: string;
}

interface Props {
    title: string;
    status: StatusInfo;
    latency?: number;
    icon: string;
    isUpdating?: boolean;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'up': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
        case 'down': return 'text-red-400 bg-red-500/20 border-red-500/30';
        case 'warn': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
};

const StatusCard: React.FC<Props> = ({ title, status, latency, icon, isUpdating }) => (
    <div className={`rounded-xl border backdrop-blur-sm p-6 transition-all hover:scale-105 ${getStatusColor(status.status)} ${isUpdating ? 'animate-pulse-subtle' : ''}`}>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
                <span className="text-2xl">{icon}</span>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-medium border">{status.status.toUpperCase()}</div>
        </div>
        {latency && <div className="text-sm opacity-80">延迟: {latency.toFixed(0)}ms</div>}
        {status.error && <div className="text-xs text-red-300 mt-2 bg-red-500/10 p-2 rounded">{status.error}</div>}
    </div>
);

export default StatusCard;
