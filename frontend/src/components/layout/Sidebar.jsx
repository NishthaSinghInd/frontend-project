import React from 'react';
import { NavLink } from 'react-router-dom';
import logoUrl from '../../assets/logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const navLinks = [
        { name: 'Overview', path: '/', icon: 'grid_view' },
        { name: 'Risk Models', path: '/risk-models', icon: 'analytics' },
        { name: 'Customer Segments', path: '/segmentation', icon: 'groups' },
        { name: 'Roi Analytics', path: '/roi-analytics', icon: 'trending_up' },
    ];

    return (
        <aside className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-sidebar-dark border-r border-slate-200 dark:border-zinc-800 z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="p-6 flex items-center justify-between border-b border-transparent">
                <div className="flex items-center gap-3">
                    <img src={logoUrl} alt="Loaner Logo" className="w-9 h-9 object-contain" />
                    <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-1 mt-1" style={{ fontFamily: '"Gropled", sans-serif' }}>
                        Loaner<span className="text-primary hidden lg:inline"></span>
                    </span>
                </div>
                <button className="md:hidden text-slate-500" onClick={() => setIsOpen(false)}>
                    <span className="material-icons-round">close</span>
                </button>
            </div>
            <nav className="flex-1 mt-4 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-primary/10 text-primary border border-primary/20 font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 font-medium'
                            }`
                        }
                    >
                        <span className="material-icons-round">{link.icon}</span>
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-6 mt-auto border-t border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-zinc-800/50 rounded-xl">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi0Y8axr3ICVA0Gt0jTt1pyCchnC1nUa9H3Yx1XviJoNyHOMh2fJdq_XxvXBoJjdf_SkVOPaYd-66ixAwRgLPccOMB4D2Z2HZG32NWdJr0bCwZ76mZ8RTl1yY0MN_VlivpIQGFASstgudBp4eS_bVU83yRuYtAcBZYxCM4gZADTSwDp2sC6h_SjY9pLgrp0D6ghysNoB5FCc7PbfJ3myL6ZZFPVs8jUQAjvlbiBpOzcumgN3GjsbtZXY65zqYLy20LdHhpVn_ZMQk"
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-primary/20 object-cover"
                    />
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate dark:text-white">Kevin</p>
                        <p className="text-xs text-slate-500 truncate"></p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
