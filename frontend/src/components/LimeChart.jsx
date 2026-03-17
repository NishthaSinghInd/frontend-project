import React from "react";

const LimeChart = ({ data }) => {

    if (!data || data.length === 0) {
        return <p className="text-sm text-slate-400">No explanation available</p>;
    }

    // ✅ SORT ONCE (outside map)
    const sortedData = [...data].sort(
        (a, b) => Math.abs(b.impact) - Math.abs(a.impact)
    );

    // ✅ Calculate max impact for width scaling
    const maxImpact = Math.max(...sortedData.map(item => Math.abs(item.impact)));

    return (
        <div className="space-y-3 mt-2">
            {sortedData.map((item, i) => {

                // ✅ rank-based width (clean & stable)
                const width = (Math.abs(item.impact) / maxImpact) * 100; // minimum 10%

                return (
                    <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300">{item.feature}</span>
                            <span className={item.impact > 0 ? "text-green-400" : "text-red-400"}>
                                {(item.impact).toFixed(3)}
                            </span>
                        </div>

                        <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${
                                    item.impact > 0 ? "bg-green-500" : "bg-red-500"
                                }`}
                                style={{ width: `${width}%` }}
                            ></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LimeChart;