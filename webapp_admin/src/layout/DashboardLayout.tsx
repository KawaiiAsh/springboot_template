import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface MenuItem {
    title: string;
    subItems: string[];
    icon: string;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    lastUpdate: Date;
    isUpdating: boolean;
    onDocsClick: () => void;
}

const menuItems: MenuItem[] = [
    {
        title: '用户管理',
        icon: '👥',
        subItems: ['用户列表', '权限管理', '角色配置'],
    },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
                                                             children,
                                                             lastUpdate,
                                                             isUpdating,
                                                             onDocsClick,
                                                         }) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const toggleMenu = (title: string) => setOpenMenu(openMenu === title ? null : title);

    return (
        <div className="flex w-full h-full backdrop-blur-sm relative z-10 bg-transparent">
            <Sidebar menuItems={menuItems} openMenu={openMenu} toggleMenu={toggleMenu} />
            <div className="flex-1 flex flex-col h-full">
                <Header lastUpdate={lastUpdate} isUpdating={isUpdating} onDocsClick={onDocsClick} />
                <main className="flex-1 p-8 overflow-auto">{children}</main>
            </div>
        </div>
    );
};

export default DashboardLayout;
