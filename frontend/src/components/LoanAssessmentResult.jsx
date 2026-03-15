import React from 'react';
import ShapChart from "../components/ShapChart";

const LoanAssessmentResult = ({ result }) => {
    if (!result) return null;

    const isApproved = result.recommendation === "Approve";

    // Calculate Gauge Needle Rotation (0 to 180 degrees)
    // 0 is perfectly safe (0 score), 180 is maximum risk (100 score)
    const rotationDegrees = (result.credit_risk_score / 100) * 180;

    return (
        <div className="bg-card-light dark:bg-card-dark p-8 rounded-[2rem] shadow-lg border border-slate-200 dark:border-neutral-800 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-primary">assessment</span>
                AI Decision
            </h3>

            {/* Main Banner */}
            <div className={`p-4 rounded-2xl mb-8 flex items-center justify-center gap-3 text-xl font-bold border-2
        ${isApproved
                    ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400'}`}>
                <span className="material-icons-round text-3xl">
                    {isApproved ? 'check_circle' : 'warning'}
                </span>
                {isApproved ? 'APPROVED' : 'MANUAL REVIEW REQUIRED'}
            </div>
{/* SHAP Feature Importance */}
<div className="mt-6">
    <h4 className="text-md font-semibold mb-2 text-slate-700 dark:text-slate-200">
        Key Risk Factors
    </h4>

    <ShapChart data={result?.shap_explanations} />
</div>
            <div className="flex-grow flex flex-col items-center justify-center space-y-10">

                {/* Risk Score Speedometer */}
                <div className="relative w-64 h-32 flex flex-col items-center overflow-hidden">
                    {/* SVG Half Circle Background */}
                    <div className="absolute inset-0 w-full h-[200%] rounded-full border-[1.5rem] border-slate-100 dark:border-neutral-800"></div>

                    {/* Colored Risk Zones */}
                    <div className="absolute inset-0 w-full h-[200%] rounded-full border-[1.5rem] border-transparent border-t-green-500 border-r-yellow-400 border-b-red-500 transform -rotate-45" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>

                    {/* Needle */}
                    <div className="absolute bottom-0 w-full flex justify-center origin-bottom transition-all duration-1000 ease-out"
                        style={{ transform: `rotate(${rotationDegrees - 90}deg)` }}>
                        <div className="w-1 h-24 bg-slate-800 dark:bg-white rounded-t-full relative bottom-2 shadow-sm"></div>
                        <div className="w-4 h-4 rounded-full bg-slate-800 dark:bg-white absolute -bottom-2"></div>
                    </div>

                    <div className="absolute bottom-0 text-3xl font-bold dark:text-white bg-card-light dark:bg-card-dark px-4 py-1 rounded-t-xl z-10">
                        {result.risk_score} <span className="text-sm font-medium text-slate-400">/ 100</span>
                    </div>
                </div>

                <p className="text-center font-bold text-slate-500 uppercase tracking-widest text-sm">Visual Risk Score</p>

                {/* Expected ROI Stat Bubble */}
                <div className="w-full bg-slate-50 dark:bg-neutral-900 p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-2">
                    <span className="material-icons-round text-slate-400">payments</span>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Estimated Expected ROI</p>
                    <h2 className={`text-4xl font-black ${result.safe_loan_score > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {result.safe_loan_score > 0 ? '+' : ''}{result.estimated_roi}%
                    </h2>
                    <p className="text-xs text-slate-500 text-center max-w-[200px] mt-2">Calculated internally via Risk & Interest models.</p>
                </div>

                {/* Optional Guardrail Flag */}
                {result.flag && (
                    <div className="w-full bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl border border-red-200 dark:border-red-800 flex items-start gap-3 text-red-600 dark:text-red-400 shadow-sm mt-4">
                        <span className="material-icons-round mt-0.5">warning</span>
                        <p className="text-sm font-bold leading-tight flex-1">OVERRIDE: {result.flag}</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LoanAssessmentResult;
