import React, { useState, useEffect } from 'react';

const OverviewPage = () => {

    const [stats, setStats] = useState({
        avg_credit_score: 742,
        total_loan_value: 0,
        predicted_roi: 0,
        overall_risk: "N/A"
    });

    const [recentLoans, setRecentLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        // Since backend no longer stores loans, just load default dashboard data
        const fetchDashboardData = async () => {
            try {

                setStats({
                    avg_credit_score: 0,
                    total_loan_value: 0,
                    predicted_roi: 0,
                    overall_risk: "N/A"
                });

                setRecentLoans([]);

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();

    }, []);

    const formatCurrency = (value) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
        return `$${value}`;
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

                <div className="p-6 border-b border-slate-200 dark:border-neutral-800">
                    <h3 className="font-bold text-lg dark:text-white">
                        Recent AI Risk Assessments
                    </h3>
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

                            {recentLoans.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        No assessments recorded yet.
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>
                </div>

            </div>

        </div>
    );
};

export default OverviewPage;