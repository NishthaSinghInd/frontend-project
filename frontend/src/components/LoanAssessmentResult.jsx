import React from 'react';
import ShapChart from "../components/ShapChart";
import LimeChart from "../components/LimeChart";

const LoanAssessmentResult = ({ result }) => {
    if (!result) return null;

    const isApproved = result.recommendation === "Approve";
    const isRejected = result.recommendation === "Reject";

    // ✅ FIXED: backend already returns 0–100
    const riskScore = Math.min(result.credit_risk_score ?? 0, 100);
    const riskPercent = riskScore.toFixed(1);

    // Normalize for gauge (0–1)
    const normalizedRisk = riskScore / 100;
    const rotationDegrees = normalizedRisk * 180;

    return (
        <div className="bg-card-light dark:bg-card-dark p-8 rounded-[2rem] shadow-lg border border-slate-200 dark:border-neutral-800 h-full flex flex-col">

            <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-primary">assessment</span>
                AI Decision
            </h3>

            {/* Decision Banner */}
            <div className={`p-4 rounded-2xl mb-8 flex items-col border-2 items-center justify-center flex-col
                ${isApproved ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : isRejected ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'}`}>
                
                <div className={`flex items-center gap-3 text-2xl font-black tracking-tight ${
                    isApproved ? 'text-green-700 dark:text-green-400' 
                    : isRejected ? 'text-red-700 dark:text-red-400'
                    : 'text-yellow-700 dark:text-yellow-400'
                }`}>
                    <span className="material-icons-round text-3xl">
                        {isApproved ? 'check_circle' : isRejected ? 'cancel' : 'warning'}
                    </span>
                    {isApproved ? 'APPROVED' : isRejected ? 'REJECTED' : 'MANUAL REVIEW REQUIRED'}
                </div>

                {result?.decision_reasons?.length > 0 && (
                    <div className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400 text-center">
                        {result.decision_reasons.map((r, i) => (
                        <div key={i}>• {r}</div>
                        ))}
                    </div>
                )}
            </div>

            {/* ✅ FIXED: Use risk_explanations instead of shap */}
            <div className="mt-6">
                <h4 className="text-md font-semibold mb-2 text-slate-700 dark:text-slate-200">
                    Key Risk Factors
                </h4>

{result?.risk_explanations?.length > 0 ? (
    <div className="mt-4 space-y-3">
        {result.risk_explanations.map((item, i) => (
            <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                    <span>{item.feature}</span>
                    <span>{item.impact > 0 ? '+' : '-'}</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${
                            item.impact > 0 ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{
                            width: `${Math.min(Math.abs(item.impact) * 60, 100)}%`
                        }}
                    ></div>
                </div>
            </div>
        ))}
    </div>
) : (
    <p className="text-sm text-slate-400">No key factors available</p>
)}
            </div>

            <div className="flex-grow flex flex-col items-center justify-center space-y-10">

                {/* Risk Score Speedometer */}
                <div className="relative w-64 h-32 flex flex-col items-center overflow-hidden">

                    {/* Gauge background */}
                    <div className="absolute inset-0 w-full h-[200%] rounded-full border-[1.5rem] border-slate-100 dark:border-neutral-800"></div>

                    {/* Risk zones */}
                    <div
                        className="absolute inset-0 w-full h-[200%] rounded-full border-[1.5rem] border-transparent border-t-green-500 border-r-yellow-400 border-b-red-500 transform -rotate-45"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}
                    ></div>

                    {/* Needle */}
                    <div
                        className="absolute bottom-0 w-full flex justify-center origin-bottom transition-all duration-1000 ease-out"
                        style={{ transform: `rotate(${rotationDegrees - 90}deg)` }}
                    >
                        <div className="w-1 h-24 bg-slate-800 dark:bg-white rounded-t-full relative bottom-2 shadow-sm"></div>
                        <div className="w-4 h-4 rounded-full bg-slate-800 dark:bg-white absolute -bottom-2"></div>
                    </div>

                    {/* Score label */}
                    <div className="absolute bottom-0 text-3xl font-bold dark:text-white bg-card-light dark:bg-card-dark px-4 py-1 rounded-t-xl z-10">
                        {riskPercent}
                        <span className="text-sm font-medium text-slate-400">%</span>
                    </div>
                </div>

                <p className="text-center font-bold text-slate-500 uppercase tracking-widest text-sm">
                    Visual Risk Score
                </p>

                {/* ROI Card */}
                <div className="w-full bg-slate-50 dark:bg-neutral-900 p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-2">
                    <span className="material-icons-round text-slate-400">payments</span>

                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                        Estimated Expected ROI
                    </p>

                    <h2 className={`text-4xl font-black ${(result.roi_prediction ?? 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {(result.roi_prediction ?? 0) > 0 ? '+' : ''}
                        {(result.roi_prediction ?? 0).toFixed(2)}%
                    </h2>

                    <p className="text-xs text-slate-500 text-center max-w-[200px] mt-2">
                        Calculated internally via Risk & Interest models.
                    </p>
                </div>
                <p className="text-xs text-slate-500 text-center mt-2">
    {result?.roi_reason}
    <div className="mt-6">
    <h4 className="text-md font-semibold mb-2 text-slate-700 dark:text-slate-200">
        ROI Explanation (LIME)
    </h4>

    <LimeChart data={result?.roi_explanations || []} />
</div>
</p>

                {/* Extra Model Metrics */}
                <div className="w-full grid grid-cols-2 gap-4 mt-6">

                    {/* ROI Model */}
                    <div className="bg-slate-50 dark:bg-neutral-900 p-4 rounded-xl border border-slate-200 dark:border-neutral-800 text-center">
                        <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">
                            ROI Prediction Model
                        </p>

                        <p className="text-2xl font-bold text-green-500 mt-2">
                            {(result.roi_prediction ?? 0).toFixed(2)}%
                        </p>

                        <p className="text-[11px] text-slate-400 mt-1">
                            Random Forest ROI Estimator
                        </p>
                    </div>

                    {/* GNN Risk */}
                    <div className="bg-slate-50 dark:bg-neutral-900 p-4 rounded-xl border border-slate-200 dark:border-neutral-800 text-center">
                        <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">
                            Borrower Network Risk
                        </p>

                        <p className="text-2xl font-bold text-red-500 mt-2">
                            {(result.borrower_network_risk ?? 0).toFixed(2)}
                        </p>

                        <p className="text-[11px] text-slate-400 mt-1">
                            Graph Neural Network Risk
                        </p>
                    </div>

                </div>

                {/* Guardrail */}
                {result.flag && (
                    <div className="w-full bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl border border-red-200 dark:border-red-800 flex items-start gap-3 text-red-600 dark:text-red-400 shadow-sm mt-4">
                        <span className="material-icons-round mt-0.5">warning</span>
                        <p className="text-sm font-bold leading-tight flex-1">
                            OVERRIDE: {result.flag}
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LoanAssessmentResult;