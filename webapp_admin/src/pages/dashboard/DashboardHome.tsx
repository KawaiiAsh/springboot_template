import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
    title: string;
    subItems: string[];
}

const menuItems: MenuItem[] = [
    {
        title: '系统管理',
        subItems: [
            '用户管理',
            '角色管理',
            '菜单管理',
            '部门管理',
            '岗位管理',
            '字典管理',
            '参数设置',
            '通知公告',
        ],
    },
    {
        title: '系统监控',
        subItems: [
            '在线用户',
            '定时任务',
            '数据监控',
            '服务监控',
            '缓存监控',
        ],
    },
    {
        title: '日志管理',
        subItems: [
            '操作日志',
            '登录日志',
            '错误日志',
            '审计日志',
        ],
    },
    {
        title: '报表中心',
        subItems: [
            '营销报表',
            '销售报表',
            '用户报表',
            '系统报表',
        ],
    },
    {
        title: '权限管理',
        subItems: [
            '菜单权限',
            '接口权限',
            '数据权限',
        ],
    },
    {
        title: '消息中心',
        subItems: [
            '通知公告',
            '私信管理',
            '邮件管理',
        ],
    },
    {
        title: '工具箱',
        subItems: [
            '数据导入',
            '数据导出',
            '系统诊断',
        ],
    },
];

const DashboardHome: React.FC = () => {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = (title: string) => {
        setOpenMenu(openMenu === title ? null : title);
    };

    const goToDocs = () => {
        navigate('/docs');
    };

    return (
        <div className="w-screen h-screen relative overflow-hidden">
            {/* 背景星海与星系 */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black">
                <div className="absolute inset-0 bg-gradient-radial from-indigo-900/20 via-transparent to-transparent" />
                <div className="absolute w-64 h-64 top-20 left-1/4 galaxy animate-swirl" />
                <div className="absolute w-56 h-56 top-1/3 right-1/5 galaxy animate-swirl-reverse" />
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(100)].map((_, i) => {
                        const size = Math.random() * 2 + 0.5;
                        return (
                            <div
                                key={i}
                                className="absolute bg-white rounded-full animate-twinkle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    opacity: 0.3 + Math.random() * 0.5,
                                    animationDelay: `${Math.random() * 5}s`,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* 主体布局 */}
            <div className="relative z-10 flex h-full">
                {/* Sidebar */}
                <aside className="w-60 bg-slate-800/60 backdrop-blur-sm border-r border-slate-700/50 p-6 overflow-auto">
                    <h2 className="text-white text-2xl font-bold mb-6">Ash管理系统</h2>
                    <ul className="space-y-4 text-slate-300">
                        {menuItems.map(item => (
                            <li key={item.title}>
                                <div
                                    className="flex justify-between items-center cursor-pointer hover:text-cyan-300"
                                    onClick={() => toggleMenu(item.title)}
                                >
                                    <span>{item.title}</span>
                                    <span className="text-lg">{openMenu === item.title ? '–' : '+'}</span>
                                </div>
                                <ul
                                    className={`mt-2 ml-4 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                                        openMenu === item.title ? 'max-h-60' : 'max-h-0'
                                    }`}
                                >
                                    {item.subItems.map(sub => (
                                        <li key={sub} className="hover:text-cyan-300 cursor-pointer text-sm">
                                            {sub}
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
                    <header className="h-16 bg-slate-800/60 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between px-8">
                        <button
                            className="text-slate-300 hover:text-cyan-300 mr-6"
                            onClick={() => navigate('/home')}
                        >
                            返回主页
                        </button>
                        <div className="flex items-center">
                            <button
                                className="text-slate-300 hover:text-cyan-300 mr-6"
                                onClick={goToDocs}
                            >
                                开发文档
                            </button>
                            <img
                                src="/asset/avatar.jpg"
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full mr-2"
                            />
                            <span className="text-white">用户名</span>
                        </div>
                    </header>

                    {/* Main 模块展示 */}
                    <main className="flex-1 p-8 grid grid-cols-2 gap-8">
                        {['模块一', '模块二', '模块三', '模块四'].map(title => (
                            <div
                                key={title}
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6"
                            >
                                <h3 className="text-white font-medium mb-2">{title}</h3>
                                <p className="text-slate-300 text-sm">示例内容</p>
                            </div>
                        ))}
                    </main>

                    {/* Footer */}
                    <footer className="h-12 bg-slate-800/60 backdrop-blur-sm border-t border-slate-700/50 flex items-center justify-center">
                        <span className="text-slate-400 text-sm">© 2025 Your Company</span>
                    </footer>
                </div>
            </div>

            {/* 样式：星系 & 星点动画 */}
            <style>{`        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes swirl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes swirlReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-twinkle { animation: twinkle 4s infinite ease-in-out; }
        .animate-swirl { animation: swirl 60s linear infinite; }
        .animate-swirl-reverse { animation: swirlReverse 80s linear infinite; }
        .galaxy {
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 60%),
                      radial-gradient(circle at bottom right, rgba(147,51,234,0.15) 20%, transparent 80%);
          filter: blur(12px);
        }
      `}</style>
        </div>
    );
};

export default DashboardHome;