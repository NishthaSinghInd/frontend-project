import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OverviewPage = () => {

    const [stats, setStats] = useState({
        avg_credit_score: 0,
        total_loan_value: 0,
        predicted_roi: 0,
        overall_risk: "N/A"
    });

    const [recentLoans, setRecentLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats directly from our new FastAPI endpoint
                const response = await axios.get('http://127.0.0.1:8000/api/portfolio/stats');
                
                if (response.data) {
                    setStats(response.data.stats || {
                        avg_credit_score: 0,
                        total_loan_value: 0,
                        predicted_roi: 0,
                        overall_risk: "N/A"
                    });
                    setRecentLoans(response.data.recent_loans || []);
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
        
        // Connect to FastAPI WebSocket for real-time reactivity (replaces polling)
        const ws = new WebSocket('ws://127.0.0.1:8000/ws/dashboard');
        
        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.action === 'new_loan') {
                    // Prepend new loan to the state for instant UI update
                    setRecentLoans(prev => [message.data, ...prev].slice(0, 10));
                    
                    // Re-fetch the overall portfolio stats to ensure accuracy
                    fetchDashboardData();
                }
            } catch (err) {
                console.error("WebSocket message error:", err);
            }
        };

        return () => {
            if (ws.readyState === 1) { // 1 is open
                ws.close();
            }
        };

    }, []);

    const formatCurrency = (value) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
        return `$${value}`;
    };

    const exportToCSV = () => {
        if (recentLoans.length === 0) return;
        
        const headers = ["Applicant", "Category", "Loan Amount ($)", "AI Risk Score", "Grade", "Status"];
        const rows = recentLoans.map(loan => 
            `"${loan.applicant}","${loan.category}",${loan.amount},${loan.ai_score},"${loan.grade}","${loan.status}"`
        );
        
        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Risk_Assessments_Export.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-[1rem] shadow-sm border border-slate-200 dark:border-neutral-800">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Avg Credit Score</p>
                    <p className="text-2xl font-bold">{stats.avg_credit_score}</p>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-[1rem] shadow-sm border border-slate-200 dark:border-neutral-800">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Total Amount Issued</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.total_loan_value)}</p>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-[1rem] shadow-sm border border-slate-200 dark:border-neutral-800">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Avg Expected ROI</p>
                    <p className="text-2xl font-bold">
                        {stats.predicted_roi > 0 ? '+' : ''}{stats.predicted_roi}%
                    </p>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-[1rem] shadow-sm border border-slate-200 dark:border-neutral-800">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Overall Risk</p>
                    <p className="text-2xl font-bold">{stats.overall_risk}</p>
                </div>

            </div>

            {/* Recent Loans Table */}
            <div className="bg-card-light dark:bg-card-dark rounded-[1rem] border border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden">

                {/* Table Header with Export */}
                <div className="p-6 border-b border-slate-200 dark:border-neutral-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-primary">history</span>
                        Recent AI Risk Assessments
                    </h3>
                    
                    <button 
                        onClick={exportToCSV}
                        disabled={recentLoans.length === 0 || isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <span className="material-icons-round text-sm group-hover:text-primary transition-colors">download</span>
                        Export Excel (CSV)
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">

                        <thead className="bg-slate-50 dark:bg-neutral-900/50 text-slate-500 text-xs font-semibold uppercase">
                            <tr>
                                <th className="px-6 py-4">Applicant</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Loan Amount</th>
                                <th className="px-6 py-4">AI Score</th>
                                <th className="px-6 py-4">Grade</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {recentLoans.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        No assessments recorded yet.
                                    </td>
                                </tr>
                            )}
                            
                            {isLoading && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        Loading dashboard data...
                                    </td>
                                </tr>
                            )}
                            
                            {recentLoans.map((loan) => (
                                <tr key={loan.id} className="border-b border-slate-100 dark:border-neutral-800/50 hover:bg-slate-50 dark:hover:bg-neutral-800/20 transition-colors">
                                    <td className="px-6 py-4 font-medium dark:text-white">
                                        {loan.applicant}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 capitalize">
                                        {loan.category}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                                        ${loan.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${loan.ai_score > 70 ? 'bg-emerald-500' : (loan.ai_score > 40 ? 'bg-amber-500' : 'bg-rose-500')}`}
                                                    style={{ width: `${loan.ai_score}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium dark:text-slate-300">{loan.ai_score}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-800 text-sm font-bold dark:text-white">
                                            {loan.grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
                                            ${loan.status === 'Approve' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 
                                            (loan.status === 'Reject' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 
                                            'bg-slate-50 text-slate-600 dark:bg-neutral-800 dark:text-slate-300')}
                                        `}>
                                            {loan.status}
                                        </span>
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