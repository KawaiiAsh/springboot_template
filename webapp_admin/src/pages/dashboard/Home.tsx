import React, { useState, useEffect, useRef } from 'react';
import { getSystemStatus } from '../../api/auth';
import DashboardLayout from '../../layout/DashboardLayout';
import StarBackground from '../../components/StarBackground';
import StatusCard, { StatusInfo } from '../../components/cards/StatusCard';
import ResourceCard from '../../components/cards/ResourceCard';

interface SystemStatus {
    frontend: StatusInfo;
    backend: StatusInfo;
    database: StatusInfo;
    redis: StatusInfo;
    system: {
        osName: string;
        cpuUsagePercent: number;
        memoryUsagePercent: number;
        usedMemoryMB: number;
        totalMemoryMB: number;
    };
    cpuUsage: number[];
    memoryUsage: number[];
    ports: Array<{ name: string; port: number; status: string }>;
}

const Home: React.FC = () => {
    const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isUpdating, setIsUpdating] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const goToDocs = () => {
        console.log('Navigate to docs');
    };

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                if (!systemStatus) setLoading(true);
                else setIsUpdating(true);

                const res = await getSystemStatus();
                const raw = res.data;
                const payload: SystemStatus = {
                    ...raw,
                    ports: raw.ports.map((p: any) => ({
                        name: p.name,
                        port: p.port,
                        status: p.status === '🟢' ? 'up' : 'down',
                    })),
                };

                setTimeout(() => {
                    setSystemStatus(payload);
                    setLastUpdate(new Date());
                    setIsUpdating(false);
                }, 300);
            } catch (err) {
                console.error('获取系统状态失败:', err);
                setIsUpdating(false);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'up': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
            case 'down': return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'warn': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-gray-900 to-black text-cyan-400 text-xl">
                系统加载中...
            </div>
        );
    }

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <StarBackground />

            <div className="relative z-10 h-full w-full">
                <DashboardLayout lastUpdate={lastUpdate} isUpdating={isUpdating} onDocsClick={goToDocs}>
                    {systemStatus && (
                        <div className="space-y-8">
                            {/* 状态概览 */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                                    <span>🔍</span><span>系统状态概览</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatusCard title="前端服务" status={systemStatus.frontend} latency={systemStatus.frontend.latency} icon="🌐" isUpdating={isUpdating} />
                                    <StatusCard title="后端服务" status={systemStatus.backend} latency={systemStatus.backend.latency} icon="⚙️" isUpdating={isUpdating} />
                                    <StatusCard title="数据库" status={systemStatus.database} latency={systemStatus.database.latency} icon="🗄️" isUpdating={isUpdating} />
                                    <StatusCard title="缓存服务" status={systemStatus.redis} latency={systemStatus.redis.latency} icon="⚡" isUpdating={isUpdating} />
                                </div>
                            </section>

                            {/* 资源使用 */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                                    <span>📊</span><span>资源使用情况</span>
                                    <span className="text-sm text-slate-400 bg-slate-800/50 px-2 py-1 rounded">{systemStatus.system.osName}</span>
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <ResourceCard title="CPU使用率" percentage={systemStatus.system.cpuUsagePercent} icon="🔥" data={systemStatus.cpuUsage} isUpdating={isUpdating} />
                                    <ResourceCard title="内存使用率" percentage={systemStatus.system.memoryUsagePercent} used={systemStatus.system.usedMemoryMB} total={systemStatus.system.totalMemoryMB} unit="MB" icon="💾" data={systemStatus.memoryUsage} isUpdating={isUpdating} />
                                </div>
                            </section>

                            {/* 端口状态 */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                                    <span>🔌</span><span>端口状态</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {systemStatus.ports.map(port => (
                                        <div key={port.name} className={`rounded-xl p-4 transition-all border backdrop-blur-sm hover:scale-105 ${getStatusColor(port.status)} ${isUpdating ? 'animate-pulse-subtle' : ''}`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold text-white">{port.name}</div>
                                                    <div className="text-sm text-slate-400">端口 {port.port}</div>
                                                </div>
                                                <div className={`w-3 h-3 rounded-full ${port.status === 'up' ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}
                </DashboardLayout>
            </div>
        </div>
    );
};

export default Home;
