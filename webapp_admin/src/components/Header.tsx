// components/Header.tsx
import React from 'react';

interface HeaderProps {
    lastUpdate: Date;
    isUpdating: boolean;
    onDocsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ lastUpdate, isUpdating, onDocsClick }) => (
    <header className="h-20 w-full bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-between px-8 neon-border-bottom">
        <div className="flex items-center space-x-6">
            <button className="text-slate-300 hover:text-cyan-300 transition-all duration-300 hover:scale-105 flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30">
                <span>🏠</span>
                <span>主页</span>
            </button>
            <div className="text-slate-400 text-sm bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-600/30 flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                <span>最后更新: {lastUpdate.toLocaleTimeString()}</span>
            </div>
        </div>
        <div className="flex items-center space-x-6">
            <button
                className="text-slate-300 hover:text-purple-300 transition-all duration-300 hover:scale-105 flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30"
                onClick={onDocsClick}
            >
                <span>📚</span>
                <span>开发文档</span>
            </button>
            <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 px-4 py-2 rounded-xl border border-slate-600/30 hover:border-cyan-500/30">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center text-white font-bold animate-pulse-glow">A</div>
                <span className="text-white font-medium">Admin</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
        </div>
    </header>
);

export default Header;
