import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoiAnalyticsPage = () => {
    const [baseRate, setBaseRate] = useState(7.25);
    const [volatility, setVolatility] = useState('Medium');
    const [inflationOffset, setInflationOffset] = useState(1.5);
    const [roiPrediction, setRoiPrediction] = useState(null);

    useEffect(() => {
    const fetchROI = async () => {
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/assess-loan", {
                borrower_name: "Test User",
                loan_amnt: 10000,
                term: "36 months",
                emp_length: "5 years",
                home_ownership: "RENT",
                annual_inc: 60000,
                dti: 15
            });

            setRoiPrediction(res.data.roi_prediction);
        } catch (err) {
            console.error("ROI fetch failed", err);
        }
    };

    fetchROI();
}, []);

    // Simulated calculation
    const calculatedRoi = (12.85 + (baseRate - 7.25) * 1.5 - (inflationOffset - 1.5) * 0.8).toFixed(2);
    const riskAdj = ((baseRate - 7.25) * 0.2 + (volatility === 'High' ? 0.5 : volatility === 'Low' ? -0.2 : 0)).toFixed(2);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Loan Portfolio Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time ROI prediction and interest rate sensitivity modeling</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Mini Stat Cards */}
                {[
                    { label: 'Predicted ROI', val: roiPrediction ? `${roiPrediction.toFixed(2)}%` : 'Loading...', icon: 'trending_up', color: 'text-primary', bg: 'bg-primary/10', chg: '+4.2%' },
                    { label: 'Avg Interest Rate', val: '7.42%', icon: 'percent', color: 'text-blue-500', bg: 'bg-blue-500/10', chg: 'Stable', chgBg: 'bg-slate-100 dark:bg-white/5 text-slate-500' },
                    { label: 'Portfolio Risk Score', val: 'B+', sub: '(Medium)', icon: 'warning_amber', color: 'text-orange-500', bg: 'bg-orange-500/10', chg: '-1.2%' },
                    { label: 'Model Accuracy', val: '98.4%', icon: 'auto_awesome', color: 'text-purple-500', bg: 'bg-purple-500/10', chg: 'AI Active' },
                ].map((stat, i) => (
                    <div key={i} className="bg-card-light dark:bg-card-dark p-6 rounded-[1.5rem] border border-slate-200 dark:border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <span className={`material-icons-round ${stat.color}`}>{stat.icon}</span>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.chgBg || `${stat.color} ${stat.bg}`}`}>{stat.chg}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                        <h3 className="text-2xl font-bold mt-1 dark:text-white">{stat.val} <span className="text-sm font-normal text-slate-500">{stat.sub}</span></h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Forecast Chart Component */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-card-light dark:bg-card-dark p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 flex-1 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-lg font-bold dark:text-white">ROI Performance Forecast</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Comparing actual vs. AI-predicted returns (8 months)</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                                    <span className="text-xs text-slate-500 font-medium">Predicted</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                    <span className="text-xs text-slate-500 font-medium">Actual</span>
                                </div>
                            </div>
                        </div>

                        {/* Mock Bar Chart */}
                        <div className="h-64 flex items-end justify-between gap-1 relative">
                            {/* Grid lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                <div className="border-t border-slate-100 dark:border-white/5 w-full h-0"></div>
                                <div className="border-t border-slate-100 dark:border-white/5 w-full h-0"></div>
                                <div className="border-t border-slate-100 dark:border-white/5 w-full h-0"></div>
                                <div className="border-t border-slate-100 dark:border-white/5 w-full h-0"></div>
                            </div>
                            {[
                                { m: 'Jan', a: '60%', p: '70%' }, { m: 'Feb', a: '65%', p: '72%' },
                                { m: 'Mar', a: '70%', p: '75%' }, { m: 'Apr', a: '80%', p: '85%' },
                                { m: 'May', a: '85%', p: '90%' }, { m: 'Jun', a: '75%', p: '78%' },
                                { m: 'Jul', a: '80%', p: '88%' }, { m: 'Aug', a: '85%', p: '95%' }
                            ].map((col, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                    <div className="w-2 bg-slate-200 dark:bg-slate-800 rounded-t-full mb-1 transition-all" style={{ height: col.a }}></div>
                                    <div className="w-2 bg-primary rounded-t-full absolute bottom-[18px] transition-all" style={{ height: col.p }}></div>
                                    <span className="text-[10px] text-slate-400 mt-2 z-10">{col.m}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-[1.5rem] border border-slate-200 dark:border-white/5">
                            <h4 className="font-bold mb-4 dark:text-white">Risk Distribution</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Low Risk (AAA-A)</span>
                                    <span className="font-bold dark:text-white">64%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[64%]"></div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Medium Risk (B-C)</span>
                                    <span className="font-bold dark:text-white">28%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-400 w-[28%]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-[1.5rem] border border-slate-200 dark:border-white/5">
                            <h4 className="font-bold mb-4 flex items-center gap-2 dark:text-white">
                                <span className="material-icons-round text-primary text-sm">auto_awesome</span> AI Recommendation
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Based on current inflation trends, increasing rates for Tier-B loans by 0.25% could maximize ROI without significantly impacting default probability.</p>
                            <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl text-xs transition-all">
                                APPLY TO BATCH
                            </button>
                        </div>
                    </div>
                </div>

                {/* Simulator Sidebar */}
                <div className="bg-primary dark:bg-primary/10 border border-primary/20 p-8 rounded-[2rem] flex flex-col h-full">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white lg:text-slate-900 dark:lg:text-white">What-if Simulator</h2>
                        <p className="text-sm text-slate-100 lg:text-slate-500 dark:lg:text-slate-400">Simulate market changes & rate adjustments</p>
                    </div>

                    <div className="space-y-8 flex-1">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-white lg:text-slate-700 dark:lg:text-slate-300">Base Interest Rate</label>
                                <span className="text-xs font-mono bg-white/20 dark:bg-white/5 px-2 py-1 rounded text-white lg:text-primary dark:lg:text-primary">{baseRate}%</span>
                            </div>
                            <input
                                type="range" min="3" max="15" step="0.25" value={baseRate} onChange={(e) => setBaseRate(Number(e.target.value))}
                                className="w-full h-2 bg-white/20 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-white lg:accent-primary"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-white lg:text-slate-700 dark:lg:text-slate-300">Market Volatility</label>
                                <span className="text-xs font-mono bg-white/20 dark:bg-white/5 px-2 py-1 rounded text-white lg:text-orange-400 dark:lg:text-orange-400">{volatility}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {['Low', 'Medium', 'High'].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setVolatility(v)}
                                        className={`py-2 text-[10px] font-bold rounded-lg uppercase transition-colors ${volatility === v
                                                ? 'bg-white lg:bg-primary text-primary lg:text-white shadow-lg'
                                                : 'border border-white/20 dark:border-white/10 text-white/60 lg:text-slate-400'
                                            }`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-white lg:text-slate-700 dark:lg:text-slate-300">Inflation Offset</label>
                                <span className="text-xs font-mono bg-white/20 dark:bg-white/5 px-2 py-1 rounded text-white lg:text-primary dark:lg:text-primary">+{inflationOffset}%</span>
                            </div>
                            <input
                                type="range" min="0" max="5" step="0.5" value={inflationOffset} onChange={(e) => setInflationOffset(Number(e.target.value))}
                                className="w-full h-2 bg-white/20 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-white lg:accent-primary"
                            />
                        </div>

                        <div className="pt-6 border-t border-white/20 dark:border-white/10">
                            <div className="bg-white/10 dark:bg-white/5 rounded-2xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-icons-round text-white lg:text-primary">query_stats</span>
                                    <span className="text-sm font-bold text-white lg:text-slate-900 dark:lg:text-white">Simulated Impact</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase text-white/60 lg:text-slate-400 font-bold">New ROI</p>
                                        <p className="text-xl font-bold text-white lg:text-slate-900 dark:lg:text-white">{calculatedRoi}%</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-white/60 lg:text-slate-400 font-bold">Risk Adj.</p>
                                        <p className={`text-xl font-bold ${Number(riskAdj) > 0 ? 'text-red-300 lg:text-red-500' : 'text-green-300 lg:text-green-500'}`}>
                                            {Number(riskAdj) > 0 ? '+' : ''}{riskAdj}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="w-full mt-8 py-4 bg-white dark:bg-primary text-primary dark:text-white font-bold rounded-2xl shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Generate Full Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoiAnalyticsPage;
