import React, { useState } from 'react';

const LoanApplicationForm = ({ onSubmit, isLoading }) => {

    const [formData, setFormData] = useState({
        borrower_name: "",
        loan_amnt: "",
        term: "36 months",
        int_rate: "",
        installment: "",
        grade: "A",
        sub_grade: "A1",
        emp_length: "< 1 year",
        home_ownership: "RENT",
        annual_inc: "",
        dti: "",
        delinq_2yrs: 0,
        pub_rec: 0,
        collections_12_mths_ex_med: 0,
        tot_coll_amt: 0,
        open_acc: "",
        total_acc: "",
        revol_bal: "",
        revol_util: ""
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        const parsedValue =
            type === "number"
                ? value === "" ? "" : Number(value)
                : value;

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }));
    };

    const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedData = {
    ...formData,

    // Force numeric fields
    loan_amnt: Number(formData.loan_amnt || 0),
    int_rate: Number(formData.int_rate || 0),
    installment: Number(formData.installment || 0),
    annual_inc: Number(formData.annual_inc || 0),
    dti: Number(formData.dti || 0),

    delinq_2yrs: Number(formData.delinq_2yrs || 0),
    pub_rec: Number(formData.pub_rec || 0),
    collections_12_mths_ex_med: Number(formData.collections_12_mths_ex_med || 0),
    tot_coll_amt: Number(formData.tot_coll_amt || 0),
};
console.log("Sending to backend:", cleanedData);
    onSubmit(cleanedData);
};

    return (
        <form onSubmit={handleSubmit} className="bg-card-light dark:bg-card-dark p-8 rounded-[2rem] shadow-lg border border-slate-200 dark:border-neutral-800">

            <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-primary">person_add</span>
                New Applicant Profile
            </h3>

            {/* Applicant Name */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Applicant Full Name
                </label>

                <input
                    type="text"
                    name="borrower_name"
                    value={formData.borrower_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. John Smith"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                {/* Loan Details */}
                <div className="space-y-4">

                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-neutral-800 pb-2">
                        Requested Loan
                    </h4>

                    <input
                        type="number"
                        name="loan_amnt"
                        placeholder="Loan Amount ($)"
                        value={formData.loan_amnt}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                    />

                    <input
                        type="number"
                        name="int_rate"
                        placeholder="Interest Rate (%)"
                        value={formData.int_rate}
                        onChange={handleChange}
                        required
                        step="0.1"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                    />

                    <input
                        type="number"
                        name="installment"
                        placeholder="Monthly Installment ($)"
                        value={formData.installment}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                    />

                    <select
                        name="term"
                        value={formData.term}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                    >
                        <option value="36 months">36 Months</option>
                        <option value="60 months">60 Months</option>
                    </select>

                </div>

                {/* Borrower Financials */}
                <div className="space-y-4">

                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-neutral-800 pb-2">
                        Borrower Stats
                    </h4>

                    <input
                        type="number"
                        name="annual_inc"
                        placeholder="Annual Income ($)"
                        value={formData.annual_inc}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                    />

                    <input
                        type="number"
                        name="dti"
                        placeholder="Debt To Income (%)"
                        value={formData.dti}
                        onChange={handleChange}
                        step="0.1"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                    />

                    <select
                        name="home_ownership"
                        value={formData.home_ownership}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                    >
                        <option value="RENT">Rent</option>
                        <option value="MORTGAGE">Mortgage</option>
                        <option value="OWN">Own</option>
                    </select>

                </div>

                {/* Credit History */}
                <div className="space-y-4">

                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-neutral-800 pb-2">
                        Credit File
                    </h4>

                    <input
                        type="number"
                        name="delinq_2yrs"
                        placeholder="Delinquencies (2yr)"
                        value={formData.delinq_2yrs}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                    />

                    <input
                        type="number"
                        name="pub_rec"
                        placeholder="Public Records"
                        value={formData.pub_rec}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                    />

                    <input
                        type="number"
                        name="collections_12_mths_ex_med"
                        placeholder="Collections (12m)"
                        value={formData.collections_12_mths_ex_med}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                    />

                    <input
                        type="number"
                        name="tot_coll_amt"
                        placeholder="Total Collection Amount"
                        value={formData.tot_coll_amt}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800"
                    />

                </div>

            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2
                ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-green-600 shadow-primary/20 hover:shadow-primary/40'}`}
            >

                {isLoading ? (
                    <>
                        <span className="material-icons-round animate-spin">refresh</span>
                        Analyzing Risk...
                    </>
                ) : (
                    <>
                        <span className="material-icons-round">psychology</span>
                        Run AI Assessment
                    </>
                )}

            </button>

        </form>
    );
};

export default LoanApplicationForm;