import React, { useState } from 'react';
import axios from 'axios';
import LoanApplicationForm from '../components/LoanApplicationForm';
import LoanAssessmentResult from '../components/LoanAssessmentResult';

const RiskModelsPage = () => {
    // State to toggle between Dashboard view and Live Input view
    const [viewMode, setViewMode] = useState('dashboard');
    const [assessmentResult, setAssessmentResult] = useState(null);
    const [bulkResults, setBulkResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleBulkAssessment = async (rowsData) => {
        setIsLoading(true);
        setAssessmentResult(null);
        setBulkResults([]);
        
        try {
            const results = [];
            // Run sequentially to guarantee orderly processing on dev server
            for(let row of rowsData) {
                const response = await axios.post('/api/assess-loan', row);
                results.push({ ...response.data, _rawInput: row });
            }
            setBulkResults(results);
        } catch (error) {
            console.error("Bulk Assessment Failed", error);
            alert("API Connection Failed during Bulk Run.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRunAssessment = async (formData) => {
        setIsLoading(true);
        setAssessmentResult(null);
        setBulkResults([]);
        try {
            const response = await axios.post('/api/assess-loan', formData);
            setAssessmentResult(response.data);
        } catch (error) {
            console.error("Failed to run assessment via API", error);
            alert("API Connection Failed. Is the FastAPI server running?");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold dark:text-white">
                    {viewMode === 'dashboard' ? 'AI Risk Models Suite' : 'Live Loan Application Review'}
                </h1>

                {/* View Toggle */}
                <div className="flex bg-slate-100 dark:bg-neutral-800 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('dashboard')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'dashboard' ? 'bg-white dark:bg-neutral-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                        Model Dashboard
                    </button>
                    <button
                        onClick={() => setViewMode('live-form')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'live-form' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-primary'}`}>
                        <span className="material-icons-round text-sm">play_arrow</span> Run Live Input
                    </button>
                </div>
            </header>

            {viewMode === 'dashboard' && (
                <>
                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-[2rem] flex items-center gap-4 shadow-sm border border-slate-200 dark:border-neutral-800">
                            <div className="w-14 h-14 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                <span className="material-icons-round text-yellow-500 text-3xl">precision_manufacturing</span>
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Active Models</p>
                                <h3 className="text-2xl font-bold dark:text-white">08</h3>
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
                </>
            )}

            {/* LIVE INTAKE FORM VIEW */}
            {viewMode === 'live-form' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <LoanApplicationForm onSubmit={handleRunAssessment} onBulkSubmit={handleBulkAssessment} isLoading={isLoading} />
                        
                        {/* BULK RESULTS TABLE */}
                        {bulkResults.length > 0 && (
                            <div className="mt-8 bg-card-light dark:bg-card-dark rounded-[2rem] p-8 shadow-lg border border-slate-200 dark:border-neutral-800 animate-fade-in-up">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                                    <span className="material-icons-round text-primary">groups</span>
                                    Bulk Assessment Results ({bulkResults.length})
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-neutral-800 text-slate-500 uppercase text-xs tracking-wider">
                                                <th className="pb-3 pt-2 font-semibold">Applicant</th>
                                                <th className="pb-3 pt-2 font-semibold">Loan Amnt</th>
                                                <th className="pb-3 pt-2 font-semibold">Risk Score</th>
                                                <th className="pb-3 pt-2 font-semibold">Est. ROI</th>
                                                <th className="pb-3 pt-2 font-semibold text-right">Decision</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bulkResults.map((res, i) => {
                                                const score = res.credit_risk_score || 0;
                                                const decision = String(res.recommendation || "Unknown").toUpperCase();
                                                const name = res._rawInput?.borrower_name || "Unknown";
                                                const amount = res._rawInput?.loan_amnt || 0;
                                                const roi = Number(res.roi_prediction || 0).toFixed(2);
                                                
                                                let badgeColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
                                                if (decision === "REJECT") badgeColor = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
                                                if (decision === "MANUAL REVIEW") badgeColor = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

                                                return (
                                                    <tr key={i} className="border-b border-slate-100 dark:border-neutral-800/50 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                        <td className="py-4 text-sm font-semibold dark:text-white">{name}</td>
                                                        <td className="py-4 text-sm font-medium text-slate-500">${amount.toLocaleString()}</td>
                                                        <td className="py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-16 h-2 bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                                    <div className={`h-full ${score < 40 ? 'bg-green-500' : score < 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${Math.min(100, score)}%`}}></div>
                                                                </div>
                                                                <span className="text-xs font-bold dark:text-slate-300">{Number(score).toFixed(1)}</span>
                                                            </div>
                                                        </td>
                                                        <td className={`py-4 text-sm font-bold ${roi < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                            {roi > 0 ? '+' : ''}{roi}%
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${badgeColor}`}>
                                                                {decision}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        {!assessmentResult && !isLoading && bulkResults.length === 0 ? (
                            <div className="bg-slate-100/50 dark:bg-neutral-800/50 rounded-[2rem] p-8 border-2 border-dashed border-slate-300 dark:border-neutral-700 flex flex-col items-center justify-center gap-4 h-full min-h-[400px]">
                                <span className="material-icons-round text-5xl text-slate-300 dark:text-neutral-600">contact_page</span>
                                <p className="text-slate-500 font-medium text-center">Fill out the applicant data and run the assessment to view intelligent results here.</p>
                            </div>
                        ) : !assessmentResult && isLoading ? (
                            <div className="bg-card-light dark:bg-card-dark rounded-[2rem] p-8 shadow-lg border border-slate-200 dark:border-neutral-800 h-full flex flex-col items-center justify-center">
                                <span className="material-icons-round animate-spin text-4xl text-primary mb-4">data_usage</span>
                                <p className="font-bold animate-pulse dark:text-white">AI Processing Forms...</p>
                            </div>
                        ) : assessmentResult ? (
                            <LoanAssessmentResult result={assessmentResult} />
                        ) : (
                            <div className="bg-card-light dark:bg-card-dark rounded-[2rem] p-8 shadow-lg border border-slate-200 dark:border-neutral-800 h-full flex flex-col items-center justify-center">
                                <span className="material-icons-round text-4xl text-emerald-500 mb-4">check_circle</span>
                                <p className="font-bold text-lg dark:text-white text-center">Bulk Processing Complete</p>
                                <p className="text-sm text-slate-500 text-center mt-2">Check the table for detailed breakdowns of all applicants.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskModelsPage;
