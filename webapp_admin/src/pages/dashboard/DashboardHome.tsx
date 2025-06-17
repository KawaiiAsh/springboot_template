import React, {useState, useEffect, useRef} from 'react';
import { getSystemStatus } from '../../api/auth';

interface StatusInfo {
    status: string;
    latency?: number;
    error?: string;
}

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

interface MenuItem {
    title: string;
    subItems: string[];
    icon: string;
}

const menuItems: MenuItem[] = [
    {
        title: "系统监控",
        icon: "📊",
        subItems: ["实时监控", "历史数据", "告警配置"]
    },
    {
        title: "用户管理",
        icon: "👥",
        subItems: ["用户列表", "权限管理", "角色配置"]
    }
];

const DashboardHome: React.FC = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isUpdating, setIsUpdating] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const toggleMenu = (title: string) => {
        setOpenMenu(openMenu === title ? null : title);
    };

    const goToDocs = () => {
        console.log('Navigate to docs');
    };

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                if (!systemStatus) {
                    setLoading(true);
                } else {
                    setIsUpdating(true);
                }

                const res = await getSystemStatus();
                const raw = res.data;
                const payload: SystemStatus = {
                    ...raw,
                    ports: raw.ports.map((p: any) => ({
                        name: p.name,
                        port: p.port,
                        status: p.status === '🟢' ? 'up' : 'down'
                    }))
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

        fetchStatus(); // ✅ 只调用一次

        // ❌ 移除自动轮询
        // intervalRef.current = setInterval(fetchStatus, 80000);
        // return () => {
        //     if (intervalRef.current) {
        //         clearInterval(intervalRef.current);
        //     }
        // };
    }, []);



    const getStatusColor = (status: string) => {
        switch (status) {
            case 'up':
                return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
            case 'down':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'warn':
                return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            default:
                return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    const getUsageColor = (percentage: number) => {
        if (percentage < 50) return 'from-emerald-400 via-cyan-400 to-blue-400';
        if (percentage < 80) return 'from-yellow-400 via-orange-400 to-pink-400';
        return 'from-red-400 via-pink-400 to-purple-400';
    };

    const renderMiniChart = (data: number[], colorClass: string) => (
        <div className="flex items-end space-x-1 h-16 w-32">
            {data.map((value, index) => (
                <div
                    key={index}
                    className={`w-2 bg-gradient-to-t ${colorClass} rounded-t-sm transition-all duration-700 hover:scale-110 glow-effect`}
                    style={{
                        height: `${Math.max((value / 100) * 100, 8)}%`,
                        animationDelay: `${index * 100}ms`
                    }}
                />
            ))}
        </div>
    );


    const StatusCard = ({ title, status, latency, icon }: { title: string; status: StatusInfo; latency?: number; icon: string }) => (
        <div className={`relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-500 hover:scale-105 ${
            isUpdating ? 'animate-pulse-subtle' : ''
        } ${getStatusColor(status.status)}`}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">{icon}</span>
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status.status)}`}>
                        {status.status.toUpperCase()}
                    </div>
                </div>

                {latency && (
                    <div className="text-sm opacity-80">
                        延迟: {latency.toFixed(0)}ms
                    </div>
                )}

                {status.error && (
                    <div className="text-xs text-red-300 mt-2 bg-red-500/10 p-2 rounded">
                        {status.error}
                    </div>
                )}
            </div>

            {/* 装饰性元素 */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
        </div>
    );

    const ResourceCard = ({ title, percentage, used, total, unit, icon, data }: {
        title: string;
        percentage: number;
        used?: number;
        total?: number;
        unit?: string;
        icon: string;
        data: number[];
    }) => (
        <div className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-600/30 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-500 ${
            isUpdating ? 'animate-pulse-subtle' : ''
        }`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">{icon}</span>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                    {percentage.toFixed(1)}%
                </div>
            </div>

            {/* 进度条 */}
            <div className="mb-4">
                <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${getUsageColor(percentage)} transition-all duration-1000 rounded-full animate-progress-wave`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>

            {used && total && (
                <div className="text-sm text-slate-400 mb-4">
                    {used.toFixed(0)} / {total.toFixed(0)} {unit}
                </div>
            )}

            {/* 迷你图表 */}
            <div className="flex justify-center">
                {renderMiniChart(data, getUsageColor(percentage))}
            </div>
        </div>
    );

    const FloatingParticles = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float opacity-60"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        animationDuration: `${8 + Math.random() * 6}s`,
                    }}
                />
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="w-screen h-screen relative overflow-hidden bg-black">
                {/* 深邃星空背景 */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black">
                    {/* 星云效果 */}
                    <div className="absolute inset-0 bg-gradient-radial from-indigo-900/20 via-transparent to-transparent"></div>
                    <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-radial from-purple-800/15 via-purple-900/5 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-blue-800/15 via-blue-900/5 to-transparent rounded-full blur-3xl"></div>

                    {/* 星星层 */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(80)].map((_, i) => {
                            const size = Math.random() * 2 + 0.5;
                            const colors = ['bg-white', 'bg-blue-200', 'bg-indigo-200', 'bg-cyan-200'];
                            const color = colors[Math.floor(Math.random() * colors.length)];
                            return (
                                <div
                                    key={`login-star-${i}`}
                                    className={`absolute ${color} rounded-full animate-twinkle`}
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        width: `${size}px`,
                                        height: `${size}px`,
                                        animationDelay: `${Math.random() * 4}s`,
                                        animationDuration: `${3 + Math.random() * 2}s`,
                                        opacity: 0.4 + Math.random() * 0.4
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* 微星点 */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(150)].map((_, i) => (
                            <div
                                key={`login-tiny-star-${i}`}
                                className="absolute bg-white rounded-full animate-pulse"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    width: '0.5px',
                                    height: '0.5px',
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${4 + Math.random() * 2}s`,
                                    opacity: 0.2 + Math.random() * 0.3
                                }}
                            />
                        ))}
                    </div>

                    {/* 流星效果 */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(2)].map((_, i) => (
                            <div
                                key={`login-meteor-${i}`}
                                className="absolute animate-meteor"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 50}%`,
                                    animationDelay: `${i * 4 + Math.random() * 6}s`,
                                    animationDuration: '4s'
                                }}
                            >
                                <div className="w-0.5 h-0.5 bg-cyan-300 rounded-full relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-200 to-transparent w-8 h-0.5 -rotate-45 blur-sm"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 银河效果 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-800/5 to-indigo-900/10 transform rotate-12"></div>
                </div>

                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="text-xl text-cyan-400">系统加载中...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen relative overflow-hidden bg-black">
            {/* 深邃星空背景 */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black">
                {/* 星云效果 */}
                <div className="absolute inset-0 bg-gradient-radial from-indigo-900/20 via-transparent to-transparent"></div>
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-radial from-purple-800/15 via-purple-900/5 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-blue-800/15 via-blue-900/5 to-transparent rounded-full blur-3xl"></div>

                {/* 星星层 */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(80)].map((_, i) => {
                        const size = Math.random() * 2 + 0.5;
                        const colors = ['bg-white', 'bg-blue-200', 'bg-indigo-200', 'bg-cyan-200'];
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        return (
                            <div
                                key={`login-star-${i}`}
                                className={`absolute ${color} rounded-full animate-twinkle`}
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    animationDelay: `${Math.random() * 4}s`,
                                    animationDuration: `${3 + Math.random() * 2}s`,
                                    opacity: 0.4 + Math.random() * 0.4
                                }}
                            />
                        );
                    })}
                </div>

                {/* 微星点 */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(150)].map((_, i) => (
                        <div
                            key={`login-tiny-star-${i}`}
                            className="absolute bg-white rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: '0.5px',
                                height: '0.5px',
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${4 + Math.random() * 2}s`,
                                opacity: 0.2 + Math.random() * 0.3
                            }}
                        />
                    ))}
                </div>

                {/* 流星效果 */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(2)].map((_, i) => (
                        <div
                            key={`login-meteor-${i}`}
                            className="absolute animate-meteor"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 50}%`,
                                animationDelay: `${i * 4 + Math.random() * 6}s`,
                                animationDuration: '4s'
                            }}
                        >
                            <div className="w-0.5 h-0.5 bg-cyan-300 rounded-full relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-200 to-transparent w-8 h-0.5 -rotate-45 blur-sm"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 银河效果 */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-800/5 to-indigo-900/10 transform rotate-12"></div>
            </div>

            {/* 主体布局 */}
            <div className="relative z-10 flex h-full backdrop-blur-sm">
                {/* 侧边栏 */}
                <aside className="w-72 bg-gradient-to-b from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border-r border-cyan-500/20 p-6 overflow-auto neon-border-right">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse-glow">
                            ⚡ 后台管理系统
                        </h2>
                    </div>

                    <ul className="space-y-3">
                        {menuItems.map(item => (
                            <li key={item.title} className="group">
                                <div
                                    className="flex justify-between items-center cursor-pointer p-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:border-cyan-400/50 border border-transparent backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-cyan-500/25 neon-glow-hover"
                                    onClick={() => toggleMenu(item.title)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                                        <span className="text-slate-200 group-hover:text-cyan-300 transition-colors font-medium">{item.title}</span>
                                    </div>
                                    <span className={`text-lg transition-all duration-300 ${openMenu === item.title ? 'rotate-45 text-cyan-400' : 'text-slate-400'}`}>+</span>
                                </div>
                                <ul className={`mt-2 ml-6 space-y-2 overflow-hidden transition-all duration-500 ease-out ${openMenu === item.title ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    {item.subItems.map((sub, idx) => (
                                        <li
                                            key={sub}
                                            className="hover:text-cyan-300 cursor-pointer text-sm text-slate-400 hover:bg-slate-700/30 p-2 rounded-lg transition-all duration-200 hover:translate-x-2 hover:shadow-sm hover:shadow-cyan-500/20"
                                            style={{animationDelay: `${idx * 50}ms`}}
                                        >
                                            • {sub}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* 内容区 */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="h-20 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-between px-8 neon-border-bottom">
                        <div className="flex items-center space-x-6">
                            <button className="text-slate-300 hover:text-cyan-300 transition-all duration-300 hover:scale-105 flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30">
                                <span>🏠</span>
                                <span>主页</span>
                            </button>
                            <div className="text-slate-400 text-sm bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-600/30 flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
                                <span>最后更新: {lastUpdate.toLocaleTimeString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <button
                                className="text-slate-300 hover:text-purple-300 transition-all duration-300 hover:scale-105 flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30"
                                onClick={goToDocs}
                            >
                                <span>📚</span>
                                <span>开发文档</span>
                            </button>
                            <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 px-4 py-2 rounded-xl border border-slate-600/30 hover:border-cyan-500/30 transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center text-white font-bold animate-pulse-glow">A</div>
                                <span className="text-white font-medium">Admin</span>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </header>

                    {/* 主要内容区 */}
                    <main className="flex-1 p-8 overflow-auto">
                        {systemStatus && (
                            <div className="space-y-8">
                                {/* 系统概览 */}
                                <section>
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                                        <span>🔍</span>
                                        <span>系统状态概览</span>
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <StatusCard
                                            title="前端服务"
                                            status={systemStatus.frontend}
                                            latency={systemStatus.frontend.latency}
                                            icon="🌐"
                                        />
                                        <StatusCard
                                            title="后端服务"
                                            status={systemStatus.backend}
                                            latency={systemStatus.backend.latency}
                                            icon="⚙️"
                                        />
                                        <StatusCard
                                            title="数据库"
                                            status={systemStatus.database}
                                            latency={systemStatus.database.latency}
                                            icon="🗄️"
                                        />
                                        <StatusCard
                                            title="缓存服务"
                                            status={systemStatus.redis}
                                            latency={systemStatus.redis.latency}
                                            icon="⚡"
                                        />
                                    </div>
                                </section>

                                {/* 资源使用情况 */}
                                <section>
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                                        <span>📊</span>
                                        <span>资源使用情况</span>
                                        <span className="text-sm text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                                            {systemStatus.system.osName}
                                        </span>
                                    </h2>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <ResourceCard
                                            title="CPU使用率"
                                            percentage={systemStatus.system.cpuUsagePercent}
                                            icon="🔥"
                                            data={systemStatus.cpuUsage}
                                        />
                                        <ResourceCard
                                            title="内存使用率"
                                            percentage={systemStatus.system.memoryUsagePercent}
                                            used={systemStatus.system.usedMemoryMB}
                                            total={systemStatus.system.totalMemoryMB}
                                            unit="MB"
                                            icon="💾"
                                            data={systemStatus.memoryUsage}
                                        />
                                    </div>
                                </section>

                                {/* 端口状态 */}
                                <section>
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                                        <span>🔌</span>
                                        <span>端口状态</span>
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {systemStatus.ports.map((port, index) => (
                                            <div
                                                key={port.name}
                                                className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border backdrop-blur-sm transition-all duration-500 hover:scale-105 ${
                                                    isUpdating ? 'animate-pulse-subtle' : ''
                                                } ${getStatusColor(port.status)}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-semibold text-white">{port.name}</div>
                                                        <div className="text-sm text-slate-400">端口 {port.port}</div>
                                                    </div>
                                                    <div className={`w-3 h-3 rounded-full ${port.status === 'up' ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* 样式定义 */}
            <style>{`
                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
                }

                @keyframes twinkle {
                    0%, 100% {
                        opacity: 0.2;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.1);
                    }
                }

                @keyframes meteor {
                    0% {
                        transform: translateX(-50px) translateY(-50px);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(150px) translateY(150px);
                        opacity: 0;
                    }
                }

                @keyframes twinkle-enhanced {
                    0%, 100% { opacity: 0.2; transform: scale(0.5) rotate(0deg); }
                    25% { opacity: 0.8; transform: scale(1.2) rotate(90deg); }
                    50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
                    75% { opacity: 0.8; transform: scale(1.2) rotate(270deg); }
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }

                @keyframes pulse-glow {
                    0%, 100% { text-shadow: 0 0 5px currentColor; }
                    50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-20px) rotate(120deg); }
                    66% { transform: translateY(10px) rotate(240deg); }
                }

                @keyframes progress-wave {
                    0% { background-position: -100% 0; }
                    100% { background-position: 100% 0; }
                }

                @keyframes pulse-subtle {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.85; }
                }

                .animate-twinkle { animation: twinkle infinite; }
                .animate-meteor { animation: meteor infinite; }
                .animate-twinkle-enhanced { animation: twinkle-enhanced 6s infinite ease-in-out; }
                .animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
                .animate-pulse-glow { animation: pulse-glow 3s infinite ease-in-out; }
                .animate-float { animation: float 12s infinite ease-in-out; }
                .animate-progress-wave { animation: progress-wave 2s infinite; }
                .animate-pulse-subtle { animation: pulse-subtle 1.5s infinite; }

                .neon-border-right { border-right: 1px solid rgba(6, 182, 212, 0.3); box-shadow: 1px 0 10px rgba(6, 182, 212, 0.1); }
                .neon-border-bottom { border-bottom: 1px solid rgba(6, 182, 212, 0.3); box-shadow: 0 1px 10px rgba(6, 182, 212, 0.1); }
                .neon-glow-hover:hover { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1); }
                .glow-effect:hover { box-shadow: 0 0 10px currentColor; }

                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: rgba(51, 65, 85, 0.3); border-radius: 3px; }
                ::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.5); border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.7); }
            `}</style>
        </div>
    );
};

export default DashboardHome;