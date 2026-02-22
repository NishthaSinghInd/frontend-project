import React from 'react';

const OverviewPage = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-[1rem] shadow-sm border border-slate-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <span className="material-icons-round text-blue-600">credit_score</span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Credit Score</p>
                            <p className="text-2xl font-bold">742</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-[1rem] shadow-sm border border-slate-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <span className="material-icons-round text-primary">payments</span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Loan Value</p>
                            <p className="text-2xl font-bold">$12.4M</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-[1rem] shadow-sm border border-slate-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <span className="material-icons-round text-purple-600">trending_up</span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Predicted ROI</p>
                            <p className="text-2xl font-bold">8.42%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-[1rem] shadow-sm border border-slate-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                            <span className="material-icons-round text-orange-600">report_problem</span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Risk</p>
                            <p className="text-2xl font-bold">Moderate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Charts area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card-light dark:bg-card-dark p-6 rounded-[1rem] border border-slate-200 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-lg dark:text-white">Risk Distribution Heatmap</h3>
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-3 h-3 rounded-full bg-primary"></span> Low Risk</span>
                            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-3 h-3 rounded-full bg-orange-400"></span> Medium Risk</span>
                            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-3 h-3 rounded-full bg-red-500"></span> High Risk</span>
                        </div>
                    </div>
                    {/* Mock Heatmap */}
                    <div className="flex items-end justify-between h-64 px-2 sm:px-4 gap-2 sm:gap-4">
                        {[
                            { low: '40%', med: '0%', high: '0%' },
                            { low: '80%', med: '0%', high: '0%' },
                            { low: '55%', med: '0%', high: '0%' },
                            { low: '0%', med: '95%', high: '0%' },
                            { low: '0%', med: '45%', high: '0%' },
                            { low: '0%', med: '0%', high: '30%' },
                            { low: '0%', med: '0%', high: '15%' }
                        ].map((col, idx) => (
                            <div key={idx} className="flex-1 flex flex-col justify-end h-full gap-1">
                                {col.high !== '0%' && <div style={{ height: col.high }} className="w-full bg-red-500/80 hover:bg-red-400 rounded-t-lg transition-all"></div>}
                                {col.med !== '0%' && <div style={{ height: col.med }} className="w-full bg-orange-400/80 hover:bg-orange-300 rounded-t-lg transition-all"></div>}
                                {col.low !== '0%' && <div style={{ height: col.low }} className="w-full bg-primary/80 hover:bg-primary/60 rounded-t-lg transition-all"></div>}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 px-1 sm:px-2 text-[10px] sm:text-xs font-medium text-slate-400">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                <div className="bg-primary p-6 rounded-[1rem] flex flex-col justify-between text-white relative overflow-hidden group min-h-[300px]">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold">Portfolio Health</h3>
                            <span className="material-icons-round cursor-pointer">more_horiz</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-white/60 text-xs font-medium uppercase">Active Approvals</p>
                                <p className="text-4xl font-bold">92.4%</p>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-1.5 focus:outline-none focus:ring-2 focus:ring-white/50">
                                <div className="bg-white h-1.5 rounded-full w-[92%]"></div>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 mt-8">
                        <p className="text-xs text-white/90 leading-relaxed italic bg-black/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 shadow-sm">
                            "Our AI model predicts a 1.2% reduction in delinquency for the next quarter based on current credit filters."
                        </p>
                    </div>
                    {/* Decorative shapes */}
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -left-10 -top-10 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="bg-card-light dark:bg-card-dark rounded-[1rem] border border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                    <h3 className="font-bold text-lg dark:text-white">Recent AI Risk Assessments</h3>
                    <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-neutral-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
                            <tr>
                                <th className="px-6 py-4">Applicant</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Loan Amount</th>
                                <th className="px-6 py-4">AI Score</th>
                                <th className="px-6 py-4">Grade</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                            {[
                                { init: 'JS', name: 'James Sterling', id: '#10922', type: 'Mortgage', amt: '$450,000', score: 88, color: 'primary', grade: 'A+', risk: 'Low', status: 'Pre-Approved' },
                                { init: 'EW', name: 'Emily Wilson', id: '#10923', type: 'Business', amt: '$120,000', score: 54, color: 'orange', grade: 'B-', risk: 'Medium', status: 'Under Review' },
                                { init: 'RT', name: 'Robert Taylor', id: '#10924', type: 'Personal', amt: '$15,000', score: 22, color: 'red', grade: 'D', risk: 'High', status: 'Flagged' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-neutral-900 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
                        ${row.color === 'primary' ? 'bg-primary/20 text-primary' :
                                                    row.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600' :
                                                        'bg-red-100 dark:bg-red-900/40 text-red-600'}`}>
                                                {row.init}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold dark:text-white">{row.name}</p>
                                                <p className="text-xs text-slate-500">App {row.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{row.type}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{row.amt}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-slate-200 dark:bg-neutral-700 h-1.5 rounded-full">
                                                <div className={`h-1.5 rounded-full ${row.color === 'primary' ? 'bg-primary' : row.color === 'orange' ? 'bg-orange-400' : 'bg-red-500'
                                                    }`} style={{ width: `${row.score}%` }}></div>
                                            </div>
                                            <span className={`text-xs font-bold ${row.color === 'primary' ? 'text-primary' : row.color === 'orange' ? 'text-orange-400' : 'text-red-500'
                                                }`}>{row.score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${row.color === 'primary' ? 'bg-primary/10 text-primary' :
                                                row.color === 'orange' ? 'bg-orange-500/10 text-orange-500' :
                                                    'bg-red-500/10 text-red-500'
                                            }`}>
                                            {row.risk} Risk ({row.grade})
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-sm font-semibold text-right ${row.color === 'primary' ? 'text-primary' :
                                            row.color === 'orange' ? 'text-slate-500' :
                                                'text-red-500'
                                        }`}>
                                        {row.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;
