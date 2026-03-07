import React, { useState } from 'react';

const LoanApplicationForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        borrower_name: "Jane Doe",
        loan_amnt: 10000,
        term: " 36 months",
        int_rate: 10.5,
        installment: 325.0,
        grade: "B",
        sub_grade: "B3",
        emp_length: "10+ years",
        home_ownership: "MORTGAGE",
        annual_inc: 65000,
        dti: 15.0,
        delinq_2yrs: 0,
        pub_rec: 0,
        collections_12_mths_ex_med: 0,
        tot_coll_amt: 0,
        open_acc: 8,
        total_acc: 15,
        revol_bal: 12000,
        revol_util: 45.0
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let parsedValue = value;

        if (type === 'number') {
            parsedValue = value === '' ? '' : Number(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-card-light dark:bg-card-dark p-8 rounded-[2rem] shadow-lg border border-slate-200 dark:border-neutral-800">
            <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-primary">person_add</span>
                New Applicant Profile
            </h3>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Applicant Full Name</label>
                <input type="text" name="borrower_name" value={formData.borrower_name} onChange={handleChange} required placeholder="e.g. John Smith"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                {/* Core Financials */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-neutral-800 pb-2">Requested Loan</h4>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loan Amount ($)</label>
                        <input type="number" name="loan_amnt" value={formData.loan_amnt} onChange={handleChange} required min="1000" max="500000"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Term</label>
                            <select name="term" value={formData.term} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white">
                                <option value=" 36 months">36 Months</option>
                                <option value=" 60 months">60 Months</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Est. Grade</label>
                            <select name="grade" value={formData.grade} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white">
                                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Borrower Stats */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-neutral-800 pb-2">Borrower Stats</h4>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Annual Income ($)</label>
                        <input type="number" name="annual_inc" value={formData.annual_inc} onChange={handleChange} required min="1000"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Debt-To-Income (%)</label>
                            <input type="number" name="dti" value={formData.dti} onChange={handleChange} required step="0.1"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Housing</label>
                            <select name="home_ownership" value={formData.home_ownership} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white">
                                <option value="MORTGAGE">Mortgage</option>
                                <option value="RENT">Rent</option>
                                <option value="OWN">Own</option>
                                <option value="ANY">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Credit History Part 1 */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-neutral-800 pb-2">Credit File</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Emp. Length</label>
                            <select name="emp_length" value={formData.emp_length} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white">
                                {['< 1 year', '1 year', '2 years', '3 years', '4 years', '5 years', '6 years', '7 years', '8 years', '9 years', '10+ years'].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Delinquencies (2yr)</label>
                            <input type="number" name="delinq_2yrs" value={formData.delinq_2yrs} onChange={handleChange} min="0"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Public Records</label>
                            <input type="number" name="pub_rec" value={formData.pub_rec} onChange={handleChange} min="0"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Collections (12m)</label>
                            <input type="number" name="collections_12_mths_ex_med" value={formData.collections_12_mths_ex_med} onChange={handleChange} min="0"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                        </div>
                    </div>
                </div>

                {/* Credit History Part 2 */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-neutral-800 pb-2 opacity-0 hidden md:block">Spacer</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Open Accounts</label>
                            <input type="number" name="open_acc" value={formData.open_acc} onChange={handleChange} min="0"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Accounts</label>
                            <input type="number" name="total_acc" value={formData.total_acc} onChange={handleChange} min="0"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Revol. Balance ($)</label>
                            <input type="number" name="revol_bal" value={formData.revol_bal} onChange={handleChange} min="0"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Revol. Util (%)</label>
                            <input type="number" name="revol_util" value={formData.revol_util} onChange={handleChange} min="0" step="0.1"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                        </div>
                    </div>
                </div>

            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2
          ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-green-600 shadow-primary/20 hover:shadow-primary/40'}`}>
                {isLoading ? (
                    <><span className="material-icons-round animate-spin">refresh</span> Analyzing Risk...</>
                ) : (
                    <><span className="material-icons-round">psychology</span> Run AI Assessment</>
                )}
            </button>
        </form>
    );
};

export default LoanApplicationForm;
