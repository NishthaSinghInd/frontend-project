import React from 'react';

const RiskModelsPage = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold dark:text-white">AI Risk Models Suite</h1>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-[2rem] flex items-center gap-4 shadow-sm border border-slate-200 dark:border-neutral-800">
                    <div className="w-14 h-14 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                        <span className="material-icons-round text-yellow-500 text-3xl">precision_manufacturing</span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Active Models</p>
                        <h3 className="text-2xl font-bold dark:text-white">05</h3>
                    </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-[2rem] flex items-center gap-4 shadow-sm border border-slate-200 dark:border-neutral-800">
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="material-icons-round text-blue-500 text-3xl">insights</span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Avg. Accuracy</p>
                        <h3 className="text-2xl font-bold dark:text-white">92.4%</h3>
                    </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-[2rem] flex items-center gap-4 shadow-sm border border-slate-200 dark:border-neutral-800">
                    <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                        <span className="material-icons-round text-pink-500 text-3xl">speed</span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Weekly Scans</p>
                        <h3 className="text-2xl font-bold dark:text-white">12,840</h3>
                    </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-[2rem] flex items-center gap-4 shadow-sm border border-slate-200 dark:border-neutral-800">
                    <div className="w-14 h-14 bg-cyan-50 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                        <span className="material-icons-round text-cyan-500 text-3xl">security</span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Global Risk</p>
                        <h3 className="text-2xl font-bold dark:text-white">Minimal</h3>
                    </div>
                </div>
            </div>

            <div className="mb-6 mt-8">
                <h2 className="text-xl font-bold mb-6 text-primary">Model Library</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                    {/* Prepayment Model */}
                    <div className="bg-card-light dark:bg-card-dark rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-neutral-800">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 dark:bg-primary/20 rounded-2xl flex items-center justify-center">
                                    <span className="material-icons-round text-primary">analytics</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">Prepayment Model</h4>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Since Jan 2023</p>
                                </div>
                            </div>
                            <span className="bg-green-100 dark:bg-primary/20 text-green-700 dark:text-primary text-xs px-3 py-1 rounded-full font-bold">STABLE</span>
                        </div>

                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-slate-400 text-sm">Model Accuracy</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">94.2%</p>
                                </div>
                                <div className="w-24 h-10">
                                    <svg className="w-full h-full stroke-primary stroke-2 fill-transparent" viewBox="0 0 100 40">
                                        <path d="M0 35 Q 20 5, 40 30 T 80 10 T 100 25"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button className="w-full py-4 bg-primary hover:bg-green-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/20">
                                View Deep Analytics
                            </button>
                            <div className="flex justify-between text-xs font-medium text-slate-400 px-2">
                                <span>Last Refined: 2h ago</span>
                                <span>v2.4.1</span>
                            </div>
                        </div>
                    </div>

                    {/* Safe Loan Model */}
                    <div className="bg-card-light dark:bg-card-dark rounded-[2rem] p-8 shadow-lg border border-slate-200 dark:border-neutral-800">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                    <span className="material-icons-round text-blue-500">verified_user</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">Safe Loan Model</h4>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Since Oct 2022</p>
                                </div>
                            </div>
                            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs px-3 py-1 rounded-full font-bold">OPTIMIZED</span>
                        </div>

                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-slate-400 text-sm">Model Accuracy</p>
                                    <p className="text-2xl font-bold dark:text-white">96.8%</p>
                                </div>
                                <div className="w-24 h-10">
                                    <svg className="w-full h-full stroke-primary stroke-2 fill-transparent" viewBox="0 0 100 40">
                                        <path d="M0 20 Q 25 15, 50 35 T 100 5"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl">View Deep Analytics</button>
                        <div className="flex justify-between text-xs font-medium text-slate-400 px-2 mt-3"><span>Last Refined: 12m ago</span><span>v3.0.0</span></div>
                    </div>

                    {/* Train New Model */}
                    <div className="bg-slate-100/50 dark:bg-neutral-800/50 rounded-[2rem] p-8 border-2 border-dashed border-slate-300 dark:border-neutral-700 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-primary dark:hover:border-primary min-h-[300px] transition-all">
                        <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <span className="material-icons-round text-slate-400 group-hover:text-primary">add</span>
                        </div>
                        <p className="font-bold text-slate-400 group-hover:text-primary transition-colors">Train New Model</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskModelsPage;
