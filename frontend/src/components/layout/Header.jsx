import React, { useState, useEffect } from 'react';
import logoUrl from '../../assets/logo.png';

const Header = ({ title = "Dashboard", onMenuClick }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        // Initial class setting
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return (
        <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-card-dark/50 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-4 hidden md:block">
                <div className="relative w-64 lg:w-96">
                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Search for something"
                        className="w-full bg-slate-100 dark:bg-neutral-800 border-none rounded-full py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/50 text-sm outline-none dark:text-white"
                    />
                </div>
            </div>

            {/* Mobile Title (visible only on small screens) */}
            <div className="md:hidden flex items-center gap-2">
                <img src={logoUrl} alt="Loaner Logo" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold dark:text-white" style={{ fontFamily: '"Gropled", sans-serif' }}>LOANER</span>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                <button
                    onClick={toggleDarkMode}
                    className="p-2.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-500 hover:text-primary transition-colors"
                    title="Toggle Dark Mode"
                >
                    <span className="material-icons-round text-xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                </button>
                <button className="relative p-2.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-500 hover:text-primary transition-colors">
                    <span className="material-icons-round text-xl text-red-500">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-neutral-800"></span>
                </button>
                <button onClick={onMenuClick} className="md:hidden p-2 dark:text-white">
                    <span className="material-icons-round">menu</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
