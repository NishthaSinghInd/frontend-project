import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SegmentationPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/segmentation/stats");
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load segmentation stats", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatCurrency = (value) => {
        if (!value) return "$0";
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
        return `$${value}`;
    };

    const generateReport = () => {
        if (!stats) return;

        const reportContent = `=========================================
      LOANER AI SEGMENTATION REPORT
=========================================
Date Generated: ${new Date().toLocaleString()}

-- OVERVIEW --
Total Customers: ${stats.total_customers.toLocaleString()}
Risk Exposure: ${formatCurrency(stats.risk_exposure)}
Avg Credit Score Est.: ${stats.avg_credit_score}
System Confidence: ${stats.ai_confidence}%

-- CUSTOMER SEGMENTATION CLUSTERS --
High-Value / Low-Risk : ${stats.segments.high_value}%
Standard Growth       : ${stats.segments.standard}%
Emerging Subprime     : ${stats.segments.subprime}%
Critical Review       : ${stats.segments.critical}%

-- RADAR PROFILE AVERAGES (0-100 Scale) --
Income Experience     : ${stats.radar_data.income}/100
DTI Health            : ${stats.radar_data.dti}/100
Credit Health         : ${stats.radar_data.history}/100

=========================================
End of Report`;

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Segmentation_Report_${new Date().toISOString().split('T')[0]}.txt`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500 font-medium">Loading Segmentation Data...</div>;
    }

    if (!stats || !stats.total_customers) {
        return <div className="p-8 text-center text-slate-500 font-medium">No loan data available. Create some loans first!</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 dark:text-white text-slate-900">Customer Segmentation</h2>
                <p className="text-slate-500 dark:text-slate-400">AI-driven risk clustering and profile distribution based on real-time market data.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* KPI Cards */}
                {[
                    { label: 'Total Customers', val: stats.total_customers.toLocaleString(), change: 'Live', color: 'emerald', icon: 'groups' },
                    { label: 'Avg. Credit Score', val: stats.avg_credit_score.toString(), change: 'AI Est.', color: 'blue', icon: 'verified' },
                    { label: 'Risk Exposure', val: formatCurrency(stats.risk_exposure), change: 'Total', color: 'red', icon: 'warning' },
                    { label: 'AI Confidence', val: `${stats.ai_confidence}%`, change: 'Stable', color: 'primary', icon: 'trending_up' },
                ].map((card, i) => (
                    <div key={i} className="bg-card-light dark:bg-card-dark p-6 border border-slate-200 dark:border-neutral-800 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className={`material-icons-round p-2 rounded-lg 
                       ${card.color === 'emerald' ? 'text-emerald-500 bg-emerald-500/10' :
                                    card.color === 'blue' ? 'text-blue-500 bg-blue-500/10' :
                                        card.color === 'red' ? 'text-orange-500 bg-orange-500/10' :
                                            'text-purple-500 bg-purple-500/10'}`}
                            >
                                {card.icon}
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded 
                        ${card.color === 'emerald' ? 'text-emerald-500 bg-emerald-500/10' :
                                    card.color === 'blue' ? 'text-blue-500 bg-blue-500/10' :
                                        card.color === 'red' ? 'text-red-500 bg-red-500/10' :
                                            'text-primary bg-primary/10'}`}>
                                {card.change}
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">{card.label}</p>
                        <h3 className="text-2xl font-bold dark:text-white">{card.val}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Radar Chart Stand-in */}
                <div className="lg:col-span-2 bg-card-light dark:bg-card-dark p-8 border border-slate-200 dark:border-neutral-800 rounded-xl flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-full flex items-center justify-between mb-8 self-start">
                        <div>
                            <h3 className="text-xl font-bold dark:text-white">Risk Distribution Model</h3>
                            <p className="text-sm text-slate-500">Multi-dimensional risk factor analysis</p>
                        </div>
                        <select className="bg-slate-100 dark:bg-neutral-800 border-none text-xs font-semibold rounded-lg dark:text-white">
                            <option>Current Quarter</option>
                        </select>
                    </div>

                    <div className="flex-1 flex items-center justify-center w-full relative">
                        {/* Simulated Radar vector */}
                        <svg className="w-full max-w-[320px] h-auto overflow-visible" viewBox="0 0 400 400">
                            <polygon className="fill-transparent stroke-slate-200 dark:stroke-neutral-800" points="200,40 360,120 360,280 200,360 40,280 40,120" strokeDasharray="4"></polygon>
                            <polygon className="fill-transparent stroke-slate-200 dark:stroke-neutral-800" points="200,80 320,140 320,260 200,320 80,260 80,140" strokeDasharray="4"></polygon>
                            <polygon className="fill-transparent stroke-slate-200 dark:stroke-neutral-800" points="200,120 280,160 280,240 200,280 120,240 120,160" strokeDasharray="4"></polygon>
                            <line className="stroke-slate-200 dark:stroke-neutral-800" x1="200" y1="40" x2="200" y2="360"></line>
                            <line className="stroke-slate-200 dark:stroke-neutral-800" x1="40" y1="120" x2="360" y2="280"></line>
                            <line className="stroke-slate-200 dark:stroke-neutral-800" x1="360" y1="120" x2="40" y2="280"></line>
                            <polygon 
                                fill="rgba(34, 197, 94, 0.2)" 
                                stroke="#22c55e" 
                                strokeWidth="2" 
                                points={`
                                    200,${200 - (stats.radar_data.income / 100 * 140)} 
                                    ${200 + (stats.radar_data.dti / 100 * 140 * 0.866)},${200 + (stats.radar_data.dti / 100 * 140 * 0.5)} 
                                    ${200 - (stats.radar_data.history / 100 * 140 * 0.866)},${200 + (stats.radar_data.history / 100 * 140 * 0.5)}
                                `}
                            />
                            <text className="text-[12px] fill-slate-500 font-medium" x="200" y="25" textAnchor="middle">Income Exp.</text>
                            <text className="text-[12px] fill-slate-500 font-medium" x="375" y="295" textAnchor="start">DTI Health</text>
                            <text className="text-[12px] fill-slate-500 font-medium" x="25" y="295" textAnchor="end">Credit Health</text>
                        </svg>
                    </div>
                </div>

                {/* Segmentation Distribution */}
                <div className="bg-card-light dark:bg-card-dark p-8 border border-slate-200 dark:border-neutral-800 flex flex-col rounded-xl">
                    <h3 className="text-xl font-bold mb-1 dark:text-white">Segmentation</h3>
                    <p className="text-sm text-slate-500 mb-8">Customer cluster distribution</p>

                    <div className="flex-1 space-y-6">
                        {[
                            { lbl: 'High-Value / Low-Risk', pct: `${stats.segments.high_value}%`, color: 'bg-primary' },
                            { lbl: 'Standard Growth', pct: `${stats.segments.standard}%`, color: 'bg-blue-500' },
                            { lbl: 'Emerging Subprime', pct: `${stats.segments.subprime}%`, color: 'bg-orange-400' },
                            { lbl: 'Critical Review', pct: `${stats.segments.critical}%`, color: 'bg-red-500' },
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="flex items-center gap-2 font-medium dark:text-slate-300">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>{item.lbl}
                                    </span>
                                    <span className="font-bold dark:text-white">{item.pct}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                                    <div className={`${item.color} h-full`} style={{ width: item.pct }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-neutral-800">
                        <button 
                            onClick={generateReport}
                            className="w-full py-3 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors text-sm font-semibold rounded-xl dark:text-white"
                        >
                            Generate Full Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SegmentationPage;
