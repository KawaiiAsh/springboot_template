// components/Sidebar.tsx
import React from 'react';

interface MenuItem {
    title: string;
    subItems: string[];
    icon: string;
}

interface SidebarProps {
    menuItems: MenuItem[];
    openMenu: string | null;
    toggleMenu: (title: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, openMenu, toggleMenu }) => (
    <aside className="w-72 bg-gradient-to-b from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border-r border-cyan-500/20 p-6 overflow-auto neon-border-right">
        <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse-glow">
                ⚡ 后台管理系统
            </h2>
        </div>

        <ul className="space-y-3">
            {menuItems.map((item) => (
                <li key={item.title} className="group">
                    <div
                        className="flex justify-between items-center cursor-pointer p-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:border-cyan-400/50 border border-transparent backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-cyan-500/25 neon-glow-hover"
                        onClick={() => toggleMenu(item.title)}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-slate-200 group-hover:text-cyan-300 font-medium">{item.title}</span>
                        </div>
                        <span className={`text-lg ${openMenu === item.title ? 'rotate-45 text-cyan-400' : 'text-slate-400'}`}>+</span>
                    </div>
                    <ul className={`mt-2 ml-6 space-y-2 transition-all ${openMenu === item.title ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        {item.subItems.map((sub) => (
                            <li key={sub} className="hover:text-cyan-300 cursor-pointer text-sm text-slate-400 hover:bg-slate-700/30 p-2 rounded-lg transition-all duration-200 hover:translate-x-2">
                                • {sub}
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    </aside>
);

export default Sidebar;
